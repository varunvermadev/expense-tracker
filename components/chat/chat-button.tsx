"use client"

import { useState } from "react"
import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ChatDrawer } from "./chat-drawer"

export function ChatButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        size="icon"
        className="fixed bottom-20 right-4 z-50 h-14 w-14 rounded-full bg-primary shadow-lg shadow-primary/25 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 transition-all"
      >
        <MessageCircle className="h-6 w-6 text-primary-foreground" />
        <span className="sr-only">Open AI chat to log expense</span>
      </Button>
      <ChatDrawer open={open} onOpenChange={setOpen} />
    </>
  )
}
