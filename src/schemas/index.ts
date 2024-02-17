import { checkIfEmailExists } from '@/lib/helpers/authHelper';
import * as z from 'zod';

export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6)),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }

      return true;
    },
    {
      message: 'New password is required!',
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
      message: 'Password is required!',
      path: ['password'],
    }
  );

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: 'Minimum of 6 characters required',
  }),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: 'Email is required',
  }),
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: 'Email is required',
  }),
  password: z.string().min(1, {
    message: 'Password is required',
  }),
  code: z.optional(z.string()),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: 'Email is required',
  }),
  password: z.string().min(6, {
    message: 'Minimum 6 characters required',
  }),
  name: z.string().min(1, {
    message: 'Name is required',
  }),
});

export const RegisterAdminSchema = z.object({
  email: z
    .string({
      required_error: 'Un email est requis',
      invalid_type_error: "L'email doit être une chaîne de caractères",
    })
    .email({
      message: 'Adresse e-mail invalide',
    })
    .refine(
      async (email) => {
        const existingUser = await checkIfEmailExists(email);
        return !existingUser;
      },
      {
        message: "L'e-mail n'existe pas",
      }
    ),
  password: z.string({ required_error: 'Un mot de passe est requis' }).min(6, {
    message: 'Minimum 6 characters required',
  }),
  name: z
    .string({
      required_error: "Le nom d'utilisateur est requis",
      invalid_type_error:
        "Le nom d'utilisateur doit être une chaîne de caractères",
    })
    .min(3, {
      message: "Le nom d'utilisateur doit comporter au moins 3 caractères",
    })
    .max(50),
  role: z.string({
    required_error: 'Le role est requis',
    invalid_type_error: 'Le role doit être une chaîne de caractères',
  }),
});
