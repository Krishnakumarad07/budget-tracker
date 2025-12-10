export type TransactionType = 'income' | 'expense';

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  color: string;
  icon?: string;
  isCustom: boolean;
}

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  category_id: string;
  date: string;
  type: TransactionType;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  currency: string;
  created_at: string;
}

export interface MonthlyStats {
  month: string;
  income: number;
  expenses: number;
  balance: number;
}

export interface CategoryStats {
  category_id: string;
  category_name: string;
  color: string;
  total: number;
  percentage: number;
}
