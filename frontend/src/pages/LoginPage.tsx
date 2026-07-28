import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Moon, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'At least 6 characters'),
});

type FormValues = z.infer<typeof schema>;

export function LoginPage() {
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await login(values.email, values.password);
      toast('Welcome back. 💗');
      navigate('/app');
    } catch {
      toast('Could not log in. Please try again.', 'error');
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
        <h1 className="font-display text-2xl font-bold">Welcome back</h1>
        <p className="mt-1 text-sm text-ink-700/70 dark:text-ink-50/70">Log in to your SkyLove space.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Field icon={Mail} label="Email" error={errors.email?.message}>
          <input type="email" className="input" placeholder="you@example.com" {...register('email')} />
        </Field>
        <Field icon={Lock} label="Password" error={errors.password?.message}>
          <input type="password" className="input" placeholder="••••••••" {...register('password')} />
        </Field>
        <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
          {isSubmitting ? 'Logging in…' : 'Login'} <ArrowRight size={18} />
        </button>
      </form>

      <div className="mt-5 flex items-center justify-between text-sm">
        <Link to="/forgot" className="text-primary-500 hover:underline">Forgot password?</Link>
        <Link to="/register" className="text-ink-700/70 dark:text-ink-50/70 hover:text-primary-500">Create account</Link>
      </div>
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
