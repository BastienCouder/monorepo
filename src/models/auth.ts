import * as z from 'zod';

const RolesEnum = z.enum(['ADMINISTRATOR', 'OWNER', 'MEMBER']);

export const SettingsSchema = z
  .object({
    name: z.optional(z.string().min(3, 'name_min_3')),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.optional(RolesEnum),
    email: z.optional(z.string().email('email_invalid')),
    password: z.optional(z.string().min(6, 'password_min_6')),
    newPassword: z.optional(z.string().min(6, 'new_password_min_6')),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }
      return true;
    },
    {
      message: 'new_password_required',
      path: ['newPassword'],
    }
  )
  .refine(
    (data) => {
      if (data.newPassword && !data.password) {
        return false;
      }
      return true;
    },
    {
      message: 'password_required',
      path: ['password'],
    }
  );

export const NewPasswordSchema = z.object({
  password: z.string().min(6, 'password_min_6'),
});

export const ResetSchema = z.object({
  email: z.string().email('email_invalid'),
});

export const LoginSchema = z.object({
  email: z.string().email('email_invalid'),
  password: z.string().min(1, 'password_required'),
  code: z.optional(z.string()),
});

export const RegisterSchema = z
  .object({
    email: z.string().email('email_invalid'),
    password: z.string().min(6, 'password_min_6'),
    name: z.string().min(1, 'name_required'),
    rgpdConsent: z.boolean().default(false),
  })
  .refine((data) => data.rgpdConsent === true, {
    message: 'rgpd_consent_required',
    path: ['rgpdConsent'],
  });
