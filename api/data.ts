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
  const user = await fetch("https://discord.com/api/users/@me", {
    headers: { authorization: request.headers.get("discordToken")! },
  });

  const guildUser = await fetch(
    `https://discord.com/api/guilds/${process.env.GUILD_ID}/members/${
      (
        await user.json()
      ).id
    }`,
    {
      headers: { authorization: `Bot ${process.env.BOT_TOKEN}` },
    }
  );

  if (guildUser.status === 200) {
    return new Response(JSON.stringify(await fetchTimetables()));
  } else {
    return new Response("Unauthorized", { status: 401 });
  }
}
