import {
  InteractionResponseType,
  InteractionType,
  verifyKey,
} from "discord-interactions";

import { z } from "zod";

import { createClient } from "@vercel/kv";

const kv = createClient({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
  enableTelemetry: false,
});

export type UserData = {
  id: string;
  name: string;
  timetable: z.infer<typeof timetableSchema>;
};

const upsertUserTimetable = async (userData: UserData) => {
  const data = (await kv.json.get("data")) as UserData[];

  const oldValIndex = data.findIndex((user) => user.id === userData.id);

  if (oldValIndex !== -1) data[oldValIndex] = userData;
  else data.push(userData);

  await kv.json.set("data", "$", data);
};

const lessonInfoSchema = z.object({
  title: z.string(),
  type: z.enum(["tut", "lab", "lec"]),
  room: z.string(),
  note: z.string().optional(),
  startTime: z.string(),
  endTime: z.string(),
});

const timetableSchema = z.array(z.array(lessonInfoSchema)).length(5);

const registerCommands = async () => {};

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

  switch (message?.type) {
    case InteractionType.PING: {
      console.log("Handling ping request");
      registerCommands();
      return new Response(JSON.stringify({ type: InteractionResponseType.PONG }));
    }
    case InteractionType.APPLICATION_COMMAND: {
      const parsedTimetable = timetableSchema.safeParse(
        JSON.parse(message.data.options[0].value)
      );

      const id = message.member.user.id;
      const name = message.member.nick ?? message.member.user.username;

      if (parsedTimetable.data) {
        await upsertUserTimetable({ id, name, timetable: parsedTimetable.data });
      }

      return new Response(
        JSON.stringify({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: parsedTimetable.success
              ? "Submission successful"
              : "Error - submission could not be parsed",
            flags: 64, // EPHEMERAL message
          },
        }),
        { headers: { "Content-Type": "application/json" } }
      );
    }
    default: {
      console.error("Unknown Type");
      return new Response(null, { status: 400 });
    }
  }
}
