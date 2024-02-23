'use client';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

import { toast } from '@/components/ui/use-toast';
import { QuizList } from './chapter-quiz-list';
import { Chapter, Quiz } from '@prisma/client';
import { createQuiz } from '@/app/(dashboard)/action/create-quiz';

interface QuizFormProps {
  initialData: Chapter & { quizs: Quiz[] };
  chapterId: string;
  courseId: string;
}

const formSchema = z.object({
  title: z.string().min(1),
});

export const QuizForm = ({
  initialData,
  courseId,
  chapterId,
}: QuizFormProps) => {
  const [isCreating, setIsCreating] = useState(false);

  const toggleCreating = () => {
    setIsCreating((current) => !current);
  };

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await createQuiz(chapterId, values.title);
      toast({
        title: 'Quiz créé',
      });
      toggleCreating();
      router.refresh();
    } catch {
      toast({
        title: "Une erreur s'est produite",
        variant: 'destructive',
      });
    }
  };

  const onEdit = (id: string) => {
    router.push(
      `/dashboard/courses/${courseId}/chapters/${chapterId}/quizs/${id}`
    );
  };

  return (
    <div className="relative mt-6 bg-card border rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        <h2 className="border-b-4 border-l-4 px-1 rounded-bl-md border-primary">
          Quiz
        </h2>
        <Button onClick={toggleCreating}>
          {isCreating ? (
            <>Annuler</>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Ajouter un quiz
            </>
          )}
        </Button>
      </div>
      {isCreating && (
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
                      placeholder="Quiz..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={
                !isValid || isSubmitting || initialData.quizs.length >= 1
              }
              type="submit"
            >
              Créer
            </Button>
          </form>
        </Form>
      )}
      {!isCreating && (
        <div
          className={cn(
            'text-sm mt-2',
            !initialData.quizs.length && 'text-slate-500 italic'
          )}
        >
          {!initialData.quizs.length && 'Aucun quiz'}
          <QuizList onEdit={onEdit} items={initialData.quizs || []} />
        </div>
      )}
    </div>
  );
};
