import mongoose from 'mongoose';

const QuizResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  instagramId: { type: String, required: true },
  userName: { type: String },
  userEmail: { type: String },
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  percentage: { type: Number, required: true },
  timeTaken: { type: Number },
  timeFormatted: { type: String },
  answers: { type: Array },
  correctAnswers: { type: Number },
  wrongAnswers: { type: Number },
  category: { type: String, default: 'General' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.QuizResult || mongoose.model('QuizResult', QuizResultSchema);
