'use client';

import React, { useEffect, useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
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
import { renameTeamSchema } from '@/models/validations/team';
import { renameTeam } from '@/server/team/rename-team';
import { capitalizeFirstLetter } from '@/lib/utils';
import { toast } from 'sonner';

interface RenameTeamModalProps {
  children: React.ReactNode;
}

const translateZodErrors = (errors: z.ZodError, t: (key: string) => string) => {
  return errors.errors.map((error) => ({
    path: error.path,
    message: t(`validation.${error.message}`),
  }));
};

export function RenameTeamModal({ children }: RenameTeamModalProps) {
  const { isOpen: modalOpen, onClose, type, data } = useModal();
  const [isOpen, setIsOpen] = useState(modalOpen && type === 'rename-team');
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const t = useTranslations('auth');
  const tValidation = useTranslations('validation');
  const [nameTeam, setNameTeam] = useState('');
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof renameTeamSchema>>({
    resolver: zodResolver(renameTeamSchema),
    defaultValues: { name: nameTeam },
  });

  useEffect(() => {
    if (data.teamName) {
      setNameTeam(data.teamName);
    }
  }, [data.teamName]);

  const onSubmit = async (values: z.infer<typeof renameTeamSchema>) => {
    const userId = data.userId;
    const teamId = data.teamId;

    if (!userId || !teamId) {
      toast(t('error_title'), {
        description: t('validation.missing_user_or_team_id'),
        action: {
          label: t('try_again'),
          onClick: () => onSubmit(values),
        },
      });
      return;
    }

    startTransition(async () => {
      try {
        const result = renameTeamSchema.safeParse(values);
        if (!result.success) {
          const translatedErrors = translateZodErrors(
            result.error,
            tValidation
          );
          translatedErrors.forEach((error) => {
            toast(t('error_title'), {
              description: capitalizeFirstLetter(error.message),
              action: {
                label: t('try_again'),
                onClick: () => onSubmit(values),
              },
            });
          });
          return;
        }

        if (userId && teamId) {
          const res = await renameTeam(userId, teamId, values);
          if (res.error) {
            toast(res.error, {
              action: {
                label: t('try_again'),
                onClick: () => onSubmit(values),
              },
            });
          } else {
            toast(res.success);
            onClose();
            setIsOpen(false);
          }
        }
      } catch (error) {
        toast(t('generic_error'), {
          action: {
            label: t('try_again'),
            onClick: () => onSubmit(values),
          },
        });
      }
    });
  };

  const RenameTeamForm = (
    <>
      <DialogHeader>
        <DialogTitle>Rename the Team</DialogTitle>
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
                  <Input className="w-full" placeholder={nameTeam} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isPending}>
            {isPending ? 'Renaming...' : 'Rename'}
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
          {RenameTeamForm}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="space-y-4 p-4 pt-0">
        {RenameTeamForm}
      </DrawerContent>
    </Drawer>
  );
}
