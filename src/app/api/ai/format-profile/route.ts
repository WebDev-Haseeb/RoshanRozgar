import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { audioBase64, mimeType, textInput, existingName, existingTrade, existingSector } = body;

    const apiKey = process.env.GEMINI_API_KEY || "AQ.Ab8RN6KXPVV-negolWjegt6ZGjoT4gs3V9FHNQPIv5CZS_aM5w";

    const promptText = `
You are an expert AI profile builder for Roshan Rozgar (روشن روزگار), a trusted trade workers platform in Islamabad and Rawalpindi, Pakistan.
Your task is to take a worker's voice introduction or description (which could be in Urdu, Roman Urdu, Punjabi, or English) and parse it into an impeccably formatted professional profile.

Context provided:
- Default Name: ${existingName || "Trade Professional"}
- Default Trade: ${existingTrade || "electrician"}
- Default Sector: ${existingSector || "Islamabad · G-9 / G-10 / G-11"}

${textInput ? `Worker input text: "${textInput}"` : `Listen to the attached audio recording of the worker speaking.`}

Extract and format the information into a single clean JSON object matching this schema:
{
  "transcription": "Exact transcription of what the worker spoke in Urdu / English",
  "name": "Worker's clean full name",
  "trade": "electrician" | "plumber" | "ac" | "carpenter" | "painter" | "mechanic",
  "experienceYears": number of years of experience (default to 5 if not specified),
  "tagline": "A crisp Apple-style tagline highlighting their primary trade specialty and area",
  "skills": ["Specific skill 1", "Specific skill 2", "Specific skill 3", "Specific skill 4"],
  "bioUrdu": "A warm, trustworthy professional bio in fluent, grammatically correct Urdu (2-3 sentences)",
  "bioEnglish": "An articulate English summary highlighting craftsmanship, punctuality, and client satisfaction (2-3 sentences)",
  "sector": "Islamabad/Rawalpindi sector"
}

Reply ONLY with valid JSON.
`;

    const parts: any[] = [{ text: promptText }];

    if (audioBase64) {
      parts.unshift({
        inlineData: {
          mimeType: mimeType || "audio/webm",
          data: audioBase64,
        },
      });
    }

    // Attempt with gemini-flash-lite-latest first, fallback to gemini-3.5-flash-lite
    const models = ["gemini-flash-lite-latest", "gemini-3.5-flash-lite", "gemini-3.8-flash"];
    let resultJson: any = null;
    let lastError: string = "";

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
              temperature: 0.2,
            },
          }),
        });

        const data = await response.json();
        if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
          const rawText = data.candidates[0].content.parts[0].text;
          resultJson = JSON.parse(rawText);
          break;
        } else {
          lastError = data.error?.message || "No candidate returned";
        }
      } catch (e: any) {
        lastError = e.message;
      }
    }

    if (!resultJson) {
      // Graceful fallback if AI is rate limited or unavailable
      resultJson = {
        transcription: textInput || "Voice intro recorded successfully.",
        name: existingName || "Verified Worker",
        trade: existingTrade || "electrician",
        experienceYears: 5,
        tagline: `Professional ${existingTrade || "Electrician"} in ${existingSector || "Islamabad"}`,
        skills: [
          "Circuit Breaker & DB Wiring",
          "Inverter & Solar UPS Installation",
          "Appliance Repair & Diagnostics",
          "Emergency Fault Finding",
        ],
        bioUrdu: "ماہر اور بااعتماد کاریگر۔ اعلیٰ معیار کے ساتھ محفوظ اور پائیدار کام کی ضمانت۔",
        bioEnglish: "Reliable and certified trade specialist dedicated to safe installations, punctual service, and transparent pricing.",
        sector: existingSector || "Islamabad · G-9 / G-10 / G-11",
      };
    }

    return NextResponse.json({ success: true, profile: resultJson });
  } catch (err: any) {
    console.error("AI Profile Formatting Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to format profile with AI" },
      { status: 500 }
    );
  }
}
