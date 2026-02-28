"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import { getCategoryById } from "@/lib/categories"
import { formatCurrency } from "@/lib/format"

interface BudgetComparisonChartProps {
  data: { category: string; budget: number; actual: number; color: string }[]
}

export function BudgetComparisonChart({ data }: BudgetComparisonChartProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Budget vs Actual</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[250px] flex-col items-center justify-center gap-2">
            <p className="text-sm text-muted-foreground">No budgets set</p>
            <p className="text-xs text-muted-foreground">Set budgets in the Expenses tab</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const chartData = data.map((d) => ({
    name: getCategoryById(d.category).name.split(" ")[0],
    budget: d.budget,
    actual: d.actual,
  }))

  const budgetColor = "#6366f1"
  const actualColor = "#34d399"

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Budget vs Actual</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            budget: { label: "Budget", color: budgetColor },
            actual: { label: "Actual", color: actualColor },
          }}
          className="h-[250px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="name"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                className="fill-muted-foreground"
              />
              <YAxis
                fontSize={11}
                tickLine={false}
                axisLine={false}
                className="fill-muted-foreground"
                tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null
                  return (
                    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-md">
                      <p className="text-xs font-medium text-foreground">{payload[0].payload.name}</p>
                      {payload.map((p) => (
                        <p key={p.dataKey as string} className="text-xs text-muted-foreground">
                          {p.dataKey === "budget" ? "Budget" : "Spent"}: {formatCurrency(p.value as number)}
                        </p>
                      ))}
                    </div>
                  )
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: 11 }}
                iconSize={8}
              />
              <Bar dataKey="budget" fill={budgetColor} radius={[4, 4, 0, 0]} barSize={20} name="Budget" />
              <Bar dataKey="actual" fill={actualColor} radius={[4, 4, 0, 0]} barSize={20} name="Actual" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
