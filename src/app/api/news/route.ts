import { NextResponse } from "next/server";
import { getMarketNews } from "@/services/news";

export async function GET() {
  try {
    const articles = await getMarketNews();
    return NextResponse.json(articles);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch news" },
      { status: 500 }
    );
  }
}
