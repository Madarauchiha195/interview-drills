// api/routes/cache-stats.js
import express from 'express';
import { getCacheStats } from '../utils/cache.js';
import { requireAuth } from '../middlewares/auth.js';

const router = express.Router();

// GET /api/cache-stats
router.get('/', requireAuth, (req, res) => {
  const stats = getCacheStats();
  res.json(stats);
});

export default router;