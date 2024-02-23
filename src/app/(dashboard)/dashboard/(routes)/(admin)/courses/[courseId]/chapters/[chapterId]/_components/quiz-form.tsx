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
import { QuizList } from './quiz-list';
import { Chapter, Quiz } from '@prisma/client';
import { createQuiz } from '@/app/(dashboard)/action/create-quiz';

interface QuizFormProps {
  initialData: Chapter & { quiz: Quiz[] };
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
        title: 'Quiz created',
      });
      toggleCreating();
      router.refresh();
    } catch {
      toast({
        title: 'Something went wrong',
      });
    }
  };

  const onEdit = (id: string) => {
    router.push(
      `/dashboard/courses/${courseId}/chapters/${chapterId}/quizs/${id}`
    );
  };

  return (
    <div className="relative mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course quiz
        <Button onClick={toggleCreating} variant="ghost">
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a quiz
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
                      placeholder="e.g. 'Introduction to the course'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={
                !isValid || isSubmitting || initialData.quiz.length >= 1
              }
              type="submit"
            >
              Create
            </Button>
          </form>
        </Form>
      )}
      {!isCreating && (
        <div
          className={cn(
            'text-sm mt-2',
            !initialData.quiz.length && 'text-slate-500 italic'
          )}
        >
          {!initialData.quiz.length && 'No quiz'}
          <QuizList onEdit={onEdit} items={initialData.quiz || []} />
        </div>
      )}
    </div>
  );
};
