'use client';

import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose, DrawerTrigger } from '@/components/ui/drawer';

import { toast } from '@/components/ui/use-toast';
import { deleteUser } from '@/server/auth/users.action';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useModal } from '@/hooks/use-modal-store';

interface DeleteUserModalProps {
    children: React.ReactNode;
}

export function DeleteUserModal({ children }: DeleteUserModalProps) {
    const { isOpen: modalOpen, onClose, type, data } = useModal();
    const [isOpen, setIsOpen] = useState(modalOpen && type === 'delete-user');
    const isDesktop = useMediaQuery('(min-width: 768px)');
    const t = useTranslations('auth');
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    async function onDelete() {
        try {
            setIsLoading(true);

            const userId = data.userId;

            if (userId) {
                const response = await deleteUser({ id: userId });

                if (!response) {
                    toast({
                        title: t('delete_user_modal.failed_delete'),
                        variant: 'destructive',
                    });
                } else {
                    toast({
                        title: t('delete_user_modal.account_deleted'),
                    });
                    router.push('/');
                    onClose();
                    setIsOpen(false);
                }
            }
        } catch (error) {
            console.error(error);
            toast({
                title: t('delete_user_modal.generic_error'),
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    }

    const DeleteUserContent = (
        <>
            <DialogHeader className="pt-4">
                <DialogTitle className="text-center text-2xl ">
                    {t('delete_user_modal.delete_user')}
                </DialogTitle>
                <DialogDescription className="text-center">
                    <div className="flex items-center justify-center gap-x-2 text-red-500">
                        <AlertTriangle className="size-5" />
                        <p className="text-lg font-semibold">{t('delete_user_modal.danger')}</p>
                    </div>
                    {t('delete_user_modal.cannot_undo')}
                </DialogDescription>
            </DialogHeader>
            <DialogFooter className="p-0">
                <div className="flex w-full items-center justify-between">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        {t('delete_user_modal.cancel')}
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={onDelete}
                        disabled={isLoading}
                    >
                        {t('delete_user_modal.delete')}
                    </Button>
                </div>
            </DialogFooter>
        </>
    );

    if (isDesktop) {
        return (
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    {children}
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    {DeleteUserContent}
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
            <DrawerTrigger asChild>
                {children}
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>{t('delete_user_modal.delete_user')}</DrawerTitle>
                    <DrawerDescription>
                        {t('delete_user_modal.cannot_undo')}
                    </DrawerDescription>
                </DrawerHeader>
                <DrawerFooter className="pt-2 space-y-2">
                    <Button
                        variant="destructive"
                        onClick={onDelete}
                        disabled={isLoading}
                    >
                        {t('delete_user_modal.delete')}
                    </Button>
                    <DrawerClose asChild>
                        <Button variant="outline">{t('delete_user_modal.cancel')}</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
