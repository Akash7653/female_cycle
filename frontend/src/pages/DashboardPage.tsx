import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  HeartPulse,
  Smile,
  Droplet,
  Pill,
  BookOpen,
  CalendarDays,
  Bell,
  Sparkles,
  ArrowRight,
  Flower2,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { Card } from '@/components/Card';
import { ProgressRing } from '@/components/ProgressRing';
import { PHASE_INFO, WATER_GOAL_DEFAULT } from '@/lib/constants';
import { greeting, formatLongDate, todayISO } from '@/lib/utils';
import { phaseTip } from '@/lib/assistant';

export function DashboardPage() {
  const { user } = useAuth();
  const { prediction, moodToday, waterToday, water, medicines, notifications, cycles, flowers, journals, markNotificationRead } = useData();
  const phase = PHASE_INFO[prediction.phase];
  const unread = notifications.filter((n) => !n.read).slice(0, 4);
  const waterPct = waterToday ? Math.min(100, (waterToday.glasses / WATER_GOAL_DEFAULT) * 100) : 0;
  const pendingMeds = medicines.filter((m) => !m.completed);
  const latestJournal = journals.length > 0 ? journals[journals.length - 1] : undefined;
  const hydrationStreak = (() => {
    const today = new Date();
    let streak = 0;
    for (let i = 0; i < 7; i += 1) {
      const candidate = new Date(today);
      candidate.setDate(today.getDate() - i);
      const key = candidate.toISOString().slice(0, 10);
      const entry = water.find((w) => w.date === key);
      if (entry && entry.glasses >= Math.ceil(WATER_GOAL_DEFAULT * 0.75)) {
        streak += 1;
      } else {
        break;
      }
    }
    return streak;
  })();

  const quickActions = [
    { to: '/app/track', label: 'Track Period', icon: HeartPulse, color: 'from-primary-400 to-primary-500' },
    { to: '/app/mood', label: 'Log Mood', icon: Smile, color: 'from-warning-500 to-primary-400' },
    { to: '/app/water', label: 'Add Water', icon: Droplet, color: 'from-accent-400 to-accent-500' },
    { to: '/app/journal', label: 'Journal', icon: BookOpen, color: 'from-secondary-400 to-secondary-500' },
    { to: '/app/medicine', label: 'Medicine', icon: Pill, color: 'from-success-500 to-success-600' },
    { to: '/app/calendar', label: 'Calendar', icon: CalendarDays, color: 'from-accent-400 to-secondary-400' },
  ];

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <p className="text-sm text-ink-700/60 dark:text-ink-50/60">{formatLongDate(todayISO())}</p>
        <h1 className="font-display text-3xl font-bold sm:text-4xl">
          {greeting()}, {user?.name?.split(' ')[0] ?? 'Friend'} 🌸
        </h1>
        <p className="mt-1 text-ink-700 dark:text-ink-50/70">{phaseTip(prediction.phase)}</p>
      </motion.div>

      <Card className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-primary-500">Today’s focus</p>
          <p className="mt-2 text-sm text-ink-700 dark:text-ink-50/70">
            Stay ahead of your cycle with small wellness actions that support your energy, rest, and hydration.
          </p>
        </div>
        <div className="space-y-2 text-sm text-ink-700 dark:text-ink-50/70">
          <p className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-primary-400" />{prediction.daysUntil <= 3 ? `Expect your period in ${prediction.daysUntil} day${prediction.daysUntil === 1 ? '' : 's'}.` : 'Your cycle looks steady today.'}</p>
          {!moodToday && <p className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-primary-400" />Log your mood for better emotional patterns.</p>}
          {waterToday?.glasses !== undefined && waterToday.glasses < 6 && <p className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-primary-400" />Try to drink a few more glasses of water today.</p>}
          {pendingMeds.length > 0 && <p className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-primary-400" />Check your medicine reminders so you don't miss a dose.</p>}
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-primary-500">Today's insight</p>
              <h2 className="mt-2 font-display text-2xl font-bold">Your body is preparing for {phase.label}.</h2>
            </div>
            <HeartPulse size={36} className="text-primary-400" />
          </div>
          <p className="text-ink-700 dark:text-ink-50/70">
            {phase.desc} Log mood, water, or symptoms now to personalize your predictions and take the guesswork out of what comes next.
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-3xl bg-white/80 p-4 text-sm text-ink-700 dark:bg-white/10 dark:text-ink-50/80">
              <p className="font-semibold">Cycle clarity</p>
              <p className="mt-2 text-xs">The more you log, the smarter your next period estimate becomes.</p>
            </div>
            <div className="rounded-3xl bg-white/80 p-4 text-sm text-ink-700 dark:bg-white/10 dark:text-ink-50/80">
              <p className="font-semibold">Symptom support</p>
              <p className="mt-2 text-xs">Capture cramps, mood swings, and energy to spot trends fast.</p>
            </div>
            <div className="rounded-3xl bg-white/80 p-4 text-sm text-ink-700 dark:bg-white/10 dark:text-ink-50/80">
              <p className="font-semibold">Calm reminders</p>
              <p className="mt-2 text-xs">Gentle nudges keep your routine steady without overwhelming you.</p>
            </div>
          </div>
        </Card>

        <Card className="space-y-4">
          <div>
            <p className="text-sm text-ink-700/60 dark:text-ink-50/60">Hydration streak</p>
            <p className="mt-2 font-display text-4xl font-bold text-accent-500">{hydrationStreak}</p>
            <p className="text-sm text-ink-700/70 dark:text-ink-50/70">days with 75%+ water goal reached</p>
          </div>
          {latestJournal ? (
            <div className="rounded-3xl bg-white/50 dark:bg-white/5 p-4">
              <p className="text-sm text-ink-700/60 dark:text-ink-50/60">Latest journal</p>
              <p className="mt-2 text-sm text-ink-900 dark:text-ink-50">{latestJournal.title}</p>
            </div>
          ) : (
            <div className="rounded-3xl bg-white/50 dark:bg-white/5 p-4 text-sm text-ink-700/70 dark:text-ink-50/70">
              Add a journal entry to see reflection prompts and energy patterns.
            </div>
          )}
        </Card>
      </div>

      {/* Top cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Card delay={0.05} className="bg-gradient-to-br from-primary-400 to-primary-500 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/80">Next Period</p>
              <p className="font-display text-3xl font-bold">{prediction.daysUntil}</p>
              <p className="text-xs text-white/80">days remaining</p>
            </div>
            <HeartPulse size={40} className="text-white/70" />
          </div>
        </Card>

        <Card delay={0.1}>
          <p className="text-sm text-ink-700/60 dark:text-ink-50/60">Current Phase</p>
          <p className="font-display text-xl font-semibold" style={{ color: phase.color }}>
            {phase.emoji} {phase.label}
          </p>
          <p className="mt-1 text-xs text-ink-700/70 dark:text-ink-50/70">{phase.desc}</p>
        </Card>

        <Card delay={0.15}>
          <p className="text-sm text-ink-700/60 dark:text-ink-50/60">Cycle Length</p>
          <p className="font-display text-xl font-semibold">{prediction.cycleLength} days</p>
          <p className="mt-1 text-xs text-ink-700/70 dark:text-ink-50/70">
            {cycles.length} cycles logged
          </p>
        </Card>

        <Card delay={0.2}>
          <p className="text-sm text-ink-700/60 dark:text-ink-50/60">Mood Today</p>
          {moodToday ? (
            <p className="font-display text-xl font-semibold capitalize">{moodToday.mood}</p>
          ) : (
            <Link to="/app/mood" className="font-display text-sm font-semibold text-primary-500 hover:underline">
              Log mood →
            </Link>
          )}
          <p className="mt-1 text-xs text-ink-700/70 dark:text-ink-50/70">
            {pendingMeds.length} meds pending
          </p>
        </Card>
      </div>

      {/* Water + reminders */}
      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-1 flex flex-col items-center justify-center">
          <p className="mb-2 text-sm font-medium text-ink-700/70 dark:text-ink-50/70">Water today</p>
          <ProgressRing value={waterPct} color="#87CEEB">
            <span className="font-display text-2xl font-bold">{waterToday?.glasses ?? 0}</span>
            <span className="text-xs text-ink-700/60 dark:text-ink-50/60">/ {WATER_GOAL_DEFAULT} glasses</span>
          </ProgressRing>
          <Link to="/app/water" className="btn-ghost mt-4 text-sm">Manage water <ArrowRight size={14} /></Link>
        </Card>

        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold flex items-center gap-2">
              <Bell size={18} className="text-primary-400" /> Today's Reminders
            </h3>
            <Link to="/app/assistant" className="text-sm text-primary-500 hover:underline">Ask AI</Link>
          </div>
          {unread.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <Sparkles size={28} className="text-primary-300" />
              <p className="text-sm text-ink-700/70 dark:text-ink-50/70">You're all caught up. Lovely. 🌷</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {unread.map((n) => (
                <li
                  key={n.id}
                  className="flex items-center gap-3 rounded-2xl bg-white/50 dark:bg-white/5 px-4 py-3"
                >
                  <span className="h-2 w-2 rounded-full bg-primary-400" />
                  <p className="flex-1 text-sm">{n.message}</p>
                  <button onClick={() => markNotificationRead(n.id)} className="text-xs text-primary-500 hover:underline">Done</button>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {/* Quick actions */}
      <div>
        <h3 className="mb-3 font-display text-lg font-semibold">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {quickActions.map((a, i) => (
            <motion.div key={a.to} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link
                to={a.to}
                className="glass-card group flex flex-col items-center gap-2 p-4 text-center transition hover:-translate-y-1"
              >
                <div className={`grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br ${a.color} text-white shadow-soft`}>
                  <a.icon size={20} />
                </div>
                <span className="text-xs font-medium">{a.label}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Garden preview */}
      {flowers.length > 0 && (
        <Card>
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold flex items-center gap-2">
              <Flower2 size={18} className="text-primary-400" /> Memory Garden
            </h3>
            <Link to="/app/garden" className="text-sm text-primary-500 hover:underline">View garden</Link>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            {flowers.slice(-6).map((f) => (
              <div key={f.id} className="flex flex-col items-center gap-1">
                <span className="grid h-14 w-14 place-items-center rounded-3xl glass text-3xl">{f.emoji}</span>
                <span className="text-xs text-ink-700/60 dark:text-ink-50/60">{f.name}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
