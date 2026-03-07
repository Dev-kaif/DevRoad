import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { GoogleGenAI } from "@google/genai";
import { roadmap } from "@/lib/data";

const genAI = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY as string
});

export async function POST(req: NextRequest) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { phaseIndex, context } = await req.json();

    const phase = phaseIndex !== undefined ? roadmap[phaseIndex] : null;

    const phaseContext = phase
        ? `The user is currently studying: "${phase.title}" (${phase.tag}).
Topics covered: ${phase.sections.flatMap((s) => s.items.map((i) => i.text)).slice(0, 10).join(", ")}.`
        : "General backend development concepts.";

    const userContext = context ? `Additional context from user: ${context}` : "";

    const prompt = `You are a senior backend engineer creating a coding assignment for a self-taught developer learning backend fundamentals.

${phaseContext}
${userContext}

The developer's stack: TypeScript, Node.js, Next.js, Postgres, Redis, Docker.
Their projects: Beatflow (music gen platform), ViralRot (video processing), OpenFlowX (workflow automation), SketchWiz (collaborative canvas).

Create ONE focused coding assignment that:
1. Can be completed in 30–120 minutes
2. Builds a small but complete thing (not "learn about X", but "build X")
3. Uses their existing stack where possible
4. Focuses on depth over breadth — they should understand every line
5. Is specific enough that they don't need to ask what to do

Return ONLY valid JSON in this exact shape, no markdown, no extra text:
{
  "title": "short imperative title e.g. 'Build a JWT refresh token rotation system'",
  "description": "3-5 sentences. What to build, specific requirements, what they should understand after. Include a small acceptance criteria list.",
  "timeLimitMin": 60,
  "phaseName": "${phase?.title ?? "General"}"
}`;

    try {
        const response = await genAI.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
        });

        const text = response.text?.trim() || "{}"

        const clean = text.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(clean);

        return NextResponse.json({ assignment: { ...parsed, aiGenerated: true, phaseIndex } });
    } catch (err) {
        console.error("Gemini error:", err);
        return NextResponse.json({ error: "Failed to generate assignment" }, { status: 500 });
    }
}