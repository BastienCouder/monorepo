'use client';

import * as z from 'zod';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Checkbox,
  Form as FormContainer,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from '@/components/ui';
import { CardWrapper } from '../_components';
import { register } from '@/server/auth/register.action';
import { RegisterSchema } from '@/models/auth';
import { capitalizeFirstLetter } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { Container, Form } from '@/components/container';
import { toast } from 'sonner';

const translateZodErrors = (errors: z.ZodError, t: (key: string) => string) => {
  return errors.errors.map((error) => ({
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
        translatedErrors.forEach((error) => {
          toast(t('error_title'), {
            description: capitalizeFirstLetter(error.message),
            action: {
              label: t('try_again'),
              onClick: () => onSubmit(values),
            },
          });
        });
        return;
      }

      register(values).then((data) => {
        if (data.error) {
          toast(t('error_title'), {
            description: capitalizeFirstLetter(data.error),
            action: {
              label: t('try_again'),
              onClick: () => onSubmit(values),
            },
          });
        }
        if (data.success) {
          toast(t('error_title'), {
            description: capitalizeFirstLetter(data.success),
            action: {
              label: t('try_again'),
              onClick: () => onSubmit(values),
            },
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
      <FormContainer {...form}>
        <Form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Container.Div className="space-y-4">
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
                  <Container.Div className="flex items-center gap-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription>{t('rgpd_consent')}</FormDescription>
                  </Container.Div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Container.Div>
          <Button disabled={isPending} type="submit" className="w-full">
            {t('create_account')}
          </Button>
        </Form>
      </FormContainer>
    </CardWrapper>
  );
};
