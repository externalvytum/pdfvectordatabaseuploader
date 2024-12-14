import React from 'react';
import { Upload, FileText, CheckCircle, XCircle } from 'lucide-react';
import { FileUploader } from './components/FileUploader';
import { ProcessingStatus } from './components/ProcessingStatus';
import { useFileUpload } from './hooks/useFileUpload';

function App() {
  const {
    uploadFile,
    uploadStatus,
    processingStatus,
    error
  } = useFileUpload();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <FileText className="w-16 h-16 text-indigo-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              PDF Vector Database Uploader
            </h1>
            <p className="text-lg text-gray-600">
              Upload PDFs to be processed and stored in your Pinecone vector database
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <FileUploader onUpload={uploadFile} disabled={uploadStatus === 'uploading'} />
          </div>

          {(uploadStatus !== 'idle' || processingStatus.length > 0) && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <ProcessingStatus
                uploadStatus={uploadStatus}
                processingStatus={processingStatus}
                error={error}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
