"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, TrendingUp, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AppShell } from "@/components/layout/app-shell"
import { CategoryPieChart } from "@/components/analytics/category-pie-chart"
import { DailyTrendChart } from "@/components/analytics/daily-trend-chart"
import { BudgetComparisonChart } from "@/components/analytics/budget-comparison-chart"
import { TopExpensesList } from "@/components/analytics/top-expenses-list"
import { useMonthlyExpenses } from "@/lib/hooks/use-expenses"
import { useBudgets } from "@/lib/hooks/use-budgets"
import { useAnalytics } from "@/lib/hooks/use-analytics"
import { formatCurrency, getCurrentMonth, getMonthLabel } from "@/lib/format"

function navigateMonth(month: string, delta: number): string {
  const [y, m] = month.split("-").map(Number)
  const date = new Date(y, m - 1 + delta, 1)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
}

export default function AnalyticsPage() {
  const [month, setMonth] = useState(getCurrentMonth)
  const { expenses } = useMonthlyExpenses(month)
  const { budgets } = useBudgets(month)
  const analytics = useAnalytics(expenses, budgets, month)

  const isCurrentMonth = month === getCurrentMonth()

  return (
    <AppShell>
      <div className="flex flex-col gap-5 px-4 pb-24 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Analytics</h1>
            <p className="text-sm text-muted-foreground">Monthly spending insights</p>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setMonth((m) => navigateMonth(m, -1))}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous month</span>
            </Button>
            <span className="min-w-[120px] text-center text-sm font-medium text-foreground">
              {getMonthLabel(month)}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setMonth((m) => navigateMonth(m, 1))}
              disabled={isCurrentMonth}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next month</span>
            </Button>
          </div>
        </div>

        {/* Summary Row */}
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Spent</p>
                <p className="text-lg font-bold text-foreground">{formatCurrency(analytics.totalSpent)}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-chart-2/10">
                <Calendar className="h-5 w-5 text-chart-2" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Daily Avg</p>
                <p className="text-lg font-bold text-foreground">{formatCurrency(analytics.dailyAverage)}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <CategoryPieChart data={analytics.categoryBreakdown} />

        <DailyTrendChart data={analytics.dailyTrend} />

        <BudgetComparisonChart data={analytics.budgetComparison} />

        <TopExpensesList expenses={analytics.topExpenses} />
      </div>
    </AppShell>
  )
}
