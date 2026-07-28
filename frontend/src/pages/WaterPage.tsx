import { motion } from 'framer-motion';
import { Droplet, Plus, Minus, History } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { useToast } from '@/context/ToastContext';
import { Card } from '@/components/Card';
import { ProgressRing } from '@/components/ProgressRing';
import { WATER_GOAL_DEFAULT } from '@/lib/constants';
import { formatLongDate, todayISO } from '@/lib/utils';

export function WaterPage() {
  const { water, waterToday, addWater } = useData();
  const { toast } = useToast();
  const glasses = waterToday?.glasses ?? 0;
  const pct = Math.min(100, (glasses / WATER_GOAL_DEFAULT) * 100);

  const last7 = (() => {
    const days: { date: string; glasses: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const ds = d.toISOString().slice(0, 10);
      days.push({ date: ds, glasses: water.find((w) => w.date === ds)?.glasses ?? 0 });
    }
    return days;
  })();
  const weeklyAverage = Math.round(last7.reduce((sum, d) => sum + d.glasses, 0) / 7) || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Water Tracker</h1>
        <p className="mt-1 text-ink-700 dark:text-ink-50/70">Stay hydrated, beautifully.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="flex flex-col items-center justify-center">
          <ProgressRing value={pct} size={180} color="#87CEEB">
            <Droplet size={28} className="text-accent-400" />
            <span className="font-display text-3xl font-bold">{glasses}</span>
            <span className="text-xs text-ink-700/60 dark:text-ink-50/60">of {WATER_GOAL_DEFAULT} glasses</span>
          </ProgressRing>
          <p className="mt-4 text-sm text-ink-700/70 dark:text-ink-50/70">7-day average: {weeklyAverage} glasses</p>
          <div className="mt-5 flex gap-3">
            <button onClick={() => { addWater(-1); }} className="grid h-12 w-12 place-items-center rounded-2xl bg-white/60 dark:bg-white/10 hover:bg-white text-ink-700 dark:text-ink-50 transition">
              <Minus size={20} />
            </button>
            <button
              onClick={() => { addWater(1); if (glasses + 1 >= WATER_GOAL_DEFAULT) toast('Water goal reached. Well done! 💧'); }}
              className="grid h-12 w-12 place-items-center rounded-2xl bg-accent-400 text-white shadow-soft hover:bg-accent-500 transition"
            >
              <Plus size={20} />
            </button>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <h3 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold">
            <History size={18} className="text-accent-400" /> Last 7 days
          </h3>
          <div className="flex items-end justify-between gap-2 h-48">
            {last7.map((d, i) => {
              const h = Math.max(4, (d.glasses / WATER_GOAL_DEFAULT) * 100);
              return (
                <div key={d.date} className="flex flex-1 flex-col items-center gap-2">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: i * 0.05, duration: 0.6, ease: 'easeOut' }}
                    className="w-full rounded-t-2xl bg-gradient-to-t from-accent-400 to-accent-300"
                    style={{ minHeight: 4 }}
                  />
                  <span className="text-xs text-ink-700/60 dark:text-ink-50/60">{d.glasses}</span>
                  <span className="text-[10px] text-ink-700/50 dark:text-ink-50/50">
                    {new Date(d.date).toLocaleDateString('en', { weekday: 'short' })}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="mb-3 font-display text-lg font-semibold">History</h3>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {[...water].reverse().slice(0, 12).map((w) => (
            <div key={w.id} className="flex items-center justify-between rounded-2xl bg-white/50 dark:bg-white/5 px-4 py-3">
              <span className="text-sm text-ink-700/70 dark:text-ink-50/70">{formatLongDate(w.date)}</span>
              <span className="font-semibold">{w.glasses} 🥛</span>
            </div>
          ))}
          {water.length === 0 && <p className="text-sm text-ink-700/60 dark:text-ink-50/60">No water logged yet.</p>}
        </div>
      </Card>
    </div>
  );
}
