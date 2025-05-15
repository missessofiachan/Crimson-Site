import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: Request) {
  const { messages } = await req.json();
  const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY,
    defaultHeaders: {
      'HTTP-Referer': 'http://localhost:3000',
      'X-Title': 'NextJS Chatbot',
    },
  });
  try {
    const completion = await openai.chat.completions.create({
      model: 'meta-llama/llama-4-scout:free',
      messages,
    });
    return NextResponse.json({
      message: completion.choices[0].message.content,
    });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
