"use client";

import { useEffect, useState } from "react";
import type { Transaction, CreateTransactionInput } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";

const CATEGORIES = {
  INCOME: ["Salary", "Freelance", "Investment", "Gift", "Other"],
  EXPENSE: ["Food", "Transport", "Housing", "Health", "Shopping", "Entertainment", "Bills", "Other"],
};

interface Summary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export function FinanceWidget() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<Summary>({ totalIncome: 0, totalExpense: 0, balance: 0 });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CreateTransactionInput>({
    title: "",
    amount: 0,
    type: "EXPENSE",
    category: "Other",
  });

  async function fetchData() {
    const res = await fetch("/api/transactions");
    const data = await res.json();
    setTransactions(data.transactions);
    setSummary(data.summary);
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || form.amount <= 0) return;

    await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setForm({ title: "", amount: 0, type: "EXPENSE", category: "Other" });
    setShowForm(false);
    await fetchData();
  }

  async function handleDelete(id: string) {
    await fetch(`/api/transactions/${id}`, { method: "DELETE" });
    await fetchData();
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">Finance</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-xs bg-blue-500 text-white px-3 py-1.5 rounded-lg hover:bg-blue-600 transition-colors font-medium"
        >
          {showForm ? "Cancel" : "+ Add"}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-green-50 rounded-xl p-3 text-center">
          <p className="text-xs text-green-600 font-medium">Income</p>
          <p className="text-sm font-bold text-green-700 mt-0.5">
            {formatCurrency(summary.totalIncome)}
          </p>
        </div>
        <div className="bg-red-50 rounded-xl p-3 text-center">
          <p className="text-xs text-red-600 font-medium">Expense</p>
          <p className="text-sm font-bold text-red-700 mt-0.5">
            {formatCurrency(summary.totalExpense)}
          </p>
        </div>
        <div className={`rounded-xl p-3 text-center ${summary.balance >= 0 ? "bg-blue-50" : "bg-orange-50"}`}>
          <p className={`text-xs font-medium ${summary.balance >= 0 ? "text-blue-600" : "text-orange-600"}`}>
            Balance
          </p>
          <p className={`text-sm font-bold mt-0.5 ${summary.balance >= 0 ? "text-blue-700" : "text-orange-700"}`}>
            {formatCurrency(summary.balance)}
          </p>
        </div>
      </div>

      {/* Add Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-4 mb-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setForm({ ...form, type: "INCOME", category: "Salary" })}
              className={`py-1.5 text-sm rounded-lg font-medium transition-colors ${
                form.type === "INCOME"
                  ? "bg-green-500 text-white"
                  : "bg-white text-gray-600 border border-gray-200"
              }`}
            >
              Income
            </button>
            <button
              type="button"
              onClick={() => setForm({ ...form, type: "EXPENSE", category: "Other" })}
              className={`py-1.5 text-sm rounded-lg font-medium transition-colors ${
                form.type === "EXPENSE"
                  ? "bg-red-500 text-white"
                  : "bg-white text-gray-600 border border-gray-200"
              }`}
            >
              Expense
            </button>
          </div>
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="number"
            placeholder="Amount"
            value={form.amount || ""}
            onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })}
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
            step="0.01"
            required
          />
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {CATEGORIES[form.type].map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            Save Transaction
          </button>
        </form>
      )}

      {/* Transaction List */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {loading && (
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        )}

        {!loading && transactions.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-6">
            No transactions yet. Add your first one!
          </p>
        )}

        {transactions.slice(0, 20).map((tx) => (
          <div
            key={tx.id}
            className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-gray-50 group"
          >
            <div className="flex items-center gap-3">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                tx.type === "INCOME" ? "bg-green-100" : "bg-red-100"
              }`}>
                {tx.type === "INCOME" ? "↑" : "↓"}
              </span>
              <div>
                <p className="text-sm font-medium text-gray-700">{tx.title}</p>
                <p className="text-xs text-gray-400">{tx.category} · {formatDate(tx.date)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-bold ${
                tx.type === "INCOME" ? "text-green-600" : "text-red-500"
              }`}>
                {tx.type === "INCOME" ? "+" : "-"}{formatCurrency(tx.amount)}
              </span>
              <button
                onClick={() => handleDelete(tx.id)}
                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 text-xs transition-opacity"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
