import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTransactions } from "@/hooks/useTransactions";
import { useCategories } from "@/hooks/useCategories";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { format, subMonths, startOfMonth } from "date-fns";

export default function Analytics() {
  const { transactions = [], isLoading: txLoading } = useTransactions();
  const { categories = [], isLoading: catLoading } = useCategories();

  const isLoading = txLoading || catLoading;

  const months = Array.from({ length: 6 }, (_, i) => {
    const date = subMonths(new Date(), 5 - i);
    return startOfMonth(date);
  });

  const trendData = months.map((monthStart) => {
    const monthStr = format(monthStart, "yyyy-MM");
    const monthLabel = format(monthStart, "MMM");

    const expenses = transactions
      .filter((tx) => tx.date?.startsWith(monthStr) && tx.type === "expense")
      .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);

    return { month: monthLabel, expenses };
  });

  const categoryData = categories
    .filter((c) => c.type === "expense")
    .map((cat) => {
      const total = transactions
        .filter((tx) => tx.category_id === cat.id)
        .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
      return { name: cat.name, total, color: cat.color };
    })
    .filter((c) => c.total > 0)
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  const comparisonData = months.map((monthStart) => {
    const monthStr = format(monthStart, "yyyy-MM");
    const monthLabel = format(monthStart, "MMM");

    const income = transactions
      .filter((tx) => tx.date?.startsWith(monthStr) && tx.type === "income")
      .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);

    const expenses = transactions
      .filter((tx) => tx.date?.startsWith(monthStr) && tx.type === "expense")
      .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);

    return { month: monthLabel, income, expenses, savings: income - expenses };
  });

  if (isLoading) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <Skeleton className="h-10 w-48" />
          <div className="grid gap-6 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-[350px]" />
            ))}
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Analytics</h2>
          <p className="text-muted-foreground">Detailed financial insights</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-2 shadow-sm">
            <CardHeader>
              <CardTitle>Monthly Spending Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={trendData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
                  <XAxis dataKey="month" stroke="hsl(var(--foreground))" />
                  <YAxis stroke="hsl(var(--foreground))" />
                  <Tooltip
                    formatter={(value: number) => `₹${value.toLocaleString()}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="expenses"
                    stroke="hsl(12,76%,61%)"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-2 shadow-sm">
            <CardHeader>
              <CardTitle>Top Spending Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={categoryData} layout="vertical">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
                  <XAxis type="number" stroke="hsl(var(--foreground))" />
                  <YAxis
                    dataKey="name"
                    type="category"
                    stroke="hsl(var(--foreground))"
                    width={100}
                  />
                  <Tooltip
                    formatter={(value: number) => `₹${value.toLocaleString()}`}
                  />
                  <Bar dataKey="total" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-2 shadow-sm md:col-span-2">
            <CardHeader>
              <CardTitle>Income vs Expenses Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={comparisonData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
                  <XAxis dataKey="month" stroke="hsl(var(--foreground))" />
                  <YAxis stroke="hsl(var(--foreground))" />
                  <Tooltip
                    formatter={(value: number) => `₹${value.toLocaleString()}`}
                  />
                  <Legend />
                  <Bar dataKey="income" fill="hsl(173,58%,39%)" name="Income" />
                  <Bar
                    dataKey="expenses"
                    fill="hsl(12,76%,61%)"
                    name="Expenses"
                  />
                  <Bar
                    dataKey="savings"
                    fill="hsl(220,70%,50%)"
                    name="Savings"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
