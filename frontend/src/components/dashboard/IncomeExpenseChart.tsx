import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Transaction } from "@/types";
import { format, startOfMonth, subMonths } from "date-fns";

interface IncomeExpenseChartProps {
  transactions: Transaction[];
}

export function IncomeExpenseChart({ transactions }: IncomeExpenseChartProps) {
  const months = Array.from({ length: 6 }, (_, i) =>
    startOfMonth(subMonths(new Date(), 5 - i))
  );

  const chartData = months.map((monthStart) => {
    const monthStr = format(monthStart, "yyyy-MM");
    const monthLabel = format(monthStart, "MMM");

    const monthTransactions = transactions.filter(
      (tx) => format(new Date(tx.date), "yyyy-MM") === monthStr
    );

    const income = monthTransactions
      .filter((tx) => tx.type === "income")
      .reduce((sum, tx) => sum + Number(tx.amount), 0);

    const expenses = monthTransactions
      .filter((tx) => tx.type === "expense")
      .reduce((sum, tx) => sum + Number(tx.amount), 0);

    return { month: monthLabel, income, expenses, savings: income - expenses };
  });

  return (
    <Card className="border-2 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Income vs Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" stroke="hsl(var(--foreground))" />
            <YAxis stroke="hsl(var(--foreground))" />
            <Tooltip
              formatter={(value: number) => `₹${value.toLocaleString()}`}
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "2px solid hsl(var(--border))",
                borderRadius: 0,
              }}
            />
            <Legend />
            <Bar dataKey="income" fill="hsl(173, 58%, 39%)" name="Income" />
            <Bar dataKey="expenses" fill="hsl(12, 76%, 61%)" name="Expenses" />
            <Bar dataKey="savings" fill="hsl(220, 70%, 50%)" name="Savings" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
