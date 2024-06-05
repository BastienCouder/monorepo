import { Server as NetServer } from 'http';
import { NextApiRequest } from 'next';
import { NextApiResponseServerIo } from '@/types/socket';
import { Server as ServerIo, Socket } from 'socket.io';

export const config = {
  api: {
    bodyParser: false,
  },
};

interface CustomSocket extends Socket {
  username?: string;
}

let connectedUsers: string[] = [];

export default function ioHandler(
  _req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (!res.socket.server.io) {
    const path = '/api/socket/io';
    const httpServer: NetServer = res.socket.server as any;

    const io = new ServerIo(httpServer, {
      path,
    });
    res.socket.server.io = io;

    io.on('connection', (socket: CustomSocket) => {
      socket.on('user_connected', (username: string) => {
        socket.username = username;
        if (!connectedUsers.includes(username)) {
          connectedUsers.push(username);
        }
        io.emit('connected_users', connectedUsers);
      });

      socket.on('disconnect', () => {
        if (socket.username) {
          const index = connectedUsers.indexOf(socket.username);
          if (index !== -1) {
            connectedUsers.splice(index, 1);
          }
        }
        io.emit('connected_users', connectedUsers);
      });
    });
  }
  res.end();
}
