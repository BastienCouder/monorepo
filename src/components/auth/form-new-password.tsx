'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';

import { NewPasswordSchema } from '@/models/auth';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { CardWrapper } from '@/components/auth/card-wrapper';
import { Button } from '@/components/ui/button';
import { newPassword } from '@/server/auth/new-password.action';
import { useTranslations } from 'next-intl';
import { toast } from '@/components/ui/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { capitalizeFirstLetter } from '@/lib/utils';

const translateZodErrors = (errors: z.ZodError, t: (key: string) => string) => {
  return errors.errors.map(error => ({
    path: error.path,
    message: t(error.message),
  }));
};

export const NewPasswordForm = () => {
  const t = useTranslations('auth.client');
  const searchParams = useSearchParams();
  const token = searchParams?.get('token');

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: '',
    },
  });

  const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {

    startTransition(() => {
      const result = NewPasswordSchema.safeParse(values);
      if (!result.success) {
        const translatedErrors = translateZodErrors(result.error, t);
        translatedErrors.forEach(error => {
          toast({
            title: t('error_title'),
            description: capitalizeFirstLetter(error.message),
            action: <ToastAction altText={t('try_again')}>{t('try_again')}</ToastAction>,
          });
        });
        return;
      }

      newPassword(values, token).then((data) => {
        if (data?.error) {
          toast({
            title: t('error_title'),
            description: capitalizeFirstLetter(data.error),
            action: <ToastAction altText={t('try_again')}>{t('try_again')}</ToastAction>,
          });
        }
        if (data?.success) {
          toast({
            title: (data.success),
          });
        }
      });
    });
  };

  return (
    <CardWrapper
      headerLabel={t('enter_new_password')}
      backButtonLabel={t('back_to_login')}
      backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('password')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="******"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={isPending} type="submit" className="w-full">
            {t('reset_password')}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
