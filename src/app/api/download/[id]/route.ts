// import type { NextApiRequest, NextApiResponse } from 'next';
// import fs from 'fs';
// import path from 'path';
// import { db } from '@/lib/prisma';
// import { NextRequest, NextResponse } from 'next/server';

// async function fetchAllFiles(
//   folderId: string,
//   basePath = 'storage'
// ): Promise<string[]> {
//   const folder = await db.folder.findUnique({
//     where: { id: folderId },
//     include: {
//       files: true,
//       subfolders: true,
//     },
//   });

//   if (!folder) {
//     return [];
//   }

//   const files = folder.files.map((file) => path.join(basePath, file.path));
//   for (const subfolder of folder.subfolders) {
//     const subfolderFiles = await fetchAllFiles(
//       subfolder.id,
//       path.join(basePath, subfolder.name)
//     );
//     files.push(...subfolderFiles);
//   }

//   return files;
// }

// export async function GET(
//   req: NextApiRequest,
//   { params }: { params: { id: string } },
//   res: NextApiResponse
// ) {
//   if (!params.id) {
//     return new NextResponse(
//       JSON.stringify({ message: 'Missing ID parameter' }),
//       {
//         status: 400,
//       }
//     );
//   }

//   const id = params.id as string;

//   try {
//     const file = await db.file.findUnique({
//       where: { id },
//     });

//     if (file) {
//       const filePath = path.join(process.cwd(), 'storage', file.path);
//       res.setHeader('Content-Type', 'application/octet-stream');
//       res.setHeader(
//         'Content-Disposition',
//         `attachment; filename="${file.name}"`
//       );
//       const res = new NextResponse(stream, {
//         status: 200,
//         headers: new Headers({
//             "content-disposition":`attachment; filename="${fileName}"` ,
//             "content-type":  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
//         })
//     }

//     const folder = await db.folder.findUnique({
//       where: { id },
//     });

//     if (folder) {
//       const files = await fetchAllFiles(id);
//       if (files.length === 0) {
//         return new NextResponse(
//           JSON.stringify({ message: 'No files found in the folder' }),
//           {
//             status: 404,
//           }
//         );
//       }

//       res.setHeader('Content-Type', 'application/octet-stream');
//       res.setHeader(
//         'Content-Disposition',
//         `attachment; filename="${folder.name}"`
//       );
//       for (const file of files) {
//         fs.createReadStream(file).pipe(res);
//       }
//       return;
//     }

//     return new NextResponse(JSON.stringify({ message: 'Item not found' }), {
//       status: 404,
//     });
//   } catch (error) {
//     console.error('Error fetching files:', error);
//     return new NextResponse(
//       JSON.stringify({ message: 'Server error while processing the download' }),
//       {
//         status: 500,
//       }
//     );
//   }
// }
