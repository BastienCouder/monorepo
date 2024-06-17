'use client';

import React, { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { toast } from '@/components/ui/use-toast';
import { useTranslations } from 'next-intl';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useModal } from '@/hooks/use-modal-store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { capitalizeFirstLetter } from '@/lib/utils';
import { createTeamFolder } from '@/server/drive/create-folder-team';
import { createFolderSchema } from '@/models/validations/folder';
import { ToastAction } from '../ui/toast';

interface CreateFolderTeamModalProps {
  children: React.ReactNode;
}

const translateZodErrors = (errors: z.ZodError, t: (key: string) => string) => {
  return errors.errors.map((error) => ({
    path: error.path,
    message: t(`validation.${error.message}`),
  }));
};

export function CreateFolderTeamModal({
  children,
}: CreateFolderTeamModalProps) {
  const { isOpen: modalOpen, onClose, type, data } = useModal();
  const [isOpen, setIsOpen] = useState(
    modalOpen && type === 'create-folder-team'
  );
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const t = useTranslations('auth');
  const tValidation = useTranslations('validation');
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof createFolderSchema>>({
    resolver: zodResolver(createFolderSchema),
  });

  const onSubmit = async (values: z.infer<typeof createFolderSchema>) => {
    const userId = data.userId;
    const teamId = data.teamId;
    const parentFolderId = data.parentFolderId;

    if (!teamId) {
      toast({
        title: t('error_title'),
        description: t('validation.missing_user_or_team_id'),
        variant: 'destructive',
      });
      return;
    }

    startTransition(async () => {
      try {
        const result = createFolderSchema.safeParse(values);
        if (!result.success) {
          const translatedErrors = translateZodErrors(
            result.error,
            tValidation
          );
          translatedErrors.forEach((error) => {
            toast({
              title: t('error_title'),
              description: capitalizeFirstLetter(error.message),
              action: (
                <ToastAction altText={t('try_again')}>
                  {t('try_again')}
                </ToastAction>
              ),
            });
          });
          return;
        }

        if (teamId) {
          const res = await createTeamFolder(
            teamId,
            values,
            userId,
            parentFolderId
          );
          if (res.error) {
            toast({
              title: res.error,
              variant: 'destructive',
            });
          } else {
            toast({
              title: res.success,
            });
            onClose();
            form.reset();
            setIsOpen(false);
          }
        }
      } catch (error) {
        toast({
          title: t('generic_error'),
          variant: 'destructive',
        });
      }
    });
  };

  const CreateFolderForm = (
    <>
      <DialogHeader>
        <DialogTitle>Create Folder</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input className="w-full" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isPending}>
            {isPending ? 'Creating...' : 'Create'}
          </Button>
        </form>
      </Form>
    </>
  );

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-[505px]">
          {CreateFolderForm}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="space-y-4 p-4 pt-0">
        {CreateFolderForm}
      </DrawerContent>
    </Drawer>
  );
}
