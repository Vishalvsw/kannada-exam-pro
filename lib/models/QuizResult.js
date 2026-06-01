import mongoose from 'mongoose';

const QuizResultSchema = new mongoose.Schema({
  userId: { type: String },
  userName: { type: String },
  instagramId: { type: String },
  score: { type: Number },
  totalQuestions: { type: Number },
  percentage: { type: Number },
  timeFormatted: { type: String },
  date: { type: Date, default: Date.now }
});

export default mongoose.models.QuizResult || mongoose.model('QuizResult', QuizResultSchema);
