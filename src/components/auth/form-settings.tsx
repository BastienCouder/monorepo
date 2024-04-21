'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition, useState } from 'react';
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

import { FormError } from '@/components/modal/form-error';
import { FormSuccess } from '@/components/modal/form-success';
import { toast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/hooks/use-current-user';
import { SettingsSchema } from '@/schemas/auth';
import { settings } from '@/server-actions/auth/settings';
import { deleteUser } from '@/server-actions/auth/users.action';

const Settings = () => {
  const user = useCurrentUser();

  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const { update } = useSession();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      password: undefined,
      newPassword: undefined,
      name: user?.name || undefined,
      email: user?.email || undefined,
      role: user?.role || undefined,
      isTwoFactorEnabled: user?.isTwoFactorEnabled || undefined,
    },
  });

  const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
    startTransition(() => {
      settings(values)
        .then((data) => {
          if (data.error) {
            setError(data.error);
          }

          if (data.success) {
            update();
            setSuccess(data.success);
          }
        })
        .catch(() => setError('An error has occurred'));
    });
  };

  const onDelete = async (userId: string) => {
    try {
      await deleteUser({ id: userId });
      toast({
        title: 'Account deleted',
      });
      router.push('/');
    } catch {
      toast({
        title: 'An error has occurred',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="py-4">
      <Card className="max-w-[600px]">
        <CardHeader>
          <p className="text-2xl font-semibold text-center">Settings</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)} >
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Name..."
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
                          <FormLabel>Email</FormLabel>
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
                          <FormLabel>Password</FormLabel>
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
                          <FormLabel>New password</FormLabel>
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
              <FormError message={error} />
              <FormSuccess message={success} />
              <Button disabled={isPending} type="submit">
                Save
              </Button>
            </form>
          </Form>
          {user && (
            <Button
              onClick={() => onDelete(user.id)}
              disabled={isPending}
              type="submit"
              variant={'destructive'}
            >
              Delete account
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
