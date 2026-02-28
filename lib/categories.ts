import type { Category } from "./types"

export const DEFAULT_CATEGORIES: Category[] = [
  { id: "food", name: "Food & Dining", icon: "UtensilsCrossed", color: "#f97316" },
  { id: "transport", name: "Transport", icon: "Car", color: "#3b82f6" },
  { id: "shopping", name: "Shopping", icon: "ShoppingBag", color: "#ec4899" },
  { id: "entertainment", name: "Entertainment", icon: "Film", color: "#a855f7" },
  { id: "bills", name: "Bills & Utilities", icon: "Zap", color: "#eab308" },
  { id: "health", name: "Health", icon: "Heart", color: "#ef4444" },
  { id: "education", name: "Education", icon: "GraduationCap", color: "#14b8a6" },
  { id: "groceries", name: "Groceries", icon: "ShoppingCart", color: "#22c55e" },
  { id: "rent", name: "Rent & Housing", icon: "Home", color: "#6366f1" },
  { id: "other", name: "Other", icon: "MoreHorizontal", color: "#6b7280" },
]

export function getCategoryById(id: string): Category {
  return DEFAULT_CATEGORIES.find((c) => c.id === id) || DEFAULT_CATEGORIES[DEFAULT_CATEGORIES.length - 1]
}

export function getCategoryColor(id: string): string {
  return getCategoryById(id).color
}
