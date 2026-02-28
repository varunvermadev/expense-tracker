"use client"

import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Drawer } from "vaul"
import { DEFAULT_CATEGORIES } from "@/lib/categories"
import { addExpenseAction, updateExpenseAction } from "@/lib/hooks/use-expenses"
import { toast } from "sonner"
import type { Expense } from "@/lib/types"
import { cn } from "@/lib/utils"

interface ExpenseFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editExpense?: Expense | null
}

export function ExpenseForm({ open, onOpenChange, editExpense }: ExpenseFormProps) {
  const [amount, setAmount] = useState(editExpense?.amount?.toString() || "")
  const [category, setCategory] = useState(editExpense?.category || "")
  const [description, setDescription] = useState(editExpense?.description || "")
  const [date, setDate] = useState<Date>(
    editExpense ? new Date(editExpense.date) : new Date()
  )
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isEditing = !!editExpense

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!amount || !category || !description) {
      toast.error("Please fill in all fields")
      return
    }
    const parsedAmount = parseFloat(amount)
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error("Please enter a valid amount")
      return
    }

    setIsSubmitting(true)
    try {
      const dateStr = format(date, "yyyy-MM-dd")
      if (isEditing && editExpense) {
        await updateExpenseAction({
          ...editExpense,
          amount: parsedAmount,
          category,
          description,
          date: dateStr,
        })
        toast.success("Expense updated")
      } else {
        await addExpenseAction({
          amount: parsedAmount,
          category,
          description,
          date: dateStr,
        })
        toast.success("Expense added")
      }
      onOpenChange(false)
      // Reset form
      setAmount("")
      setCategory("")
      setDescription("")
      setDate(new Date())
    } catch {
      toast.error("Failed to save expense")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 mx-auto flex max-w-lg flex-col rounded-t-2xl border border-border bg-card">
          <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-muted-foreground/30" />
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 pb-8">
            <Drawer.Title className="text-base font-semibold text-foreground">
              {isEditing ? "Edit Expense" : "Add Expense"}
            </Drawer.Title>
            <Drawer.Description className="sr-only">
              {isEditing ? "Edit expense details" : "Add a new expense"}
            </Drawer.Description>

            <div className="flex flex-col gap-2">
              <Label htmlFor="amount" className="text-sm text-foreground">Amount (INR)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-lg font-semibold"
                min="0"
                step="1"
                autoFocus
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="category" className="text-sm text-foreground">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {DEFAULT_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="description" className="text-sm text-foreground">Description</Label>
              <Input
                id="description"
                placeholder="What did you spend on?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-sm text-foreground">Date</Label>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(date, "dd MMM yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => {
                      if (d) {
                        setDate(d)
                        setCalendarOpen(false)
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <Button type="submit" disabled={isSubmitting} className="mt-2">
              {isSubmitting ? "Saving..." : isEditing ? "Update Expense" : "Add Expense"}
            </Button>
          </form>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
