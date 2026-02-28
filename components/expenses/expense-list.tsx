"use client"

import { Trash2 } from "lucide-react"
import { CategoryIcon } from "./category-icon"
import { getCategoryById } from "@/lib/categories"
import { formatCurrency, formatDate } from "@/lib/format"
import { deleteExpenseAction } from "@/lib/hooks/use-expenses"
import { toast } from "sonner"
import type { Expense } from "@/lib/types"
import { Button } from "@/components/ui/button"

interface ExpenseListProps {
  expenses: Expense[]
  onEdit: (expense: Expense) => void
}

export function ExpenseList({ expenses, onEdit }: ExpenseListProps) {
  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
          <span className="text-2xl text-muted-foreground">{"..."}</span>
        </div>
        <p className="mt-4 text-sm font-medium text-foreground">No expenses found</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Add your first expense or use the AI chat
        </p>
      </div>
    )
  }

  // Group expenses by date
  const grouped = expenses.reduce<Record<string, Expense[]>>((acc, expense) => {
    const date = expense.date
    if (!acc[date]) acc[date] = []
    acc[date].push(expense)
    return acc
  }, {})

  async function handleDelete(id: string) {
    try {
      await deleteExpenseAction(id)
      toast.success("Expense deleted")
    } catch {
      toast.error("Failed to delete")
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {Object.entries(grouped)
        .sort(([a], [b]) => b.localeCompare(a))
        .map(([date, items]) => (
          <div key={date}>
            <p className="mb-2 px-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {formatDate(date)}
            </p>
            <div className="flex flex-col gap-1 rounded-xl bg-card border border-border">
              {items.map((expense, idx) => {
                const category = getCategoryById(expense.category)
                return (
                  <div
                    key={expense.id}
                    className={`flex items-center gap-3 px-3 py-3 ${
                      idx < items.length - 1 ? "border-b border-border" : ""
                    }`}
                  >
                    <button
                      onClick={() => onEdit(expense)}
                      className="flex flex-1 items-center gap-3 text-left"
                    >
                      <CategoryIcon iconName={category.icon} color={category.color} size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">{expense.description}</p>
                        <p className="text-xs text-muted-foreground">{category.name}</p>
                      </div>
                      <p className="text-sm font-semibold text-foreground">{formatCurrency(expense.amount)}</p>
                    </button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => handleDelete(expense.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete expense</span>
                    </Button>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
    </div>
  )
}
