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
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { createCourseSchema } from '@/schemas/course';
import { createCourse } from '../../../action/create-course';

type CourseFormValues = z.infer<typeof createCourseSchema>;

const defaultValues: Partial<CourseFormValues> = {};

type FormType = {
  // eslint-disable-next-line no-unused-vars
  setIsOpen: (isOpen: boolean) => void;
};

export function CreateCourseForm({ setIsOpen }: FormType) {
  const session = useCurrentUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const form = useForm<CourseFormValues>({
    resolver: zodResolver(createCourseSchema),
    defaultValues,
    mode: 'onChange',
  });
  async function onSubmit(data: CourseFormValues) {
    setLoading(true);

    try {
      const userId = session?.id;
      const adminResponse = await admin();
      if (adminResponse.error) {
        toast({
          title: adminResponse.error,
        });
        setLoading(false);
        return;
      }

      if (userId) {
        await createCourse(userId, data.title);
        toast({
          title: 'Course created',
        });
      }
      router.refresh();
      setIsOpen(false);
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
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre</FormLabel>
              <FormControl>
                <Input placeholder="Titre..." {...field} />
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
