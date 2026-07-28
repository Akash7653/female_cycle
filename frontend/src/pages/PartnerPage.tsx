import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, ShieldCheck, Heart, Bell, Sparkles } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { useToast } from '@/context/ToastContext';
import { storage } from '@/lib/storage';
import { Card } from '@/components/Card';
import type { PartnerPermissions } from '@/lib/types';

export function PartnerPage() {
  const { prediction, medicines, journals, symptoms } = useData();
  const { toast } = useToast();
  const [perms, setPerms] = useState<PartnerPermissions>(() => storage.getPartner());

  const update = (patch: Partial<PartnerPermissions>) => {
    const next = { ...perms, ...patch };
    setPerms(next);
    storage.setPartner(next);
  };

  const toggleMain = () => {
    const next = !perms.enabled;
    update({ enabled: next });
    toast(next ? 'Partner mode enabled. You control what is shared.' : 'Partner mode disabled.', next ? 'success' : 'info');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Partner Mode</h1>
        <p className="mt-1 text-ink-700 dark:text-ink-50/70">Optional, off by default. You control every detail.</p>
      </div>

      <Card className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-secondary-400 to-primary-400 text-white shadow-soft">
            <Users size={22} />
          </div>
          <div>
            <p className="font-display font-semibold">Enable Partner Mode</p>
            <p className="text-xs text-ink-700/60 dark:text-ink-50/60">Share gentle reminders with someone who cares.</p>
          </div>
        </div>
        <button
          onClick={toggleMain}
          className={`relative h-7 w-12 rounded-full transition ${perms.enabled ? 'bg-primary-400' : 'bg-ink-200'}`}
        >
          <span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${perms.enabled ? 'left-6' : 'left-1'}`} />
        </button>
      </Card>

      {perms.enabled && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
          <Card>
            <label className="mb-1.5 block text-sm font-medium">Partner's name</label>
            <input
              className="input max-w-sm"
              placeholder="e.g. Alex"
              value={perms.partnerName ?? ''}
              onChange={(e) => update({ partnerName: e.target.value })}
            />
          </Card>

          <Card>
            <h3 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold">
              <ShieldCheck size={18} className="text-accent-400" /> What can they see?
            </h3>
            <div className="space-y-2">
              <PermToggle label="Days until next period" icon={Heart} perms={perms} field="shareDaysUntil" update={update} defaultOn />
              <PermToggle label="General reminders" icon={Bell} perms={perms} field="shareReminders" update={update} defaultOn />
              <PermToggle label="Support suggestions" icon={Sparkles} perms={perms} field="shareSupport" update={update} defaultOn />
              <PermToggle label="Journal entries" icon={Heart} perms={perms} field="shareJournal" update={update} />
              <PermToggle label="Symptoms" icon={Heart} perms={perms} field="shareSymptoms" update={update} />
              <PermToggle label="Medical history" icon={Heart} perms={perms} field="shareMedical" update={update} />
            </div>
            <p className="mt-3 rounded-2xl bg-error-500/10 px-4 py-3 text-xs text-error-600 dark:text-error-400">
              Journal, symptoms, private notes, and medical history are <strong>never</strong> shared unless you explicitly turn them on.
            </p>
          </Card>

          <Card>
            <h3 className="mb-3 font-display text-lg font-semibold">Partner Preview</h3>
            <div className="space-y-2 text-sm">
              {perms.shareDaysUntil && (
                <div className="rounded-2xl bg-white/50 dark:bg-white/5 px-4 py-3">
                  <span className="text-ink-700/60 dark:text-ink-50/60">Next period in</span>{' '}
                  <strong>{prediction.daysUntil} days</strong>
                </div>
              )}
              {perms.shareReminders && (
                <div className="rounded-2xl bg-white/50 dark:bg-white/5 px-4 py-3">
                  {medicines.filter((m) => !m.completed).length} medicine reminders pending
                </div>
              )}
              {perms.shareSupport && (
                <div className="rounded-2xl bg-white/50 dark:bg-white/5 px-4 py-3">
                  "Be patient and kind today." — a gentle support note
                </div>
              )}
              {perms.shareJournal && journals[0] && (
                <div className="rounded-2xl bg-white/50 dark:bg-white/5 px-4 py-3">
                  Latest journal: "{journals[0].title}"
                </div>
              )}
              {perms.shareSymptoms && symptoms[0] && (
                <div className="rounded-2xl bg-white/50 dark:bg-white/5 px-4 py-3">
                  Recent symptoms: {symptoms[0].symptoms.join(', ')}
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

function PermToggle({
  label, icon: Icon, perms, field, update, defaultOn,
}: {
  label: string;
  icon: React.ElementType;
  perms: PartnerPermissions;
  field: keyof PartnerPermissions;
  update: (patch: Partial<PartnerPermissions>) => void;
  defaultOn?: boolean;
}) {
  const on = perms[field] as boolean;
  return (
    <div className="flex items-center justify-between rounded-2xl bg-white/50 dark:bg-white/5 px-4 py-3">
      <span className="flex items-center gap-2 text-sm font-medium">
        <Icon size={14} className={defaultOn ? 'text-success-500' : 'text-ink-700/40'} /> {label}
      </span>
      <button
        onClick={() => update({ [field]: !on } as Partial<PartnerPermissions>)}
        className={`relative h-7 w-12 rounded-full transition ${on ? 'bg-primary-400' : 'bg-ink-200'}`}
      >
        <span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${on ? 'left-6' : 'left-1'}`} />
      </button>
    </div>
  );
}
