import { DollarSign, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { SpendingChart } from "@/components/dashboard/SpendingChart";
import { IncomeExpenseChart } from "@/components/dashboard/IncomeExpenseChart";
import { useTransactions } from "@/hooks/useTransactions";
import { useCategories } from "@/hooks/useCategories";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { transactions, stats, isLoading: txLoading } = useTransactions();
  const { categories, isLoading: catLoading } = useCategories();

  const isLoading = txLoading || catLoading;

  if (isLoading) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-[400px]" />
            <Skeleton className="h-[400px]" />
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <p className="text-muted-foreground">Your financial overview</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard
            title="Total Balance"
            value={`₹${stats.balance.toLocaleString()}`}
            subtitle="Current balance"
            icon={<Wallet className="h-5 w-5" />}
          />
          <StatCard
            title="Total Income"
            value={`₹${stats.totalIncome.toLocaleString()}`}
            subtitle="This month"
            icon={<TrendingUp className="h-5 w-5" />}
            variant="income"
          />
          <StatCard
            title="Total Expenses"
            value={`₹${stats.totalExpenses.toLocaleString()}`}
            subtitle="This month"
            icon={<TrendingDown className="h-5 w-5" />}
            variant="expense"
          />
        </div>

        {/* Charts */}
        <div className="grid gap-6 md:grid-cols-2">
          <SpendingChart transactions={transactions} categories={categories} />
          <IncomeExpenseChart transactions={transactions} />
        </div>

        {/* Recent Transactions */}
        <RecentTransactions
          transactions={transactions}
          categories={categories}
        />
      </div>
    </AppLayout>
  );
}
