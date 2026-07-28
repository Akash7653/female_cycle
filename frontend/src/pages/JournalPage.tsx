import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Plus, Trash2, ImagePlus, X } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { useToast } from '@/context/ToastContext';
import { Card } from '@/components/Card';
import { todayISO, formatLongDate } from '@/lib/utils';

export function JournalPage() {
  const { journals, addJournal, deleteJournal } = useData();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(todayISO());
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<string | undefined>();

  const onImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const save = () => {
    if (!content.trim()) {
      toast('Write something first.', 'error');
      return;
    }
    addJournal({ date, title: title || formatLongDate(date), content, image });
    toast('Journal entry saved. 📓');
    setOpen(false);
    setTitle(''); setContent(''); setImage(undefined);
  };

  const prompts = [
    'What made me feel grounded today?',
    'How did my energy change this week?',
    'What self-care did I enjoy most?',
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Journal</h1>
          <p className="mt-1 text-ink-700 dark:text-ink-50/70">A private timeline of your thoughts.</p>
        </div>
        <button onClick={() => setOpen(true)} className="btn-primary">
          <Plus size={18} /> New entry
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="bg-primary-50/80 dark:bg-white/10">
          <p className="text-sm uppercase tracking-[0.24em] text-primary-500">Reflect with intention</p>
          <p className="mt-2 text-sm text-ink-700 dark:text-ink-50/70">Use these quick prompts to turn private notes into powerful cycle insights.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {prompts.map((prompt) => (
              <button key={prompt} onClick={() => setContent(prompt)} className="chip bg-white/90 text-ink-900 dark:bg-ink-900/80 dark:text-ink-50">
                {prompt}
              </button>
            ))}
          </div>
        </Card>
        <Card className="bg-white/90 dark:bg-ink-900/70">
          <p className="text-sm uppercase tracking-[0.24em] text-ink-700/60 dark:text-ink-50/70">Journal benefits</p>
          <ul className="mt-3 space-y-2 text-sm text-ink-700 dark:text-ink-50/70">
            <li>• Spot emotional patterns across your cycle.</li>
            <li>• Track what helps you feel rested and strong.</li>
            <li>• Save private notes for self-care planning.</li>
          </ul>
        </Card>
      </div>

      {journals.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 py-12 text-center">
          <BookOpen size={36} className="text-primary-300" />
          <p className="text-sm text-ink-700/70 dark:text-ink-50/70">Your journal is empty. Write your first entry.</p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {journals.map((j, i) => (
            <motion.div
              key={j.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card hover={false} className="flex h-full flex-col">
                {j.image && (
                  <img src={j.image} alt="" className="mb-3 h-40 w-full rounded-2xl object-cover" />
                )}
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-ink-700/60 dark:text-ink-50/60">{formatLongDate(j.date)}</p>
                    <h3 className="font-display font-semibold">{j.title}</h3>
                  </div>
                  <button onClick={() => { deleteJournal(j.id); toast('Entry deleted.', 'info'); }} className="text-ink-700/40 hover:text-error-500">
                    <Trash2 size={16} />
                  </button>
                </div>
                <p className="mt-2 flex-1 text-sm text-ink-700 dark:text-ink-50/70 whitespace-pre-wrap">{j.content}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-ink-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 glass-card p-6"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-xl font-semibold">New journal entry</h2>
                <button onClick={() => setOpen(false)} className="text-ink-700/60 hover:text-ink-900"><X size={20} /></button>
              </div>
              <div className="space-y-4">
                <input type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} />
                <input className="input" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                <textarea className="input min-h-[140px]" placeholder="What's on your mind?" value={content} onChange={(e) => setContent(e.target.value)} />
                <div className="flex items-center gap-3">
                  <label className="btn-ghost cursor-pointer text-sm">
                    <ImagePlus size={16} /> Attach image
                    <input type="file" accept="image/*" className="hidden" onChange={onImage} />
                  </label>
                  {image && <img src={image} alt="" className="h-12 w-12 rounded-xl object-cover" />}
                </div>
                <button onClick={save} className="btn-primary w-full">Save entry</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
