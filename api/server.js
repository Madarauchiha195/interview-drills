import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { connectDB } from './utils/db.js';
import drillsRouter from './routes/drills.js';
import attemptsRouter from './routes/attempts.js';
import authRouter from './routes/auth.js';
import meRouter from './routes/me.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(helmet());
app.use(morgan('dev'));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(cors({ origin: process.env.WEB_ORIGIN, credentials: true }));
app.use(rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 300000),
  max: Number(process.env.RATE_LIMIT_MAX || 100)
}));

// simple root
app.get('/', (req,res) => res.send('API up — try GET /api/health'));
app.get('/api/health', (req,res) => res.json({ ok: true }));

// routes
app.use('/auth', authRouter);
app.use('/api/drills', drillsRouter);
app.use('/api/attempts', attemptsRouter);
app.use('/api/me', meRouter);

// generic error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'internal server error' });
});

await connectDB(process.env.MONGO_URI);
app.listen(PORT, '0.0.0.0', () => console.log(`API listening on ${PORT}`));
