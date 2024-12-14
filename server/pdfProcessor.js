import { PineconeClient } from '@pinecone-database/pinecone';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

const pinecone = new PineconeClient();

async function initPinecone() {
  await pinecone.init({
    environment: process.env.PINECONE_ENVIRONMENT,
    apiKey: process.env.PINECONE_API_KEY,
  });
}

export async function processUploadedPDF(filePath, fileName) {
  try {
    // Initialize Pinecone client
    await initPinecone();
    const index = pinecone.Index(process.env.PINECONE_INDEX_NAME);

    // Load and parse PDF
    const loader = new PDFLoader(filePath);
    const docs = await loader.load();

    // Split text into chunks
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const chunks = await textSplitter.splitDocuments(docs);

    // Create embeddings
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    // Process chunks and store in Pinecone
    const vectors = await Promise.all(
      chunks.map(async (chunk, i) => {
        const embedding = await embeddings.embedQuery(chunk.pageContent);
        return {
          id: `${fileName}-${i}`,
          values: embedding,
          metadata: {
            text: chunk.pageContent,
            source: fileName,
            page: chunk.metadata.page,
          },
        };
      })
    );

    // Upsert vectors to Pinecone
    await index.upsert({
      upsertRequest: {
        vectors,
      },
    });

    return true;
  } catch (error) {
    console.error('Error processing PDF:', error);
    throw error;
  }
}