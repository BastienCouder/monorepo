'use client';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2, PlusCircle, X } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { toast } from '@/components/ui/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { createQuestion } from '@/app/(dashboard)/dashboard/action/create-question';
import { OptionSchema } from '@/schemas/db-schema';
import { cn } from '@/lib/utils';
import { QuestionsList } from './quiz-question-option-list';
import { reorderQuestions } from '@/app/(dashboard)/dashboard/action/reorder-question';

interface QuestionOptionsFormProps {
  initialData: any;
  quizId: string;
}

const formSchema = z.object({
  label: z.string().min(1, { message: 'La question est obligatoire' }),
  options: z
    .array(OptionSchema)
    .min(3, { message: 'Au moins trois options sont requises' })
    .max(5, { message: 'Un maximum de cinq options est autorisé' }),
});

export const QuestionOptionsForm = ({
  // eslint-disable-next-line no-unused-vars
  initialData,
  quizId,
}: QuestionOptionsFormProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [isEditing, setIsEditing] = useState(false);

  const toggleCreating = () => {
    setIsCreating((current) => !current);
  };

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      options: [
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
      ],
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await createQuestion(quizId, values, values.label);

      toast({
        title: 'Question créée',
      });
      toggleCreating();
      form.reset();
      router.refresh();
    } catch {
      toast({
        title: "Une erreur s'est produite",
        variant: 'destructive',
      });
    }
  };

  // eslint-disable-next-line no-unused-vars
  const onReorder = async (updateData: { id: string; position: number }[]) => {
    try {
      setIsUpdating(true);

      await reorderQuestions(quizId, updateData);

      toast({
        title: 'Questions réorganisés',
      });
      router.refresh();
    } catch {
      toast({
        title: "Une erreur s'est produite",
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="relative mt-6 border bg-card rounded-md p-4">
      {isUpdating && (
        <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-m flex items-center justify-center">
          <Loader2 className="animate-spin h-6 w-6 text-sky-700" />
        </div>
      )}
      <div className="font-medium flex items-center justify-between gap-x-4">
        <h2 className="border-b-4 border-l-4 px-1 rounded-bl-md border-primary">
          Questions *
        </h2>

        <Button
          onClick={toggleCreating}
          aria-label={isCreating ? 'Annuler' : 'Ajouter un une question'}
        >
          {isCreating ? (
            <>Annuler</>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" aria-label="icon plus" />
              Ajouter un question
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
              name="label"
              render={({ field }) => (
                <FormItem className="max-w-96">
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="Question..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Gestion des options */}
            {form.watch('options')?.map((option, index) => (
              <div key={index} className="flex items-end gap-2">
                <FormField
                  control={form.control}
                  name={`options.${index}.text`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} placeholder="Texte de l'option" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`options.${index}.isCorrect`}
                  // eslint-disable-next-line no-unused-vars
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormDescription className="pb-2">
                        Cocher si correcte.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {(form.getValues().options?.length || 0) > 3 && (
                  <Button
                    type="button"
                    variant={'ghost'}
                    onClick={() =>
                      form.setValue(
                        'options',
                        form.getValues().options.filter((_, i) => i !== index)
                      )
                    }
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <div className="flex gap-4">
              {(form.getValues().options?.length || 0) < 5 && (
                <Button
                  type="button"
                  onClick={() =>
                    form.setValue('options', [
                      ...(form.getValues().options || []),
                      { text: '', isCorrect: false },
                    ])
                  }
                >
                  Ajouter une option
                </Button>
              )}

              <Button
                aria-label="Créer une question"
                disabled={!isValid || isSubmitting}
                type="submit"
              >
                Créer
              </Button>
            </div>
          </form>
        </Form>
      )}

      {/* {!isCreating && (
        <p className="text-xs text-muted-foreground mt-4">
          Glisser-déposer pour réorganiser les chapitres
        </p>
      )} */}
      {!isCreating && (
        <div className={cn('text-sm mt-2', !initialData.questions && 'italic')}>
          {!initialData.questions && 'Aucun contenus'}
          <QuestionsList
            onEdit={toggleEdit}
            onReorder={onReorder}
            items={initialData.questions || []}
          />
        </div>
      )}
    </div>
  );
};
