'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Row } from '@tanstack/react-table';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { updateUserSchema } from '@/schemas/user';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { admin } from '@/app/(auth)/actions/admin.action';

type UserFormValues = z.infer<typeof updateUserSchema>;

type FormType<TData> = {
  // eslint-disable-next-line no-unused-vars
  setIsOpen: (isOpen: boolean) => void;
  row: Row<TData>;
};

export function UpdateForm<TData>({ setIsOpen, row }: FormType<TData>) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const form = useForm<UserFormValues>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      ...row.original,
      newPassword: undefined,
    },
    mode: 'onChange',
  });

  async function onSubmit(data: UserFormValues) {
    const adminResponse = await admin();
    if (adminResponse.error) {
      toast({
        title: adminResponse.error,
      });
      setLoading(false);
      return;
    }

    setLoading(true);
    const response = await fetch(`/api/users/${row.getValue('id')}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response?.ok) {
      return toast({
        title: 'Something went wrong.',
        description: 'Your post was not created. Please try again.',
        variant: 'destructive',
      });
    }

    toast({
      title: 'Success',
      description: 'Your message has been sent.',
    });
    // This forces a cache invalidation.
    router.refresh();

    setLoading(false);
    setIsOpen(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Mohsin Shaikh" {...field} />
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
                <Input placeholder="mohsin@npnits.com" {...field} />
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
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
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
              <FormLabel>Role</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USER">USER</SelectItem>
                    <SelectItem value="ADMIN">ADMIN</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading ? true : false}>
          {loading ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : null}
          Update
        </Button>
      </form>
    </Form>
  );
}
