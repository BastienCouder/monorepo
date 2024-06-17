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
  Form as FormContainer,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { capitalizeFirstLetter } from '@/lib/utils';
import { createTeamFolder } from '@/server/drive/create-folder-team';
import { createFolderSchema } from '@/models/validations/folder';
import { ToastAction } from '@/components/ui';
import { Container, Form, Text } from '@/components/container';

interface CreateFolderProps {
  userId: string | undefined;
  teamId: string;
  parentFolderId: string | undefined;
  isDesktop?: boolean;
  children?: React.ReactNode;
}

const translateZodErrors = (errors: z.ZodError, t: (key: string) => string) => {
  return errors.errors.map((error) => ({
    path: error.path,
    message: t(`validation.${error.message}`),
  }));
};

export const CreateFolder = ({
  userId,
  teamId,
  parentFolderId,
  isDesktop,
  children,
}: CreateFolderProps) => {
  const t = useTranslations('auth');
  const tValidation = useTranslations('validation');
  const [isPending, startTransition] = useTransition();
  const { isOpen: modalOpen, onClose, type } = useModal();
  const [isOpen, setIsOpen] = useState(
    modalOpen && type === 'create-folder-team'
  );
  const form = useForm<z.infer<typeof createFolderSchema>>({
    resolver: zodResolver(createFolderSchema),
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof createFolderSchema>) => {
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
            form.reset();
            if (isDesktop) {
              onClose();
              setIsOpen(false);
            }
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

  const content = (
    <Container.Div
      className={`${isDesktop ? '' : 'mx-auto w-[80%]'} space-y-3`}
    >
      <Container.Div className="text-center sm:text-start">
        <Text.H3 className="-mb-1">Create Folder</Text.H3>
        <Text.Small>lorem ipsum kklhyghyuhi jkgfgcfgj</Text.Small>
      </Container.Div>
      <FormContainer {...form}>
        <Form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    className="w-full"
                    placeholder="Folder Name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            className={`${isDesktop ? 'w-full' : 'w-full'}`}
            type="submit"
            disabled={isPending}
            size={'sm'}
          >
            {isPending ? 'Creating...' : 'Create'}
          </Button>
        </Form>
      </FormContainer>
    </Container.Div>
  );

  if (isDesktop) {
    return <>{content}</>;
  }

  return (
    <>
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>{children}</DrawerTrigger>
        <DrawerContent className="space-y-4 pb-6">{content}</DrawerContent>
      </Drawer>
    </>
  );
};
