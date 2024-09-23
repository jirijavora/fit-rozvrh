import { createClient } from "@vercel/kv";

const kv = createClient({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_READ_ONLY_TOKEN,
  enableTelemetry: false,
});

const fetchTimetables = async () => {
  const data = await kv.json.get("data");
  return data;
};

export async function GET(request: Request) {
  const me = await fetch("https://discord.com/api/users/@me", {
    headers: { authorization: request.headers.get("discordToken")! },
  });

  console.log(await me.json());

  return new Response(JSON.stringify(await fetchTimetables()));
}
