import { User } from '@prisma/client';
import { AvatarProps } from '@radix-ui/react-avatar';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Icons } from '@/components/shared/icons';
import useActiveList from '@/hooks/use-active-list';
import { useMemo } from 'react';

interface UserAvatarProps extends AvatarProps {
  user: Pick<User, 'image' | 'name' | 'email'>;
}

export function UserAvatar({ user, ...props }: UserAvatarProps) {

  return (
    <Avatar {...props}>
      {user.image ? (
        <AvatarImage
          alt="Picture"
          src={user.image}
          referrerPolicy="no-referrer"
          className={user.email ? 'border-green-500' : 'border-gray-300'}
        />
      ) : (
        <AvatarFallback className={user.email ? 'border-green-500' : 'border-gray-300'}>
          <span className="sr-only">{user.name}</span>
          <Icons.user className="h-4 w-4" />
        </AvatarFallback>
      )}
      <span
        className={`absolute bottom-0 right-0 block h-2 w-2 rounded-full ${user.name ? 'bg-green-500' : 'bg-gray-400'
          } ring-2 ring-muted`}
      />
    </Avatar>
  );
}
