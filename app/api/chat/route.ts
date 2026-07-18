import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";
import {
  MODEL,
  returningCustomerContext,
  runTool,
  systemPrompt,
  tools,
  type ConciergeEvent,
} from "@/lib/concierge";
import { FALLBACK_NOTICE, scriptedReply, type ChatTurn } from "@/lib/fallback";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Stops a malfunctioning tool loop from running forever. */
const MAX_TOOL_ROUNDS = 6;

type StreamChunk =
  | { type: "text"; text: string }
  | { type: "event"; event: ConciergeEvent }
  | { type: "notice"; text: string }
  | { type: "error"; text: string }
  | { type: "done" };

export async function POST(req: NextRequest) {
  let body: {
    messages?: ChatTurn[];
    identity?: { phone?: string; instagram?: string };
  };

  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const history = (body.messages ?? []).filter(
    (m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string",
  );

  if (history.length === 0) {
    return Response.json({ error: "No messages provided." }, { status: 400 });
  }

  const encoder = new TextEncoder();
  // The SDK resolves credentials itself (API key, auth token, or an `ant auth
  // login` profile) — we only check whether *any* credential is configured so
  // we know whether to fall back to the scripted concierge.
  const hasCredentials = Boolean(
    process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN,
  );

  const stream = new ReadableStream({
    async start(controller) {
      const send = (chunk: StreamChunk) => {
        controller.enqueue(encoder.encode(`${JSON.stringify(chunk)}\n`));
      };

      try {
        // ---- No credentials: run the scripted concierge so the site still works.
        if (!hasCredentials) {
          send({ type: "notice", text: FALLBACK_NOTICE });
          const { text, event } = scriptedReply(history);
          // Emit in small pieces so the UI still feels like it's typing.
          for (const word of text.split(/(\s+)/)) {
            send({ type: "text", text: word });
            await new Promise((r) => setTimeout(r, 12));
          }
          if (event) send({ type: "event", event });
          send({ type: "done" });
          controller.close();
          return;
        }

        const client = new Anthropic();
        const returning = await returningCustomerContext(body.identity);
        const system = systemPrompt({ returningCustomer: returning });

        const messages: Anthropic.MessageParam[] = history.map((m) => ({
          role: m.role,
          content: m.content,
        }));

        for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
          const messageStream = client.messages.stream({
            model: MODEL,
            max_tokens: 2048,
            system: [
              // Cache the system prompt: it carries the whole catalog and is
              // identical on every request, so it should never be re-processed.
              { type: "text", text: system, cache_control: { type: "ephemeral" } },
            ],
            // A booking concierge is latency-sensitive and not a reasoning task,
            // so we run it fast. The system prompt carries a matching
            // "final answer only" instruction.
            thinking: { type: "disabled" },
            output_config: { effort: "low" },
            tools,
            messages,
          });

          messageStream.on("text", (delta) => send({ type: "text", text: delta }));

          const message = await messageStream.finalMessage();
          messages.push({ role: "assistant", content: message.content });

          if (message.stop_reason !== "tool_use") break;

          const toolUses = message.content.filter(
            (b): b is Anthropic.ToolUseBlock => b.type === "tool_use",
          );

          const results: Anthropic.ToolResultBlockParam[] = [];
          for (const toolUse of toolUses) {
            try {
              const { result, event } = await runTool(
                toolUse.name,
                toolUse.input as Record<string, unknown>,
              );
              if (event) send({ type: "event", event });
              results.push({
                type: "tool_result",
                tool_use_id: toolUse.id,
                content: result,
              });
            } catch (err) {
              // Hand the failure back to the model so it can recover in-conversation
              // rather than dropping the customer.
              results.push({
                type: "tool_result",
                tool_use_id: toolUse.id,
                content: `Tool failed: ${err instanceof Error ? err.message : "unknown error"}`,
                is_error: true,
              });
            }
          }

          messages.push({ role: "user", content: results });
        }

        send({ type: "done" });
        controller.close();
      } catch (err) {
        console.error("[concierge]", err);

        const message =
          err instanceof Anthropic.RateLimitError
            ? "We're getting a lot of love right now — give me a moment and try again 💜"
            : err instanceof Anthropic.AuthenticationError
              ? "The concierge isn't configured correctly. Please message us on WhatsApp and we'll help you straight away."
              : "Something went wrong on my side. Please try again, or reach us on WhatsApp and we'll sort it out personally 💜";

        send({ type: "error", text: message });
        send({ type: "done" });
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
