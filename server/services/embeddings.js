import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { updateProcessingStatus } from '../utils/status.js';

export async function createEmbeddings(chunks, fileName) {
  try {
    if (!process.env.OPENAI_API_KEY?.startsWith('sk-')) {
      throw new Error('Invalid OpenAI API key format. Please check your configuration.');
    }

    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    return Promise.all(
      chunks.map(async (chunk, i) => {
        const embedding = await embeddings.embedQuery(chunk.pageContent);
        return {
          id: `${chunk.metadata.source}-${i}`,
          values: embedding,
          metadata: {
            text: chunk.pageContent,
            source: chunk.metadata.source,
            page: chunk.metadata.page,
          },
        };
      })
    );
  } catch (error) {
    updateProcessingStatus(fileName, 'Creating Embeddings', 'error');
    throw new Error(`Embedding creation failed: ${error.message}`);
  }
}