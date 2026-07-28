import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Moon, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export function ForgotPasswordPage() {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      toast('Enter a valid email.', 'error');
      return;
    }
    setSent(true);
    toast('Reset link sent. Check your inbox.');
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
        <h1 className="font-display text-2xl font-bold">Reset password</h1>
        <p className="mt-1 text-sm text-ink-700/70 dark:text-ink-50/70">We'll email you a secure reset link.</p>
      </div>

      {sent ? (
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <CheckCircle2 size={40} className="text-success-500" />
          <p className="text-sm text-ink-700 dark:text-ink-50/70">A reset link is on its way to <strong>{email}</strong>.</p>
          <Link to="/login" className="btn-primary mt-2">Back to login</Link>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Email</label>
            <div className="relative">
              <Mail size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-primary-400" />
              <input
                type="email"
                className="input pl-10"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <button type="submit" className="btn-primary w-full">
            Send reset link <ArrowRight size={18} />
          </button>
          <p className="text-center text-sm text-ink-700/70 dark:text-ink-50/70">
            <Link to="/login" className="text-primary-500 hover:underline">Back to login</Link>
          </p>
        </form>
      )}
    </motion.div>
  );
}
