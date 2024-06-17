'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { useState, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Form as FormContainer,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from '@/components/ui';
import { FormSuccess } from '@/components/form/form-success';
import { reset } from '@/server/auth/reset.action';
import { CardWrapper } from './card-wrapper';
import { ResetSchema } from '@/models/auth';
import { useTranslations } from 'next-intl';
import { FormError } from '@/components/form/form-error';
import { Container, Form } from '@/components/container';

const translateZodErrors = (errors: z.ZodError, t: (key: string) => string) => {
  return errors.errors.map((error) => ({
    path: error.path,
    message: t(error.message),
  }));
};

export const ResetForm = () => {
  const t = useTranslations('auth.client');
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = (values: z.infer<typeof ResetSchema>) => {
    setError('');
    setSuccess('');

    startTransition(() => {
      const result = ResetSchema.safeParse(values);
      if (!result.success) {
        const translatedErrors = translateZodErrors(result.error, t);
        translatedErrors.forEach((error) => {
          setError(error.message);
        });
        return;
      }

      reset(values).then((data) => {
        setError(data?.error);
        setSuccess(data?.success);
      });
    });
  };

  return (
    <CardWrapper
      headerLabel={t('forgot_password')}
      backButtonLabel={t('back_to_login')}
      backButtonHref="/login"
    >
      <FormContainer {...form}>
        <Form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Container.Div className="space-y-4">
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
          </Container.Div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button disabled={isPending} type="submit" className="w-full">
            {t('send_reset_email')}
          </Button>
        </Form>
      </FormContainer>
    </CardWrapper>
  );
};
