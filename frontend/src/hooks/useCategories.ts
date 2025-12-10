import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Category } from "@/types";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .get<Category[]>("/categories")
      .then((res) => setCategories(res))
      .finally(() => setIsLoading(false));
  }, []);

  const addCategory = async (data: Omit<Category, "id">) => {
    const newCat = await api.post<Category>("/categories", data);
    setCategories((prev) => [...prev, newCat]);
    return newCat;
  };

  const updateCategory = async (id: string, data: Partial<Category>) => {
    const updated = await api.put<Category>(`/categories/${id}`, data);
    setCategories((prev) => prev.map((c) => (c.id === id ? updated : c)));
  };

  const deleteCategory = async (id: string) => {
    await api.delete(`/categories/${id}`);
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  return { categories, isLoading, addCategory, updateCategory, deleteCategory };
}
