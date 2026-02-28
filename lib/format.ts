import { format, parseISO, isToday, isYesterday } from "date-fns"

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(dateStr: string): string {
  const date = parseISO(dateStr)
  if (isToday(date)) return "Today"
  if (isYesterday(date)) return "Yesterday"
  return format(date, "dd MMM yyyy")
}

export function formatDateShort(dateStr: string): string {
  return format(parseISO(dateStr), "dd MMM")
}

export function getCurrentMonth(): string {
  return format(new Date(), "yyyy-MM")
}

export function getMonthLabel(month: string): string {
  const [year, m] = month.split("-")
  const date = new Date(parseInt(year), parseInt(m) - 1)
  return format(date, "MMMM yyyy")
}

export function getDaysInMonth(month: string): number {
  const [year, m] = month.split("-")
  return new Date(parseInt(year), parseInt(m), 0).getDate()
}
