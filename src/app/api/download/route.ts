import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const WINDOWS_BASE_PATH = '/mnt/c/Users/basti';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const filePath = url.searchParams.get('path') || '';
  const fileName = url.searchParams.get('name') || '';

  const basePath = path.resolve(WINDOWS_BASE_PATH);
  const fullFilePath = path.resolve(basePath, filePath, fileName);

  if (!fullFilePath.startsWith(basePath)) {
    return new NextResponse(JSON.stringify({ message: 'Invalid path!' }), {
      status: 400,
    });
  }

  try {
    await fs.access(fullFilePath, fs.constants.R_OK);

    const fileBuffer = await fs.readFile(fullFilePath);

    const headers = new Headers();
    headers.append('Content-Type', 'application/octet-stream');
    headers.append(
      'Content-Disposition',
      `attachment; filename="${encodeURIComponent(fileName)}"`
    );

    return new NextResponse(fileBuffer, { status: 200, headers });
  } catch (err) {
    console.error(`Error accessing file ${fullFilePath}: ${err}`);
    return new NextResponse(
      JSON.stringify({ message: 'File not found or access denied' }),
      {
        status: 404,
      }
    );
  }
}
