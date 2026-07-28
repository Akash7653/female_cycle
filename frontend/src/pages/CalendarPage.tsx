import { useMemo, useState } from 'react';
import Calendar from 'react-calendar';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Droplet, Smile, BookOpen, Pill } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { phaseForDate } from '@/lib/cycle';
import { PHASE_INFO, MOODS } from '@/lib/constants';
import { isoDate, formatLongDate } from '@/lib/utils';
import { Card } from '@/components/Card';
import { useAuth } from '@/context/AuthContext';
import type { Cycle } from '@/lib/types';

export function CalendarPage() {
  const { cycles, symptoms, moods, journals } = useData();
  const { user } = useAuth();
  const [selected, setSelected] = useState<string | null>(null);
  const [activeStartDate, setActiveStartDate] = useState(new Date());

  const tileContent = useMemo(() => {
    return ({ date, view }: { date: Date; view: string }) => {
      if (view !== 'month') return null;
      const ds = isoDate(date);
      const info = phaseForDate(ds, cycles, user?.cycleLength, user?.periodLength);
      if (info.isPeriod) return <div className="mx-auto mt-1 h-2 w-2 rounded-full bg-primary-400" />;
      if (info.isOvulation) return <div className="mx-auto mt-1 h-2 w-2 rounded-full bg-accent-400" />;
      if (info.isFertile) return <div className="mx-auto mt-1 h-2 w-2 rounded-full bg-success-500" />;
      return null;
    };
  }, [cycles, user]);

  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return '';
    const ds = isoDate(date);
    const info = phaseForDate(ds, cycles, user?.cycleLength, user?.periodLength);
    if (info.isPeriod) return 'bg-primary-100 dark:bg-primary-400/20';
    if (info.isOvulation) return 'bg-accent-100 dark:bg-accent-400/20';
    if (info.isFertile) return 'bg-success-500/10';
    return '';
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <h1 className="font-display text-3xl font-bold">Calendar</h1>
          <p className="mt-1 text-ink-700 dark:text-ink-50/70">A cleaner view for your cycle phases and daily logs.</p>
        </div>
        <Card className="rounded-3xl p-4 text-sm text-ink-700 dark:text-ink-50/70">
          <p className="font-semibold">Tip</p>
          <p className="mt-2">Tap a day to reveal mood, symptoms and journal details in the side summary.</p>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <Card className="p-4">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-primary-500">Current month</p>
              <p className="mt-1 text-2xl font-semibold">{activeStartDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveStartDate((date) => {
                  const prev = new Date(date);
                  prev.setMonth(date.getMonth() - 1);
                  return prev;
                })}
                className="btn-ghost h-11 w-11 rounded-2xl"
              >‹</button>
              <button
                type="button"
                onClick={() => setActiveStartDate((date) => {
                  const next = new Date(date);
                  next.setMonth(date.getMonth() + 1);
                  return next;
                })}
                className="btn-ghost h-11 w-11 rounded-2xl"
              >›</button>
            </div>
          </div>
          <Calendar
            value={selected ? new Date(selected) : undefined}
            view="month"
            onClickDay={(d) => setSelected(isoDate(d))}
            tileContent={tileContent as never}
            tileClassName={tileClassName as never}
            showNavigation={false}
            activeStartDate={activeStartDate}
            onActiveStartDateChange={({ activeStartDate: next }) => setActiveStartDate(next)}
            showNeighboringMonth={false}
            calendarType="gregory"
          />
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Legend color="bg-primary-400" label="Period" />
            <Legend color="bg-accent-400" label="Ovulation" />
            <Legend color="bg-success-500" label="Fertile" />
            <Legend color="bg-ink-300" label="Normal" />
          </div>
        </Card>

        <Card className="space-y-4">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-primary-500">Phase summary</p>
            <p className="mt-2 text-sm text-ink-700 dark:text-ink-50/70">The calendar now presents a more compact, easy-scan month view with subtle color cues.</p>
          </div>
          <div className="grid gap-3 rounded-3xl border border-dashed border-white/40 p-4 text-sm text-ink-700 dark:border-white/10 dark:text-ink-50/70">
            <p><strong>Period</strong>: highlighted in soft pink</p>
            <p><strong>Ovulation</strong>: marked with calm blue</p>
            <p><strong>Fertile window</strong>: soft green tint</p>
            <p><strong>Tap a day</strong> for details on mood, symptoms, and journaling.</p>
          </div>
        </Card>
      </div>

      <AnimatePresence>
        {selected && (
          <DayDetailDrawer date={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`h-3 w-3 rounded-full ${color}`} />
      <span className="text-ink-700/70 dark:text-ink-50/70">{label}</span>
    </div>
  );
}

function DayDetailDrawer({ date, onClose }: { date: string; onClose: () => void }) {
  const { cycles, symptoms, moods, journals } = useData();
  const { user } = useAuth();
  const info = phaseForDate(date, cycles, user?.cycleLength, user?.periodLength);
  const daySymptoms = symptoms.find((s) => s.date === date);
  const dayMood = moods.find((m) => m.date === date);
  const dayJournal = journals.find((j) => j.date === date);
  const phase = PHASE_INFO[info.phase];

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-40 bg-ink-900/40 backdrop-blur-sm"
      />
      <motion.div
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 32 }}
        className="fixed right-0 top-0 z-50 h-full w-full max-w-md overflow-y-auto glass border-l border-white/40 dark:border-white/10 p-6"
      >
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-ink-700/60 dark:text-ink-50/60">{formatLongDate(date)}</p>
            <h2 className="font-display text-xl font-semibold" style={{ color: phase.color }}>
              {phase.emoji} {phase.label}
            </h2>
          </div>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full hover:bg-white/40 dark:hover:bg-white/10">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <Section icon={Droplet} title="Flow">
            {cycles.find((c) => date >= c.startDate && date <= (c.endDate ?? c.startDate))
              ? <p className="text-sm">{cycles.find((c) => date >= c.startDate && date <= (c.endDate ?? c.startDate))?.flow}</p>
              : <p className="text-sm text-ink-700/60 dark:text-ink-50/60">No flow logged.</p>}
          </Section>

          <Section icon={Smile} title="Mood">
            {dayMood ? (
              <p className="text-sm">{MOODS.find((m) => m.value === dayMood.mood)?.emoji} {MOODS.find((m) => m.value === dayMood.mood)?.label}</p>
            ) : <p className="text-sm text-ink-700/60 dark:text-ink-50/60">No mood logged.</p>}
          </Section>

          <Section icon={Droplet} title="Symptoms">
            {daySymptoms?.symptoms.length ? (
              <div className="flex flex-wrap gap-1.5">
                {daySymptoms.symptoms.map((s) => (
                  <span key={s} className="chip bg-primary-100 text-primary-600 dark:bg-primary-400/20 dark:text-primary-300">{s}</span>
                ))}
              </div>
            ) : <p className="text-sm text-ink-700/60 dark:text-ink-50/60">No symptoms logged.</p>}
          </Section>

          <Section icon={BookOpen} title="Journal">
            {dayJournal ? (
              <div>
                <p className="font-medium">{dayJournal.title}</p>
                <p className="text-sm text-ink-700/70 dark:text-ink-50/70">{dayJournal.content}</p>
              </div>
            ) : <p className="text-sm text-ink-700/60 dark:text-ink-50/60">No journal entry.</p>}
          </Section>

          <Section icon={Pill} title="Medicine">
            <p className="text-sm text-ink-700/60 dark:text-ink-50/60">See the Medicine page for reminders.</p>
          </Section>
        </div>
      </motion.div>
    </>
  );
}

function Section({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white/50 dark:bg-white/5 p-4">
      <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
        <Icon size={16} className="text-primary-400" /> {title}
      </h3>
      {children}
    </div>
  );
}
