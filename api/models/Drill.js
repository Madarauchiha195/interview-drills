import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  id: { 
    type: String, 
    required: true 
  },
  prompt: { 
    type: String, 
    required: true 
  },
  options: [{
    id: { type: String, required: true },
    text: { type: String, required: true }
  }],
  correctAnswer: { 
    type: String, 
    required: true 
  },
  points: { 
    type: Number, 
    default: 1 
  },
  explanation: String,
  keywords: [String]
});

const drillSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true
  },
  description: { 
    type: String,
    trim: true
  },
  difficulty: { 
    type: String, 
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  category: {
    type: String,
    trim: true
  },
  tags: [String],
  questions: [questionSchema],
  totalPoints: {
    type: Number,
    default: 0
  },
  timeLimit: {
    type: Number, // in seconds
    default: 900 // 15 minutes
  },
  instructions: String,
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Update timestamp on save
drillSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Calculate total points
  if (this.questions && this.questions.length > 0) {
    this.totalPoints = this.questions.reduce((sum, q) => sum + (q.points || 1), 0);
  }
  
  next();
});

// Indexes for efficient queries
drillSchema.index({ difficulty: 1, isActive: 1 });
drillSchema.index({ tags: 1 });
drillSchema.index({ category: 1 });
drillSchema.index({ createdAt: -1 });

// Virtual for question count
drillSchema.virtual('questionCount').get(function() {
  return this.questions ? this.questions.length : 0;
});

// Ensure virtuals are included in JSON output
drillSchema.set('toJSON', { virtuals: true });
drillSchema.set('toObject', { virtuals: true });

export default mongoose.models.Drill || mongoose.model('Drill', drillSchema);
