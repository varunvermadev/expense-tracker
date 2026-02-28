import { openDB, type IDBPDatabase } from "idb"
import type { Expense, Budget } from "./types"

const DB_NAME = "expense-tracker"
const DB_VERSION = 1

export interface ExpenseTrackerDB {
  expenses: {
    key: string
    value: Expense
    indexes: {
      "by-date": string
      "by-category": string
      "by-month": string
    }
  }
  budgets: {
    key: string
    value: Budget
    indexes: {
      "by-month": string
    }
  }
}

let dbPromise: Promise<IDBPDatabase> | null = null

function getDB(): Promise<IDBPDatabase> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("IndexedDB is not available on the server"))
  }
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Expenses store
        if (!db.objectStoreNames.contains("expenses")) {
          const expenseStore = db.createObjectStore("expenses", { keyPath: "id" })
          expenseStore.createIndex("by-date", "date")
          expenseStore.createIndex("by-category", "category")
        }
        // Budgets store
        if (!db.objectStoreNames.contains("budgets")) {
          const budgetStore = db.createObjectStore("budgets", { keyPath: "id" })
          budgetStore.createIndex("by-month", "month")
        }
      },
    })
  }
  return dbPromise
}

// -- Expense operations --

export async function addExpense(expense: Expense): Promise<void> {
  const db = await getDB()
  await db.put("expenses", expense)
}

export async function getExpense(id: string): Promise<Expense | undefined> {
  const db = await getDB()
  return db.get("expenses", id)
}

export async function getAllExpenses(): Promise<Expense[]> {
  const db = await getDB()
  const expenses = await db.getAll("expenses")
  return expenses.sort((a, b) => b.createdAt - a.createdAt)
}

export async function getExpensesByMonth(month: string): Promise<Expense[]> {
  const db = await getDB()
  const all = await db.getAll("expenses")
  return all
    .filter((e) => e.date.startsWith(month))
    .sort((a, b) => b.createdAt - a.createdAt)
}

export async function getExpensesByCategory(category: string): Promise<Expense[]> {
  const db = await getDB()
  const all = await db.getAllFromIndex("expenses", "by-category", category)
  return all.sort((a, b) => b.createdAt - a.createdAt)
}

export async function deleteExpense(id: string): Promise<void> {
  const db = await getDB()
  await db.delete("expenses", id)
}

export async function updateExpense(expense: Expense): Promise<void> {
  const db = await getDB()
  await db.put("expenses", expense)
}

// -- Budget operations --

export async function setBudget(budget: Budget): Promise<void> {
  const db = await getDB()
  await db.put("budgets", budget)
}

export async function getBudgetsByMonth(month: string): Promise<Budget[]> {
  const db = await getDB()
  return db.getAllFromIndex("budgets", "by-month", month)
}

export async function deleteBudget(id: string): Promise<void> {
  const db = await getDB()
  await db.delete("budgets", id)
}
