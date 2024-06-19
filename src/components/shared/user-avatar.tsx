
import { AvatarProps } from '@radix-ui/react-avatar';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SocketIndicator } from './socket-indicator';
import { FaUserCircle } from "react-icons/fa";
import { User } from '@/models/db';

interface UserAvatarProps extends AvatarProps {
  user: Pick<User, 'image' | 'name' | 'email'>;
  isCollapsed?: boolean;
}

export function UserAvatar({ user, ...props }: UserAvatarProps) {
  return (
    <>
      <Avatar {...props}>
        {user.image ? (
          <AvatarImage
            alt="Picture"
            src={user.image}
            referrerPolicy="no-referrer"
          />
        ) : (
          <AvatarFallback>
            {props.isCollapsed ? <FaUserCircle size={10} /> : <FaUserCircle size={15} />}
          </AvatarFallback>
        )}
        {/* <SocketIndicator /> */}
      </Avatar>
    </>
  );
}
