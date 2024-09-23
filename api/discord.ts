import { InteractionResponseType, InteractionType } from "discord-interactions";

export async function POST(request: Request) {
  const message = (await request.json()).body;

  if (message?.type === InteractionType.PING) {
    console.log("Handling ping request");
    return new Response(JSON.stringify({ type: InteractionResponseType.PONG }));
  } else {
    console.error("Unknown Type");
    return new Response(null, { status: 400 });
  }
}
