"use client"

import { useState } from "react"
import { Plus, Search, Filter } from "lucide-react"
import { AppShell } from "@/components/layout/app-shell"
import { ExpenseList } from "@/components/expenses/expense-list"
import { ExpenseForm } from "@/components/expenses/expense-form"
import { ChatButton } from "@/components/chat/chat-button"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useMonthlyExpenses } from "@/lib/hooks/use-expenses"
import { DEFAULT_CATEGORIES } from "@/lib/categories"
import { getCurrentMonth, getMonthLabel } from "@/lib/format"
import type { Expense } from "@/lib/types"

export default function ExpensesPage() {
  const currentMonth = getCurrentMonth()
  const { expenses } = useMonthlyExpenses(currentMonth)
  const [formOpen, setFormOpen] = useState(false)
  const [editExpense, setEditExpense] = useState<Expense | null>(null)
  const [search, setSearch] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")

  const filteredExpenses = expenses.filter((e) => {
    const matchSearch = !search || e.description.toLowerCase().includes(search.toLowerCase())
    const matchCategory = filterCategory === "all" || e.category === filterCategory
    return matchSearch && matchCategory
  })

  function handleEdit(expense: Expense) {
    setEditExpense(expense)
    setFormOpen(true)
  }

  function handleFormClose(open: boolean) {
    setFormOpen(open)
    if (!open) setEditExpense(null)
  }

  return (
    <AppShell>
      <div className="flex flex-col gap-4 px-4 pt-6 pb-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">Expenses</h1>
            <p className="text-sm text-muted-foreground">{getMonthLabel(currentMonth)}</p>
          </div>
          <Button
            size="sm"
            onClick={() => setFormOpen(true)}
            className="gap-1.5"
          >
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search expenses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-[140px]">
              <Filter className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {DEFAULT_CATEGORIES.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* List */}
        <ExpenseList expenses={filteredExpenses} onEdit={handleEdit} />
      </div>

      <ExpenseForm
        open={formOpen}
        onOpenChange={handleFormClose}
        editExpense={editExpense}
      />
      <ChatButton />
    </AppShell>
  )
}
