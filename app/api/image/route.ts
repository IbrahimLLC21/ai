import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { Configuration, OpenAIApi, ChatCompletionRequestMessage } from "openai";

import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);

const instructionMessage = {
  role: "system",
  content: `
    You are a cover letter generator. Create a detailed and personalized cover letter using the provided CV and job description. 
    Focus on showcasing the candidate's unique qualifications, achievements, and fit for the role. 
    Ensure the cover letter reflects genuine enthusiasm and includes specific details relevant to both the job and the candidate’s background. 
    Use a variety of sentence structures, include personal anecdotes, and reflect the candidate's authentic voice. 
    Strive for a natural, human-like tone by incorporating minor imperfections, colloquial language, and emotional expressions where appropriate. 
    Additionally, avoid repetitive phrasing, incorporate varied vocabulary, and ensure the text feels personal and sincere. 
    Consider how a human would naturally write, with slight hesitations, asides, and authentic reflections on their experiences and goals.`
};



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

    const response = await openai.createChatCompletion({
      model: "gpt-4o-mini",
      messages: [instructionMessage, ...messages]
    });

    if (!isPro) await increaseApiLimit();

    return NextResponse.json(response.data.choices[0].message);
  } catch (error) {
    console.error("[COVER_LETTER_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
