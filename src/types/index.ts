export type TransactionType = "INCOME" | "EXPENSE";

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  description?: string | null;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransactionInput {
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  description?: string;
  date?: string;
}

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  description: string;
  city: string;
  icon: string;
}

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: string;
}

export interface FinanceSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactions: Transaction[];
}
