export const dynamic = 'force-dynamic';
export const runtime = 'nodejs'; 
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";

import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

// Define the CustomMessage type
interface CustomMessage extends ChatCompletionRequestMessage {
  name?: string;
  position?: string;
  company?: string;
}

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { messages } = body;

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    if (!configuration.apiKey)
      return new NextResponse("OpenAI API Key Not Configured", { status: 500 });

    if (!messages)
      return new NextResponse("Messages Are Required", { status: 400 });

    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();

    if (!freeTrial && !isPro)
      return new NextResponse("Free Trial Has Expired", { status: 403 });

    // Customize the response by modifying the prompt
    const customMessages = (messages as CustomMessage[]).map((message) => {
      return {
        role: message.role,
        content: message.role === "user"
          ? `As a candidate named ${message.name ?? 'Anonymous'} interviewing for the ${message.position ?? 'unknown'} position at ${message.company ?? 'unknown company'}, answer the following interview question: ${message.content}. Please provide a natural and concise response without repeating the question or referencing the technology used to generate responses.`
          : message.content
      };
    });

    const response = await openai.createChatCompletion({
      model: "gpt-4o-mini",
      messages: customMessages,
    });

    if (!isPro) await increaseApiLimit();

    return NextResponse.json(response.data.choices[0].message);
  } catch (error) {
    console.error("[CONVERSATION_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
