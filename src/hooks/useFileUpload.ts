import { useState, useCallback } from 'react';
import { UploadStatus, ProcessingStep } from '../types';

const API_URL = import.meta.env.VITE_API_URL || '';

export function useFileUpload() {
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
  const [processingStatus, setProcessingStatus] = useState<ProcessingStep[]>([]);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = useCallback(async (file: File) => {
    setUploadStatus('uploading');
    setError(null);
    setProcessingStatus([]);

    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const uploadUrl = API_URL ? `${API_URL}/upload` : '/upload';
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      setUploadStatus('completed');
      
      // Start polling for processing status
      const processingSteps = [
        { name: 'PDF Text Extraction', status: 'processing' },
        { name: 'Creating Embeddings', status: 'waiting' },
        { name: 'Storing in Pinecone', status: 'waiting' }
      ];
      setProcessingStatus(processingSteps);

      const pollStatus = async () => {
        const statusUrl = API_URL ? `${API_URL}/status/${file.name}` : `/status/${file.name}`;
        const statusResponse = await fetch(statusUrl);
        const status = await statusResponse.json();

        setProcessingStatus(status.steps);

        if (status.error) {
          setError(status.error);
          return;
        }

        if (!status.completed) {
          setTimeout(pollStatus, 1000);
        }
      };

      pollStatus();
    } catch (err) {
      setUploadStatus('error');
      setError(err instanceof Error ? err.message : 'An error occurred during upload');
    }
  }, []);

  return {
    uploadFile,
    uploadStatus,
    processingStatus,
    error
  };
}