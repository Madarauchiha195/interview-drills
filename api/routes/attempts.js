import express from 'express';
import Attempt from '../models/Attempt.js';
import Drill from '../models/Drill.js';
import { requireAuth } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { submitAttemptSchema, attemptIdSchema } from '../validation/attempt.js';
import mongoose from 'mongoose';

const router = express.Router();

// Calculate score based on correct answers
function computeScore(drill, answers) {
  if (!drill || !drill.questions || !answers) return 0;
  
  let correctAnswers = 0;
  const totalQuestions = drill.questions.length;
  
  drill.questions.forEach((question) => {
    const userAnswer = answers[question.id];
    if (userAnswer && userAnswer === question.correctAnswer) {
      correctAnswers++;
    }
  });
  
  return Math.round((correctAnswers / totalQuestions) * 100);
}

// Submit a new drill attempt
router.post('/', requireAuth, validate(submitAttemptSchema), async (req, res, next) => {
  try {
    const { drillId, answers, timeSpent } = req.body;

    // Find the drill
    const drill = await Drill.findById(drillId);
    if (!drill) {
      return res.status(404).json({ error: 'Drill not found' });
    }

    // Calculate score
    const score = computeScore(drill, answers);
    const totalQuestions = drill.questions.length;
    const correctAnswers = Object.keys(answers).filter(key => {
      const question = drill.questions.find(q => q.id === key);
      return question && answers[key] === question.correctAnswer;
    }).length;

    // Create the attempt
    const attempt = await Attempt.create({
      userId: req.user.id,
      drillId,
      answers,
      score,
      totalQuestions,
      correctAnswers,
      timeSpent: timeSpent || 0,
      completed: true
    });

    // Populate drill information for response
    await attempt.populate('drillId', 'title difficulty');

    res.status(201).json({
      success: true,
      attempt: {
        _id: attempt._id,
        score,
        totalQuestions,
        correctAnswers,
        timeSpent: attempt.timeSpent,
        createdAt: attempt.createdAt,
        drillId: {
          _id: drill._id,
          title: drill.title,
          difficulty: drill.difficulty
        }
      }
    });

  } catch (error) {
    console.error('Error creating attempt:', error);
    next(error);
  }
});

// Get user's attempt history
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const limit = Math.min(100, Number(req.query.limit) || 20);
    const page = Math.max(1, Number(req.query.page) || 1);
    const skip = (page - 1) * limit;

    // Get attempts with drill information
    const attempts = await Attempt.find({ userId: req.user.id })
      .populate('drillId', 'title difficulty tags')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const totalAttempts = await Attempt.countDocuments({ userId: req.user.id });

    res.json({
      attempts,
      pagination: {
        page,
        limit,
        total: totalAttempts,
        pages: Math.ceil(totalAttempts / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching attempts:', error);
    next(error);
  }
});

// Get attempt statistics
router.get('/stats', requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get basic stats
    const totalAttempts = await Attempt.countDocuments({ userId });
    const totalDrills = await Attempt.distinct('drillId', { userId });
    
    if (totalAttempts === 0) {
      return res.json({
        totalAttempts: 0,
        averageScore: 0,
        totalTimeSpent: 0,
        bestScore: 0,
        improvementRate: 0,
        completionRate: 0,
        drillStats: []
      });
    }

    // Aggregate statistics
    const stats = await Attempt.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalAttempts: { $sum: 1 },
          totalScore: { $sum: '$score' },
          totalTimeSpent: { $sum: '$timeSpent' },
          bestScore: { $max: '$score' },
          scores: { $push: '$score' }
        }
      }
    ]);

    const totalScore = stats[0]?.totalScore || 0;
    const totalTimeSpent = stats[0]?.totalTimeSpent || 0;
    const bestScore = stats[0]?.bestScore || 0;
    const averageScore = Math.round(totalScore / totalAttempts);

    // Calculate improvement rate (compare first vs last attempt)
    const firstAttempt = await Attempt.findOne({ userId }).sort({ createdAt: 1 });
    const lastAttempt = await Attempt.findOne({ userId }).sort({ createdAt: -1 });
    
    let improvementRate = 0;
    if (firstAttempt && lastAttempt && firstAttempt.score !== lastAttempt.score) {
      improvementRate = Math.round(((lastAttempt.score - firstAttempt.score) / firstAttempt.score) * 100);
    }

    // Calculate completion rate
    const completedAttempts = await Attempt.countDocuments({ userId, completed: true });
    const completionRate = Math.round((completedAttempts / totalAttempts) * 100);

    // Get drill-wise statistics
    const drillStats = await Attempt.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$drillId',
          attempts: { $sum: 1 },
          totalScore: { $sum: '$score' },
          bestScore: { $max: '$score' },
          averageTime: { $avg: '$timeSpent' }
        }
      },
      {
        $lookup: {
          from: 'drills',
          localField: '_id',
          foreignField: '_id',
          as: 'drillInfo'
        }
      },
      {
        $project: {
          drillId: '$_id',
          drillTitle: { $arrayElemAt: ['$drillInfo.title', 0] },
          difficulty: { $arrayElemAt: ['$drillInfo.difficulty', 0] },
          attempts: 1,
          averageScore: { $round: [{ $divide: ['$totalScore', '$attempts'] }, 0] },
          bestScore: 1,
          averageTime: { $round: ['$averageTime', 0] }
        }
      }
    ]);

    res.json({
      totalAttempts,
      averageScore,
      totalTimeSpent,
      bestScore,
      improvementRate,
      completionRate,
      drillStats
    });

  } catch (error) {
    console.error('Error fetching attempt stats:', error);
    next(error);
  }
});

// Get a specific attempt
router.get('/:id', requireAuth, validate(attemptIdSchema, 'params'), async (req, res, next) => {
  try {
    const attempt = await Attempt.findById(req.params.id)
      .populate('drillId', 'title difficulty questions')
      .lean();

    if (!attempt) {
      return res.status(404).json({ error: 'Attempt not found' });
    }

    if (attempt.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(attempt);

  } catch (error) {
    console.error('Error fetching attempt:', error);
    next(error);
  }
});

export default router;
