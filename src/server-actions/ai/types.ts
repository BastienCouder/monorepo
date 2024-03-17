export interface AnalyzedFile {
  file: any;
  analysisResults: any;
}

export type FileType =
  | 'application/pdf'
  | 'image/jpeg'
  | 'image/png'
  | 'audio/mpeg';
