'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { NewPasswordSchema } from '@/models/auth';
import {
  Form as FormContainer,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Button,
} from '@/components/ui';
import { CardWrapper } from '../_components';
import { newPassword } from '@/server/auth/new-password.action';
import { useTranslations } from 'next-intl';
import { capitalizeFirstLetter } from '@/lib/utils';
import { Container, Form } from '@/components/container';
import { toast } from 'sonner';

const translateZodErrors = (errors: z.ZodError, t: (key: string) => string) => {
  return errors.errors.map((error) => ({
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

      newPassword(values, token).then((data) => {
        if (data?.error) {
          toast(t('error_title'), {
            description: capitalizeFirstLetter(data.error),
            action: {
              label: t('try_again'),
              onClick: () => onSubmit(values),
            },
          });
        }
        if (data?.success) {
          toast(t('error_title'), {
            description: data.success,
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
      headerLabel={t('enter_new_password')}
      backButtonLabel={t('back_to_login')}
      backButtonHref="/auth/login"
    >
      <FormContainer {...form}>
        <Form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Container.Div className="space-y-4">
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
          </Container.Div>
          <Button disabled={isPending} type="submit" className="w-full">
            {t('reset_password')}
          </Button>
        </Form>
      </FormContainer>
    </CardWrapper>
  );
};
