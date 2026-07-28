import { Moon, Sun, Bell, Shield, Lock, Download, Trash2, FileText, FileSpreadsheet } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { useToast } from '@/context/ToastContext';
import { storage } from '@/lib/storage';
import { Card } from '@/components/Card';

export function SettingsPage() {
  const { theme, toggle } = useTheme();
  const { logout } = useAuth();
  const { cycles, symptoms, moods, journals, water, medicines } = useData();
  const { toast } = useToast();

  const exportJSON = () => {
    const data = { cycles, symptoms, moods, journals, water, medicines };
    download('skylove-data.json', JSON.stringify(data, null, 2), 'application/json');
    toast('Data exported as JSON.');
  };

  const exportCSV = () => {
    const rows = [['date', 'flow', 'pain', 'energy']];
    cycles.forEach((c) => rows.push([c.startDate, c.flow, String(c.painLevel), String(c.energyLevel)]));
    const csv = rows.map((r) => r.join(',')).join('\n');
    download('skylove-cycles.csv', csv, 'text/csv');
    toast('Cycles exported as CSV.');
  };

  const deleteAccount = () => {
    if (!confirm('This will permanently delete all your data. Continue?')) return;
    Object.keys(localStorage)
      .filter((k) => k.startsWith('skylove.'))
      .forEach((k) => localStorage.removeItem(k));
    toast('Account deleted.', 'info');
    setTimeout(() => window.location.href = '/', 800);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Settings</h1>
        <p className="mt-1 text-ink-700 dark:text-ink-50/70">Customize your SkyLove experience.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <h3 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold">
            {theme === 'dark' ? <Moon size={18} className="text-secondary-400" /> : <Sun size={18} className="text-warning-500" />}
            Appearance
          </h3>
          <div className="flex items-center justify-between rounded-2xl bg-white/50 dark:bg-white/5 px-4 py-3">
            <span className="text-sm font-medium">Dark mode</span>
            <button
              onClick={toggle}
              className={`relative h-7 w-12 rounded-full transition ${theme === 'dark' ? 'bg-primary-400' : 'bg-ink-200'}`}
            >
              <span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${theme === 'dark' ? 'left-6' : 'left-1'}`} />
            </button>
          </div>
        </Card>

        <Card>
          <h3 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold">
            <Bell size={18} className="text-primary-400" /> Notifications
          </h3>
          <div className="space-y-2">
            {['Period reminders', 'Mood logging', 'Water nudges', 'Medicine alerts', 'Journal prompts'].map((n) => (
              <Toggle key={n} label={n} defaultOn />
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold">
            <Shield size={18} className="text-accent-400" /> Privacy
          </h3>
          <div className="space-y-2">
            <Toggle label="PIN lock" defaultOn={false} />
            <Toggle label="Biometric lock (coming soon)" defaultOn={false} />
            <div className="rounded-2xl bg-white/50 dark:bg-white/5 px-4 py-3 text-sm text-ink-700/70 dark:text-ink-50/70">
              Your data is stored locally and privately. Partner sharing is off by default.
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold">
            <Download size={18} className="text-success-500" /> Export Data
          </h3>
          <div className="flex flex-wrap gap-2">
            <button onClick={exportJSON} className="btn-ghost text-sm"><FileText size={16} /> Export JSON</button>
            <button onClick={exportCSV} className="btn-ghost text-sm"><FileSpreadsheet size={16} /> Export CSV</button>
          </div>
        </Card>

        <Card className="lg:col-span-2 border-error-500/20">
          <h3 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold text-error-500">
            <Lock size={18} /> Danger Zone
          </h3>
          <div className="flex flex-wrap gap-2">
            <button onClick={logout} className="btn-ghost text-sm">Log out</button>
            <button onClick={deleteAccount} className="btn text-sm bg-error-500/10 text-error-500 hover:bg-error-500/20 px-4 py-2">
              <Trash2 size={16} /> Delete account & all data
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Toggle({ label, defaultOn }: { label: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn ?? false);
  return (
    <div className="flex items-center justify-between rounded-2xl bg-white/50 dark:bg-white/5 px-4 py-3">
      <span className="text-sm font-medium">{label}</span>
      <button
        onClick={() => setOn(!on)}
        className={`relative h-7 w-12 rounded-full transition ${on ? 'bg-primary-400' : 'bg-ink-200'}`}
      >
        <span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${on ? 'left-6' : 'left-1'}`} />
      </button>
    </div>
  );
}

function download(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}
