

import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  title_en: { type: String },
  content: { type: String, required: true },
  content_en: { type: String },
  category: { type: String, default: 'General' },
  important: { type: Boolean, default: false },
  createdBy: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Note || mongoose.model('Note', NoteSchema);