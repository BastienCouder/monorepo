'use client';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Pencil } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { updateCourse } from '@/app/(dashboard)/dashboard/action/update-course';

interface TitleFormProps {
  initialData: {
    title: string;
  };
  courseId: string;
}

export const titleCourseFormSchema = z.object({
  title: z.string().min(1, {
    message: 'Title is required',
  }),
});

export const TitleForm = ({ initialData, courseId }: TitleFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof titleCourseFormSchema>>({
    resolver: zodResolver(titleCourseFormSchema),
    defaultValues: initialData,
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof titleCourseFormSchema>) => {
    try {
      await updateCourse(courseId, values);
      toast({
        title: 'Cours mis à jour',
      });
      toggleEdit();
      router.refresh();
    } catch {
      toast({
        title: "Une erreur s'est produite",
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="mt-6 border bg-card rounded-md p-4">
      <div className="font-medium flex items-center justify-between gap-x-4">
        <h2 className="border-b-4 border-l-4 px-1 rounded-bl-md border-primary">
          Titre *
        </h2>
        <Button
          onClick={toggleEdit}
          aria-label={isEditing ? 'Annuler' : 'Modifier le titre'}
        >
          {isEditing ? (
            <>Annuler</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" aria-label="icon stylo" />
              Modifier le titre
            </>
          )}
        </Button>
      </div>
      {!isEditing && <p className="text-sm mt-2">{initialData.title}</p>}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="Titre..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button
                aria-label="Sauvegarder le titre"
                disabled={!isValid || isSubmitting}
                type="submit"
              >
                Sauvegarder
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
