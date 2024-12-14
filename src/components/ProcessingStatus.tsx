import React from 'react';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import { UploadStatus, ProcessingStep } from '../types';

interface ProcessingStatusProps {
  uploadStatus: UploadStatus;
  processingStatus: ProcessingStep[];
  error: string | null;
}

export function ProcessingStatus({
  uploadStatus,
  processingStatus,
  error
}: ProcessingStatusProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Processing Status</h3>
      
      <div className="space-y-3">
        <StatusItem
          label="File Upload"
          status={uploadStatus}
          completed={uploadStatus === 'completed'}
          error={uploadStatus === 'error'}
        />

        {processingStatus.map((step, index) => (
          <StatusItem
            key={index}
            label={step.name}
            status={step.status}
            completed={step.status === 'completed'}
            error={step.status === 'error'}
          />
        ))}
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
}

interface StatusItemProps {
  label: string;
  status: string;
  completed: boolean;
  error: boolean;
}

function StatusItem({ label, status, completed, error }: StatusItemProps) {
  return (
    <div className="flex items-center space-x-3">
      {completed && <CheckCircle className="w-5 h-5 text-green-500" />}
      {error && <XCircle className="w-5 h-5 text-red-500" />}
      {!completed && !error && <Loader className="w-5 h-5 text-indigo-500 animate-spin" />}
      <span className="text-gray-700">{label}</span>
      <span className="text-sm text-gray-500 capitalize">({status})</span>
    </div>
  );
}