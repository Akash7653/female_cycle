import { useMemo } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from 'recharts';
import { BarChart3, TrendingUp, Activity, Droplet } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/Card';
import { MOODS, SYMPTOMS } from '@/lib/constants';
import { averageCycleLength, averagePeriodLength } from '@/lib/cycle';
import { formatLongDate } from '@/lib/utils';

const PIE_COLORS = ['#FF6B9A', '#C9A7EB', '#87CEEB', '#81C784', '#FFD54F', '#EF5350', '#B384DE', '#5BB6DA'];

export function AnalyticsPage() {
  const { cycles, symptoms, moods, water } = useData();
  const { user } = useAuth();

  const cycleData = useMemo(() => {
    const sorted = [...cycles].sort((a, b) => a.startDate.localeCompare(b.startDate));
    return sorted.map((c, i) => ({
      name: `C${i + 1}`,
      start: c.startDate.slice(5),
      length: c.endDate ? Math.max(1, new Date(c.endDate).getTime() - new Date(c.startDate).getTime()) / 86_400_000 + 1 : user?.periodLength ?? 5,
    }));
  }, [cycles, user]);

  const moodData = useMemo(() => {
    const counts: Record<string, number> = {};
    moods.forEach((m) => { counts[m.mood] = (counts[m.mood] ?? 0) + 1; });
    return Object.entries(counts).map(([k, v]) => ({
      name: MOODS.find((m) => m.value === k)?.emoji ?? k,
      value: v,
    }));
  }, [moods]);

  const symptomData = useMemo(() => {
    const counts: Record<string, number> = {};
    symptoms.forEach((s) => s.symptoms.forEach((sym) => { counts[sym] = (counts[sym] ?? 0) + 1; }));
    return Object.entries(counts)
      .map(([k, v]) => ({ name: k, value: v }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [symptoms]);

  const waterData = useMemo(() => {
    const days: { name: string; glasses: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const ds = d.toISOString().slice(0, 10);
      days.push({ name: d.toLocaleDateString('en', { weekday: 'short' }), glasses: water.find((w) => w.date === ds)?.glasses ?? 0 });
    }
    return days;
  }, [water]);

  const avgCycle = averageCycleLength(cycles, user?.cycleLength ?? 28);
  const avgPeriod = averagePeriodLength(cycles, user?.periodLength ?? 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Analytics</h1>
        <p className="mt-1 text-ink-700 dark:text-ink-50/70">Insights from your wellness journey.</p>
      </div>

      <Card className="bg-primary-50/80 dark:bg-white/10">
        <p className="text-sm uppercase tracking-[0.24em] text-primary-500">Your cycle story</p>
        <p className="mt-2 text-sm text-ink-700 dark:text-ink-50/70">
          Every log helps your app learn what feels normal for you — from period length to energy shifts and hydration habits.
        </p>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={Activity} label="Avg cycle length" value={`${avgCycle} days`} color="from-primary-400 to-primary-500" />
        <StatCard icon={TrendingUp} label="Avg period length" value={`${avgPeriod} days`} color="from-secondary-400 to-secondary-500" />
        <StatCard icon={Droplet} label="Cycles logged" value={`${cycles.length}`} color="from-accent-400 to-accent-500" />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <h3 className="mb-4 font-display text-lg font-semibold">Period Length per Cycle</h3>
          {cycleData.length ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={cycleData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,107,154,0.1)" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="length" fill="#FF6B9A" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <EmptyChart />}
        </Card>

        <Card>
          <h3 className="mb-4 font-display text-lg font-semibold">Mood Distribution</h3>
          {moodData.length ? (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={moodData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} innerRadius={40}>
                  {moodData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : <EmptyChart />}
        </Card>

        <Card>
          <h3 className="mb-4 font-display text-lg font-semibold">Top Symptoms</h3>
          {symptomData.length ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={symptomData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,107,154,0.1)" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#C9A7EB" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <EmptyChart />}
        </Card>

        <Card>
          <h3 className="mb-4 font-display text-lg font-semibold">Water Intake (7 days)</h3>
          {waterData.some((d) => d.glasses > 0) ? (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={waterData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(135,206,235,0.15)" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="glasses" stroke="#87CEEB" strokeWidth={3} dot={{ r: 4, fill: '#87CEEB' }} />
              </LineChart>
            </ResponsiveContainer>
          ) : <EmptyChart />}
        </Card>
      </div>

      <Card>
        <h3 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold">
          <BarChart3 size={18} className="text-primary-400" /> Health Insights
        </h3>
        <ul className="space-y-2 text-sm text-ink-700 dark:text-ink-50/70">
          <li>• Your average cycle is <strong>{avgCycle} days</strong>. {avgCycle >= 21 && avgCycle <= 35 ? 'This is within the typical range.' : 'Consider tracking more cycles for accuracy.'}</li>
          <li>• Your period lasts about <strong>{avgPeriod} days</strong> on average.</li>
          {symptomData[0] && <li>• Your most common symptom is <strong>{symptomData[0].name}</strong>.</li>}
          {moodData[0] && <li>• Your most frequent mood is <strong>{MOODS.find((m) => m.emoji === moodData[0].name)?.label}</strong>.</li>}
          <li>• {cycles.length >= 3 ? 'Predictions are well-calibrated from your history.' : 'Log at least 3 cycles for stronger predictions.'}</li>
        </ul>
      </Card>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string; color: string }) {
  return (
    <Card>
      <div className="flex items-center gap-3">
        <div className={`grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br ${color} text-white shadow-soft`}>
          <Icon size={20} />
        </div>
        <div>
          <p className="text-xs text-ink-700/60 dark:text-ink-50/60">{label}</p>
          <p className="font-display text-xl font-bold">{value}</p>
        </div>
      </div>
    </Card>
  );
}

function EmptyChart() {
  return (
    <div className="flex h-[240px] flex-col items-center justify-center gap-2 text-center">
      <BarChart3 size={28} className="text-primary-300" />
      <p className="text-sm text-ink-700/60 dark:text-ink-50/60">Not enough data yet. Keep logging!</p>
    </div>
  );
}
