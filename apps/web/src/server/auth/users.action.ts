"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { getUserByEmail } from "@/lib/auth/user";
import { db } from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { getTranslations } from "next-intl/server";
import { createUserSchema, deleteUserSchema } from "@/models/user";

type Response = {
  error?: string;
  success?: string;
};

const hashId = (id: string): string => {
  return crypto.createHash("sha256").update(id).digest("hex");
};

export const createUser = async (
  values: z.infer<typeof createUserSchema>,
): Promise<Response> => {
  const t = await getTranslations("auth.server");
  const validatedFields = createUserSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: t("invalid_fields") };
  }

  const { email, password, name, role } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: t("email_in_use") };
  }

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
    },
  });

  return { success: t("user_created") };
};

export const deleteUser = async (values: z.infer<typeof deleteUserSchema>) => {
  const t = await getTranslations("auth.server");
  const validatedFields = deleteUserSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: t("invalid_fields") };
  }

  const { id } = validatedFields.data;

  // Validation
  const user = await currentUser();
  if (id === user?.id) {
    return { error: t("cannot_delete_own_user") };
  }

  const userToDelete = await db.user.findUnique({
    where: { id },
  });

  if (!userToDelete) {
    return { error: t("user_not_found") };
  }

  // Hash the user's ID
  const hashedId = hashId(userToDelete.id);

  // Anonymize user data
  const anonymizedEmail = `anonymous+${hashedId}@example.com`;
  const anonymizedName = `Anonymous ${hashedId}`;

  // Create anonymous user record
  await db.user.update({
    where: {
      id: userToDelete.id,
    },
    data: {
      email: anonymizedEmail,
      name: anonymizedName,
    },
  });

  await db.user.delete({
    where: {
      id,
    },
  });

  return { success: t("user_deleted") };
};
