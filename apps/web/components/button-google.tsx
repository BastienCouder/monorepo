"use client";

import Image from "next/image";

type ButtonGoogleProps = {
  redirect?: string;
};

export default function ButtonGoogle({
  redirect = "/",
}: ButtonGoogleProps): JSX.Element {
  const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;
  const REDIRECT_URI = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!;

  const state = JSON.stringify({ redirect });

  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "consent",
    state,
  });

  const GOOGLE_AUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

  return (
    <a href={GOOGLE_AUTH_URL}>
      <button className="bg-white border border-gray-300 px-4 py-2 rounded shadow hover:bg-gray-100">
        <Image
          width={20}
          height={20}
          src="/google-icon.svg"
          alt="Google"
          className="inline-block w-5 h-5 mr-2"
        />
        Se connecter avec Google
      </button>
    </a>
  );
}
