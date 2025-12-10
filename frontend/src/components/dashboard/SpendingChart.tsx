import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Transaction, Category } from "@/types";

interface SpendingChartProps {
  transactions: Transaction[];
  categories: Category[];
}

export function SpendingChart({
  transactions,
  categories,
}: SpendingChartProps) {
  const expenseTransactions = transactions.filter(
    (tx) => tx.type === "expense"
  );

  const categoryTotals = expenseTransactions.reduce((acc, tx) => {
    const key = String(tx.category_id);
    acc[key] = (acc[key] || 0) + Number(tx.amount);
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(categoryTotals)
    .map(([categoryId, total]) => {
      const category = categories.find((c) => String(c.id) === categoryId);
      return {
        name: category?.name || "Unknown",
        value: total,
        color: category?.color || "hsl(0, 0%, 50%)",
      };
    })
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  if (chartData.length === 0) {
    return (
      <Card className="border-2 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Spending by Category</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <p className="text-muted-foreground">No expense data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Spending by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke="hsl(var(--foreground))"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [
                `₹${value.toLocaleString()}`,
                "Amount",
              ]}
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "2px solid hsl(var(--border))",
                borderRadius: 0,
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
