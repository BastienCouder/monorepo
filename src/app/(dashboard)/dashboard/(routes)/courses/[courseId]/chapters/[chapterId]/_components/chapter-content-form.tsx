'use client';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2, PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// import { ChaptersList } from './chapters-list';
import { toast } from '@/components/ui/use-toast';
import { Chapter, Content } from '@/schemas/db-schema';
import { Editor } from '@/components/editor';
import { Textarea } from '@/components/ui/textarea';
import { createContent } from '../../../../action/action/create-content';
import { ContentsList } from './chapter-content-list';
import { Input } from '@/components/ui/input';

interface ChaptersContentFormProps {
  initialData: Chapter & { content: Content[] };
  chapterId: string;
}

const formSchema = z
  .object({
    title: z
      .string()
      .nonempty({ message: 'Le titre est obligatoire' })
      .refine((val) => val.trim().length > 0, {
        message:
          'Le titre ne peut pas être vide ou ne contenir que des espaces blancs',
      }),
    code: z.string().optional(),
    imageUrl: z.string().optional(),
    description: z.string().optional(),
  })
  .refine(
    (data) => {
      return (
        (data.code && data.code.trim().length > 0) ||
        (data.imageUrl && data.imageUrl.trim().length > 0) ||
        (data.description && data.description.trim().length > 0)
      );
    },
    {
      message:
        'Au moins un des champs (code, imageUrl, description) doit être fourni et non vide',
    }
  );
export const ChaptersForm = ({
  initialData,
  chapterId,
}: ChaptersContentFormProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [contentType, setContentType] = useState('');

  const toggleCreating = () => {
    setIsCreating((current) => !current);
  };

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      code: '',
      imageUrl: '',
      description: '',
    },
  });

  const handleContentTypeChange = (type: any) => {
    setContentType(type);
    toggleCreating();
  };

  const { isValid, isSubmitting } = form.formState;

  // eslint-disable-next-line no-unused-vars
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await createContent(chapterId, values, values.title);
      toast({
        title: 'Contenus créé',
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

  // eslint-disable-next-line no-unused-vars
  const onReorder = async (updateData: { id: string; position: number }[]) => {
    try {
      setIsUpdating(true);

      //   await axios.put(`/api/courses/${courseId}/chapters/reorder`, {
      //     list: updateData,
      //   });
      toast({
        title: 'Contenus réorganisés',
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
          Contenu *
        </h2>
        {isCreating ? (
          <Button onClick={toggleCreating} aria-label="Annuler">
            Annuler
          </Button>
        ) : (
          <Popover>
            <PopoverTrigger className={cn(buttonVariants())}>
              <PlusCircle className="h-4 w-4 mr-2" aria-label="icon plus" />
              Ajouter
            </PopoverTrigger>
            <PopoverContent className="w-80 space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Contenu</h4>
                <p className="text-sm text-muted-foreground">
                  Choisi le contenu à mettre
                </p>
              </div>
              <div className="flex gap-4 flex-wrap">
                <Button
                  onClick={() => handleContentTypeChange('code')}
                  aria-label={isCreating ? 'Annuler' : 'Ajouter code'}
                >
                  Ajouter code
                </Button>

                <Button
                  onClick={() => handleContentTypeChange('image')}
                  aria-label={isCreating ? 'Annuler' : 'Ajouter image'}
                >
                  Ajouter image
                </Button>

                <Button
                  onClick={() => handleContentTypeChange('description')}
                  aria-label={isCreating ? 'Annuler' : 'Ajouter description'}
                >
                  Ajouter description
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        )}
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
                      placeholder="Titre..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {contentType === 'code' && (
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {contentType === 'image' && (
              //   <FileUpload
              //     endpoint="courseImage"
              //     onChange={(url) => {
              //       url;
              //     }}
              //   />
              <p>image</p>
            )}
            {contentType === 'description' && (
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Editor {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <Button
              aria-label="Créer un contenu"
              disabled={!isValid || isSubmitting}
              type="submit"
            >
              Créer
            </Button>
          </form>
        </Form>
      )}
      {!isCreating && (
        <div className={cn('text-sm mt-2', !initialData.content && 'italic')}>
          {!initialData.content && 'Aucun contenus'}
          <ContentsList
            onEdit={handleContentTypeChange}
            onReorder={onReorder}
            items={initialData.content || []}
          />
        </div>
      )}
      {!isCreating && (
        <p className="text-xs text-muted-foreground mt-4">
          Glisser-déposer pour réorganiser les contenus
        </p>
      )}
    </div>
  );
};
