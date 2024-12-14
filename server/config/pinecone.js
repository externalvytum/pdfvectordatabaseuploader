import { Pinecone } from '@pinecone-database/pinecone';

let pineconeInstance = null;

export async function initPinecone() {
  if (!pineconeInstance) {
    if (!process.env.PINECONE_API_KEY?.startsWith('pcsk_')) {
      throw new Error('Invalid Pinecone API key format. Please check your configuration.');
    }

    pineconeInstance = new Pinecone({
      environment: process.env.PINECONE_ENVIRONMENT,
      apiKey: process.env.PINECONE_API_KEY
    });
  }
  return pineconeInstance;

export async function getPineconeIndex() {
  const client = await initPinecone();
  return client.index(process.env.PINECONE_INDEX_NAME);
}