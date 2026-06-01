import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  question_en: { type: String },
  options: { type: [String], required: true },
  answer: { type: String, required: true },
  category: { type: String, default: 'General' },
  subcategory: { type: String },
  difficulty: { type: String, default: 'medium', enum: ['easy', 'medium', 'hard'] },
  explanation: { type: String },
  explanation_en: { type: String },
  points: { type: Number, default: 1 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Question || mongoose.model('Question', QuestionSchema);
