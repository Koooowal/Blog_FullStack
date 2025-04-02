import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import postRoutes from './routes/posts.route.js';
import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/users.route.js';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import ImageKit from 'imagekit';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize ImageKit
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(cookieParser());
app.use(express.json());

// Configure multer for memory storage (not disk)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ImageKit upload endpoint
app.post('/api/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    // Generate a unique file name
    const fileName = `${Date.now()}-${req.file.originalname.replace(/\s/g, '_')}`;
    
    // Convert buffer to base64
    const fileBuffer = req.file.buffer;
    const fileBase64 = fileBuffer.toString('base64');
    
    // Upload to ImageKit
    const uploadResponse = await imagekit.upload({
      file: fileBase64,
      fileName: fileName,
      folder: '/blog-posts'
    });
    
    // Return the ImageKit file path to be stored in the database
    res.status(200).json(uploadResponse.filePath);
  } catch (error) {
    console.error('ImageKit upload error:', error);
    res.status(500).json({ error: 'Failed to upload to ImageKit' });
  }
});

// Routes
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});