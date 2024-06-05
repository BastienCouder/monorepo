'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { useCurrentUser } from '@/hooks/use-current-user';
import { SettingsSchema } from '@/models/auth';
import { settings } from '@/server/auth/settings';
import { ToastAction } from '../ui/toast';
import { catchError } from '@/lib/catch-error';
import { capitalizeFirstLetter } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { DeleteUserModal } from '../modal/delete-user-modal';
import { useModal } from '@/hooks/use-modal-store';

const translateZodErrors = (errors: z.ZodError, t: (key: string) => string) => {
  return errors.errors.map(error => ({
    path: error.path,
    message: t(`validation.${error.message}`),
  }));
};

const Settings = () => {
  const user = useCurrentUser();
  const t = useTranslations('auth.client');
  const tValidation = useTranslations('validation');
  const { onOpen } = useModal();

  const handleDeleteUser = (userId: string) => {
    onOpen('delete-user', { userId });
  };

  const { update } = useSession();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      password: undefined,
      newPassword: undefined,
      name: user?.name || undefined,
      email: user?.email || undefined,
      role: user?.role === 'ADMINISTRATOR' || user?.role === 'OWNER' || user?.role === 'MEMBER' ? user?.role : undefined,
      isTwoFactorEnabled: user?.isTwoFactorEnabled || undefined,
    },
  });

  const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
    startTransition(() => {
      const result = SettingsSchema.safeParse(values);
      if (!result.success) {
        const translatedErrors = translateZodErrors(result.error, tValidation);
        translatedErrors.forEach(error => {
          toast({
            title: t('error_title'),
            description: capitalizeFirstLetter(error.message),
            action: <ToastAction altText={t('try_again')}>{t('try_again')}</ToastAction>,
          });
        });
        return;
      }

      settings(values)
        .then((data) => {
          if (data.error) {
            toast({
              title: t('error_title'),
              description: capitalizeFirstLetter(data.error),
              action: <ToastAction altText={t('try_again')}>{t('try_again')}</ToastAction>,
            });
          }

          if (data.success) {
            update();
            toast({
              title: capitalizeFirstLetter(data.success),
            });
          }
        })
        .catch(() => catchError(t('generic_error')));
    });
  };

  return (
    <div className="py-4">
      <Card className="max-w-[600px]">
        <CardHeader>
          <p className="text-2xl font-semibold text-center">{t('settings')}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
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
                          placeholder={t('name_placeholder')}
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {user?.isOAuth === false && (
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
                              placeholder="name@example.com"
                              type="email"
                              disabled={isPending}
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
                              placeholder="******"
                              type="password"
                              disabled={isPending}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('new_password')}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="******"
                              type="password"
                              disabled={isPending}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </div>
              <Button disabled={isPending} type="submit">
                {t('save')}
              </Button>
            </form>
          </Form>
          {user && (
            <DeleteUserModal>
              <Button
                onClick={() => handleDeleteUser(user.id)}
                disabled={isPending}
                type="button"
                variant={'destructive'}
              >
                {t('delete_account')}
              </Button>
            </DeleteUserModal>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
