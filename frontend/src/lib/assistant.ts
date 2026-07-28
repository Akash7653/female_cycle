import type { Phase } from './types';

interface Rule {
  match: string[];
  suggestions: string[];
}

const RULES: Rule[] = [
  {
    match: ['cramp', 'cramps', 'pain', 'pelvic'],
    suggestions: [
      'Use a warm heating pad on your lower abdomen for 15–20 minutes.',
      'Stay hydrated — aim for your daily water goal.',
      'Try gentle stretching or a short walk to ease tension.',
      'Rest when your body asks for it.',
      'If pain is severe or unusual, consult a healthcare professional.',
    ],
  },
  {
    match: ['headache', 'migraine'],
    suggestions: [
      'Drink water — dehydration often triggers headaches.',
      'Rest in a quiet, dimly lit room.',
      'Try a cool compress on your forehead.',
      'Track triggers like caffeine or screen time.',
    ],
  },
  {
    match: ['mood', 'sad', 'emotional', 'cry', 'anxious', 'anxiety', 'stress', 'stressed'],
    suggestions: [
      'Take 5 slow, deep breaths — in for 4, out for 6.',
      'A short walk outside can reset your nervous system.',
      'Write one line in your journal about how you feel.',
      'Be gentle with yourself — hormones are real.',
    ],
  },
  {
    match: ['fatigue', 'tired', 'exhausted', 'no energy', 'low energy'],
    suggestions: [
      'Honor the rest — your luteal phase naturally lowers energy.',
      'Eat iron-rich foods like spinach, lentils, or dark chocolate.',
      'A 20-minute nap can restore focus.',
      'Skip the intense workout; choose restorative yoga.',
    ],
  },
  {
    match: ['bloat', 'bloating', 'water weight'],
    suggestions: [
      'Reduce salty foods and carbonated drinks today.',
      'Sip warm ginger or peppermint tea.',
      'Light movement helps lymph flow.',
    ],
  },
  {
    match: ['sleep', 'insomnia', 'cant sleep', "can't sleep"],
    suggestions: [
      'Dim screens an hour before bed.',
      'A warm shower before sleep relaxes muscles.',
      'Try a 4-7-8 breathing exercise.',
    ],
  },
  {
    match: ['nausea', 'sick', 'vomit', 'throw up'],
    suggestions: [
      'Sip ginger tea or chew a small piece of crystallized ginger.',
      'Eat small, bland meals through the day.',
      'Avoid strong smells and greasy foods.',
      'If nausea persists, contact your doctor.',
    ],
  },
  {
    match: ['late', 'missed', 'delayed', 'pregnant', 'pregnancy'],
    suggestions: [
      'Stress, travel, and illness can delay a period.',
      'Take a pregnancy test if you are sexually active.',
      'Track when symptoms began and note any changes.',
      'If your cycle is over 45 days, consult a clinician.',
    ],
  },
  {
    match: ['water', 'hydrate', 'thirsty'],
    suggestions: [
      'Aim for 8 glasses today — add cucumber or mint for taste.',
      'Keep a bottle within arm’s reach.',
      'Log each glass in your Water Tracker.',
    ],
  },
  {
    match: ['acne', 'skin', 'breakout'],
    suggestions: [
      'Cleanse gently twice daily; avoid over-exfoliating.',
      'Reduce dairy and refined sugar this week.',
      'Change pillowcases frequently during your period.',
    ],
  },
];

const DEFAULT_RESPONSE = [
  'I hear you. Tell me a bit more — cramps, mood, sleep, energy?',
  'Logging your symptoms daily helps me give better suggestions.',
  'Remember: I offer general wellness info, not medical advice.',
];

export function getAssistantReply(message: string): { text: string; suggestions: string[] } {
  const lower = message.toLowerCase();
  for (const rule of RULES) {
    if (rule.match.some((m) => lower.includes(m))) {
      return {
        text: "Here are a few gentle suggestions for you. 💗",
        suggestions: rule.suggestions,
      };
    }
  }
  return {
    text: DEFAULT_RESPONSE[0],
    suggestions: DEFAULT_RESPONSE.slice(1),
  };
}

export const ASSISTANT_DISCLAIMER =
  'SkyLove AI provides general wellness information and is not a substitute for professional medical advice.';

export function phaseTip(phase: Phase): string {
  switch (phase) {
    case 'menstrual':
      return 'Rest, hydrate, and be gentle with yourself today.';
    case 'follicular':
      return 'Energy is rising — a great day to start something new.';
    case 'ovulation':
      return 'You may feel confident and social today. Enjoy it!';
    case 'luteal':
      return 'Slow down, nourish yourself, and listen to your body.';
  }
}
