'use client';

import React, {
    ChangeEvent,
    FormEventHandler,
    useEffect,
    useState,
    useTransition,
} from 'react';
import { Button, Switch, Input } from '@/components/ui';
import { useTranslations } from 'next-intl';
import { regenerateKey } from '@/server/team/regenerate-key';
import { toggleKeyActive } from '@/server/team/key-active';
import { z } from 'zod';
import { capitalizeFirstLetter } from '@/lib/utils';
import { regenerateKeySchema } from '@/models/validations/team';
import { Team, User } from '@/models/db';
import { toast } from 'sonner';

interface GetKeyTeamModalProps {
    team: Team;
    user: User;
}

const translateZodErrors = (errors: z.ZodError, t: (key: string) => string) => {
    return errors.errors.map((error) => ({
        path: error.path,
        message: t(`validation.${error.message}`),
    }));
};

export function GetKeyTeam({ team, user }: GetKeyTeamModalProps) {
    const t = useTranslations('auth');
    const [isKeyActive, setIsKeyActive] = useState(false);
    const [currentKey, setCurrentKey] = useState('');
    const [isPending, startTransition] = useTransition();
    const tValidation = useTranslations('validation');

    useEffect(() => {
        if (team.key) {
            setCurrentKey(team.key);
        }
        if (team.keyActive) {
            setIsKeyActive(team.keyActive);
        }
    }, [team.key, team.keyActive]);

    async function onSubmit() {
        const userId = user.id;
        const teamId = team.id;

        if (!userId || !teamId) {
            toast(t('error_title'), {
                description: t('validation.missing_user_or_team_id'),
                action: {
                    label: t('try_again'),
                    onClick: () => onSubmit(),
                },
            });
            return;
        }

        startTransition(async () => {
            try {
                const result = regenerateKeySchema.safeParse({ userId, teamId });
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

                const res = await regenerateKey({ userId, teamId });
                if (res.error) {
                    toast(t('error_title'), {
                        description: capitalizeFirstLetter(res.error),
                        action: {
                            label: t('try_again'),
                            onClick: () => onSubmit(),
                        },
                    });
                } else {
                    if (res.key) {
                        setCurrentKey(res.key);
                    }
                    toast(res.success);
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

    const onCopy = async () => {
        if (navigator.clipboard && currentKey) {
            await navigator.clipboard.writeText(currentKey);
            toast('Key Copied to Clipboard');
        } else {
            toast('Failed to Copy Key', {
                action: {
                    label: t('try_again'),
                    onClick: () => onSubmit(),
                },
            });
        }
    };

    const toggleKeyActivation = async () => {
        const userId = user.id;
        const teamId = team.id;

        if (!userId || !teamId) {
            toast(t('error_title'), {
                description: t('validation.missing_user_or_team_id'),
                action: {
                    label: t('try_again'),
                    onClick: () => onSubmit(),
                },
            });
            return;
        }

        try {
            const res = await toggleKeyActive(userId, teamId);
            if (res.error) {
                toast(res.error, {
                    action: {
                        label: t('try_again'),
                        onClick: () => onSubmit(),
                    },
                });
            } else {
                setIsKeyActive(!isKeyActive);
                toast(res.success);
            }
        } catch (error) {
            toast(t('generic_error'), {
                action: {
                    label: t('try_again'),
                    onClick: () => onSubmit(),
                },
            });
        }
    };

    return (
        <>
            <div className="space-y-0">
                <h1 className="font-bold">Team members</h1>
                <p className="text-xs">Copy the key for people to join the group</p>
            </div>
            <div className="w-full flex flex-col gap-2">
                <div className="w-full flex gap-4">
                    <Input value={currentKey} disabled />
                    <Button
                        className="w-1/3"
                        onClick={onCopy}
                        disabled={isPending}
                        variant={'outline'}
                    >
                        {'Copy key'}
                    </Button>
                </div>
                <div className="space-y-2">
                    <Button onClick={onSubmit} disabled={isPending} className="w-full">
                        {isPending ? 'Regenerating...' : 'Regenerate Key'}
                    </Button>
                    <div className="flex items-center justify-between">
                        <span className="text-xs">
                            {isKeyActive ? 'Key is Active' : 'Key is Inactive'}
                        </span>
                        <Switch
                            checked={isKeyActive}
                            onCheckedChange={toggleKeyActivation}
                            disabled={isPending}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
