import { useState } from 'react';
import { motion } from 'framer-motion';
import { Droplet, Check } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { useToast } from '@/context/ToastContext';
import { Card } from '@/components/Card';
import { SYMPTOMS } from '@/lib/constants';
import { todayISO } from '@/lib/utils';

export function SymptomsPage() {
  const { symptoms, setSymptomsForDate } = useData();
  const { toast } = useToast();
  const [date, setDate] = useState(todayISO());
  const today = symptoms.find((s) => s.date === date);
  const [selected, setSelected] = useState<string[]>(today?.symptoms ?? []);

  const toggle = (sym: string) => {
    setSelected((prev) => (prev.includes(sym) ? prev.filter((s) => s !== sym) : [...prev, sym]));
  };

  const save = () => {
    setSymptomsForDate(date, selected);
    toast('Symptoms saved. 💗');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Symptoms</h1>
        <p className="mt-1 text-ink-700 dark:text-ink-50/70">Tap what you're feeling today.</p>
      </div>

      <div className="rounded-4xl border border-primary-200/60 bg-primary-50/70 p-4 text-sm text-ink-700 dark:border-primary-400/30 dark:bg-ink-900/40 dark:text-ink-50/80">
        Tracking symptoms helps your cycle predictions adjust to real changes in cramps, energy, and mood.
      </div>

      <Card className="space-y-5">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Date</label>
          <input type="date" className="input max-w-xs" value={date} onChange={(e) => {
            setDate(e.target.value);
            const existing = symptoms.find((s) => s.date === e.target.value);
            setSelected(existing?.symptoms ?? []);
          }} />
        </div>

        <div className="flex items-center justify-between text-sm text-ink-700/70 dark:text-ink-50/70">
          <span>{selected.length} symptoms selected</span>
          <span>Tracking shapes better predictions.</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
          {SYMPTOMS.map((sym, i) => {
            const active = selected.includes(sym);
            return (
              <motion.button
                key={sym}
                whileTap={{ scale: 0.96 }}
                onClick={() => toggle(sym)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02 }}
                className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                  active
                    ? 'border-transparent bg-primary-400 text-white shadow-soft'
                    : 'border-white/40 dark:border-white/10 bg-white/40 dark:bg-white/5 hover:bg-white/60'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Droplet size={14} className={active ? 'text-white' : 'text-primary-400'} /> {sym}
                </span>
                {active && <Check size={16} />}
              </motion.button>
            );
          })}
        </div>

        <button onClick={save} className="btn-primary">Save symptoms</button>
      </Card>
    </div>
  );
}
