"use client"

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import { formatCurrency } from "@/lib/format"

interface DailyTrendChartProps {
  data: { day: number; amount: number; date: string }[]
}

export function DailyTrendChart({ data }: DailyTrendChartProps) {
  const hasData = data.some((d) => d.amount > 0)

  if (!hasData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Daily Spending Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[250px] items-center justify-center">
            <p className="text-sm text-muted-foreground">No expenses yet</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const primaryColor = "#34d399"

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Daily Spending Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            amount: { label: "Amount", color: primaryColor },
          }}
          className="h-[250px]"
        >
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="fillAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={primaryColor} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={primaryColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="day"
                fontSize={11}
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
                  const d = payload[0].payload as { day: number; amount: number }
                  return (
                    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-md">
                      <p className="text-xs font-medium text-foreground">Day {d.day}</p>
                      <p className="text-xs text-muted-foreground">{formatCurrency(d.amount)}</p>
                    </div>
                  )
                }}
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke={primaryColor}
                strokeWidth={2}
                fill="url(#fillAmount)"
              />
            </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
