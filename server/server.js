import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import auth from './routes/auth.js';
import content from './routes/content.js';
import upload from './routes/upload.js';

const required = ['MONGODB_URI', 'JWT_SECRET'];
for (const key of required) {
  if (!process.env[key]) {
    console.error(`Missing ${key}`);
    process.exit(1);
  }
}

await mongoose.connect(process.env.MONGODB_URI);
const app = express();
const clientUrl =
  process.env.CLIENT_URL || "http://localhost:5173";

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },

    // Required for displaying GridFS PDFs inside the portfolio iframe
    frameguard: false,

    contentSecurityPolicy: {
      directives: {
        frameAncestors: [
          "'self'",
          clientUrl,
        ],
      },
    },
  })
);
app.use(
  cors({
    origin: [
      "https://protfolio-je7m.vercel.app",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.get('/api/health', (_req, res) => res.status(200).send('OK'));
app.use('/api/auth', auth);
app.use('/api/content', content);
app.use('/api/upload', upload);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Something went wrong' });
});
app.listen(process.env.PORT || 5000, () => console.log(`Portfolio API running on port ${process.env.PORT || 5000}`));
