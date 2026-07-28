import { env } from '../config/env.js';

const GROK_API_URL = 'https://api.grok.ai/v1/responses';

function buildSystemPrompt(user) {
  const profileLabel = user.accountType === 'loved-one' ? 'Loved one support profile' : 'Personal wellness profile';
  return `You are SkyLove Cycle, a premium menstrual wellness assistant. You answer kind, calm, and evidence-based questions about periods, PMS, ovulation, pregnancy awareness, symptoms, nutrition, exercise, mental health, menstrual hygiene, and fertility awareness. Always include a disclaimer that this is general wellness information and not a substitute for professional medical advice.

User profile summary:
- Name: ${user.name}
- Account type: ${profileLabel}
- Relationship: ${user.relationship || 'Self'}
- Cycle length: ${user.cycleLength || 28} days
- Period length: ${user.periodLength || 5} days

When you answer, keep the tone supportive, premium, and calm. If the user asks diagnostic medical questions, defer to a medical professional.`;
}

function parseGrokText(response) {
  if (!response) return '';
  if (typeof response === 'string') return response;

  if (response.output_text) return response.output_text;
  if (Array.isArray(response.output)) {
    const outputBlock = response.output.find((block) => block?.type === 'output_text');
    if (outputBlock?.content?.[0]?.text) return outputBlock.content[0].text;
    if (outputBlock?.text) return outputBlock.text;
  }
  return JSON.stringify(response);
}

export async function generateGrokResponse(user, message) {
  if (!env.GROK_API_KEY) {
    return `Hi there. I’m your SkyLove companion. I can help with cycle tracking, period care, hydration, and mood support. Please paste your Grok API key in the backend environment variable GROK_API_KEY to enable live assistant responses. ${user ? `

You asked: ${message}` : ''}`;
  }

  const prompt = `${buildSystemPrompt(user)}\n\nUser message:\n${message}`;

  try {
    const resp = await fetch(GROK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.GROK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'grok-1',
        input: prompt,
        temperature: 0.65,
        max_output_tokens: 400,
      }),
    });

    if (!resp.ok) {
      const errorText = await resp.text();
      console.error('Grok API error', resp.status, errorText);
      return 'SkyLove is having trouble reaching the wellness assistant right now. Please try again in a moment.';
    }

    const data = await resp.json();
    return parseGrokText(data);
  } catch (error) {
    console.error('Grok integration failed', error);
    return 'SkyLove is unable to connect to the assistant service at the moment. If you have not set GROK_API_KEY, add it to your backend environment variables.';
  }
}
