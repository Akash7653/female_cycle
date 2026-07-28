import mongoose from 'mongoose';

const aiChatSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
    message: { type: String, required: true },
    metadata: { type: Object, default: {} },
  },
  { timestamps: true },
);

aiChatSchema.index({ user: 1, createdAt: -1 });

export const AIChat = mongoose.model('AIChat', aiChatSchema);
