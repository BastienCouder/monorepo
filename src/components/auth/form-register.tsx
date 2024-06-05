'use client';

import * as z from 'zod';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { CardWrapper } from '@/components/auth/card-wrapper';
import { Button } from '@/components/ui/button';
import { register } from '@/server/auth/register.action';
import { Checkbox } from '../ui/checkbox';
import { RegisterSchema } from '@/models/auth';
import { toast } from '@/components/ui/use-toast';
import { capitalizeFirstLetter } from '@/lib/utils';
import { ToastAction } from '../ui/toast';
import { useTranslations } from 'next-intl';

const translateZodErrors = (errors: z.ZodError, t: (key: string) => string) => {
  return errors.errors.map(error => ({
    path: error.path,
    message: t(error.message),
  }));
};

export const RegisterForm = () => {
  const [isPending, startTransition] = useTransition();

  const t = useTranslations('auth.client');
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: '',
      password: '',
      name: '',
      rgpdConsent: false,
    },
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    startTransition(() => {
      const result = RegisterSchema.safeParse(values);
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

      register(values).then((data) => {
        if (data.error) {
          toast({
            title: t('error_title'),
            description: capitalizeFirstLetter(data.error),
            action: <ToastAction altText={t('try_again')}>{t('try_again')}</ToastAction>,
          });
        }
        if (data.success) {
          toast({
            title: capitalizeFirstLetter(data.success),
          });
        }
      });
    });
  };

  return (
    <CardWrapper
      headerLabel={t('create_account')}
      backButtonLabel={t('already_have_account')}
      backButtonHref="/login"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('name')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder={t('name_placeholder')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('email')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="name@example.com"
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <FormField
              control={form.control}
              name="rgpdConsent"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription>
                      {t('rgpd_consent')}
                    </FormDescription>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={isPending} type="submit" className="w-full">
            {t('create_account')}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
