import express from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import { processUploadedPDF } from './services/pdfProcessor.js';
import { initializeProcessingStatus, getProcessingStatus, setProcessingError } from './utils/status.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const uploadsDir = join(__dirname, '../uploads');
const upload = multer({ dest: uploadsDir });
const staticDir = process.env.NODE_ENV === 'production' 
  ? join(__dirname, '..') : join(__dirname, '../dist');

app.use(cors());
app.use(express.json());

// Ensure uploads directory exists
import { mkdirSync } from 'fs';
mkdirSync(uploadsDir, { recursive: true });

app.post('/upload', upload.single('pdf'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No PDF file uploaded' });
  }

  const fileName = req.file.originalname;
  initializeProcessingStatus(fileName);

  // Process PDF in background
  processUploadedPDF(req.file.path, fileName)
    .catch(error => setProcessingError(fileName, error));

  res.json({ message: 'Upload received, processing started' });
});

app.get('/status/:fileName', (req, res) => {
  const status = getProcessingStatus(req.params.fileName);
  if (!status) {
    return res.status(404).json({ error: 'File not found' });
  }
  res.json(status);
});

// Serve static files from the dist folder
app.use(express.static(staticDir));

// Handle client-side routing - must be after API routes
app.get('*', (req, res) => {
  res.sendFile('index.html', { root: staticDir });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});