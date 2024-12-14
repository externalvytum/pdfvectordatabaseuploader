import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';

interface FileUploaderProps {
  onUpload: (file: File) => void;
  disabled?: boolean;
}

export function FileUploader({ onUpload, disabled }: FileUploaderProps) {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (disabled) return;

      const file = e.dataTransfer.files[0];
      if (file && file.type === 'application/pdf') {
        onUpload(file);
      }
    },
    [onUpload, disabled]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && file.type === 'application/pdf') {
        onUpload(file);
      }
    },
    [onUpload]
  );

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className={`border-2 border-dashed rounded-lg p-8 text-center ${
        disabled ? 'border-gray-300 bg-gray-50' : 'border-indigo-300 hover:border-indigo-400'
      }`}
    >
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileInput}
        className="hidden"
        id="file-upload"
        disabled={disabled}
      />
      <label
        htmlFor="file-upload"
        className={`flex flex-col items-center ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <Upload className={`w-12 h-12 mb-4 ${disabled ? 'text-gray-400' : 'text-indigo-500'}`} />
        <p className={`text-lg mb-2 ${disabled ? 'text-gray-400' : 'text-gray-700'}`}>
          Drag and drop your PDF here, or click to select
        </p>
        <p className={`text-sm ${disabled ? 'text-gray-400' : 'text-gray-500'}`}>
          Only PDF files are accepted
        </p>
      </label>
    </div>
  );
}