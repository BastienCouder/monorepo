'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
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
import { useState } from 'react';
import { Loader2, MinusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/hooks/use-current-user';
import { toast } from '@/components/ui/use-toast';
import { createJoinTeamSchema } from '@/models/validations/team';
import { joinTeamWithKey } from '@/server/team/join-with-key';

type JoinTeamFormValues = z.infer<typeof createJoinTeamSchema>;

const defaultValues: Partial<JoinTeamFormValues> = {};

type FormType = {
  // eslint-disable-next-line no-unused-vars
  setIsOpen: (isOpen: boolean) => void;
};

export function CreateJoinTeamForm({ setIsOpen }: FormType) {
  const session = useCurrentUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const form = useForm<JoinTeamFormValues>({
    resolver: zodResolver(createJoinTeamSchema),
    defaultValues,
    mode: 'onChange',
  });
  async function onSubmit(data: JoinTeamFormValues) {
    setLoading(true);

    try {
      const userId = session?.id;

      if (userId) {
        await joinTeamWithKey(userId, data.key);

        toast({
          title: 'JoinTeam created',
        });
        router.refresh();
        setIsOpen(false);
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'Something went wrong',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pb-4">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="key"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Key</FormLabel>
                <FormControl>
                  <Input className="w-full" placeholder={`Key...`} {...field} />
                </FormControl>
                <FormMessage />
                <FormDescription>Enter a key access</FormDescription>
              </FormItem>
            )}
          />
        </div>
        <div className="flex gap-4 items-start">
          <Button type="submit" disabled={loading}>
            {loading ? (
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
            ) : (
              'Create'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
