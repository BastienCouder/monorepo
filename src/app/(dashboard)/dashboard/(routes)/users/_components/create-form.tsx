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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createUserSchema } from '@/schemas/user';
import { useRouter } from 'next/navigation';


import { toast } from '@/components/ui/use-toast';
import { admin } from '@/server-actions/auth/admin.action';
import { createUser } from '@/server-actions/auth/users.action';

type UserFormValues = z.infer<typeof createUserSchema>;

const defaultValues: Partial<UserFormValues> = {};

type FormType = {
  // eslint-disable-next-line no-unused-vars
  setIsOpen: (isOpen: boolean) => void;
};

export function CreateForm({ setIsOpen }: FormType) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const form = useForm<UserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues,
    mode: 'onChange',
  });
  async function onSubmit(data: UserFormValues) {
    setLoading(true);

    try {
      const adminResponse = await admin();
      if (adminResponse.error) {
        toast({
          title: adminResponse.error,
        });
        setLoading(false);
        return;
      }

      const createUserResponse = await createUser(data);
      if (createUserResponse.error) {
        toast({
          title: createUserResponse.error,
        });
        setLoading(false);
        return;
      }
      toast({
        title: createUserResponse.success,
      });
      router.refresh();
      setIsOpen(false);
    } catch (error) {
      console.error('An unexpected error occurred:', error);
      toast({
        title: 'An unexpected error occurred.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom</FormLabel>
              <FormControl>
                <Input placeholder="Nom..." {...field} />
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
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="nom@exemple.com" {...field} />
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
              <FormLabel>Mot de passe</FormLabel>
              <FormControl>
                <Input type="password" placeholder="******" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rôle</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USER">Utilisateur</SelectItem>
                    <SelectItem value="ADMIN">Administrateur</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading ? true : false}>
          {loading ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : null}
          Créer
        </Button>
      </form>
    </Form>
  );
}
