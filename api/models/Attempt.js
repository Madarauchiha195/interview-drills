import mongoose from 'mongoose';

const attemptSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true,
    index: true
  },
  drillId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Drill',
    required: true,
    index: true
  },
  answers: {
    type: Map,
    of: String,
    required: true
  },
  score: { 
    type: Number, 
    required: true,
    min: 0,
    max: 100
  },
  totalQuestions: {
    type: Number,
    required: true,
    min: 1
  },
  correctAnswers: {
    type: Number,
    required: true,
    min: 0
  },
  timeSpent: {
    type: Number,
    default: 0,
    min: 0
  },
  completed: {
    type: Boolean,
    default: true
  },
  createdAt: { 
    type: Date, 
    default: Date.now,
    index: true
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Update timestamp on save
attemptSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Compound indexes for efficient queries
attemptSchema.index({ userId: 1, createdAt: -1 });
attemptSchema.index({ userId: 1, drillId: 1, createdAt: -1 });
attemptSchema.index({ drillId: 1, score: -1 });

// Virtual for percentage score
attemptSchema.virtual('percentage').get(function() {
  return this.score;
});

// Ensure virtuals are included in JSON output
attemptSchema.set('toJSON', { virtuals: true });
attemptSchema.set('toObject', { virtuals: true });

export default mongoose.models.Attempt || mongoose.model('Attempt', attemptSchema);
