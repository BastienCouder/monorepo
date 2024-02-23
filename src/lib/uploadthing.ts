'use server';

import type { NextApiRequest, NextApiResponse } from 'next';

import { createUploadthing, type FileRouter } from 'uploadthing/next-legacy';
import { currentUser, roleCheckMiddleware } from './authCheck';
const f = createUploadthing();

// eslint-disable-next-line no-unused-vars
const auth = (req: NextApiRequest, res: NextApiResponse) => ({ id: 'fakeId' }); // Fake auth function

const handleAuth = async () => {
  const session = await currentUser();
  const isAuthorized = roleCheckMiddleware(session);

  if (!session || !isAuthorized) throw new Error('Unauthorized');
  const userId = session.id;
  return { userId };
};
// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  courseImage: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
  courseAttachment: f(['text', 'image', 'video', 'audio', 'pdf'])
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
  chapterVideo: f({ video: { maxFileCount: 1, maxFileSize: '512GB' } })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
