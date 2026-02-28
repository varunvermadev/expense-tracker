import useSWR, { mutate } from "swr"
import * as db from "@/lib/db"
import type { Expense } from "@/lib/types"
import { getCurrentMonth } from "@/lib/format"

const EXPENSES_KEY = "expenses"
const MONTHLY_KEY = (month: string) => `expenses-${month}`

export function useExpenses() {
  const { data, error, isLoading } = useSWR<Expense[]>(
    EXPENSES_KEY,
    () => db.getAllExpenses()
  )

  return {
    expenses: data || [],
    isLoading,
    error,
  }
}

export function useMonthlyExpenses(month: string) {
  const { data, error, isLoading } = useSWR<Expense[]>(
    MONTHLY_KEY(month),
    () => db.getExpensesByMonth(month)
  )

  return {
    expenses: data || [],
    isLoading,
    error,
  }
}

export async function addExpenseAction(expense: Omit<Expense, "id" | "createdAt">) {
  const newExpense: Expense = {
    ...expense,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  }
  await db.addExpense(newExpense)
  // Revalidate all expense caches
  mutate((key: string) => typeof key === "string" && key.startsWith("expenses"), undefined, { revalidate: true })
  return newExpense
}

export async function deleteExpenseAction(id: string) {
  await db.deleteExpense(id)
  mutate((key: string) => typeof key === "string" && key.startsWith("expenses"), undefined, { revalidate: true })
}

export async function updateExpenseAction(expense: Expense) {
  await db.updateExpense(expense)
  mutate((key: string) => typeof key === "string" && key.startsWith("expenses"), undefined, { revalidate: true })
}
