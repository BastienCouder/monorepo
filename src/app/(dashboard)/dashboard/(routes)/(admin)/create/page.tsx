'use client';
import * as z from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormLabel,
  FormMessage,
  FormItem,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { admin } from '@/app/(auth)/actions/admin.action';
import { toast } from '@/components/ui/use-toast';
import { createCourse } from '@/app/(dashboard)/action/create-course';
import { useCurrentUser } from '@/hooks/useCurrentUser';

const formSchema = z.object({
  title: z.string().min(1, {
    message: 'Title is required',
  }),
});

export default function CreatePage() {
  const session = useCurrentUser();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const adminResponse = await admin();
    if (adminResponse.error) {
      toast({
        title: adminResponse.error,
      });
      return;
    }

    try {
      const userId = session?.id;
      if (userId) {
        const course = await createCourse(userId, values.title);
        router.push(`/dashboard/admin/courses/${course.id}`);
        toast({
          title: 'Course created',
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'Something went wrong',
      });
    }
  };

  return (
    <div className="max-w-5xl flex md:items-center md:justify-start h-full p-6">
      <div>
        <h1 className="text-2xl">Donnez un titre au nouveau cours</h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mt-8"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre du cours</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    What will you teach in this course?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Link href="/">
                <Button type="button" variant="ghost">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={!isValid || isSubmitting}>
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
