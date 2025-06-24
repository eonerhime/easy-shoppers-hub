import getUserSession from "@/actions/auth/getUserSession";

export async function GET(req) {
  try {
    const result = await getUserSession();
    console.log("GET RESULT:", result);
    return Response.json(result);
  } catch (err) {
    return Response.json({ error: "Failed to get session" }, { status: 500 });
  }
}
