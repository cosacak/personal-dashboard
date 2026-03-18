import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { CreateTransactionInput } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const limit = parseInt(searchParams.get("limit") ?? "50");

    const transactions = await prisma.transaction.findMany({
      where: type ? { type: type as "INCOME" | "EXPENSE" } : undefined,
      orderBy: { date: "desc" },
      take: limit,
    });

    const totalIncome = await prisma.transaction.aggregate({
      _sum: { amount: true },
      where: { type: "INCOME" },
    });

    const totalExpense = await prisma.transaction.aggregate({
      _sum: { amount: true },
      where: { type: "EXPENSE" },
    });

    const income = totalIncome._sum.amount ?? 0;
    const expense = totalExpense._sum.amount ?? 0;

    return NextResponse.json({
      transactions,
      summary: {
        totalIncome: income,
        totalExpense: expense,
        balance: income - expense,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateTransactionInput = await request.json();

    if (!body.title || !body.amount || !body.type || !body.category) {
      return NextResponse.json(
        { error: "Missing required fields: title, amount, type, category" },
        { status: 400 }
      );
    }

    if (body.amount <= 0) {
      return NextResponse.json(
        { error: "Amount must be greater than 0" },
        { status: 400 }
      );
    }

    const transaction = await prisma.transaction.create({
      data: {
        title: body.title,
        amount: body.amount,
        type: body.type,
        category: body.category,
        description: body.description,
        date: body.date ? new Date(body.date) : new Date(),
      },
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 }
    );
  }
}
