"use client"

import { BottomNav } from "./bottom-nav"

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-background">
      <main className="mx-auto max-w-lg pb-20">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
