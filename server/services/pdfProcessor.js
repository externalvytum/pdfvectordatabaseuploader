import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { getPineconeIndex } from '../config/pinecone.js';
import { createEmbeddings } from './embeddings.js';
import { updateProcessingStatus } from '../utils/status.js';

import { unlink } from 'fs/promises';

export async function processUploadedPDF(filePath, fileName) {
  try {
    // Load and parse PDF
    updateProcessingStatus(fileName, 'PDF Text Extraction', 'processing');
    const loader = new PDFLoader(filePath);
    const docs = await loader.load();
    updateProcessingStatus(fileName, 'PDF Text Extraction', 'completed');

    // Split text into chunks
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const chunks = await textSplitter.splitDocuments(docs);

    // Create embeddings
    try {
      updateProcessingStatus(fileName, 'Creating Embeddings', 'processing');
      const vectors = await createEmbeddings(chunks, fileName);
      updateProcessingStatus(fileName, 'Creating Embeddings', 'completed');

      // Store in Pinecone
      updateProcessingStatus(fileName, 'Storing in Pinecone', 'processing');
      const index = await getPineconeIndex();
      await index.upsert({
        vectors,
      });
      updateProcessingStatus(fileName, 'Storing in Pinecone', 'completed');
    } catch (error) {
      console.error('Processing error:', error);
      throw error;
    }

    // Clean up uploaded file
    try {
      await unlink(filePath);
    } catch (error) {
      console.error('Error cleaning up file:', error);
    }
    
    return true;
  } catch (error) {
    console.error('Error processing PDF:', error);
    throw error;
  } 
}