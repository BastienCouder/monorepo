import { useRouter } from 'next/navigation';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui';
import React from 'react';
import { LoginForm } from './form-login';
import { Touch } from '@/components/container';

interface LoginButtonProps {
  children: React.ReactNode;
  mode?: 'modal' | 'redirect';
  asChild?: boolean;
}

export const LoginButton = ({
  children,
  mode = 'redirect',
  asChild,
}: LoginButtonProps) => {
  const router = useRouter();

  const onClick = () => {
    router.push('/auth/login');
  };

  if (mode === 'modal') {
    return (
      <Dialog>
        <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
        <DialogContent className="p-0 w-auto bg-transparent border-none">
          <LoginForm />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Touch onClick={onClick} className="cursor-pointer">
      {children}
    </Touch>
  );
};
