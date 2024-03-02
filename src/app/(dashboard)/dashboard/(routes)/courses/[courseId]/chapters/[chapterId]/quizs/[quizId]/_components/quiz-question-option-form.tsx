'use client';

import * as z from 'zod';
import { PlusCircle, Video } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { updateChapter } from '@/app/(dashboard)/dashboard/(routes)/courses/action/action/update-chapter';
import { Questions, Quiz } from '@/schemas/db-schema';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Checkbox } from '@/components/ui/checkbox';

interface ChapterVideoFormProps {
  initialData: Quiz & { questions: Questions[] };
  chapterId: string;
}

const OptionSchema = z.object({
  text: z.string().min(1, "Le texte de l'option est requis"),
  isCorrect: z.boolean(),
});

const QuestionSchema = z.object({
  label: z.string().min(1, 'Le libellé de la question est requis'),
  options: z.array(OptionSchema).min(2, 'Au moins deux options sont requises'),
});

const QuizSchema = z.object({
  title: z.string().min(1, 'Le titre du quiz est requis'),
  questions: z
    .array(QuestionSchema)
    .min(1, 'Au moins une question est requise'),
});

export const QuestionOptionsForm = ({
  initialData,
  chapterId,
}: ChapterVideoFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  console.log(initialData);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof QuizSchema>>({
    resolver: zodResolver(QuizSchema),
    defaultValues: {
      title: '',
      questions: [
        {
          label: '',
          options: [
            { text: '', isCorrect: false },
            { text: '', isCorrect: false },
            { text: '', isCorrect: false },
          ],
        },
      ],
    },
  });

  const questionsFieldArray = useFieldArray({
    control: form.control,
    name: 'questions',
  });

  const { isSubmitting, isValid } = form.formState;

  // eslint-disable-next-line no-unused-vars
  const onSubmit = async (values: z.infer<typeof QuizSchema>) => {
    try {
      await updateChapter(chapterId, values);
      toast({
        title: 'Quiz mis à jour',
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
          Quiz
        </h2>
        <Button onClick={toggleEdit}>
          {isEditing && <>Annuler</>}
          {!isEditing && initialData.questions.length < 1 && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Ajouter
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!initialData ? (
          <div className="flex items-center justify-center h-60 border mt-4 rounded-md">
            <Video className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="text-slate-500 font-italic">Aucune questions</div>
        ))}
      {isEditing && (
        <>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Nombre d'options" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 4 }, (_, i) => i + 2).map((value) => (
                <SelectItem key={value} value={String(value)}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 mt-4"
            >
              {questionsFieldArray.fields.map((question, index) => (
                <div
                  key={index}
                  className="flex flex-col justify-center gap-4 max-w-96"
                >
                  <FormField
                    control={form.control}
                    name={`questions.${index}.label`}
                    render={({ field }) => (
                      <FormItem>
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
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center gap-4">
                      <FormField
                        control={form.control}
                        name={`questions.${optionIndex}.options.${optionIndex}.text`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                disabled={isSubmitting}
                                placeholder="Options..."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`questions.${optionIndex}.options.${optionIndex}.isCorrect`}
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center gap-2">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormDescription className="text-sm">
                                {option.isCorrect
                                  ? 'Réponse correcte'
                                  : 'Réponse incorrecte'}
                              </FormDescription>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
                </div>
              ))}
              <div className="flex items-center gap-x-2">
                <Button disabled={!isValid || isSubmitting} type="submit">
                  Sauvegarder
                </Button>
              </div>
            </form>
          </Form>
        </>
      )}
      {initialData && !isEditing && (
        <div className="text-xs text-muted-foreground mt-2">
          Le traitement des vidéos peut prendre quelques minutes. Actualisez la
          page si la vidéo n&apos;apparaît pas.
        </div>
      )}
    </div>
  );
};
