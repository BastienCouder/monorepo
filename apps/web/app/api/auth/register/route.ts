import { publishUserRegistered } from "@repo/email";
import { registerUser } from "@repo/auth";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const result = await registerUser(email, password);

  if ("error" in result) {
    return new Response(JSON.stringify({ error: result.error }), {
      status: 400,
    });
  }

  publishUserRegistered({ email }).catch(console.error);

  return new Response(JSON.stringify({ success: true }), { status: 201 });
}
