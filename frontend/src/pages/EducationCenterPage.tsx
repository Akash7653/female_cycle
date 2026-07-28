import { motion } from 'framer-motion';
import { Search, Bookmark, Sparkles } from 'lucide-react';
import { Card } from '@/components/Card';
import { useMemo, useState } from 'react';

const CONTENT = [
  { title: 'What is a Menstrual Cycle', body: 'The menstrual cycle is a monthly series of changes a woman’s body goes through in preparation for possible pregnancy. It involves hormonal shifts, physical symptoms, and emotional changes. Tracking your cycle can help you understand patterns and care for your well-being.', tags: ['cycle', 'overview'] },
  { title: 'Four Phases', body: 'The cycle has four phases: menstrual, follicular, ovulation, and luteal. Each phase brings a unique combination of energy, mood, and hormonal balance.', tags: ['phases', 'cycle'] },
  { title: 'Menstrual Phase', body: 'This is when bleeding occurs. It is a time for rest, warm nourishment, and gentle self-care. Symptoms may include cramps, fatigue, and mood shifts.', tags: ['menstruation', 'self-care'] },
  { title: 'Follicular Phase', body: 'This phase begins after menstruation. Energy often rises, focus returns, and the body prepares an egg for release. It is a good time for building healthy habits.', tags: ['follicular', 'energy'] },
  { title: 'Ovulation Phase', body: 'Ovulation is when an egg is released from the ovary. You may feel more social, confident, and energized. This is also a fertile window.', tags: ['ovulation', 'fertility'] },
  { title: 'Luteal Phase', body: 'After ovulation, hormones change as the body prepares for a possible pregnancy. Many people feel more introspective, and symptoms like bloating or mood swings may appear.', tags: ['luteal', 'PMS'] },
  { title: 'Symptoms', body: 'Symptoms can include cramps, headaches, fatigue, mood swings, and breast tenderness. Tracking these signs helps you recognize patterns and take gentle action.', tags: ['symptoms', 'tracking'] },
  { title: 'Mood', body: 'Mood can change across the cycle. Noticing when you feel calm, sad, irritable, or joyful helps you build a supportive routine.', tags: ['mood', 'mental health'] },
  { title: 'Flow', body: 'Flow intensity varies. Light, medium, or heavy bleeding is normal for different people. Track your flow to understand your body and manage comfort.', tags: ['flow', 'menstrual'] },
  { title: 'Pain Levels', body: 'Pain can be physical or emotional. Use heat, hydration, movement, and rest to find relief. Seek medical advice if pain is severe or disruptive.', tags: ['pain', 'relief'] },
  { title: 'Nutrition', body: 'Balanced nutrition supports hormonal health. Focus on whole foods, hydration, iron-rich meals, and nourishing snacks throughout the cycle.', tags: ['nutrition', 'diet'] },
  { title: 'Hygiene', body: 'Use comfortable, breathable menstrual care products and change them regularly. Cleanse gently and support your skin during the cycle.', tags: ['hygiene', 'care'] },
  { title: 'Healthy Habits', body: 'Healthy habits include sleep, hydration, movement, and self-compassion. Listen to your body and adapt as your cycle changes.', tags: ['habits', 'wellness'] },
  { title: 'Why Track Your Cycle', body: 'Tracking your cycle reveals patterns, improves symptom management, and supports fertility awareness. It turns monthly rhythm into meaningful insight.', tags: ['tracking', 'insight'] },
  { title: 'When to See a Doctor', body: 'If your cycle is extremely painful, irregular, very heavy, or accompanied by concerning symptoms, seek medical advice. Your health deserves careful attention.', tags: ['doctor', 'care'] },
  { title: 'Medical Disclaimer', body: 'SkyLove Cycle provides general wellness information and is not a substitute for professional medical advice. Always consult a qualified healthcare provider for personalized care.', tags: ['disclaimer', 'safety'] },
];

export function EducationCenterPage() {
  const [query, setQuery] = useState('');
  const filtered = useMemo(
    () => CONTENT.filter((item) => item.title.toLowerCase().includes(query.toLowerCase()) || item.body.toLowerCase().includes(query.toLowerCase()) || item.tags.some((tag) => tag.includes(query.toLowerCase()))),
    [query],
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <h1 className="font-display text-3xl font-bold">Education Center</h1>
          <p className="mt-1 text-ink-700 dark:text-ink-50/70">A beautiful reference for cycle health, symptoms, nutrition, and wellness.</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-ghost rounded-3xl px-4 py-3">Bookmark</button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <Card className="flex items-center justify-between gap-4 p-5">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-primary-500">Search</p>
              <p className="mt-2 text-2xl font-semibold">Find the right wellness guidance</p>
            </div>
            <Search size={28} className="text-primary-400" />
          </Card>

          <div className="space-y-4">
            {filtered.map((item) => (
              <Card key={item.title} className="space-y-3 p-6" hover={false}>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="font-display text-xl font-semibold">{item.title}</h2>
                    <p className="mt-1 text-sm text-ink-700/70 dark:text-ink-50/70">{item.tags.join(' • ')}</p>
                  </div>
                  <div className="grid h-12 w-12 place-items-center rounded-3xl bg-gradient-to-br from-primary-400 to-secondary-400 text-white shadow-soft">
                    <Bookmark size={18} />
                  </div>
                </div>
                <p className="text-sm leading-7 text-ink-700 dark:text-ink-50/80">{item.body}</p>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Card className="rounded-4xl bg-primary-500/10 p-6 text-primary-700 dark:bg-primary-400/10 dark:text-primary-200">
            <p className="text-sm uppercase tracking-[0.24em]">Featured</p>
            <h2 className="mt-3 text-2xl font-semibold">Why track your cycle?</h2>
            <p className="mt-3 text-sm leading-7">Tracking your cycle creates clarity, supports better self-care, and helps you spot changes early.</p>
          </Card>

          <Card className="space-y-3 p-6">
            <h3 className="font-display text-lg font-semibold">Quick topics</h3>
            {['Nutrition', 'Hygiene', 'PMS', 'Fertility', 'Healthy habits'].map((topic) => (
              <button key={topic} type="button" className="chip w-full bg-white/80 text-ink-900 dark:bg-ink-900/80 dark:text-white">{topic}</button>
            ))}
          </Card>

          <Card className="rounded-4xl border border-white/40 bg-white/80 p-6 text-sm text-ink-700 dark:bg-white/10 dark:text-ink-50/70">
            <p className="font-semibold">Disclaimer</p>
            <p className="mt-2">SkyLove Cycle provides general educational content and is not a substitute for professional medical advice.</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
