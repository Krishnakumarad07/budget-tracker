import { Category } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2 } from 'lucide-react';

interface CategoryListProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}

export function CategoryList({ categories, onEdit, onDelete }: CategoryListProps) {
  const expenseCategories = categories.filter(c => c.type === 'expense');
  const incomeCategories = categories.filter(c => c.type === 'income');

  const CategoryCard = ({ category }: { category: Category }) => (
    <div
      className="flex items-center justify-between p-3 border-2 border-border bg-card"
    >
      <div className="flex items-center gap-3">
        <div
          className="w-6 h-6 border-2 border-foreground"
          style={{ backgroundColor: category.color }}
        />
        <div>
          <p className="font-medium">{category.name}</p>
          {category.isCustom && (
            <Badge variant="secondary" className="text-xs">Custom</Badge>
          )}
        </div>
      </div>
      {category.isCustom && (
        <div className="flex gap-1">
          <Button variant="outline" size="icon" onClick={() => onEdit(category)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => onDelete(category.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="border-2 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-3 h-3 bg-chart-1 border border-foreground" />
            Expense Categories
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {expenseCategories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </CardContent>
      </Card>

      <Card className="border-2 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-3 h-3 bg-chart-2 border border-foreground" />
            Income Categories
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {incomeCategories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
