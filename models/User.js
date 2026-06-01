import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
  googleId: { type: String, unique: true, sparse: true },
  instagramId: { type: String, required: true, unique: true },
  profileImage: { type: String },
  role: { type: String, default: 'user', enum: ['user', 'admin', 'moderator'] },
  score: { type: Number, default: 0 },
  totalQuizzesTaken: { type: Number, default: 0 },
  totalCorrectAnswers: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  lastQuizDate: { type: Date },
  badges: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
