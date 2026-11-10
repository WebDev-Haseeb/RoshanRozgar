import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { rawText, senderRole } = body;

    if (!rawText || !rawText.trim()) {
      return NextResponse.json({ error: "Missing text to enhance" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY || "AQ.Ab8RN6KXPVV-negolWjegt6ZGjoT4gs3V9FHNQPIv5CZS_aM5w";

    const prompt = `
You are an AI communication assistant for Roshan Rozgar (روشن روزگار) trade marketplace in Islamabad & Rawalpindi.
A ${senderRole === "worker" ? "trade worker" : "client"} has recorded a spoken voice note message to send in chat:
"${rawText}"

Improve this message into a polite, professional, crystal-clear chat message suitable for Pakistani service messaging.
Rules:
1. Preserve all core facts (names, tools, parts, arrival time, pricing, locations).
2. Format as a warm, respectful message in clear Urdu followed by a concise English translation if helpful.
3. Keep it brief and friendly (no corporate jargon, no fluff).

Reply ONLY with the improved message text.
`;

    const models = ["gemini-flash-lite-latest", "gemini-3.5-flash-lite", "gemini-3.8-flash"];
    let enhanced = "";

    for (const model of models) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.2 },
          }),
        });

        const data = await response.json();
        if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
          enhanced = data.candidates[0].content.parts[0].text.trim();
          break;
        }
      } catch (e) {
        // next model
      }
    }

    if (!enhanced) {
      enhanced = rawText.trim();
    }

    return NextResponse.json({ success: true, enhancedText: enhanced });
  } catch (err: any) {
    console.error("AI Enhance Chat Error:", err);
    return NextResponse.json({ error: err.message || "Failed to enhance message" }, { status: 500 });
  }
}
