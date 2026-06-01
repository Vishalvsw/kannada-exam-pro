import mongoose from 'mongoose';

const QAQuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  question_en: { type: String },
  answer: { type: String, required: true },
  answer_en: { type: String },
  explanation: { type: String },
  category: { type: String, default: 'General' },
  important: { type: Boolean, default: false },
  examType: { type: String, default: 'KPSC' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.QAQuestion || mongoose.model('QAQuestion', QAQuestionSchema);