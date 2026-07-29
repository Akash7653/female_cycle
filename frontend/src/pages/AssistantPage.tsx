import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Heart, Loader2, RefreshCw, X, MessageSquare } from 'lucide-react';
import { Card } from '@/components/Card';
import { getAssistantReply, ASSISTANT_DISCLAIMER } from '@/lib/assistant';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { phaseTip } from '@/lib/assistant';
import { api } from '@/lib/api';

interface Msg {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  suggestions?: string[];
  isLoading?: boolean;
}

const STARTERS = [
  'I have cramps today.',
  "I'm feeling emotional.",
  'I have low energy.',
  'How much water should I drink?',
  'What should I eat during my period?',
  'Help me track my cycle better',
];

const TOPICS = [
  'Cycle support',
  'Hydration tips',
  'Mood balance',
  'Self-care ideas',
  'Nutrition',
  'Sleep quality',
];

const QUICK_ACTIONS = [
  { icon: Heart, label: 'Mood check', prompt: "I want to check in on my mood today" },
  { icon: Sparkles, label: 'Cycle tips', prompt: 'Give me tips for my current cycle phase' },
  { icon: MessageSquare, label: 'Journal help', prompt: 'Help me write a journal entry' },
];

export function AssistantPage() {
  const { prediction } = useData();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: `Hi ${user?.name?.split(' ')[0] || 'love'}! I'm Luna, your SkyLove wellness companion. ${phaseTip(prediction.phase)} How are you feeling today? 💗`,
      suggestions: STARTERS.slice(0, 3),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async (text: string) => {
    if (!text.trim() || isLoading) return;
    
    const userMsg: Msg = { id: Math.random().toString(36).slice(2), role: 'user', text };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setIsLoading(true);

    // Add loading message
    const loadingMsg: Msg = { 
      id: 'loading-' + Math.random().toString(36).slice(2), 
      role: 'assistant', 
      text: '', 
      isLoading: true 
    };
    setMessages((m) => [...m, loadingMsg]);

    try {
      // Try to use Grok API first
      const response = await api.post('/ai', { message: text });
      const botMsg: Msg = { 
        id: Math.random().toString(36).slice(2), 
        role: 'assistant', 
        text: response.data.response,
        suggestions: response.data.suggestions || []
      };
      
      // Remove loading message and add response
      setMessages((m) => [...m.filter(msg => !msg.isLoading), botMsg]);
    } catch (error) {
      // Fallback to local assistant
      const reply = getAssistantReply(text);
      const botMsg: Msg = { 
        id: Math.random().toString(36).slice(2), 
        role: 'assistant', 
        ...reply 
      };
      setMessages((m) => [...m.filter(msg => !msg.isLoading), botMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        text: `Hi ${user?.name?.split(' ')[0] || 'love'}! I'm Luna, your SkyLove wellness companion. ${phaseTip(prediction.phase)} How are you feeling today? 💗`,
        suggestions: STARTERS.slice(0, 3),
      },
    ]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Luna AI Assistant</h1>
          <p className="mt-1 text-ink-700 dark:text-ink-50/70">Your personal wellness companion — powered by AI 💗</p>
        </div>
        <button
          onClick={clearChat}
          className="btn-ghost px-4 py-2 text-sm"
          type="button"
        >
          <RefreshCw size={16} className="mr-2" />
          New Chat
        </button>
      </div>

      <Card className="grid gap-4 rounded-4xl bg-gradient-to-br from-primary-50/80 to-secondary-50/80 p-6 text-ink-700 dark:from-white/10 dark:to-white/5 dark:text-ink-50/80">
        <div className="flex items-center gap-2">
          <Sparkles size={20} className="text-primary-500" />
          <p className="font-semibold">Quick Actions</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action.label}
              type="button"
              onClick={() => send(action.prompt)}
              className="flex items-center gap-3 rounded-2xl bg-white/90 p-4 text-left shadow-sm hover:bg-white dark:bg-ink-900/80 dark:hover:bg-ink-900 transition"
            >
              <action.icon size={20} className="text-primary-500" />
              <div>
                <p className="font-medium text-sm">{action.label}</p>
                <p className="text-xs text-ink-700/60 dark:text-ink-50/60">Tap to start</p>
              </div>
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
                exit={{ opacity: 0, y: -10 }}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-3xl px-4 py-3 ${
                    m.role === 'user'
                      ? 'bg-gradient-to-br from-primary-400 to-secondary-400 text-white rounded-br-md shadow-soft'
                      : 'glass rounded-bl-md'
                  }`}
                >
                  {m.isLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin text-primary-500" />
                      <p className="text-sm text-ink-700 dark:text-ink-50/80">Luna is thinking...</p>
                    </div>
                  ) : (
                    <>
                      {m.role === 'assistant' && (
                        <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-primary-500">
                          <Sparkles size={12} /> Luna AI
                        </div>
                      )}
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{m.text}</p>
                      {m.suggestions && (
                        <ul className="mt-3 space-y-1.5">
                          {m.suggestions.map((s, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-ink-700 dark:text-ink-50/80">
                              <Heart size={12} className="mt-1 shrink-0 text-primary-400" /> {s}
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
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
              disabled={isLoading}
            />
            <button 
              type="submit" 
              className="btn-primary px-4 py-3 disabled:opacity-50"
              disabled={isLoading || !input.trim()}
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
          </form>
          
          <div className="mt-4">
            <p className="mb-2 text-xs font-semibold text-ink-700/60 dark:text-ink-50/60">Suggested questions:</p>
            <div className="flex flex-wrap gap-2">
              {STARTERS.map((s) => (
                <button 
                  key={s} 
                  onClick={() => send(s)} 
                  className="chip bg-primary-100 text-primary-600 dark:bg-primary-400/20 dark:text-primary-300 hover:bg-primary-200 transition text-xs"
                  disabled={isLoading}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          
          <p className="mt-3 text-xs text-ink-700/50 dark:text-ink-50/50">{ASSISTANT_DISCLAIMER}</p>
        </div>
      </Card>
    </div>
  );
}
