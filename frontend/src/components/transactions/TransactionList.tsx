import { useMemo, useState } from "react";
import { Transaction, Category } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import {
  Pencil,
  Trash2,
  Search,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

interface TransactionListProps {
  transactions: Transaction[];
  categories: Category[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export function TransactionList({
  transactions,
  categories,
  onEdit,
  onDelete,
}: TransactionListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const getCategoryName = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.name || "Unknown";
  };

  const getCategoryColor = (categoryId: string) => {
    return (
      categories.find((c) => c.id === categoryId)?.color || "hsl(0, 0%, 50%)"
    );
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      if (
        searchQuery &&
        !tx.description.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      if (typeFilter !== "all" && tx.type !== typeFilter) {
        return false;
      }
      if (categoryFilter !== "all" && tx.category_id !== categoryFilter) {
        return false;
      }
      return true;
    });
  }, [transactions, searchQuery, typeFilter, categoryFilter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Mobile View: Visible on screens smaller than 'md' */}
      <div className="space-y-2 md:hidden">
        {filteredTransactions.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">
            No transactions found
          </p>
        ) : (
          filteredTransactions.map((tx) => (
            <div key={tx.id} className="border rounded-lg p-4 space-y-3">
              {/* This grid creates the two-column layout */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <span className="font-medium text-muted-foreground">Type</span>
                <div className="flex items-center gap-2">
                  {tx.type === "income" ? (
                    <ArrowUpRight className="h-4 w-4 text-chart-2" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-chart-1" />
                  )}
                  <span className="capitalize">{tx.type}</span>
                </div>

                <span className="font-medium text-muted-foreground">
                  Description
                </span>
                <span className="font-medium">{tx.description}</span>

                <span className="font-medium text-muted-foreground">
                  Category
                </span>
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 border border-foreground"
                    style={{
                      backgroundColor: getCategoryColor(tx.category_id),
                    }}
                  />
                  {getCategoryName(tx.category_id)}
                </div>

                <span className="font-medium text-muted-foreground">Date</span>
                <span>{format(new Date(tx.date), "MMM d, yyyy")}</span>

                <span className="font-medium text-muted-foreground">
                  Amount
                </span>
                <span
                  className={`font-bold ${
                    tx.type === "income" ? "text-chart-2" : "text-chart-1"
                  }`}
                >
                  {tx.type === "income" ? "+" : "-"}₹
                  {tx.amount.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-end gap-1 pt-2 border-t border-border">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onEdit(tx)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onDelete(tx.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop View: Hidden on mobile, visible on 'md' screens and up */}
      <div className="hidden border-2 border-border md:block">
        <Table>
          <TableHeader>
            <TableRow className="border-b-2 border-border">
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground"
                >
                  No transactions found
                </TableCell>
              </TableRow>
            ) : (
              filteredTransactions.map((tx) => (
                <TableRow key={tx.id} className="border-b border-border">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {tx.type === "income" ? (
                        <ArrowUpRight className="h-4 w-4 text-chart-2" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-chart-1" />
                      )}
                      <span className="capitalize">{tx.type}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {tx.description}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 border border-foreground"
                        style={{
                          backgroundColor: getCategoryColor(tx.category_id),
                        }}
                      />
                      {getCategoryName(tx.category_id)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {format(new Date(tx.date), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell
                    className={`text-right font-bold ${
                      tx.type === "income" ? "text-chart-2" : "text-chart-1"
                    }`}
                  >
                    {tx.type === "income" ? "+" : "-"}₹
                    {tx.amount.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onEdit(tx)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onDelete(tx.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
