export interface Expense {
  id: string
  amount: number
  category: string
  description: string
  date: string // ISO date string YYYY-MM-DD
  createdAt: number // timestamp
}

export interface Budget {
  id: string
  category: string
  amount: number
  month: string // YYYY-MM format
}

export interface Category {
  id: string
  name: string
  icon: string // Lucide icon name
  color: string // hex color for charts
}

export interface MonthlyAnalytics {
  totalSpent: number
  dailyAverage: number
  categoryBreakdown: { category: string; total: number; color: string }[]
  dailyTrend: { day: number; amount: number; date: string }[]
  topExpenses: Expense[]
  budgetComparison: { category: string; budget: number; actual: number; color: string }[]
}
