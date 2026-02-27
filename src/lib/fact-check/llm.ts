import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";

const MODEL = "claude-sonnet-4-20250514";
const MAX_RETRIES = 3;
const BACKOFF_BASE_MS = 1000;

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error("ANTHROPIC_API_KEY environment variable is required");
    }
    client = new Anthropic({ apiKey });
  }
  return client;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function extractJson(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) return fenced[1].trim();

  const braceStart = text.indexOf("{");
  const braceEnd = text.lastIndexOf("}");
  if (braceStart !== -1 && braceEnd > braceStart) {
    return text.slice(braceStart, braceEnd + 1);
  }

  return text.trim();
}

export async function callClaude<T>(options: {
  system: string;
  user: string;
  schema: z.ZodType<T>;
  temperature: number;
  maxTokens?: number;
}): Promise<T> {
  const { system, user, schema, temperature, maxTokens = 4096 } = options;
  const anthropic = getClient();

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    if (attempt > 0) {
      await sleep(BACKOFF_BASE_MS * Math.pow(2, attempt - 1));
    }

    try {
      const response = await anthropic.messages.create({
        model: MODEL,
        max_tokens: maxTokens,
        temperature,
        system,
        messages: [{ role: "user", content: user }],
      });

      const textBlock = response.content.find((b) => b.type === "text");
      if (!textBlock || textBlock.type !== "text") {
        throw new Error("No text content in Claude response");
      }

      const jsonStr = extractJson(textBlock.text);
      const parsed = JSON.parse(jsonStr);
      const validated = schema.parse(parsed);
      return validated;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      console.error(
        `  [LLM] Attempt ${attempt + 1}/${MAX_RETRIES} failed: ${lastError.message}`,
      );
    }
  }

  throw new Error(
    `LLM call failed after ${MAX_RETRIES} attempts: ${lastError?.message}`,
  );
}
