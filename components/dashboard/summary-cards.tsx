"use client"

import { IndianRupee, TrendingDown, Wallet, Target } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { formatCurrency } from "@/lib/format"
import type { Budget } from "@/lib/types"

interface SummaryCardsProps {
  totalSpent: number
  dailyAverage: number
  totalBudget: number
  expenseCount: number
}

export function SummaryCards({ totalSpent, dailyAverage, totalBudget, expenseCount }: SummaryCardsProps) {
  const budgetUsed = totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0
  const budgetRemaining = totalBudget > 0 ? totalBudget - totalSpent : 0

  return (
    <div className="grid grid-cols-2 gap-3">
      <Card className="col-span-2 border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5">
        <CardContent className="flex items-center gap-4 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/20">
            <Wallet className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">Total Spent</p>
            <p className="text-2xl font-bold tracking-tight text-foreground">{formatCurrency(totalSpent)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">{expenseCount} expenses</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Daily Avg</p>
          </div>
          <p className="mt-1 text-lg font-semibold text-foreground">{formatCurrency(dailyAverage)}</p>
        </CardContent>
      </Card>

      {totalBudget > 0 ? (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Budget Left</p>
            </div>
            <p className={`mt-1 text-lg font-semibold ${budgetRemaining < 0 ? "text-destructive" : "text-foreground"}`}>
              {formatCurrency(Math.abs(budgetRemaining))}
            </p>
            <Progress value={budgetUsed} className="mt-2 h-1.5" />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Budget</p>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">Not set</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
