import useSWR, { mutate } from "swr"
import * as db from "@/lib/db"
import type { Budget } from "@/lib/types"

const BUDGETS_KEY = (month: string) => `budgets-${month}`

export function useBudgets(month: string) {
  const { data, error, isLoading } = useSWR<Budget[]>(
    BUDGETS_KEY(month),
    () => db.getBudgetsByMonth(month)
  )

  return {
    budgets: data || [],
    isLoading,
    error,
  }
}

export async function setBudgetAction(budget: Omit<Budget, "id">) {
  const newBudget: Budget = {
    ...budget,
    id: `${budget.category}-${budget.month}`,
  }
  await db.setBudget(newBudget)
  mutate((key: string) => typeof key === "string" && key.startsWith("budgets"), undefined, { revalidate: true })
  return newBudget
}

export async function deleteBudgetAction(id: string) {
  await db.deleteBudget(id)
  mutate((key: string) => typeof key === "string" && key.startsWith("budgets"), undefined, { revalidate: true })
}
