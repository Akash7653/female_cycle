import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Heart } from 'lucide-react';
import { Card } from '@/components/Card';
import { getAssistantReply, ASSISTANT_DISCLAIMER } from '@/lib/assistant';
import { useData } from '@/context/DataContext';
import { phaseTip } from '@/lib/assistant';

interface Msg {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  suggestions?: string[];
}

const STARTERS = [
  'I have cramps today.',
  "I'm feeling emotional.",
  'I have low energy.',
  'How much water should I drink?',
];

const TOPICS = [
  'Cycle support',
  'Hydration tips',
  'Mood balance',
  'Self-care ideas',
];

export function AssistantPage() {
  const { prediction } = useData();
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: `Hi love. I'm your SkyLove wellness companion. ${phaseTip(prediction.phase)} How are you feeling today? 💗`,
      suggestions: STARTERS,
    },
  ]);
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Msg = { id: Math.random().toString(36).slice(2), role: 'user', text };
    const reply = getAssistantReply(text);
    const botMsg: Msg = { id: Math.random().toString(36).slice(2), role: 'assistant', ...reply };
    setMessages((m) => [...m, userMsg, botMsg]);
    setInput('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">AI Wellness Assistant</h1>
        <p className="mt-1 text-ink-700 dark:text-ink-50/70">Gentle, general wellness guidance — anytime.</p>
      </div>

      <Card className="grid gap-4 rounded-4xl bg-primary-50/80 p-6 text-ink-700 dark:bg-white/10 dark:text-ink-50/80">
        <p className="font-semibold">Try asking about:</p>
        <div className="flex flex-wrap gap-2">
          {TOPICS.map((topic) => (
            <button key={topic} type="button" onClick={() => send(topic)} className="chip bg-white/90 text-ink-900 dark:bg-ink-900/80 dark:text-ink-50">
              {topic}
            </button>
          ))}
        </div>
      </Card>

      <Card className="flex flex-col" hover={false}>
        <div className="flex-1 space-y-4 overflow-y-auto" style={{ maxHeight: '50vh' }}>
          <AnimatePresence>
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-3xl px-4 py-3 ${
                    m.role === 'user'
                      ? 'bg-primary-400 text-white rounded-br-md'
                      : 'glass rounded-bl-md'
                  }`}
                >
                  {m.role === 'assistant' && (
                    <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-primary-500">
                      <Sparkles size={12} /> SkyLove
                    </div>
                  )}
                  <p className="text-sm whitespace-pre-wrap">{m.text}</p>
                  {m.suggestions && (
                    <ul className="mt-3 space-y-1.5">
                      {m.suggestions.map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-ink-700 dark:text-ink-50/80">
                          <Heart size={12} className="mt-1 shrink-0 text-primary-400" /> {s}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={endRef} />
        </div>

        <div className="mt-4 border-t border-white/40 dark:border-white/10 pt-4">
          <form
            onSubmit={(e) => { e.preventDefault(); send(input); }}
            className="flex items-center gap-2"
          >
            <input
              className="input flex-1"
              placeholder="Tell me how you're feeling…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="btn-primary px-4 py-3">
              <Send size={18} />
            </button>
          </form>
          <div className="mt-3 flex flex-wrap gap-2">
            {STARTERS.map((s) => (
              <button key={s} onClick={() => send(s)} className="chip bg-primary-100 text-primary-600 dark:bg-primary-400/20 dark:text-primary-300 hover:bg-primary-200 transition">
                {s}
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs text-ink-700/50 dark:text-ink-50/50">{ASSISTANT_DISCLAIMER}</p>
        </div>
      </Card>
    </div>
  );
}
