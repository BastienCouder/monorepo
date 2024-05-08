import {
  ref,
  getBytes,
  uploadBytes,
  deleteObject,
  StorageReference,
} from 'firebase/storage';
import pdfParse from 'pdf-parse';
import * as path from 'path';
import { read, utils, WorkBook } from 'xlsx';
import OpenAI from 'openai';
import { storage } from '@/lib/firebase';
import { imageAnalyze } from './image-analyze';

const openai = new OpenAI();

type FileType =
  | '.pdf'
  | '.xlsx'
  | '.jpg'
  | '.webp'
  | '.png'
  | '.jpeg'
  | '.gif'
  | '.txt';

interface AnalyzerOptions {
  rename: boolean;
}

interface AnalysisResult {
  name?: string;
  category: string;
}

// Placeholder for content analysis function
async function analyzeContent(
  firebaseFilePath: string,
  extension: FileType
): Promise<AnalysisResult> {
  // Implement content analysis logic here
  // This is a simplified example that returns a placeholder result
  return {
    name: path.basename(firebaseFilePath, extension),
    category: 'general',
  };
}

async function analyzeAndOptionallyRenameFiles(
  firebaseFilePaths: string[],
  options: AnalyzerOptions
): Promise<void> {
  for (const firebaseFilePath of firebaseFilePaths) {
    const fileRef: StorageReference = ref(storage, firebaseFilePath);
    let content: string = '';
    const extension: FileType = path
      .extname(firebaseFilePath)
      .toLowerCase() as FileType;
    let newName: string | undefined;

    let buffer: Buffer | undefined;

    try {
      const arrayBuffer: ArrayBuffer = await getBytes(fileRef);
      buffer = Buffer.from(arrayBuffer);
    } catch (error) {
      console.error(`Error downloading file ${firebaseFilePath}:`, error);
      continue;
    }

    switch (extension) {
      case '.pdf':
        const resultPDF = await pdfParse(buffer);
        content = resultPDF.text;
        break;
      case '.xlsx':
        const workbook: WorkBook = read(buffer, { type: 'buffer' });
        content = utils.sheet_to_txt(workbook.Sheets[workbook.SheetNames[0]]);
        break;
      case '.jpg':
      case '.png':
      case '.jpeg':
      case '.gif':
        content = await imageAnalyze({ filePath: firebaseFilePath });
        break;
      case '.txt':
        content = buffer.toString('utf-8');
        break;
      default:
        console.log(`Unsupported file type for ${firebaseFilePath}.`);
        continue;
    }

    const analysisResult = await analyzeContent(firebaseFilePath, extension);

    if (options.rename && analysisResult.name) {
      newName = `${analysisResult.name}${extension}`;
    }

    if (newName) {
      const newFilePath = `organized/${newName}`;
      await deleteObject(fileRef);
      const newFileRef = ref(storage, newFilePath);
      if (buffer) {
        await uploadBytes(newFileRef, buffer);
      }
      console.log(`File ${firebaseFilePath} renamed to ${newName}`);
    }
  }
}

async function organizeFiles(
  firebaseFilePaths: string[],
  options: AnalyzerOptions
): Promise<void> {
  for (const firebaseFilePath of firebaseFilePaths) {
    const extension: FileType = path
      .extname(firebaseFilePath)
      .toLowerCase() as FileType;
    const analysisResult = await analyzeContent(firebaseFilePath, extension);

    const targetFolder = `organized/${analysisResult.category}`;
    let newName = analysisResult.name || path.basename(firebaseFilePath);

    if (options.rename && analysisResult.name) {
      newName = `${analysisResult.name}${extension}`;
    }

    const newFilePath = `${targetFolder}/${newName}`;
    const fileRef: StorageReference = ref(storage, firebaseFilePath);
    const newFileRef = ref(storage, newFilePath);
    try {
      const buffer: ArrayBuffer = await getBytes(fileRef);
      await uploadBytes(newFileRef, buffer);
      await deleteObject(fileRef);
      console.log(`File ${firebaseFilePath} organized into ${newFilePath}`);
    } catch (error) {
      console.error(`Error organizing file ${firebaseFilePath}: `, error);
    }
  }
}
