import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default async function AuthLayout({
  children,
}: AuthLayoutProps): Promise<JSX.Element> {
  const user = await getCurrentUser();
  console.log(user);

  // if (user) {
  //   if (user.role === "ADMIN") redirect("/admin");
  //   redirect("/dashboard");
  // }

  return <div className="min-h-screen">{children}</div>;
}
