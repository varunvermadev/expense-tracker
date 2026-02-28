"use client"

import { AppShell } from "@/components/layout/app-shell"
import { SummaryCards } from "@/components/dashboard/summary-cards"
import { RecentExpenses } from "@/components/dashboard/recent-expenses"
import { ChatButton } from "@/components/chat/chat-button"
import { useMonthlyExpenses } from "@/lib/hooks/use-expenses"
import { useBudgets } from "@/lib/hooks/use-budgets"
import { useAnalytics } from "@/lib/hooks/use-analytics"
import { getCurrentMonth, getMonthLabel } from "@/lib/format"

export default function DashboardPage() {
  const currentMonth = getCurrentMonth()
  const { expenses, isLoading } = useMonthlyExpenses(currentMonth)
  const { budgets } = useBudgets(currentMonth)
  const analytics = useAnalytics(expenses, budgets, currentMonth)
  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0)

  return (
    <AppShell>
      <div className="flex flex-col gap-4 px-4 pt-6 pb-4">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance">
            SpendWise
          </h1>
          <p className="text-sm text-muted-foreground">{getMonthLabel(currentMonth)}</p>
        </div>

        {/* Summary */}
        <SummaryCards
          totalSpent={analytics.totalSpent}
          dailyAverage={analytics.dailyAverage}
          totalBudget={totalBudget}
          expenseCount={expenses.length}
        />

        {/* Recent Expenses */}
        <RecentExpenses expenses={expenses} />
      </div>

      <ChatButton />
    </AppShell>
  )
}
