import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: { type: [String], required: true },
  answer: { type: String, required: true },
  category: { type: String, default: 'General' },
  difficulty: { type: String, default: 'medium' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Question || mongoose.model('Question', QuestionSchema);
