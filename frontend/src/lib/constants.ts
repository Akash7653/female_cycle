import type { FlowLevel, MoodType, Phase } from './types';

export const SYMPTOMS = [
  'Headache',
  'Back Pain',
  'Cramps',
  'Fatigue',
  'Acne',
  'Bloating',
  'Nausea',
  'Mood Swings',
  'Stress',
  'Anxiety',
  'Constipation',
  'Diarrhea',
  'Food Cravings',
  'Breast Tenderness',
  'Sleep Issues',
] as const;

export const FLOW_OPTIONS: { value: FlowLevel; label: string; color: string }[] = [
  { value: 'light', label: 'Light', color: '#FF9DBE' },
  { value: 'medium', label: 'Medium', color: '#FF6B9A' },
  { value: 'heavy', label: 'Heavy', color: '#E0296A' },
  { value: 'very_heavy', label: 'Very Heavy', color: '#931843' },
];

export const MOODS: { value: MoodType; label: string; emoji: string; color: string }[] = [
  { value: 'happy', label: 'Happy', emoji: '😊', color: '#FFD54F' },
  { value: 'loved', label: 'Loved', emoji: '😍', color: '#FF6B9A' },
  { value: 'neutral', label: 'Neutral', emoji: '😐', color: '#C9A7EB' },
  { value: 'sad', label: 'Sad', emoji: '😢', color: '#87CEEB' },
  { value: 'emotional', label: 'Emotional', emoji: '😭', color: '#B384DE' },
  { value: 'angry', label: 'Angry', emoji: '😡', color: '#EF5350' },
  { value: 'tired', label: 'Tired', emoji: '😴', color: '#81C784' },
  { value: 'sick', label: 'Sick', emoji: '🤒', color: '#5BB6DA' },
];

export const PHASE_INFO: Record<Phase, { label: string; color: string; emoji: string; desc: string }> = {
  menstrual: { label: 'Menstrual', color: '#FF6B9A', emoji: '🌙', desc: 'Rest and nurture your body.' },
  follicular: { label: 'Follicular', color: '#C9A7EB', emoji: '🌱', desc: 'Energy rising. A great time for new ideas.' },
  ovulation: { label: 'Ovulation', color: '#87CEEB', emoji: '✨', desc: 'Peak energy and confidence.' },
  luteal: { label: 'Luteal', color: '#FFD54F', emoji: '🍂', desc: 'Slow down and listen to your needs.' },
};

export const SEASONAL_FLOWERS = [
  { season: 'Spring', name: 'Cherry Blossom', emoji: '🌸' },
  { season: 'Summer', name: 'Sunflower', emoji: '🌻' },
  { season: 'Autumn', name: 'Cosmos', emoji: '🌼' },
  { season: 'Winter', name: 'Camellia', emoji: '🌺' },
  { season: 'Special', name: 'Moon Orchid', emoji: '兰花' },
];

export const WATER_GOAL_DEFAULT = 8;

export const TESTIMONIALS = [
  {
    name: 'Aisha K.',
    text: 'SkyLove feels like a soft landing every morning. The Memory Garden makes my cycles feel meaningful, not burdensome.',
    role: 'Designer, 27',
  },
  {
    name: 'Mariana L.',
    text: 'The predictions are scarily accurate and the privacy-first design gives me peace of mind I never had with other apps.',
    role: 'Nurse, 31',
  },
  {
    name: 'Priya S.',
    text: 'I love the AI assistant. It gently reminds me to hydrate and rest without ever being preachy. Beautiful, kind, useful.',
    role: 'Teacher, 24',
  },
];

export const FAQS = [
  {
    q: 'Is my data private?',
    a: 'Yes. Everything is encrypted in transit and at rest. You can export or delete your data at any time. Partner sharing is off by default and you control every detail.',
  },
  {
    q: 'How does cycle prediction work?',
    a: 'We use your last three cycles to estimate your next period, ovulation, and fertile window. Predictions improve as you log more data.',
  },
  {
    q: 'Is the AI assistant a doctor?',
    a: 'No. The assistant offers general wellness suggestions and is not a substitute for professional medical advice.',
  },
  {
    q: 'Can I use it offline?',
    a: 'SkyLove is a Progressive Web App — install it on your phone and your most recent data stays available offline.',
  },
  {
    q: 'What is the Memory Garden?',
    a: 'Each completed cycle grows a unique flower in your garden, marking your wellness journey across seasons.',
  },
];
