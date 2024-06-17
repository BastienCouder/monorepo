// 'use client';

// import React, { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import {
//     Dialog,
//     DialogContent,
//     DialogHeader,
//     DialogTitle,
//     DialogTrigger
// } from '@/components/ui/dialog';
// import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';

// import { toast } from '@/components/ui/use-toast';
// import { deleteUser } from '@/server/auth/users.action';
// import { useTranslations } from 'next-intl';
// import { useMediaQuery } from '@/hooks/use-media-query';
// import { useModal } from '@/hooks/use-modal-store';
// import { useForm } from 'react-hook-form';
// import { Input } from '@/components/ui/input';
// import {
//     Form,
//     FormControl,
//     FormField,
//     FormItem,
//     FormLabel,
//     FormMessage,
// } from '@/components/ui/form';
// import { Loader2, MinusCircle } from 'lucide-react';

// interface AddUserToTeamModalProps {
//     children: React.ReactNode;
// }
// // type TeamFormValues = z.infer<typeof createTeamSchema>;

// const defaultValues: Partial<TeamFormValues> = {};

// export function AddUserToTeamModal({ children }: AddUserToTeamModalProps) {
//     const { isOpen: modalOpen, onClose, type, data: dataModal } = useModal();
//     const [isOpen, setIsOpen] = useState(modalOpen && type === 'add-user-to-team');
//     const isDesktop = useMediaQuery('(min-width: 768px)');
//     const t = useTranslations('auth');
//     const [isLoading, setIsLoading] = useState(false);
//     const [inviteCount, setInviteCount] = useState(1);

//     const form = useForm<TeamFormValues>({
//         // resolver: zodResolver(createTeamSchema),
//         defaultValues,
//         mode: 'onChange',
//     });

//     async function onSubmit(data: TeamFormValues) {
//         try {
//             setIsLoading(true);

//             const userId = dataModal.userId;

//             if (userId) {
//                 const response = await deleteUser({ id: userId });
//                 // await createTeam(
//                 //     userId,
//                 //     data.name,
//                 //     data.invites
//                 //         ? data.invites.filter((invite): invite is string => !!invite)
//                 //         : []
//                 // );
//                 if (!response) {
//                     // toast({
//                     //     title: t('delete_user_modal.failed_delete'),
//                     //     variant: 'destructive',
//                     // });
//                 } else {
//                     // toast({
//                     //     title: t('delete_user_modal.account_deleted'),
//                     // });

//                     onClose();
//                     setIsOpen(false);
//                 }
//             }
//         } catch (error) {
//             console.error(error);
//             toast({
//                 title: t('delete_user_modal.generic_error'),
//                 variant: 'destructive',
//             });
//         } finally {
//             setIsLoading(false);
//         }
//     }

//     const AddUserToTeamForm = (
//         <>
//             <DialogHeader>
//                 <DialogTitle>
//                     Add user To Team
//                 </DialogTitle>
//             </DialogHeader>
//             <Form {...form}>
//                 <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//                     <div className="space-y-4">
//                         {[...Array(inviteCount)].map((_, index) => (
//                             <div key={index} className="w-full flex items-center gap-x-2">
//                                 <FormField
//                                     control={form.control}
//                                     name={`invites.${index}`}
//                                     render={({ field }) => (
//                                         <FormItem>
//                                             <FormLabel>Invite {index + 1}</FormLabel>
//                                             <FormControl>
//                                                 <Input
//                                                     className="w-full"
//                                                     placeholder={`Email ${index + 1}...`}
//                                                     {...field}
//                                                 />
//                                             </FormControl>
//                                             <FormMessage />
//                                         </FormItem>
//                                     )}
//                                 />
//                                 {inviteCount > 1 && (
//                                     <Button
//                                         type="button"
//                                         variant={'ghost'}
//                                         className="px-1 bg-none"
//                                         onClick={() => {
//                                             form.setValue(
//                                                 'invites',
//                                                 form.getValues().invites?.filter((_, i) => i !== index)
//                                             );
//                                             setInviteCount(inviteCount - 1);
//                                         }}
//                                     >
//                                         <MinusCircle className="w-4 h-4 text-red-500" />
//                                     </Button>
//                                 )}
//                             </div>
//                         ))}
//                     </div>
//                     <div className="flex gap-4 items-start">
//                         {inviteCount < 3 && (
//                             <Button
//                                 type="button"
//                                 onClick={() => setInviteCount(inviteCount + 1)}
//                             >
//                                 Add Email
//                             </Button>
//                         )}

//                         <Button type="submit" disabled={isLoading}>
//                             {isLoading ? (
//                                 <Loader2 className="w-4 h-4 mr-1 animate-spin" />
//                             ) : (
//                                 'Create'
//                             )}
//                         </Button>
//                     </div>
//                 </form>
//             </Form>
//         </>
//     );

//     if (isDesktop) {
//         return (
//             <Dialog open={isOpen} onOpenChange={setIsOpen}>
//                 <DialogTrigger asChild>
//                     {children}
//                 </DialogTrigger>
//                 <DialogContent className="sm:max-w-[425px]">
//                     {AddUserToTeamForm}
//                 </DialogContent>
//             </Dialog>
//         );
//     }

//     return (
//         <Drawer open={isOpen} onOpenChange={setIsOpen}>
//             <DrawerTrigger asChild>
//                 {children}
//             </DrawerTrigger>
//             <DrawerContent>
//                 {AddUserToTeamForm}
//             </DrawerContent>
//         </Drawer>
//     );
// }
