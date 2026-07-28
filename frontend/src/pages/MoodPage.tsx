import { useState } from 'react';
import { motion } from 'framer-motion';
import { useData } from '@/context/DataContext';
import { useToast } from '@/context/ToastContext';
import { Card } from '@/components/Card';
import { MOODS } from '@/lib/constants';
import { todayISO, formatLongDate } from '@/lib/utils';
import type { MoodType } from '@/lib/types';

export function MoodPage() {
  const { moods, setMoodForDate } = useData();
  const { toast } = useToast();
  const [date, setDate] = useState(todayISO());
  const [note, setNote] = useState('');
  const existing = moods.find((m) => m.date === date);
  const recentMoodCounts = MOODS.map((m) => ({
    ...m,
    count: moods.filter((item) => item.mood === m.value).length,
  }))
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  const pick = (mood: MoodType) => {
    setMoodForDate(date, mood, note || undefined);
    toast(`${MOODS.find((m) => m.value === mood)?.emoji} Mood saved.`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Mood Tracker</h1>
        <p className="mt-1 text-ink-700 dark:text-ink-50/70">How are you feeling today?</p>
      </div>

      <Card className="grid gap-4 sm:grid-cols-2">
        {recentMoodCounts.length ? (
          recentMoodCounts.map((item) => (
            <div key={item.value} className="rounded-3xl bg-white/70 p-4 text-sm text-ink-700 dark:bg-white/10 dark:text-ink-50/80">
              <p className="font-semibold">{item.emoji} {item.label}</p>
              <p className="mt-2 text-xs">Logged {item.count} time{item.count === 1 ? '' : 's'}.</p>
            </div>
          ))
        ) : (
          <div className="rounded-3xl bg-white/70 p-4 text-sm text-ink-700 dark:bg-white/10 dark:text-ink-50/80">
            Log moods consistently to reveal your cycle's emotional pattern and support your self-care routine.
          </div>
        )}
      </Card>

      <Card className="space-y-5">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Date</label>
          <input
            type="date"
            className="input max-w-xs"
            value={date}
            onChange={(e) => { setDate(e.target.value); setNote(moods.find((m) => m.date === e.target.value)?.note ?? ''); }}
          />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {MOODS.map((m, i) => {
            const active = existing?.mood === m.value;
            return (
              <motion.button
                key={m.value}
                whileHover={{ y: -4, scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => pick(m.value)}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`flex flex-col items-center gap-2 rounded-4xl border p-5 transition ${
                  active
                    ? 'border-transparent text-white shadow-soft'
                    : 'border-white/40 dark:border-white/10 bg-white/40 dark:bg-white/5 hover:bg-white/60'
                }`}
                style={active ? { background: m.color } : undefined}
              >
                <span className="text-4xl">{m.emoji}</span>
                <span className="text-sm font-medium">{m.label}</span>
              </motion.button>
            );
          })}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Note (optional)</label>
          <textarea
            className="input min-h-[80px]"
            placeholder="A line about your day…"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
      </Card>

      <Card>
        <h3 className="mb-3 font-display text-lg font-semibold">Recent Moods</h3>
        <div className="space-y-2">
          {[...moods].reverse().slice(0, 8).map((m) => {
            const meta = MOODS.find((x) => x.value === m.mood);
            return (
              <div key={m.id} className="flex items-center gap-3 rounded-2xl bg-white/50 dark:bg-white/5 px-4 py-3">
                <span className="text-2xl">{meta?.emoji}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium capitalize">{m.mood}</p>
                  <p className="text-xs text-ink-700/60 dark:text-ink-50/60">{formatLongDate(m.date)}</p>
                </div>
                {m.note && <p className="text-xs text-ink-700/70 dark:text-ink-50/70 italic max-w-[40%] truncate">"{m.note}"</p>}
              </div>
            );
          })}
          {moods.length === 0 && <p className="text-sm text-ink-700/60 dark:text-ink-50/60">No moods logged yet.</p>}
        </div>
      </Card>
    </div>
  );
}
