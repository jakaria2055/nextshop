import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { message, role } = await req.json();

    const prompt = `
You are a professional delivery assistant chatbot for a food & parcel delivery app.

You will be given:
- role: either "user" or "delivery_boy"
- last message: the most recent message in the conversation

Your task:
- If role is "user":
  Generate 3 short WhatsApp-style reply suggestions that a user could send to the delivery boy.
- If role is "delivery_boy":
  Generate 3 short WhatsApp-style reply suggestions that a delivery boy could send to the user.

Follow these rules strictly:
- Replies must be very short (max 8 words each)
- Use natural, friendly, real WhatsApp tone
- No emojis
- No greetings like "Hello" or "Hi"
- No explanations or extra text
- Do NOT include numbering or quotes
- Keep replies context-aware and polite
- Assume a delivery conversation (location, timing, confirmation, delay, payment, etc.)

Output format:
Return ONLY the three reply suggestions, separated by commas.

Role: ${role}
Last message: ${message}
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent`,
      {
        method: "POST",
        headers: {
          "x-goog-api-key": process.env.GEMINI_API_KEY!,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      },
    );

    const data = await response.json();

    const replyText = data.candidates?.[0].content.parts?.[0].text || "";

    const suggestions = replyText
      .split(",")
      .map((s: string) => s.trim())
      .filter((s: string) => s.length > 0);

    return NextResponse.json(suggestions, { status: 200 });
  } catch (error) {
    console.error("Gemini API error:", error);
    return NextResponse.json(
      { message: `gemini API error: ${error}` },
      { status: 500 },
    );
  }
}
