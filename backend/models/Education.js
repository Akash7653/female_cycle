import mongoose from 'mongoose';

const educationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    section: { type: String, default: '' },
    content: { type: String, required: true },
    tags: [{ type: String }],
    featured: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Education = mongoose.model('Education', educationSchema);
