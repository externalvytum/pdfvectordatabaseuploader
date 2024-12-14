export type UploadStatus = 'idle' | 'uploading' | 'completed' | 'error';

export interface ProcessingStep {
  name: string;
  status: 'waiting' | 'processing' | 'completed' | 'error';
}