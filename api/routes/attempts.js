import express from 'express';
import Attempt from '../models/Attempt.js';
import Drill from '../models/Drill.js';
import { requireAuth } from '../middlewares/auth.js';
const router = express.Router();

function computeScore(drill, answers) {
  let matches = 0, keywordsTotal = 0;
  for (const q of drill.questions) {
    const ansObj = answers.find(a => a.questionId === q.id) || { answer: '' };
    const text = (ansObj.answer || '').toLowerCase();
    for (const kw of q.keywords || []) {
      keywordsTotal++;
      if (text.includes(kw.toLowerCase())) matches++;
    }
  }
  return keywordsTotal === 0 ? 0 : Math.round((matches / keywordsTotal) * 100);
}

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { drillId, answers } = req.body;
    const drill = await Drill.findById(drillId);
    if (!drill) return res.status(404).json({ error: 'drill not found' });

    const score = computeScore(drill, answers);
    const attempt = await Attempt.create({
      userId: req.user.id,
      drillId,
      answers,
      score
    });
    res.json({ score, attemptId: attempt._id });
  } catch (e) { next(e); }
});

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const limit = Math.min(50, Number(req.query.limit) || 5);
    const attempts = await Attempt.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(limit).lean();
    res.json(attempts);
  } catch (e) { next(e); }
});

export default router;
