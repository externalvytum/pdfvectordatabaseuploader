const processingStatus = new Map();

export function initializeProcessingStatus(fileName) {
  processingStatus.set(fileName, {
    completed: false,
    steps: [
      { name: 'PDF Text Extraction', status: 'waiting' },
      { name: 'Creating Embeddings', status: 'waiting' },
      { name: 'Storing in Pinecone', status: 'waiting' }
    ],
    error: null
  });
}

export function updateProcessingStatus(fileName, stepName, status) {
  const currentStatus = processingStatus.get(fileName);
  if (!currentStatus) return;

  const updatedSteps = currentStatus.steps.map(step => 
    step.name === stepName ? { ...step, status } : step
  );

  const allCompleted = updatedSteps.every(step => step.status === 'completed');

  processingStatus.set(fileName, {
    ...currentStatus,
    completed: allCompleted,
    steps: updatedSteps
  });
}

export function setProcessingError(fileName, error) {
  const currentStatus = processingStatus.get(fileName);
  if (!currentStatus) return;
  
  const errorMessage = error.message.includes('API key') 
    ? error.message 
    : 'An error occurred during processing. Please check the server logs.';

  processingStatus.set(fileName, {
    ...currentStatus,
    completed: true,
    error: errorMessage,
    steps: currentStatus.steps.map(step => ({
      ...step,
      status: 'error'
    }))
  });
}

export function getProcessingStatus(fileName) {
  return processingStatus.get(fileName);
}