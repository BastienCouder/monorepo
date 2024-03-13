'use client';

import MuxPlayer from '@mux/mux-player-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Lock } from 'lucide-react';

import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';

interface VideoPlayerProps {
  playbackId: string;
  courseId: string;
  chapterId: string;
  nextChapterId?: string;
  isLocked: boolean;
  completeOnEnd: boolean;
  title: string;
}

export const VideoPlayer = ({
  playbackId,
  courseId,
  // eslint-disable-next-line no-unused-vars
  chapterId,
  nextChapterId,
  isLocked,
  completeOnEnd,
  title,
}: VideoPlayerProps) => {
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();

  const onEnd = async () => {
    try {
      if (completeOnEnd) {
        // await axios.put(
        //   `/api/courses/${courseId}/chapters/${chapterId}/progress`,
        //   {
        //     isCompleted: true,
        //   }
        // );

        if (!nextChapterId) {
          return;
        }

        toast({
          title: 'Mise à jour des progrès',
        });
        router.refresh();

        if (nextChapterId) {
          router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
        }
      }
    } catch {
      toast({
        title: "Une erreur s'est produite",
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="relative aspect-video">
      {!isReady && !isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <Loader2 className="h-8 w-8 animate-spin text-background" />
        </div>
      )}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-background">
          <Lock className="h-8 w-8" />
          <p className="text-sm">Connecte toi</p>
        </div>
      )}
      {!isLocked && (
        <MuxPlayer
          title={title}
          className={cn(!isReady && 'hidden')}
          onCanPlay={() => setIsReady(true)}
          onEnded={onEnd}
          autoPlay
          playbackId={playbackId}
        />
      )}
    </div>
  );
};
