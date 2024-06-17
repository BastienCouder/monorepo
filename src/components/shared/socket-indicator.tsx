'use client';

import { useSocket } from '@/providers/socket-provider';

export function SocketIndicator() {
  const { isConnected } = useSocket();

  if (!isConnected) {
    return (
      <span
        className={`absolute bottom-0 right-0 block h-2 w-2 rounded-full bg-gray-400 ring-2 ring-muted`}
      />
    );
  }
  return (
    <span
      className={`absolute bottom-0 right-0 block h-2 w-2 rounded-full bg-green-600 ring-2 ring-muted`}
    />
  );
}
