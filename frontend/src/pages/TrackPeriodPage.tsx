import { useState } from 'react';
import { motion } from 'framer-motion';
import { HeartPulse, Save, Trash2 } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { useToast } from '@/context/ToastContext';
import { Card } from '@/components/Card';
import { FLOW_OPTIONS } from '@/lib/constants';
import { todayISO, clamp } from '@/lib/utils';
import type { FlowLevel } from '@/lib/types';

export function TrackPeriodPage() {
  const { cycles, addCycle, deleteCycle } = useData();
  const { toast } = useToast();
  const [startDate, setStartDate] = useState(todayISO());
  const [endDate, setEndDate] = useState('');
  const [flow, setFlow] = useState<FlowLevel>('medium');
  const [pain, setPain] = useState(3);
  const [energy, setEnergy] = useState(5);

  const save = () => {
    if (!startDate) {
      toast('Please choose a start date.', 'error');
      return;
    }
    addCycle({
      startDate,
      endDate: endDate || undefined,
      flow,
      painLevel: pain,
      energyLevel: energy,
    });
    toast('Cycle saved. A flower may bloom soon. 🌸');
    setEndDate('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Track Period</h1>
        <p className="mt-1 text-ink-700 dark:text-ink-50/70">Log a cycle and we'll refine your predictions.</p>
      </div>

      <Card className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-3xl bg-primary-100 text-primary-700">
            <HeartPulse size={24} />
          </div>
          <div>
            <p className="font-semibold">Why this matters</p>
            <p className="mt-2 text-sm text-ink-700 dark:text-ink-50/70">Every entry helps the app learn your unique rhythm, improving future cycle and fertility predictions.</p>
          </div>
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2 space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Start date</label>
              <input type="date" className="input" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">End date (optional)</label>
              <input type="date" className="input" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Flow</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {FLOW_OPTIONS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFlow(f.value)}
                  className={`rounded-2xl border px-3 py-3 text-sm font-medium transition ${
                    flow === f.value
                      ? 'border-transparent text-white shadow-soft'
                      : 'border-white/40 dark:border-white/10 bg-white/40 dark:bg-white/5 hover:bg-white/60'
                  }`}
                  style={flow === f.value ? { background: f.color } : undefined}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <Slider label="Pain level" value={pain} setValue={setPain} color="#EF5350" />
          <Slider label="Energy level" value={energy} setValue={setEnergy} color="#81C784" />

          <button onClick={save} className="btn-primary w-full">
            <Save size={18} /> Save Cycle
          </button>
        </Card>

        <Card>
          <h3 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold">
            <HeartPulse size={18} className="text-primary-400" /> Cycle History
          </h3>
          {cycles.length === 0 ? (
            <p className="text-sm text-ink-700/60 dark:text-ink-50/60">No cycles logged yet.</p>
          ) : (
            <ul className="space-y-2">
              {[...cycles].reverse().map((c) => (
                <motion.li
                  key={c.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between rounded-2xl bg-white/50 dark:bg-white/5 px-3 py-2.5"
                >
                  <div>
                    <p className="text-sm font-medium">{c.startDate}</p>
                    <p className="text-xs text-ink-700/60 dark:text-ink-50/60 capitalize">{c.flow} flow · pain {c.painLevel}/10</p>
                  </div>
                  <button
                    onClick={() => { deleteCycle(c.id); toast('Cycle removed.', 'info'); }}
                    className="text-ink-700/40 hover:text-error-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </motion.li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}

function Slider({ label, value, setValue, color }: { label: string; value: number; setValue: (n: number) => void; color: string }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label className="text-sm font-medium">{label}</label>
        <span className="text-sm font-semibold" style={{ color }}>{value}/10</span>
      </div>
      <input
        type="range"
        min={0}
        max={10}
        value={value}
        onChange={(e) => setValue(clamp(Number(e.target.value), 0, 10))}
        className="w-full accent-primary-400"
        style={{ accentColor: color }}
      />
    </div>
  );
}
