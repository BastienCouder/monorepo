'use client';

import React, { useState, useTransition, useEffect } from 'react';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { toast } from '@/components/ui/use-toast';
import { useTranslations } from 'next-intl';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useModal } from '@/hooks/use-modal-store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import {
    Button,
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    Input,
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
    Slider,
} from '@/components/ui';
import { capitalizeFirstLetter } from '@/lib/utils';
import { ToastAction } from '../ui/toast';
import { createGroup } from '@/server/team/create-group';
import { createGroupSchema } from '@/models/validations/team';
import { Container, Text } from '@/components/container';

interface CreateGroupModalProps {
    children: React.ReactNode;
}

const translateZodErrors = (errors: z.ZodError, t: (key: string) => string) => {
    return errors.errors.map((error) => ({
        path: error.path,
        message: t(`validation.${error.message}`),
    }));
};

export function CreateGroupModal({ children }: CreateGroupModalProps) {
    const { isOpen: modalOpen, onClose, type, data } = useModal();
    const [isOpen, setIsOpen] = useState(
        modalOpen && type === 'create-folder-team'
    );
    const isDesktop = useMediaQuery('(min-width: 768px)');
    const t = useTranslations('auth');
    const tValidation = useTranslations('validation');
    const [isPending, startTransition] = useTransition();
    const [storageUsed, setStorageUsed] = useState<number>(0);
    const [storageValue, setStorageValue] = useState<number>(0);
    const form = useForm<z.infer<typeof createGroupSchema>>({
        resolver: zodResolver(createGroupSchema),
    });

    useEffect(() => {
        if (data.storageUsed) {

            setStorageUsed(data.storageUsed / 1000000); // Conversion en gigaoctets
        }
    }, [data.storageUsed]);


    const onSubmit = async (values: z.infer<typeof createGroupSchema>) => {
        const userId = data.userId;

        if (!userId) {
            toast({
                title: t('error_title'),
                description: t('validation.missing_user_or_team_id'),
                variant: 'destructive',
            });
            return;
        }

        startTransition(async () => {
            try {
                const result = createGroupSchema.safeParse(values);
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

                // const storageUsedBytes = convertToBytes(storageValue, storageUnit);
                const res = await createGroup(userId, { ...values, storageLimit: 8000 });

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
            } catch (error) {
                toast({
                    title: t('generic_error'),
                    variant: 'destructive',
                });
            }
        });
    };

    const CreateGroupForm = (
        <>
            <DialogHeader>
                <DialogTitle>Create Group</DialogTitle>
                <Text.Small>Specify the storage limit for your team.</Text.Small>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input className="w-full" placeholder='name' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Container.Div className="flex flex-col gap-y-3 px-2">
                        <Container.Div className="flex justify-between">
                            <Text.Small>{storageValue}</Text.Small>
                            <Text.Small>{storageUsed} limited</Text.Small>
                        </Container.Div>
                        <Slider
                            defaultValue={[0]}
                            onValueChange={(value) => setStorageValue(value[0])}
                            max={storageUsed}
                            step={1}
                        />
                    </Container.Div>
                    <Button type="submit" disabled={isPending} size={'sm'}>
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
                    {CreateGroupForm}
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
            <DrawerTrigger asChild>{children}</DrawerTrigger>
            <DrawerContent className="space-y-4 p-4 pt-0">
                {CreateGroupForm}
            </DrawerContent>
        </Drawer>
    );
}
