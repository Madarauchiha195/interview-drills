import mongoose from 'mongoose';
const q = new mongoose.Schema({ id: String, prompt: String, keywords: [String] });
const schema = new mongoose.Schema({
  title: String,
  difficulty: { type: String, enum: ['easy','medium','hard'] },
  tags: [String],
  questions: [q],
  createdAt: { type: Date, default: Date.now }
});
export default mongoose.models.Drill || mongoose.model('Drill', schema);
