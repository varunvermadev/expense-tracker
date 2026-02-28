import {
  UtensilsCrossed,
  Car,
  ShoppingBag,
  Film,
  Zap,
  Heart,
  GraduationCap,
  ShoppingCart,
  Home,
  MoreHorizontal,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

const iconMap: Record<string, LucideIcon> = {
  UtensilsCrossed,
  Car,
  ShoppingBag,
  Film,
  Zap,
  Heart,
  GraduationCap,
  ShoppingCart,
  Home,
  MoreHorizontal,
}

interface CategoryIconProps {
  iconName: string
  color: string
  size?: "sm" | "md" | "lg"
  className?: string
}

export function CategoryIcon({ iconName, color, size = "md", className }: CategoryIconProps) {
  const Icon = iconMap[iconName] || MoreHorizontal
  const sizeClasses = {
    sm: "h-7 w-7 p-1.5",
    md: "h-9 w-9 p-2",
    lg: "h-11 w-11 p-2.5",
  }

  return (
    <div
      className={cn("flex items-center justify-center rounded-xl", sizeClasses[size], className)}
      style={{ backgroundColor: `${color}20`, color }}
    >
      <Icon className="h-full w-full" />
    </div>
  )
}
