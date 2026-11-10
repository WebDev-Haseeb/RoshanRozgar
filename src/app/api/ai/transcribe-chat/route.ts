import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { audioBase64, mimeType, fallbackText } = body;

    const apiKey = process.env.GEMINI_API_KEY || "AQ.Ab8RN6KXPVV-negolWjegt6ZGjoT4gs3V9FHNQPIv5CZS_aM5w";

    if (!audioBase64 && !fallbackText) {
      return NextResponse.json({ error: "No audio or text provided" }, { status: 400 });
    }

    const prompt = `
You are an expert audio transcriber and conversational assistant for Pakistani trade workers and homeowners in Islamabad/Rawalpindi.
Listen to the attached audio recording (which may be in Urdu, Punjabi, Roman Urdu, or English).
Transcribe what the person spoke accurately.

Rules:
1. Provide the exact verbatim transcription of the speaker's voice in clean Urdu or English.
2. Return a JSON object with:
{
  "transcription": "The exact spoken words",
  "improved": "A polite, clean, professional version ready to send in chat"
}

Reply ONLY with valid JSON.
`;

    const parts: any[] = [{ text: prompt }];

    if (audioBase64) {
      parts.unshift({
        inlineData: {
          mimeType: mimeType || "audio/webm",
          data: audioBase64,
        },
      });
    } else if (fallbackText) {
      parts.push({ text: `Spoken draft: "${fallbackText}"` });
    }

    const models = ["gemini-flash-lite-latest", "gemini-3.5-flash-lite", "gemini-3.8-flash"];
    let result = null;

    for (const model of models) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts }],
            generationConfig: {
              responseMimeType: "application/json",
              temperature: 0.1,
            },
          }),
        });

        const data = await response.json();
        if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
          result = JSON.parse(data.candidates[0].content.parts[0].text);
          break;
        }
      } catch (e) {
        // next model
      }
    }

    if (!result) {
      const speech = (fallbackText && fallbackText.trim()) ? fallbackText.trim() : "";
      result = {
        transcription: speech,
        improved: speech ? speech : "",
      };
    }

    return NextResponse.json({ success: true, ...result });
  } catch (err: any) {
    console.error("Transcribe chat error:", err);
    return NextResponse.json({ error: err.message || "Failed to transcribe audio" }, { status: 500 });
  }
}
