import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Moon, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

const schema = z.object({
  name: z.string().min(2, 'Enter your name'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'At least 6 characters'),
});

type FormValues = z.infer<typeof schema>;

export function RegisterPage() {
  const { register: doRegister } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', password: '' },
  });

  const onSubmit = async (values: FormValues) => {
    setServerError(null);

    try {
      await doRegister(values.name, values.email, values.password);
      toast('Welcome to SkyLove. 🌸');
      navigate('/app');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Could not create account. Try again.';
      setServerError(message);
      toast(message, 'error');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card p-8"
    >
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="mb-3 grid h-14 w-14 place-items-center rounded-3xl bg-gradient-to-br from-primary-400 to-secondary-400 text-white shadow-soft">
          <Moon size={26} />
        </div>
        <h1 className="font-display text-2xl font-bold">Create your account</h1>
        <p className="mt-1 text-sm text-ink-700/70 dark:text-ink-50/70">Your private wellness journey starts here.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Field icon={User} label="Name" error={errors.name?.message}>
          <input className="input" placeholder="Your name" {...register('name')} />
        </Field>
        <Field icon={Mail} label="Email" error={errors.email?.message}>
          <input type="email" className="input" placeholder="you@example.com" {...register('email')} />
        </Field>
        <Field icon={Lock} label="Password" error={errors.password?.message}>
          <input type="password" className="input" placeholder="••••••••" {...register('password')} />
        </Field>
        {serverError && <p className="text-sm text-error-500">{serverError}</p>}
        <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
          {isSubmitting ? 'Creating…' : 'Create account'} <ArrowRight size={18} />
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-ink-700/70 dark:text-ink-50/70">
        Already have an account?{' '}
        <Link to="/login" className="text-primary-500 hover:underline">Login</Link>
      </p>
    </motion.div>
  );
}

function Field({ icon: Icon, label, error, children }: { icon: React.ElementType; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-50/80">{label}</label>
      <div className="relative">
        <Icon size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-primary-400" />
        <div className="[&_input]:pl-10">{children}</div>
      </div>
      {error && <p className="mt-1 text-xs text-error-500">{error}</p>}
    </div>
  );
}
