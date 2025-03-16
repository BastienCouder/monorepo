"use server";

import * as z from "zod";

import { ResetSchema } from "@/models/auth";
import { getUserByEmail } from "@/lib/auth/user";
import { sendPasswordResetEmail } from "@/lib/email";
import { generatePasswordResetToken } from "@/lib/tokens";
import { getTranslations } from "next-intl/server";

type Response = {
  error?: string;
  success?: string;
};

export const reset = async (
  values: z.infer<typeof ResetSchema>,
): Promise<Response> => {
  const t = await getTranslations("auth.server");
  const validatedFields = ResetSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: t("invalid_email") };
  }

  const { email } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return { error: t("email_not_found") };
  }

  const passwordResetToken = await generatePasswordResetToken(email);
  await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token,
  );

  return { success: t("reset_email_sent") };
};
