import {
  convertToModelMessages,
  streamText,
  tool,
  UIMessage,
} from "ai"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import * as z from "zod"

export const maxDuration = 30

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
})

const addExpenseTool = tool({
  description:
    "Add an expense when the user mentions spending money. Extract the amount, category, description, and date from the message. If no date is mentioned, use today. Categories are: food, transport, shopping, entertainment, bills, health, education, groceries, rent, other.",
  inputSchema: z.object({
    amount: z.number().describe("The expense amount in INR"),
    category: z
      .enum([
        "food",
        "transport",
        "shopping",
        "entertainment",
        "bills",
        "health",
        "education",
        "groceries",
        "rent",
        "other",
      ])
      .describe("The expense category"),
    description: z
      .string()
      .describe("A short description of the expense"),
    date: z
      .string()
      .describe(
        "The date of the expense in YYYY-MM-DD format. Use today if not specified."
      ),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    expense: z.object({
      id: z.string(),
      amount: z.number(),
      category: z.string(),
      description: z.string(),
      date: z.string(),
    }),
  }),
})

const tools = {
  addExpense: addExpenseTool,
} as const

export async function POST(req: Request) {
  const body = await req.json()

  const messages: UIMessage[] = body.messages

  const result = streamText({
    model: google("gemini-2.0-flash"),
    system: `You are SpendWise AI, a friendly and efficient expense tracking assistant. Your job is to help users log their daily expenses through natural conversation.

When a user tells you about an expense:
1. Extract the amount, category, and description
2. Use the addExpense tool to log it
3. Confirm the expense was logged with a brief summary

Key behaviors:
- Currency is INR (Indian Rupees). If user says "200 on chai", the amount is 200.
- If the user says something like "spent 500 on groceries", immediately use the tool. Don't ask unnecessary questions.
- If the amount or description is unclear, ask for clarification.
- Be concise and friendly. Use short responses.
- If the user asks about their spending or wants tips, provide helpful advice.
- Today's date is ${new Date().toISOString().split("T")[0]}.
- If user says "yesterday", compute the correct date. Same for "last Monday", etc.
- You can also help users understand categories. Food & Dining covers restaurants, cafes, snacks. Groceries covers supermarket runs, vegetables, etc.`,
    messages: await convertToModelMessages(messages),
    tools,
    stopWhen: (options) => {
      return options.steps.length >= 3
    },
  })

  return result.toUIMessageStreamResponse()
}
