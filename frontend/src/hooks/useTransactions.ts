import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Transaction } from "@/types";

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState({
    balance: 0,
    totalIncome: 0,
    totalExpenses: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .get<Transaction[]>("/transactions")
      .then((res) => {
        setTransactions(res);
        calculateStats(res);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const calculateStats = (data: Transaction[]) => {
    const totalIncome = data
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0);
    const totalExpenses = data
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    setStats({
      balance: totalIncome - totalExpenses,
      totalIncome,
      totalExpenses,
    });
  };

  // Add transaction
  const addTransaction = async (
    data: Omit<Transaction, "id" | "created_at" | "updated_at">
  ) => {
    const newTx = await api.post<Transaction>("/transactions", data);
    const updatedList = [newTx, ...transactions];
    setTransactions(updatedList);
    calculateStats(updatedList);
    return newTx;
  };

  // Update transaction
  const updateTransaction = async (id: string, data: Partial<Transaction>) => {
    const updatedTx = await api.put<Transaction>(`/transactions/${id}`, data);
    const updatedList = transactions.map((t) => (t.id === id ? updatedTx : t));
    setTransactions(updatedList);
    calculateStats(updatedList);
  };

  // Delete transaction
  const deleteTransaction = async (id: string) => {
    await api.delete(`/transactions/${id}`);
    const updatedList = transactions.filter((t) => t.id !== id);
    setTransactions(updatedList);
    calculateStats(updatedList);
  };

  return {
    transactions,
    stats,
    isLoading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };
}
