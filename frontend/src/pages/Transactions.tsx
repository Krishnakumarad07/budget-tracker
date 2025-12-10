import { useState } from "react";
import { Plus } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { TransactionList } from "@/components/transactions/TransactionList";
import { TransactionForm } from "@/components/transactions/TransactionForm";
import { useTransactions } from "@/hooks/useTransactions";
import { useCategories } from "@/hooks/useCategories";
import { Transaction } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export default function Transactions() {
  const {
    transactions,
    isLoading: txLoading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useTransactions();
  const { categories, isLoading: catLoading } = useCategories();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<
    Transaction | undefined
  >();
  const { toast } = useToast();

  const isLoading = txLoading || catLoading;

  const handleSubmit = (
    data: Omit<Transaction, "id" | "created_at" | "updated_at">
  ) => {
    if (editingTransaction) {
      updateTransaction(editingTransaction.id, data);
      toast({
        title: "Transaction updated",
        description: "Your transaction has been updated.",
      });
    } else {
      addTransaction(data);
      toast({
        title: "Transaction added",
        description: "Your transaction has been added.",
      });
    }
    setEditingTransaction(undefined);
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteTransaction(id);
    toast({
      title: "Transaction deleted",
      description: "Your transaction has been deleted.",
    });
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTransaction(undefined);
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-[400px]" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold">Transactions</h2>
            <p className="text-muted-foreground">
              Manage your income and expenses
            </p>
          </div>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Transaction
          </Button>
        </div>

        <TransactionList
          transactions={transactions}
          categories={categories}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <TransactionForm
          open={isFormOpen}
          onClose={handleCloseForm}
          onSubmit={handleSubmit}
          categories={categories}
          initialData={editingTransaction}
        />
      </div>
    </AppLayout>
  );
}
