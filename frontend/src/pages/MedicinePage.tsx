import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pill, Plus, Check, Trash2, X, Bell } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { useToast } from '@/context/ToastContext';
import { Card } from '@/components/Card';

export function MedicinePage() {
  const { medicines, addMedicine, toggleMedicine, deleteMedicine } = useData();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [time, setTime] = useState('08:00');
  const [repeat, setRepeat] = useState<'daily' | 'weekdays' | 'custom'>('daily');

  const save = () => {
    if (!name.trim()) { toast('Enter a medicine name.', 'error'); return; }
    addMedicine({ name, time, repeat });
    toast('Reminder added. 🔔');
    setOpen(false); setName('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Medicine Reminder</h1>
          <p className="mt-1 text-ink-700 dark:text-ink-50/70">Gentle nudges so you never miss a dose.</p>
        </div>
        <button onClick={() => setOpen(true)} className="btn-primary">
          <Plus size={18} /> Add
        </button>
      </div>

      {medicines.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 py-12 text-center">
          <Pill size={36} className="text-primary-300" />
          <p className="text-sm text-ink-700/70 dark:text-ink-50/70">No reminders yet. Add your first medicine.</p>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {medicines.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card hover={false} className={`flex items-center gap-4 ${m.completed ? 'opacity-60' : ''}`}>
                <button
                  onClick={() => toggleMedicine(m.id)}
                  className={`grid h-11 w-11 place-items-center rounded-2xl transition ${
                    m.completed ? 'bg-success-500 text-white' : 'bg-white/60 dark:bg-white/10 text-primary-400 hover:bg-primary-100'
                  }`}
                >
                  <Check size={20} />
                </button>
                <div className="flex-1">
                  <p className={`font-display font-semibold ${m.completed ? 'line-through' : ''}`}>{m.name}</p>
                  <p className="text-xs text-ink-700/60 dark:text-ink-50/60 flex items-center gap-1">
                    <Bell size={12} /> {m.time} · {m.repeat}
                  </p>
                </div>
                <button onClick={() => { deleteMedicine(m.id); toast('Reminder removed.', 'info'); }} className="text-ink-700/40 hover:text-error-500">
                  <Trash2 size={16} />
                </button>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} className="fixed inset-0 z-40 bg-ink-900/40 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 glass-card p-6"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-xl font-semibold">Add reminder</h2>
                <button onClick={() => setOpen(false)} className="text-ink-700/60 hover:text-ink-900"><X size={20} /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Medicine name</label>
                  <input className="input" placeholder="e.g. Iron supplement" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Time</label>
                  <input type="time" className="input" value={time} onChange={(e) => setTime(e.target.value)} />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Repeat</label>
                  <select className="input" value={repeat} onChange={(e) => setRepeat(e.target.value as 'daily' | 'weekdays' | 'custom')}>
                    <option value="daily">Daily</option>
                    <option value="weekdays">Weekdays</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
                <button onClick={save} className="btn-primary w-full">Save reminder</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
