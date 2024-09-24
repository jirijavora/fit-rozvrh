const ADD_TIMETABLE_COMMAND = {
  name: "add_timetable",
  type: "1",
  description: "Add your timetable to fitzvrh",
  options: [
    {
      name: "rozvrh",
      description: "the rozvrh JSON string",
      type: 3,
      required: true,
    },
  ],
};

export async function GET(request: Request) {
  const response = await fetch(
    `https://discord.com/api/v10/applications/${process.env.APPLICATION_ID}/commands`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bot ${process.env.BOT_TOKEN}`,
      },
      method: "PUT",
      body: JSON.stringify([ADD_TIMETABLE_COMMAND]),
    }
  );

  console.log(JSON.stringify(await response.json()));

  return new Response(JSON.stringify({ result: response.ok }));
}
