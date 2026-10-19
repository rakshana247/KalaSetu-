import express, { Request, Response } from 'express';
import multer from 'multer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { analyzeProductImage, refineArtisanStory, analyzeVoiceDescription } from './server/gemini.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Enable comprehensive CORS with credentials support for iframe preview environments
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-goog-api-key, Cache-Control'
  );
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// Body parsing middleware
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Multer memory storage configuration (up to 10MB)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
  fileFilter: (_req, file, cb) => {
    const isImage =
      file.mimetype.startsWith('image/') ||
      /\.(jpe?g|png|webp|gif|heic|jfif)$/i.test(file.originalname || '');
    if (isImage) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type: ${file.mimetype}. Please upload a JPG, PNG, WEBP, or HEIC image.`));
    }
  },
});

// API health endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    app: 'KalaSetu AI',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'),
    timestamp: new Date().toISOString(),
  });
});

// Photo-to-Catalogue endpoint supporting multipart/form-data, JSON base64, and imageUrl
app.post(
  '/api/catalogue/analyze-photo',
  (req, res, next) => {
    const contentType = req.headers['content-type'] || '';
    if (contentType.includes('multipart/form-data')) {
      upload.any()(req, res, (err) => {
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ success: false, error: 'File size exceeds 10MB limit. Please upload a smaller image.' });
          }
          return res.status(400).json({ success: false, error: `Upload error: ${err.message}` });
        } else if (err) {
          return res.status(400).json({ success: false, error: err.message });
        }
        next();
      });
    } else {
      next();
    }
  },
  async (req: Request, res: Response) => {
    try {
      let buffer: Buffer | null = null;
      let mimeType = 'image/jpeg';

      // Check uploaded file from multipart (support field names: image, file, photo, etc.)
      const files = req.files as Express.Multer.File[] | undefined;
      const uploadedFile = (files && files.length > 0) ? files[0] : req.file;

      if (uploadedFile) {
        buffer = uploadedFile.buffer;
        mimeType = uploadedFile.mimetype || 'image/jpeg';
        if (mimeType === 'application/octet-stream') {
          if (uploadedFile.originalname?.endsWith('.png')) mimeType = 'image/png';
          else if (uploadedFile.originalname?.endsWith('.webp')) mimeType = 'image/webp';
          else mimeType = 'image/jpeg';
        }
      } else if (req.body && req.body.image) {
        const raw = String(req.body.image);
        if (raw.startsWith('data:')) {
          const match = raw.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
          if (match) {
            mimeType = match[1];
            buffer = Buffer.from(match[2], 'base64');
          } else {
            return res.status(400).json({ success: false, error: 'Invalid data URL format for image.' });
          }
        } else {
          buffer = Buffer.from(raw, 'base64');
          if (req.body.mimeType) {
            mimeType = req.body.mimeType;
          }
        }
      } else if (req.body && req.body.imageUrl) {
        const imgRes = await fetch(req.body.imageUrl);
        if (!imgRes.ok) {
          throw new Error(`Failed to load image from remote URL (${imgRes.status}).`);
        }
        const arrayBuf = await imgRes.arrayBuffer();
        buffer = Buffer.from(arrayBuf);
        mimeType = imgRes.headers.get('content-type') || 'image/jpeg';
      }

      if (!buffer || buffer.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'No image provided. Please upload an image file or provide image data.',
        });
      }

      // Analyze image with Gemini
      const analysis = await analyzeProductImage(buffer, mimeType);

      return res.status(200).json({
        success: true,
        data: analysis,
      });
    } catch (err: any) {
      console.error('[KalaSetu AI] Analysis error:', err);
      const message = err?.message || 'Failed to analyze product image with Gemini API.';
      return res.status(500).json({
        success: false,
        error: message,
      });
    }
  }
);

// Story refinement endpoint using Gemini
app.post('/api/artisan/refine-story', async (req: Request, res: Response) => {
  try {
    const { artisan_name, craft_name, location, materials_techniques, story_text, language } = req.body;
    if (!story_text || !artisan_name) {
      return res.status(400).json({
        success: false,
        error: 'Please provide artisan name and draft story text.',
      });
    }

    const result = await refineArtisanStory({
      artisan_name,
      craft_name: craft_name || 'Traditional Craft',
      location: location || 'Craft Cluster',
      materials_techniques: materials_techniques || 'Traditional handmade techniques',
      story_text,
      language: language || 'English',
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err: any) {
    console.error('[KalaSetu AI] Story refinement error:', err);
    return res.status(500).json({
      success: false,
      error: err?.message || 'Failed to refine story with Gemini AI.',
    });
  }
});

// Voice-to-Catalogue endpoint supporting Tamil & English speech transcripts
app.post('/api/catalogue/analyze-voice', async (req: Request, res: Response) => {
  try {
    const { transcript, language } = req.body;
    if (!transcript || typeof transcript !== 'string' || transcript.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid spoken or typed description transcript.',
      });
    }

    const analysis = await analyzeVoiceDescription({
      transcript: transcript.trim(),
      language: language || 'ta',
    });

    return res.status(200).json({
      success: true,
      data: analysis,
    });
  } catch (err: any) {
    console.error('[KalaSetu AI] Voice analysis error:', err);
    return res.status(500).json({
      success: false,
      error: err?.message || 'Failed to process voice description.',
    });
  }
});



async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[KalaSetu AI] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[KalaSetu AI] Fatal server startup error:', err);
  process.exit(1);
});
