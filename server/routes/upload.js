import { Router } from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    const allowed = file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf';
    callback(allowed ? null : new Error('Only images and PDF files are permitted'), allowed);
  },
});

function bucket() {
  return new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'portfolioFiles' });
}

router.post('/', requireAuth, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Choose an image or PDF file' });
  const stream = bucket().openUploadStream(req.file.originalname, {
    metadata: { contentType: req.file.mimetype, originalName: req.file.originalname },
  });
  stream.on('error', (error) => {
    console.error('GridFS upload failed:', error);
    if (!res.headersSent) res.status(500).json({ error: 'File upload failed' });
  });
  stream.on('finish', () => {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    res.status(201).json({
      url: `${baseUrl}/api/upload/${stream.id}`,
      publicId: stream.id.toString(),
      fileId: stream.id.toString(),
      resourceType: req.file.mimetype === 'application/pdf' ? 'raw' : 'image',
      originalName: req.file.originalname,
    });
  });
  stream.end(req.file.buffer);
});

router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ error: 'Invalid file ID' });
    const fileId = new mongoose.Types.ObjectId(req.params.id);
    const store = bucket();
    const file = await store.find({ _id: fileId }).next();
    if (!file) return res.status(404).json({ error: 'File not found' });
    const originalName = file.metadata?.originalName || file.filename || 'download';
    const safeName = originalName.replace(/[^a-zA-Z0-9._-]/g, '_');
    res.setHeader('Content-Type', file.metadata?.contentType || 'application/octet-stream');
    res.setHeader('Content-Disposition', `${req.query.download === '1' ? 'attachment' : 'inline'}; filename="${safeName}"`);
    store.openDownloadStream(fileId).on('error', (error) => {
      console.error('GridFS download failed:', error);
      if (!res.headersSent) res.status(500).end();
    }).pipe(res);
  } catch (error) {
    console.error('GridFS file error:', error);
    if (!res.headersSent) res.status(500).json({ error: 'Unable to retrieve file' });
  }
});

export default router;
