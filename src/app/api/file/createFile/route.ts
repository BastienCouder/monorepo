import fs from 'fs/promises';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import path from 'path';

export async function POST(request: Request) {
  const { path: filePath, content = '' } = await request.json();
  const basePath = path.resolve('C:\\Users\\basti');
  const fullFilePath = path.resolve(basePath, filePath);

  try {
    await fs.writeFile(fullFilePath, content);
    revalidatePath('/folder');
    return new NextResponse(
      JSON.stringify({ message: 'File created successfully' }),
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error creating file: ${error}`);
    return new NextResponse(
      JSON.stringify({ message: 'Unable to create the file' }),
      { status: 500 }
    );
  }
}
