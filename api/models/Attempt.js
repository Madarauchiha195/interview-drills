import mongoose from 'mongoose';
const a = new mongoose.Schema({ questionId: String, answer: String });
const schema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  drillId: { type: mongoose.Schema.Types.ObjectId, ref: 'Drill' },
  answers: [a],
  score: Number,
  createdAt: { type: Date, default: Date.now }
});
schema.index({ userId: 1, createdAt: -1 });
export default mongoose.models.Attempt || mongoose.model('Attempt', schema);
