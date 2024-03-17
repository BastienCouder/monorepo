import fs from 'fs/promises';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import path from 'path';

export async function POST(request: Request) {
  const { path: folderPath } = await request.json();
  const basePath = path.resolve('C:\\Users\\basti');
  const fullFolderPath = path.resolve(basePath, folderPath);

  try {
    await fs.mkdir(fullFolderPath, { recursive: true });
    revalidatePath('/folder');

    return new NextResponse(
      JSON.stringify({ message: 'Folder created successfully' }),
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error creating folder: ${error}`);
    return new NextResponse(
      JSON.stringify({ message: 'Unable to create the folder' }),
      { status: 500 }
    );
  }
}
