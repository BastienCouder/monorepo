'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
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
import { createTeamSchema } from '@/models/validations/team';
import { createTeam } from '@/server/team/create-team-with-invite';

type TeamFormValues = z.infer<typeof createTeamSchema>;

const defaultValues: Partial<TeamFormValues> = {};

type FormType = {
  // eslint-disable-next-line no-unused-vars
  setIsOpen: (isOpen: boolean) => void;
};

export function CreateTeamForm({ setIsOpen }: FormType) {
  const session = useCurrentUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [inviteCount, setInviteCount] = useState(1);
  const form = useForm<TeamFormValues>({
    resolver: zodResolver(createTeamSchema),
    defaultValues,
    mode: 'onChange',
  });

  async function onSubmit(data: TeamFormValues) {
    setLoading(true);

    try {
      const userId = session?.id;

      if (userId) {
        await createTeam(
          userId,
          data.name,
          data.invites
            ? data.invites.filter((invite): invite is string => !!invite)
            : []
        );

        toast({
          title: 'Team created',
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    className="w-full"
                    placeholder={`Name...`}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {[...Array(inviteCount)].map((_, index) => (
            <div key={index} className="w-full flex items-center gap-x-2">
              <FormField
                control={form.control}
                name={`invites.${index}`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Invite {index + 1}</FormLabel>
                    <FormControl>
                      <Input
                        className="w-full"
                        placeholder={`Email ${index + 1}...`}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {inviteCount > 1 && (
                <Button
                  type="button"
                  variant={'ghost'}
                  className="px-1 bg-none"
                  onClick={() => {
                    form.setValue(
                      'invites',
                      form.getValues().invites?.filter((_, i) => i !== index)
                    );
                    setInviteCount(inviteCount - 1);
                  }}
                >
                  <MinusCircle className="w-4 h-4 text-red-500" />
                </Button>
              )}
            </div>
          ))}
        </div>
        <div className="flex gap-4 items-start">
          {inviteCount < 3 && (
            <Button
              type="button"
              onClick={() => setInviteCount(inviteCount + 1)}
            >
              Add Invite
            </Button>
          )}

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
