import { useState } from 'react';
import { motion } from 'framer-motion';
import { User as UserIcon, Save, Camera } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Card } from '@/components/Card';

export function ProfilePage() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: user?.name ?? '',
    age: user?.age ?? '',
    height: user?.height ?? '',
    weight: user?.weight ?? '',
    cycleLength: user?.cycleLength ?? 28,
    periodLength: user?.periodLength ?? 5,
    language: user?.language ?? 'English',
  });
  const [avatar, setAvatar] = useState<string | undefined>(user?.avatar);

  const onAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result as string);
    reader.readAsDataURL(file);
  };

  const save = () => {
    updateUser({
      name: form.name,
      age: Number(form.age) || undefined,
      height: Number(form.height) || undefined,
      weight: Number(form.weight) || undefined,
      cycleLength: Number(form.cycleLength),
      periodLength: Number(form.periodLength),
      language: form.language,
      avatar,
    });
    toast('Profile updated. 💗');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Profile</h1>
        <p className="mt-1 text-ink-700 dark:text-ink-50/70">Your personal wellness details.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="flex flex-col items-center text-center">
          <div className="relative">
            <div className="grid h-28 w-28 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 text-white text-4xl font-display font-bold shadow-soft">
              {avatar ? <img src={avatar} alt="" className="h-full w-full object-cover" /> : (form.name?.[0]?.toUpperCase() ?? 'S')}
            </div>
            <label className="absolute bottom-0 right-0 grid h-9 w-9 cursor-pointer place-items-center rounded-full bg-white shadow-glass text-primary-500">
              <Camera size={16} />
              <input type="file" accept="image/*" className="hidden" onChange={onAvatar} />
            </label>
          </div>
          <p className="mt-4 font-display text-lg font-semibold">{form.name || 'Your name'}</p>
          <p className="text-sm text-ink-700/60 dark:text-ink-50/60">{user?.email}</p>
        </Card>

        <Card className="lg:col-span-2 space-y-4">
          <h3 className="flex items-center gap-2 font-display text-lg font-semibold">
            <UserIcon size={18} className="text-primary-400" /> Personal Info
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name"><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
            <Field label="Age"><input type="number" className="input" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} /></Field>
            <Field label="Height (cm)"><input type="number" className="input" value={form.height} onChange={(e) => setForm({ ...form, height: e.target.value })} /></Field>
            <Field label="Weight (kg)"><input type="number" className="input" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} /></Field>
            <Field label="Cycle length (days)"><input type="number" className="input" value={form.cycleLength} onChange={(e) => setForm({ ...form, cycleLength: Number(e.target.value) })} /></Field>
            <Field label="Period length (days)"><input type="number" className="input" value={form.periodLength} onChange={(e) => setForm({ ...form, periodLength: Number(e.target.value) })} /></Field>
            <Field label="Language">
              <select className="input" value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })}>
                <option>English</option><option>Spanish</option><option>French</option><option>Hindi</option><option>Arabic</option>
              </select>
            </Field>
          </div>
          <motion.button whileTap={{ scale: 0.97 }} onClick={save} className="btn-primary">
            <Save size={18} /> Save profile
          </motion.button>
        </Card>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium">{label}</label>
      {children}
    </div>
  );
}
