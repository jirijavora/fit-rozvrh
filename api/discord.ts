import {
  InteractionResponseType,
  InteractionType,
  verifyKey,
} from "discord-interactions";

export async function POST(request: Request) {
  const signature = request.headers.get("X-Signature-Ed25519");
  const timestamp = request.headers.get("X-Signature-Timestamp");
  const requestBody = await request.text();

  const isValidRequest = await verifyKey(
    requestBody,
    signature,
    timestamp,
    "d5ad2df6c9aaa0ee82ef1871ed9e1f9ffda11526a0cc9d3faf52d6dde2226c9c"
  );
  if (!isValidRequest) {
    return new Response("Bad request signature", { status: 401 });
  }

  const message = JSON.parse(requestBody);

  if (message?.type === InteractionType.PING) {
    console.log("Handling ping request");
    return new Response(JSON.stringify({ type: InteractionResponseType.PONG }));
  } else {
    console.error("Unknown Type");
    return new Response(null, { status: 400 });
  }
}
