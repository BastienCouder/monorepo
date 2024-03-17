import { File } from '@prisma/client';
import { preprocessAndAnalyzeFiles } from './process-analyze-files';
import { AnalyzedFile } from './types';

export async function analyzeAndSortFiles(files: any) {
  // Placeholder pour les résultats analysés
  let analyzedFiles = [];

  for (const file of files) {
    // Supposons que `preprocessAndAnalyzeFiles` traite un seul fichier
    const analysisResults = await preprocessAndAnalyzeFiles([file]); // Notez que nous passons une liste contenant un seul fichier
    // Traiter `analysisResult` comme nécessaire
    // Ajouter les résultats d'analyse et des informations sur le fichier original pour le tri ultérieur
    analyzedFiles.push({
      originalFile: files,
      analysisResults,
    });
  }

  const sortedFiles = sortFilesBasedOnAnalysis(analyzedFiles);

  // Retourner les fichiers triés
  return sortedFiles;
}

function sortFilesBasedOnAnalysis(files: AnalyzedFile[]): AnalyzedFile[] {
  // Exemple de tri basé sur un critère fictif
  return files.sort((a, b) => {
    const criterionA = a.analysisResults.criterion;
    const criterionB = b.analysisResults.criterion;
    if (criterionA < criterionB) {
      return -1;
    }
    if (criterionA > criterionB) {
      return 1;
    }
    return 0;
  });
}
