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
import { admin } from '@/server/auth/admin.action';
import { toast } from '@/components/ui/use-toast';
import { createFolderSchema } from '@/models/validations/folder';
import { createFolder } from '@/server/user/create-folder';
import { capitalize } from '@/lib/utils';

type FolderFormValues = z.infer<typeof createFolderSchema>;

const defaultValues: Partial<FolderFormValues> = {};

type FormType = {
  // eslint-disable-next-line no-unused-vars
  setIsOpen: (isOpen: boolean) => void;
  basePath: string | undefined;
};

export function CreateFolderForm({ setIsOpen, basePath }: FormType) {
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
        if (basePath && basePath !== '') {
          await createFolder(userId, data.name, basePath);
        } else {
          await createFolder(userId, data.name, null);
        }
        toast({
          title: 'Folder created',
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
