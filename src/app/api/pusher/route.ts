import type { NextApiRequest, NextApiResponse } from 'next';
import { currentUser } from '@/lib/authCheck';
import { NextResponse } from 'next/server';
import { pusherServer } from '@/lib/pusher/server';

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const session = await currentUser();

  if (!session) {
    return;
  }

  try {
    const socketId = req.body.socket_id;
    const channel = req.body.channel_name;
    const data = {
      user_id: session.email as string,
    };
    console.log(req);
    console.log(data);

    const authResponse = pusherServer.authorizeChannel(socketId, channel, data);

    return new NextResponse(JSON.stringify(authResponse));
  } catch (error) {
    console.error('Error fetching files:', error);
    return new NextResponse(
      JSON.stringify({ message: 'Server error while processing the download' }),
      {
        status: 500,
      }
    );
  }
}
