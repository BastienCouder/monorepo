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

import { admin } from '@/app/(auth)/actions/admin.action';
import { toast } from '@/components/ui/use-toast';
import { createCategory } from '@/app/(dashboard)/dashboard/(routes)/courses/action/action/category';
import { createCategorySchema } from '@/schemas/category';

type CategoryFormValues = z.infer<typeof createCategorySchema>;

const defaultValues: Partial<CategoryFormValues> = {};

type FormType = {
  // eslint-disable-next-line no-unused-vars
  setIsOpen: (isOpen: boolean) => void;
};

export function CreateCategoryForm({ setIsOpen }: FormType) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(createCategorySchema),
    defaultValues,
    mode: 'onChange',
  });
  async function onSubmit(data: CategoryFormValues) {
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

      await createCategory(data);

      toast({
        title: 'Category created',
      });
      setLoading(false);
      router.refresh();
      setIsOpen(false);
    } catch (error) {
      console.error('An unexpected error occurred:', error);
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
              <FormLabel>Nom</FormLabel>
              <FormControl>
                <Input placeholder="Catégorie..." {...field} />
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
