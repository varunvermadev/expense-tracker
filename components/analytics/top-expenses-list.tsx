"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CategoryIcon } from "@/components/expenses/category-icon"
import { getCategoryById } from "@/lib/categories"
import { formatCurrency, formatDate } from "@/lib/format"
import type { Expense } from "@/lib/types"

interface TopExpensesListProps {
  expenses: Expense[]
}

export function TopExpensesList({ expenses }: TopExpensesListProps) {
  if (expenses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Top Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[200px] items-center justify-center">
            <p className="text-sm text-muted-foreground">No expenses yet</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Top Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {expenses.map((expense, index) => {
            const category = getCategoryById(expense.category)
            return (
              <div key={expense.id} className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                  {index + 1}
                </span>
                <CategoryIcon iconName={category.icon} color={category.color} size="sm" />
                <div className="flex flex-1 flex-col">
                  <p className="text-sm font-medium text-foreground leading-none">
                    {expense.description}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {category.name} &middot; {formatDate(expense.date)}
                  </p>
                </div>
                <p className="text-sm font-semibold text-foreground">
                  {formatCurrency(expense.amount)}
                </p>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
