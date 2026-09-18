import { z } from "zod";
import { groqApiKey, groqModel } from "@/lib/env";
import { VELORIA_SYSTEM_PROMPT } from "@/lib/veloria-bot";

export const runtime = "nodejs";

const MessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(800),
});

const BodySchema = z.object({
  messages: z.array(MessageSchema).min(1).max(16),
});

const hits = new Map<string, { n: number; t: number }>();

function tooMany(ip: string) {
  const now = Date.now();
  const row = hits.get(ip);
  if (!row || now - row.t > 10 * 60 * 1000) {
    hits.set(ip, { n: 1, t: now });
    return false;
  }
  row.n += 1;
  return row.n > 24;
}

function clientIp(req: Request) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "local"
  );
}

export async function POST(req: Request) {
  const key = groqApiKey();
  if (!key) {
    return Response.json(
      { error: "Chat is not configured. Set GROQ_API_KEY." },
      { status: 503 },
    );
  }

  if (tooMany(clientIp(req))) {
    return Response.json({ error: "Please wait a moment, then try again." }, { status: 429 });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) {
    return Response.json({ error: "Invalid messages." }, { status: 400 });
  }

  const last = parsed.data.messages.at(-1);
  if (!last || last.role !== "user") {
    return Response.json({ error: "Ask a question to continue." }, { status: 400 });
  }

  const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: groqModel(),
      stream: true,
      temperature: 0.2,
      max_tokens: 280,
      messages: [
        { role: "system", content: VELORIA_SYSTEM_PROMPT },
        ...parsed.data.messages.map((m) => ({ role: m.role, content: m.content })),
      ],
    }),
  });

  if (!groqRes.ok || !groqRes.body) {
    const detail = await groqRes.text().catch(() => "");
    console.error("Groq chat failed:", groqRes.status, detail.slice(0, 240));
    return Response.json(
      { error: "Veloria could not reply just now. Please try again." },
      { status: 502 },
    );
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const reader = groqRes.body.getReader();

  const stream = new ReadableStream({
    async start(controller) {
      let buffer = "";
      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data:")) continue;
            const data = trimmed.slice(5).trim();
            if (data === "[DONE]") continue;
            try {
              const chunk = JSON.parse(data) as {
                choices?: { delta?: { content?: string } }[];
              };
              const token = chunk.choices?.[0]?.delta?.content;
              if (token) controller.enqueue(encoder.encode(token));
            } catch {
              /* ignore partial JSON */
            }
          }
        }
      } catch (error) {
        console.error("Groq stream error:", error);
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
