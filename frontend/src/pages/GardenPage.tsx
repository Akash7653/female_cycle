import { motion } from 'framer-motion';
import { Flower2, Sparkles } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { Card } from '@/components/Card';
import { formatLongDate } from '@/lib/utils';

const MILESTONES = [
  { count: 1, message: 'Your first bloom — welcome to your garden. 🌸' },
  { count: 3, message: 'Three cycles, three flowers. You are growing. 🌷' },
  { count: 6, message: 'Half a year of care. Beautiful consistency. 🌻' },
  { count: 12, message: 'A full year in bloom. You are remarkable. 🌺' },
];

export function GardenPage() {
  const { flowers, cycles } = useData();
  const completed = cycles.filter((c) => c.endDate).length;
  const nextMilestone = MILESTONES.find((m) => m.count > flowers.length);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Memory Garden 🌸</h1>
        <p className="mt-1 text-ink-700 dark:text-ink-50/70">Each completed cycle blooms a new flower.</p>
      </div>

      <Card className="bg-gradient-to-br from-primary-100/60 via-secondary-100/40 to-accent-100/40 dark:from-primary-400/10 dark:via-secondary-400/10 dark:to-accent-400/10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-ink-700/70 dark:text-ink-50/70">Flowers bloomed</p>
            <p className="font-display text-4xl font-bold text-primary-500">{flowers.length}</p>
            <p className="text-xs text-ink-700/60 dark:text-ink-50/60">{completed} cycles completed</p>
          </div>
          <Flower2 size={56} className="text-primary-300" />
        </div>
        {nextMilestone && (
          <div className="mt-4 flex items-center gap-2 rounded-2xl bg-white/60 dark:bg-white/10 px-4 py-3 text-sm">
            <Sparkles size={16} className="text-secondary-400" />
            {nextMilestone.count - flowers.length} more bloom{nextMilestone.count - flowers.length === 1 ? '' : 's'} to unlock: "{nextMilestone.message}"
          </div>
        )}
      </Card>

      {flowers.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 py-16 text-center">
          <span className="text-6xl">🌱</span>
          <p className="text-sm text-ink-700/70 dark:text-ink-50/70">
            Your garden is waiting. Complete a cycle (add an end date) to grow your first flower.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {flowers.map((f, i) => (
            <motion.div
              key={f.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.06, type: 'spring', stiffness: 200 }}
              whileHover={{ y: -6, rotate: 2 }}
            >
              <Card hover={false} className="flex flex-col items-center gap-2 text-center">
                <motion.span
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3 + (i % 3), repeat: Infinity, ease: 'easeInOut' }}
                  className="text-5xl"
                >
                  {f.emoji}
                </motion.span>
                <p className="font-display text-sm font-semibold">{f.name}</p>
                <p className="text-xs text-ink-700/60 dark:text-ink-50/60">{f.season}</p>
                <p className="text-[10px] text-ink-700/50 dark:text-ink-50/50">{formatLongDate(f.unlockedAt.slice(0, 10))}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
