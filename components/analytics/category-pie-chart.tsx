"use client"

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
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

interface CategoryPieChartProps {
  data: { category: string; total: number; color: string }[]
}

export function CategoryPieChart({ data }: CategoryPieChartProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Category Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[250px] items-center justify-center">
            <p className="text-sm text-muted-foreground">No expenses yet</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const chartData = data.map((d) => ({
    name: getCategoryById(d.category).name,
    value: d.total,
    fill: d.color,
  }))

  const chartConfig = Object.fromEntries(
    data.map((d) => [
      getCategoryById(d.category).name,
      { label: getCategoryById(d.category).name, color: d.color },
    ])
  )

  const total = data.reduce((sum, d) => sum + d.total, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Category Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="mx-auto h-[250px]">
          <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null
                  const d = payload[0]
                  return (
                    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-md">
                      <p className="text-xs font-medium text-foreground">{d.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatCurrency(d.value as number)} ({((d.value as number / total) * 100).toFixed(1)}%)
                      </p>
                    </div>
                  )
                }}
              />
            </PieChart>
        </ChartContainer>
        <div className="mt-3 flex flex-wrap gap-2">
          {data.slice(0, 5).map((d) => (
            <div key={d.category} className="flex items-center gap-1.5">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: d.color }}
              />
              <span className="text-xs text-muted-foreground">
                {getCategoryById(d.category).name}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
