'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { useState, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';

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
import { login } from '@/server/auth/login.action';
import { Button } from '../ui/button';
import { LoginSchema } from '@/models/auth';
import { toast } from '@/components/ui/use-toast';
import { capitalizeFirstLetter } from '@/lib/utils';
import { ToastAction } from '../ui/toast';
import { useTranslations } from 'next-intl';
import { catchError } from '@/lib/catch-error';

const translateZodErrors = (errors: z.ZodError, t: (key: string) => string) => {
  return errors.errors.map(error => ({
    path: error.path,
    message: t(error.message),
  }));
};

export const LoginForm = () => {
  const t = useTranslations('auth.client');
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get('callbackUrl');
  const urlError =
    searchParams?.get('error') === 'OAuthAccountNotLinked'
      ? t('oauth_account_not_linked')
      : '';

  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {


    startTransition(() => {
      const result = LoginSchema.safeParse(values);
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

      login(values, callbackUrl)
        .then((data) => {
          if (data?.error) {
            form.reset();
            toast({
              title: t('error_title'),
              description: capitalizeFirstLetter(data.error),
              action: <ToastAction altText={t('try_again')}>{t('try_again')}</ToastAction>,
            });
          }

          if (data?.success) {
            form.reset();
            toast({
              title: data.success,
            });
          }

          if (data?.twoFactor) {
            setShowTwoFactor(true);
          }
        })
        .catch(() => catchError(t('generic_error')));
    });
  };

  return (
    <CardWrapper
      headerLabel={t('login')}
      backButtonLabel={t('dont_have_an_account')}
      backButtonHref="/register"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-4">
            {showTwoFactor && (
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('two_factor_code')}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="123456"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {!showTwoFactor && (
              <>
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
                      <Button
                        size="sm"
                        variant="link"
                        asChild
                        className="px-0 font-normal"
                      >
                        <Link href="/reset">{t('forgot_password')}</Link>
                      </Button>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
          <Button
            disabled={isPending}
            data-testid="submit-button"
            type="submit"
            className="w-full"
          >
            {showTwoFactor ? t('confirm') : t('login')}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
