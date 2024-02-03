// Qestion: order??
// Example: do you know ningbo? ... show me the weather of this place now? ... what about ningbo? ... show me the weather of this city now?

import { NextRequest, NextResponse } from "next/server";
import { Message as VercelChatMessage, StreamingTextResponse } from "ai";

import {
  AgentExecutor,
  createOpenAIFunctionsAgent,
  createReactAgent,
} from "langchain/agents";
import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { SerpAPI } from "@langchain/community/tools/serpapi";
import { Calculator } from "langchain/tools/calculator";
import {
  GoogleCalendarCreateTool,
  GoogleCalendarViewTool,
} from "@langchain/community/tools/google_calendar";

import { AIMessage, ChatMessage, HumanMessage } from "@langchain/core/messages";
import { pull } from "langchain/hub";
import type { PromptTemplate } from "@langchain/core/prompts";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { BaseLLM } from "langchain/llms/base";

// export const runtime = "edge";

// const convertVercelMessageToLangChainMessage = (message: VercelChatMessage) => {
//   if (message.role === "user") {
//     return new HumanMessage(message.content);
//   } else if (message.role === "assistant") {
//     return new AIMessage(message.content);
//   } else {
//     return new ChatMessage(message.content, message.role);
//   }
// };

const formatMessage = (message: VercelChatMessage) => {
  return `${message.role}: ${message.content}`;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const returnIntermediateSteps = true;

    const messages = (body.messages ?? []).filter(
      (message: VercelChatMessage) =>
        message.role === "user" || message.role === "assistant"
    );
    const previousMessages = messages.slice(0, -1).map(formatMessage);
    const currentMessageContent = messages[messages.length - 1].content;

    console.log(previousMessages);

    // https://js.langchain.com/docs/modules/agents/agent_types/react

    const chat = new ChatOllama({
      baseUrl: "http://localhost:11434", // Default value
      model: "mistral",
    });

    const googleCalendarParams = {
      credentials: {
        clientEmail: process.env.GOOGLE_CALENDAR_CLIENT_EMAIL,
        privateKey: process.env.GOOGLE_CALENDAR_PRIVATE_KEY,
        calendarId: process.env.GOOGLE_CALENDAR_CALENDAR_ID,
      },
      scopes: [
        "https://www.googleapis.com/auth/calendar",
        "https://www.googleapis.com/auth/calendar.events",
      ],
      model: chat as unknown as BaseLLM, // bad bad integration
    };

    const tools = [
      new Calculator(),
      new SerpAPI(),
      new GoogleCalendarCreateTool(googleCalendarParams),
      new GoogleCalendarViewTool(googleCalendarParams),
    ];

    const prompt = await pull<PromptTemplate>("hwchase17/react-chat");

    const agent = await createReactAgent({
      llm: chat,
      tools,
      prompt,
    });

    const agentExecutor = new AgentExecutor({
      agent,
      tools,
      returnIntermediateSteps,
    });

    if (!returnIntermediateSteps) {
      const logStream = await agentExecutor.streamLog({
        input: currentMessageContent,
        chat_history: previousMessages.join("\n"),
      });

      const textEncoder = new TextEncoder();
      const transformStream = new ReadableStream({
        async start(controller) {
          for await (const chunk of logStream) {
            if (chunk.ops?.length > 0 && chunk.ops[0].op === "add") {
              const addOp = chunk.ops[0];
              if (
                addOp.path.startsWith("/logs/ChatOpenAI") &&
                typeof addOp.value === "string" &&
                addOp.value.length
              ) {
                controller.enqueue(textEncoder.encode(addOp.value));
              }
            }
          }
          controller.close();
        },
      });

      return new StreamingTextResponse(transformStream);
    } else {
      const result = await agentExecutor.invoke({
        input: currentMessageContent,
        chat_history: previousMessages.join("\n"),
      });
      return NextResponse.json(
        { output: result.output, intermediate_steps: result.intermediateSteps },
        { status: 200 }
      );
    }
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
