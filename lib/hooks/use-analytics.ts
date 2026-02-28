import { useMemo } from "react"
import type { Expense, Budget, MonthlyAnalytics } from "@/lib/types"
import { DEFAULT_CATEGORIES, getCategoryColor } from "@/lib/categories"
import { getDaysInMonth } from "@/lib/format"

export function useAnalytics(
  expenses: Expense[],
  budgets: Budget[],
  month: string
): MonthlyAnalytics {
  return useMemo(() => {
    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0)
    const daysInMonth = getDaysInMonth(month)
    const dailyAverage = expenses.length > 0 ? totalSpent / daysInMonth : 0

    // Category breakdown
    const categoryMap = new Map<string, number>()
    expenses.forEach((e) => {
      categoryMap.set(e.category, (categoryMap.get(e.category) || 0) + e.amount)
    })
    const categoryBreakdown = Array.from(categoryMap.entries())
      .map(([category, total]) => ({
        category,
        total,
        color: getCategoryColor(category),
      }))
      .sort((a, b) => b.total - a.total)

    // Daily trend
    const dailyMap = new Map<number, number>()
    expenses.forEach((e) => {
      const day = parseInt(e.date.split("-")[2])
      dailyMap.set(day, (dailyMap.get(day) || 0) + e.amount)
    })
    const dailyTrend = Array.from({ length: daysInMonth }, (_, i) => ({
      day: i + 1,
      amount: dailyMap.get(i + 1) || 0,
      date: `${month}-${String(i + 1).padStart(2, "0")}`,
    }))

    // Top expenses
    const topExpenses = [...expenses].sort((a, b) => b.amount - a.amount).slice(0, 5)

    // Budget comparison
    const budgetComparison = DEFAULT_CATEGORIES.map((cat) => {
      const budget = budgets.find((b) => b.category === cat.id)
      const actual = categoryMap.get(cat.id) || 0
      return {
        category: cat.id,
        budget: budget?.amount || 0,
        actual,
        color: cat.color,
      }
    }).filter((b) => b.budget > 0 || b.actual > 0)

    return {
      totalSpent,
      dailyAverage,
      categoryBreakdown,
      dailyTrend,
      topExpenses,
      budgetComparison,
    }
  }, [expenses, budgets, month])
}
