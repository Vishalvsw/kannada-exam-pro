import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true },
  instagramId: { type: String, unique: true, required: true },
  profileImage: { type: String },
  score: { type: Number, default: 0 },
  totalQuizzesTaken: { type: Number, default: 0 },
  lastQuizDate: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
