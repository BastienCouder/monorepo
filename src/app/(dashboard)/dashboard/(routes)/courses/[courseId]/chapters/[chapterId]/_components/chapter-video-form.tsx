'use client';

import * as z from 'zod';
import MuxPlayer from '@mux/mux-player-react';
import { Pencil, PlusCircle, Video } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Chapter, MuxData } from '@prisma/client';

import { Button } from '@/components/ui/button';
import { FileUpload } from '@/components/file-upload';
import { toast } from '@/components/ui/use-toast';
import { updateChapter } from '@/app/(dashboard)/dashboard/action/update-chapter';

interface ChapterVideoFormProps {
  initialData: Chapter & { muxData?: MuxData | null };
  chapterId: string;
}

const formSchema = z.object({
  videoUrl: z.string().min(1),
});

export const ChapterVideoForm = ({
  initialData,
  chapterId,
}: ChapterVideoFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await updateChapter(chapterId, values);
      toast({
        title: 'Chapitre mis à jour',
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
          Video
        </h2>
        <Button onClick={toggleEdit}>
          {isEditing && <>Annuler</>}
          {!isEditing && !initialData.videoUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Ajouter
            </>
          )}
          {!isEditing && initialData.videoUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Modifier
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!initialData.videoUrl ? (
          <div className="flex items-center justify-center h-60 border mt-4 rounded-md">
            <Video className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <MuxPlayer playbackId={initialData?.muxData?.playbackId || ''} />
          </div>
        ))}
      {isEditing && (
        <div>
          <FileUpload
            endpoint="chapterVideo"
            onChange={(url) => {
              if (url) {
                onSubmit({ videoUrl: url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            Télécharger la vidéo de ce chapitre
          </div>
        </div>
      )}
      {initialData.videoUrl && !isEditing && (
        <div className="text-xs text-muted-foreground mt-2">
          Le traitement des vidéos peut prendre quelques minutes. Actualisez la
          page si la vidéo n&apos;apparaît pas.
        </div>
      )}
    </div>
  );
};
