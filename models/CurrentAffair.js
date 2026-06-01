import mongoose from 'mongoose';

const CurrentAffairSchema = new mongoose.Schema({
  title: { type: String, required: true },
  title_en: { type: String },
  content: { type: String, required: true },
  content_en: { type: String },
  summary: { type: String },
  category: { type: String, default: 'General' },
  tags: [{ type: String }],
  important: { type: Boolean, default: false },
  image: { type: String },
  source: { type: String },
  date: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.CurrentAffair || mongoose.model('CurrentAffair', CurrentAffairSchema);