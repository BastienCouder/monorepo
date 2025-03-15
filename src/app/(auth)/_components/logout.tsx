import { Touch } from '@/components/container';
import { logout } from '@/server/auth/logout.action';
import React from 'react';

interface LogoutButtonProps {
  children?: React.ReactNode;
}

export const LogoutButton = ({ children }: LogoutButtonProps) => {
  const onClick = () => {
    logout();
  };

  return (
    <Touch onClick={onClick} className="cursor-pointer">
      {children}
    </Touch>
  );
};
