"use client"

import { useState, useRef, useEffect } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport, lastAssistantMessageIsCompleteWithToolCalls } from "ai"
import { Drawer } from "vaul"
import { Send, Bot, User, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { addExpense } from "@/lib/db"
import { getCategoryById } from "@/lib/categories"
import { formatCurrency } from "@/lib/format"
import { mutate } from "swr"

interface ChatDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ChatDrawer({ open, onOpenChange }: ChatDrawerProps) {
  const [input, setInput] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)

  const { messages, sendMessage, addToolOutput, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
    onToolCall({ toolCall }) {
      if (toolCall.dynamic) return

      if (toolCall.toolName === "addExpense") {
        const args = toolCall.args as {
          amount: number
          category: string
          description: string
          date: string
        }

        const id = crypto.randomUUID()
        const expense = {
          id,
          amount: args.amount,
          category: args.category,
          description: args.description,
          date: args.date,
          createdAt: Date.now(),
        }

        addExpense(expense).then(() => {
          mutate((key: string) => typeof key === "string" && key.startsWith("expenses"), undefined, { revalidate: true })
          mutate((key: string) => typeof key === "string" && key.startsWith("budgets"), undefined, { revalidate: true })
        })

        addToolOutput({
          tool: "addExpense",
          toolCallId: toolCall.toolCallId,
          output: {
            success: true,
            expense: {
              id,
              amount: args.amount,
              category: args.category,
              description: args.description,
              date: args.date,
            },
          },
        })
      }
    },
  })

  const isLoading = status === "streaming" || status === "submitted"

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 mx-auto flex max-h-[85vh] max-w-lg flex-col rounded-t-2xl border border-border bg-card">
          <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-muted-foreground/30" />

          <div className="flex items-center gap-3 border-b border-border px-4 pb-3 pt-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <Bot className="h-4 w-4 text-primary" />
            </div>
            <div>
              <Drawer.Title className="text-sm font-semibold text-foreground">
                SpendWise AI
              </Drawer.Title>
              <Drawer.Description className="text-xs text-muted-foreground">
                {"Say \"spent 200 on chai\" to log an expense"}
              </Drawer.Description>
            </div>
          </div>

          <div
            ref={scrollRef}
            className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4"
            style={{ minHeight: "300px", maxHeight: "60vh" }}
          >
            {messages.length === 0 && (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 py-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Bot className="h-6 w-6 text-primary" />
                </div>
                <p className="text-center text-sm text-muted-foreground">
                  Hi! Tell me about your expenses and I will log them for you.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {[
                    "Spent 150 on lunch",
                    "Auto fare 30 rupees",
                    "Bought groceries for 800",
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => {
                        sendMessage({ text: suggestion })
                      }}
                      className="rounded-full border border-border bg-muted/50 px-3 py-1.5 text-xs text-foreground transition-colors hover:bg-muted"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Bot className="h-3.5 w-3.5 text-primary" />
                  </div>
                )}
                <div
                  className={`flex max-w-[80%] flex-col gap-1.5 rounded-2xl px-3.5 py-2 text-sm ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  {message.parts.map((part, i) => {
                    if (part.type === "text" && part.text.trim()) {
                      return (
                        <p key={i} className="whitespace-pre-wrap leading-relaxed">
                          {part.text}
                        </p>
                      )
                    }
                    if (part.type === "tool-invocation") {
                      const toolName = part.toolInvocation.toolName
                      if (toolName === "addExpense") {
                        const args = part.toolInvocation.args as {
                          amount: number
                          category: string
                          description: string
                          date: string
                        }
                        const cat = getCategoryById(args.category)
                        const isDone = part.toolInvocation.state === "output-available"

                        return (
                          <div
                            key={i}
                            className="flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-3 py-2"
                          >
                            {isDone ? (
                              <Check className="h-4 w-4 shrink-0 text-primary" />
                            ) : (
                              <Loader2 className="h-4 w-4 shrink-0 animate-spin text-primary" />
                            )}
                            <div className="text-xs">
                              <p className="font-medium text-foreground">
                                {isDone ? "Logged" : "Logging"}: {formatCurrency(args.amount)}
                              </p>
                              <p className="text-muted-foreground">
                                {cat.name} - {args.description}
                              </p>
                            </div>
                          </div>
                        )
                      }
                    }
                    return null
                  })}
                </div>
                {message.role === "user" && (
                  <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary">
                    <User className="h-3.5 w-3.5 text-secondary-foreground" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
              <div className="flex gap-2">
                <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Bot className="h-3.5 w-3.5 text-primary" />
                </div>
                <div className="rounded-2xl bg-muted px-3.5 py-2">
                  <div className="flex gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:0ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:150ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (!input.trim() || isLoading) return
              sendMessage({ text: input })
              setInput("")
            }}
            className="flex items-center gap-2 border-t border-border px-4 py-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. Spent 300 on dinner..."
              disabled={isLoading}
              className="flex-1 rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50"
            />
            <Button
              type="submit"
              size="icon"
              disabled={isLoading || !input.trim()}
              className="h-10 w-10 shrink-0 rounded-xl"
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </form>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
