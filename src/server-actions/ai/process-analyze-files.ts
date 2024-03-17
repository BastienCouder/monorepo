'use server';
import { File } from '@prisma/client';
import { AnalyzedFile, FileType } from './types';
import { extractTextFromPdf } from '@/lib/pdf-util';
import { analyzeTextWithGPT3 } from '@/lib/openAi';

export async function preprocessAndAnalyzeFiles(
  files: File[]
): Promise<AnalyzedFile[]> {
  let processedFiles: any = [];

  for (const file of files) {
    let analyzableContent = '';

    if (file.type === 'application/pdf') {
      // Simulons la récupération d'un Buffer pour le fichier PDF
      const fileBuffer: Buffer = Buffer.from([]); // Remplacez ceci par la méthode appropriée pour obtenir le Buffer de votre fichier
      analyzableContent = await extractTextFromPdf(fileBuffer);
    }
    // Ajoutez d'autres cas pour d'autres types de fichiers si nécessaire

    const analysisResult: string = await analyzeTextWithGPT3(analyzableContent);

    processedFiles.push({ originalFile: file, analysisResult });
  }

  return processedFiles;
}
