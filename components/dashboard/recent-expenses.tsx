"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CategoryIcon } from "@/components/expenses/category-icon"
import { getCategoryById } from "@/lib/categories"
import { formatCurrency, formatDate } from "@/lib/format"
import type { Expense } from "@/lib/types"

interface RecentExpensesProps {
  expenses: Expense[]
}

export function RecentExpenses({ expenses }: RecentExpensesProps) {
  if (expenses.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
            <span className="text-2xl text-muted-foreground">{"..."}</span>
          </div>
          <p className="mt-4 text-sm font-medium text-foreground">No expenses yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Tap the chat button to log your first expense
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base">Recent Expenses</CardTitle>
        <Link
          href="/expenses"
          className="flex items-center gap-1 text-xs text-primary hover:underline"
        >
          View all <ChevronRight className="h-3 w-3" />
        </Link>
      </CardHeader>
      <CardContent className="flex flex-col gap-1 px-4 pb-4">
        {expenses.slice(0, 7).map((expense) => {
          const category = getCategoryById(expense.category)
          return (
            <div
              key={expense.id}
              className="flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-muted/50"
            >
              <CategoryIcon iconName={category.icon} color={category.color} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{expense.description}</p>
                <p className="text-xs text-muted-foreground">{category.name}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-foreground">{formatCurrency(expense.amount)}</p>
                <p className="text-xs text-muted-foreground">{formatDate(expense.date)}</p>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
