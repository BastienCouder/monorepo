import { cookies } from "next/headers";
import { loginUser } from "@repo/auth";
export async function POST(req: Request) {
  const { email, password } = await req.json();
  const result = await loginUser(email, password);

  if ("error" in result) {
    return new Response(JSON.stringify({ error: result.error }), {
      status: 401,
    });
  }

  const { accessToken, refreshToken } = result;
  (await cookies()).set("accessToken", accessToken, {
    httpOnly: true,
    maxAge: 900,
    path: "/",
  });
  (await cookies()).set("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
