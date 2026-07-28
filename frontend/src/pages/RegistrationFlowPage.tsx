import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Moon, User, Mail, Lock, CalendarDays, Ruler, Scale, Heart, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

const parseNumber = (value: unknown) => {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return undefined;
    const parsed = Number(trimmed);
    return Number.isNaN(parsed) ? undefined : parsed;
  }
  if (typeof value === 'number') return value;
  return undefined;
};

const schema = z.object({
  accountType: z.enum(['myself', 'loved-one']),
  name: z.string().min(2, 'Enter your name'),
  relationship: z.string().optional(),
  lovedOneName: z.string().optional(),
  lovedOneAge: z.preprocess(parseNumber, z.number().min(1).optional()),
  dateOfBirth: z.string().optional(),
  height: z.preprocess(parseNumber, z.number().positive().optional()),
  weight: z.preprocess(parseNumber, z.number().positive().optional()),
  cycleLength: z.preprocess(parseNumber, z.number().positive().optional()),
  periodLength: z.preprocess(parseNumber, z.number().positive().optional()),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'At least 6 characters'),
});

type FormValues = z.infer<typeof schema>;

export function RegistrationFlowPage() {
  const [step, setStep] = useState<'choice' | 'myself' | 'lovedOne'>('choice');
  const { register: doRegister } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { register, handleSubmit, control, watch, setValue, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      accountType: 'myself',
      name: '',
      relationship: '',
      lovedOneName: '',
      lovedOneAge: undefined,
      dateOfBirth: '',
      height: undefined,
      weight: undefined,
      cycleLength: undefined,
      periodLength: undefined,
      email: '',
      password: '',
    },
  });

  const accountType = watch('accountType');

  useEffect(() => {
    setValue('accountType', step === 'lovedOne' ? 'loved-one' : 'myself');
  }, [step, setValue]);

  const onSubmit = async (values: FormValues) => {
    try {
      await doRegister(
        values.name,
        values.email,
        values.password,
        values.accountType,
        values.relationship,
        values.lovedOneName,
        values.lovedOneAge,
        values.dateOfBirth,
        values.height,
        values.weight,
        values.cycleLength,
        values.periodLength,
      );
      toast('Welcome to SkyLove. 🌸');
      navigate('/app');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Could not create account. Try again.';
      toast(message, 'error');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="glass-card p-8">
      <div className="mb-6 text-center">
        <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 text-white shadow-soft">
          <Sparkles size={28} />
        </div>
        <h1 className="font-display text-3xl font-bold">Create your SkyLove account</h1>
        <p className="mt-2 text-sm text-ink-700/70 dark:text-ink-50/70">
          Choose whether you're creating this profile for yourself or with permission to support a loved one.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => { setStep('myself'); setValue('accountType', 'myself'); }}
            className={`rounded-3xl border p-4 text-left transition ${step === 'myself' ? 'border-primary-400 bg-primary-50 shadow-soft' : 'border-white/30 bg-white/70 hover:border-primary-200'}`}
          >
            <p className="text-sm text-primary-500">I want to track my own menstrual cycle</p>
            <p className="mt-2 text-sm text-ink-700 dark:text-ink-50/70">Personal health insights, cycle tracking, and tailored reminders.</p>
          </button>
          <button
            type="button"
            onClick={() => { setStep('lovedOne'); setValue('accountType', 'loved-one'); }}
            className={`rounded-3xl border p-4 text-left transition ${step === 'lovedOne' ? 'border-primary-400 bg-primary-50 shadow-soft' : 'border-white/30 bg-white/70 hover:border-primary-200'}`}
          >
            <p className="text-sm text-secondary-500">I want to support and track my loved one's cycle</p>
            <p className="mt-2 text-sm text-ink-700 dark:text-ink-50/70">Only with explicit permission and clear partner consent.</p>
          </button>
        </div>

        <input type="hidden" value={accountType} {...register('accountType')} />

        {step === 'myself' ? (
          <div className="space-y-4">
            <p className="text-sm font-semibold text-ink-700 dark:text-ink-50/80">My information</p>
            <Field label="Name" error={errors.name?.message}><input className="input" {...register('name')} /></Field>
            <Field label="Date of Birth" error={errors.dateOfBirth?.message}><input type="date" className="input" {...register('dateOfBirth')} /></Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Height (cm)" error={errors.height?.message}><input type="number" className="input" {...register('height')} /></Field>
              <Field label="Weight (kg)" error={errors.weight?.message}><input type="number" className="input" {...register('weight')} /></Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Average cycle length" error={errors.cycleLength?.message}><input type="number" className="input" {...register('cycleLength')} /></Field>
              <Field label="Average period length" error={errors.periodLength?.message}><input type="number" className="input" {...register('periodLength')} /></Field>
            </div>
          </div>
        ) : step === 'lovedOne' ? (
          <div className="space-y-4">
            <p className="text-sm font-semibold text-ink-700 dark:text-ink-50/80">Loved one profile</p>
            <Field label="Your name" error={errors.name?.message}><input className="input" {...register('name')} /></Field>
            <Field label="Relationship" error={errors.relationship?.message}>
              <Controller
                control={control}
                name="relationship"
                render={({ field }) => (
                  <select className="input" {...field}>
                    <option value="">Select relationship</option>
                    <option value="Boyfriend">Boyfriend</option>
                    <option value="Husband">Husband</option>
                    <option value="Fiancé">Fiancé</option>
                    <option value="Partner">Partner</option>
                    <option value="Family Member">Family Member</option>
                    <option value="Friend">Friend</option>
                  </select>
                )}
              />
            </Field>
            <Field label="Loved one’s name" error={errors.lovedOneName?.message}><input className="input" {...register('lovedOneName')} /></Field>
            <Field label="Loved one’s age" error={errors.lovedOneAge?.message}><input type="number" className="input" {...register('lovedOneAge')} /></Field>
            <p className="text-xs text-ink-700/60 dark:text-ink-50/60">Tracking another person’s cycle should only be done with their knowledge and consent.</p>
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-white/40 bg-white/60 p-5 text-sm text-ink-700 dark:bg-white/10 dark:text-ink-50/70">
            Choose how you want to use SkyLove Cycle to continue.
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Email" error={errors.email?.message}><input type="email" className="input" {...register('email')} /></Field>
          <Field label="Password" error={errors.password?.message}><input type="password" className="input" {...register('password')} /></Field>
        </div>

        <button type="submit" disabled={isSubmitting || !['myself', 'lovedOne'].includes(step)} className="btn-primary w-full">
          {isSubmitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>
    </motion.div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-ink-700 dark:text-ink-50/80">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-error-500">{error}</p>}
    </div>
  );
}
