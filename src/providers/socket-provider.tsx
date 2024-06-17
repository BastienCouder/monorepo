'use client';
import { env } from '@/env.mjs';
import { useCurrentUser } from '@/hooks/use-current-user';
import { createContext, useContext, useEffect, useState } from 'react';
import { io as ClientIO } from 'socket.io-client';

type SocketContextType = {
  socket: any | null;
  isConnected: boolean;
  connectedUsers: string[];
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  connectedUsers: [],
});

export const useSocket = () => {
  return useContext(SocketContext);
};

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState<string[]>([]);
  const user = useCurrentUser();

  useEffect(() => {
    if (!user) return;

    const socketInstance = new (ClientIO as any)(env.NEXT_PUBLIC_APP_URL!, {
      path: '/api/socket/io',
    });

    socketInstance.on('connect', () => {
      setIsConnected(true);
      socketInstance.emit('user_connected', user.name);
    });

    socketInstance.on('connected_users', (users: string[]) => {
      setConnectedUsers(users);
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, isConnected, connectedUsers }}>
      {children}
    </SocketContext.Provider>
  );
}
