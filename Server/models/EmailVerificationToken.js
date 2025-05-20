import mongoose from 'mongoose';

const EmailVerificationTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: '1h' }, // Token expires after 1 hour
});

export const EmailVerificationToken = mongoose.model('EmailVerificationToken', EmailVerificationTokenSchema);
