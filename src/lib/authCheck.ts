import { auth } from "@/auth";

export const currentUser = async () => {
  const session = await auth();

  return session?.user;
};

export const currentRole = async () => {
  const session = await auth();

  return session?.user?.role;
};

const roles = {
  protected: ["ADMIN"],
};

export function roleCheckMiddleware(
  session: any,
  specificRoles = roles.protected
) {
  if (!session || !session.role) {
    console.log(session.role);

    return false;
  }

  return specificRoles.includes(session.role);
}