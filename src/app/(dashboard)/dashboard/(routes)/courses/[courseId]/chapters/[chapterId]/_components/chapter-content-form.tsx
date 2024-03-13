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

import { ContentsList } from './chapter-content-list';
import { Input } from '@/components/ui/input';
import { FileUpload } from '@/components/file-upload';
import { createContent } from '@/app/(dashboard)/dashboard/action/create-content';
import { reorderContents } from '@/app/(dashboard)/dashboard/action/reorder-content';
import { updateContent } from '@/app/(dashboard)/dashboard/action/update-content';

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
  const [isEditing, setIsEditing] = useState(false);
  const [editingContentId, setEditingContentId] = useState<string | null>(null);

  const toggleEdit = () => setIsEditing((current) => !current);

  const toggleCreating = () => {
    setIsCreating((current) => !current);
    if (!isCreating) {
      // Si vous allez activer le mode création
      form.reset({
        title: '',
        code: '',
        imageUrl: '',
        description: '',
      });
    }
  };
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const handleContentTypeEditing = (id: string, type: string) => {
    const contentToEdit = initialData.content.find(
      (content: Content) => content.id === id
    );
    if (contentToEdit) {
      form.reset({
        title: contentToEdit.title,
        code: contentToEdit.code,
        imageUrl: contentToEdit.imageUrl,
        description: contentToEdit.description,
      });
      setEditingContentId(id);
    }
    setContentType(type);
    setIsEditing(true);
  };

  const handleContentTypeChange = (type: string) => {
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

      await reorderContents(chapterId, updateData);
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

  const onImageSubmit = async (imageUrl: string) => {
    const { title } = form.getValues();

    const valuesWithImageTitle = {
      title: title || 'image',
      imageUrl,
      description: '',
    };

    try {
      await createContent(chapterId, valuesWithImageTitle, title);
      toast({
        title: 'Contenu créé',
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

  const onEdintingSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!editingContentId) return;

    try {
      await updateContent(editingContentId, values);
      toast({
        title: 'Contenu mis à jour',
      });
      setEditingContentId(null);
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
        {isCreating || isEditing ? (
          <Button
            onClick={isCreating ? toggleCreating : toggleEdit}
            aria-label="Annuler"
          >
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

      {isEditing && (
        <>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onEdintingSubmit)}
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
              {contentType === 'image' && (
                <FileUpload
                  endpoint="courseImage"
                  onChange={(url) => {
                    if (url) {
                      onImageSubmit(url);
                    }
                  }}
                />
              )}
              <div className="flex items-center gap-x-2">
                <Button
                  aria-label="Sauvegarder"
                  disabled={!isValid || isSubmitting}
                  type="submit"
                >
                  Sauvegarder
                </Button>
              </div>
            </form>
          </Form>
        </>
      )}
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
              <FileUpload
                endpoint="courseImage"
                onChange={(url) => {
                  if (url) {
                    onImageSubmit(url);
                  }
                }}
              />
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
      {!isCreating && !isEditing && (
        <div className={cn('text-sm mt-2', !initialData.content && 'italic')}>
          {!initialData.content && 'Aucun contenus'}
          <ContentsList
            onEdit={handleContentTypeEditing}
            onReorder={onReorder}
            items={initialData.content || []}
          />
        </div>
      )}
      {!isCreating && !isEditing && (
        <p className="text-xs text-muted-foreground mt-4">
          Glisser-déposer pour réorganiser les contenus
        </p>
      )}
    </div>
  );
};
