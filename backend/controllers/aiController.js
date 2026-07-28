import { AIChat } from '../models/AIChat.js';
import { generateGrokResponse } from '../services/aiService.js';

export async function getAIHistory(req, res) {
  const history = await AIChat.find({ user: req.user._id }).sort({ createdAt: 1 });
  res.json({ history });
}

export async function createAIResponse(req, res) {
  const { message } = req.body;
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ message: 'Message is required.' });
  }

  const userMessage = await AIChat.create({
    user: req.user._id,
    role: 'user',
    message,
    metadata: { source: 'assistant' },
  });

  const response = await generateGrokResponse(req.user, message);

  const assistantMessage = await AIChat.create({
    user: req.user._id,
    role: 'assistant',
    message: response,
    metadata: { source: 'assistant' },
  });

  res.json({ userMessage, assistantMessage, response });
}
