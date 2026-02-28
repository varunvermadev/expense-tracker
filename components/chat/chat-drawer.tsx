"use client"

import { Drawer } from "vaul"

interface ChatDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ChatDrawer({ open, onOpenChange }: ChatDrawerProps) {
  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 mx-auto flex max-w-lg flex-col rounded-t-2xl border border-border bg-card">
          <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-muted-foreground/30" />
          <div className="flex flex-col p-4">
            <Drawer.Title className="text-base font-semibold text-foreground">
              AI Expense Assistant
            </Drawer.Title>
            <Drawer.Description className="text-xs text-muted-foreground">
              Tell me about your expense, like &quot;Spent 200 on lunch&quot;
            </Drawer.Description>
            <div className="mt-4 flex items-center justify-center rounded-xl bg-muted/50 py-12">
              <p className="text-sm text-muted-foreground">Chat loading...</p>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
