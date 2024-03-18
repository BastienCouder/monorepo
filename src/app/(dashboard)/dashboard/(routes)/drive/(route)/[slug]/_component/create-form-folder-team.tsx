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
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/hooks/use-current-user';
import { toast } from '@/components/ui/use-toast';
import { createFolderSchema } from '@/schemas/validations/folder';
import { capitalize } from '@/lib/utils';
import { createTeamFolder } from '@/server-actions/drive/create-folder-drive';

type FolderFormValues = z.infer<typeof createFolderSchema>;

const defaultValues: Partial<FolderFormValues> = {};

type FormType = {
  // eslint-disable-next-line no-unused-vars
  setIsOpen: (isOpen: boolean) => void;
  basePath: string;
  refreshData: () => void;
  teamId: string;
};

export function CreateFolderForm({
  setIsOpen,
  basePath,
  refreshData,
  teamId,
}: FormType) {
  const session = useCurrentUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const form = useForm<FolderFormValues>({
    resolver: zodResolver(createFolderSchema),
    defaultValues,
    mode: 'onChange',
  });
  async function onSubmit(data: FolderFormValues) {
    setLoading(true);

    try {
      const userId = session?.id;

      if (userId) {
        if (basePath !== '') {
          await createTeamFolder(
            userId,
            capitalize(data.name),
            basePath,
            teamId
          );
        } else {
          await createTeamFolder(userId, capitalize(data.name), null, teamId);
        }
        toast({
          title: 'Folder created',
        });
        router.refresh();
        setIsOpen(false);
        refreshData();
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Name folder..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading ? true : false}>
          {loading ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : null}
          Create
        </Button>
      </form>
    </Form>
  );
}
