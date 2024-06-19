'use client';

import React, { useState, useTransition } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Drawer,
    DrawerContent,
    DrawerClose,
    DrawerTrigger,
} from '@/components/ui/drawer';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useModal } from '@/hooks/use-modal-store';
import { z } from 'zod';
import { capitalizeFirstLetter } from '@/lib/utils';
import { deleteGroup } from '@/server/team/delete-group';
import { deleteTeamSchema } from '@/models/validations/team';
import { toast } from 'sonner';

interface DeleteTeamModalProps {
    children: React.ReactNode;
}

const translateZodErrors = (errors: z.ZodError, t: (key: string) => string) => {
    return errors.errors.map((error) => ({
        path: error.path,
        message: t(`validation.${error.message}`),
    }));
};

export function DeleteTeamModal({ children }: DeleteTeamModalProps) {
    const { isOpen: modalOpen, onClose, type, data } = useModal();
    const [isOpen, setIsOpen] = useState(modalOpen && type === 'delete-team');
    const tValidation = useTranslations('validation');
    const isDesktop = useMediaQuery('(min-width: 768px)');
    const t = useTranslations('auth');
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    async function onSubmit() {
        const userId = data.userId;
        const teamId = data.teamId;

        if (!userId || !teamId) {
            toast(t('error_title'), {
                description: t('delete_user_modal.user_id_missing'),
                action: {
                    label: t('try_again'),
                    onClick: () => onSubmit(),
                },
            });
            return;
        }

        startTransition(async () => {
            try {
                const result = deleteTeamSchema.safeParse({ id: userId });

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
                                onClick: () => onSubmit(),
                            },
                        });
                    });
                    return;
                }

                const res = await deleteGroup(teamId, userId);
                if (res.error) {
                    toast(t('error_title'), {
                        description: capitalizeFirstLetter(res.error),
                        action: {
                            label: t('try_again'),
                            onClick: () => onSubmit(),
                        },
                    });
                } else {
                    toast(res.success, {
                        action: {
                            label: t('try_again'),
                            onClick: () => onSubmit(),
                        },
                    });
                    onClose();
                    setIsOpen(false);
                    router.push('/');
                }
            } catch (error) {
                toast(t('generic_error'), {
                    action: {
                        label: t('try_again'),
                        onClick: () => onSubmit(),
                    },
                });
            }
        });
    }

    const DeleteTeamContent = (
        <>
            <DialogHeader className="pt-4">
                <DialogTitle className="text-center text-2xl ">
                    {t('delete_user_modal.delete_user')}
                </DialogTitle>
                <DialogDescription className="text-center">
                    <div className="flex items-center justify-center gap-x-2 text-red-500">
                        <AlertTriangle className="size-5" />
                        <p className="text-lg font-semibold">
                            {t('delete_user_modal.danger')}
                        </p>
                    </div>
                    {t('delete_user_modal.cannot_undo')}
                </DialogDescription>
            </DialogHeader>
            <DialogFooter className="p-0">
                <div className="flex w-full items-center justify-between">
                    <DrawerClose asChild>
                        <Button variant="outline" onClick={onClose} disabled={isPending}>
                            {t('delete_user_modal.cancel')}
                        </Button>
                    </DrawerClose>
                    <Button variant="destructive" onClick={onSubmit} disabled={isPending}>
                        {t('delete_user_modal.delete')}
                    </Button>
                </div>
            </DialogFooter>
        </>
    );

    if (isDesktop) {
        return (
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>{children}</DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    {DeleteTeamContent}
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
            <DrawerTrigger asChild>{children}</DrawerTrigger>
            <DrawerContent>{DeleteTeamContent}</DrawerContent>
        </Drawer>
    );
}
