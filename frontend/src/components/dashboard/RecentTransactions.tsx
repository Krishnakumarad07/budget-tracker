import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction, Category } from "@/types";
import { format } from "date-fns";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface RecentTransactionsProps {
  transactions: Transaction[];
  categories: Category[];
}

export function RecentTransactions({
  transactions,
  categories,
}: RecentTransactionsProps) {
  const getCategoryName = (categoryId: string) =>
    categories.find((c) => c.id === categoryId)?.name || "Unknown";
  const getCategoryColor = (categoryId: string) =>
    categories.find((c) => c.id === categoryId)?.color || "hsl(0, 0%, 50%)";

  const recentTx = transactions.slice(0, 5);

  return (
    <Card className="border-2 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentTx.length === 0 ? (
          <p className="text-muted-foreground text-sm">No transactions yet</p>
        ) : (
          recentTx.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center border-2 border-foreground"
                  style={{ backgroundColor: getCategoryColor(tx.category_id) }}
                >
                  {tx.type === "income" ? (
                    <ArrowUpRight className="h-5 w-5 text-foreground" />
                  ) : (
                    <ArrowDownRight className="h-5 w-5 text-foreground" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-sm">{tx.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {getCategoryName(tx.category_id)} •{" "}
                    {format(new Date(tx.date), "MMM d")}
                  </p>
                </div>
              </div>
              <span
                className={`font-bold ${
                  tx.type === "income" ? "text-chart-2" : "text-chart-1"
                }`}
              >
                {tx.type === "income" ? "+" : "-"}₹{tx.amount.toLocaleString()}
              </span>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
