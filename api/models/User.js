import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  name: String,
  picture: String,
  providers: [String],
  createdAt: { type: Date, default: Date.now }
});
export default mongoose.models.User || mongoose.model('User', schema);
