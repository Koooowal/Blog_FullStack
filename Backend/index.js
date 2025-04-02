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

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(cookieParser());
app.use(express.json());

// Initialize ImageKit
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.VITE_URL_IK_ENDPOINT
});

// Configure multer for temporary file storage
const storage = multer.memoryStorage(); // Store file in memory
const upload = multer({ storage });

// ImageKit upload endpoint
app.post('/api/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    // Convert buffer to base64
    const fileStr = req.file.buffer.toString('base64');
    
    // Upload to ImageKit
    const result = await imagekit.upload({
      file: fileStr,
      fileName: `${Date.now()}-${req.file.originalname}`,
      folder: '/blog-uploads/'
    });

    // Return the file URL for storage in the database
    return res.status(200).json(result.url);
  } catch (error) {
    console.error('Error uploading to ImageKit:', error);
    return res.status(500).json({ error: 'Failed to upload image' });
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