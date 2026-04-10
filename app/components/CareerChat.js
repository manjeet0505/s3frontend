'use client';
// app/components/CareerChat.jsx
// Drop this file into: frontend/app/components/CareerChat.jsx
// Then add <CareerChat /> to app/dashboard/page.jsx (or your layout)

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Send, ChevronDown, BookOpen, Briefcase,
  TrendingUp, User, Loader2, Trash2, Plus,
  ChevronLeft, Sparkles,
} from 'lucide-react';
import { getUserId, getUser } from '@/lib/api';
import { chatApi } from '@/lib/api';

const SOURCE_META = {
  resume:    { label: 'Resume',     color: 'bg-blue-500/10 text-blue-400 border-blue-500/20',     Icon: User },
  job_match: { label: 'Job match',  color: 'bg-purple-500/10 text-purple-400 border-purple-500/20', Icon: Briefcase },
  skill_gap: { label: 'Skill gap',  color: 'bg-amber-500/10 text-amber-400 border-amber-500/20',   Icon: TrendingUp },
};

const DEFAULT_QUESTIONS = [
  'Why am I not getting interviews?',
  'What skills should I learn next?',
  'Which job matches fit me best?',
  'How strong is my resume?',
  'What\'s my biggest career gap?',
  'Give me a 30-day action plan',
];

function RenderMarkdown({ text }) {
  const lines = text.split('\n');
  return (
    <div className="space-y-1.5">
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-1" />;
        if (line.startsWith('## ')) return <p key={i} className="text-sm font-semibold text-foreground mt-3 mb-1">{line.slice(3)}</p>;
        if (line.startsWith('### ')) return <p key={i} className="text-sm font-medium text-foreground mt-2">{line.slice(4)}</p>;
        if (line.match(/^[\-\*] /)) return (
          <div key={i} className="flex gap-2 text-sm text-foreground/90">
            <span className="text-primary mt-0.5 shrink-0">•</span>
            <span dangerouslySetInnerHTML={{ __html: inlineFormat(line.slice(2)) }} />
          </div>
        );
        if (line.match(/^\d+\. /)) {
          const dot = line.indexOf('. ');
          return (
            <div key={i} className="flex gap-2 text-sm text-foreground/90">
              <span className="text-primary font-medium shrink-0">{line.slice(0, dot)}.</span>
              <span dangerouslySetInnerHTML={{ __html: inlineFormat(line.slice(dot + 2)) }} />
            </div>
          );
        }
        return <p key={i} className="text-sm text-foreground/90 leading-relaxed" dangerouslySetInnerHTML={{ __html: inlineFormat(line) }} />;
      })}
    </div>
  );
}

function inlineFormat(t) {
  return t
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-medium text-foreground">$1</strong>')
    .replace(/`(.*?)`/g, '<code class="text-xs bg-secondary/60 px-1 py-0.5 rounded font-mono">$1</code>');
}

function SourceBadge({ source }) {
  const meta = SOURCE_META[source.source_type] || SOURCE_META.resume;
  const { Icon } = meta;
  const score = source.relevance_score ? Math.round(source.relevance_score * 100) : null;
  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg border text-xs ${meta.color}`}>
      <Icon className="w-3 h-3 shrink-0" />
      <span className="font-medium truncate max-w-[120px]">{source.source_title || meta.label}</span>
      {score && <span className="opacity-60">{score}%</span>}
    </div>
  );
}

function MessageBubble({ message, isStreaming, onSuggestionClick }) {
  const [showSources, setShowSources] = useState(false);
  const isUser   = message.role === 'user';
  const sources  = message.source_chunks || [];
  const suggests = message.suggested_questions || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col gap-2 ${isUser ? 'items-end' : 'items-start'}`}
    >
      <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
        isUser
          ? 'bg-primary text-primary-foreground rounded-tr-sm'
          : 'bg-secondary/50 border border-border/60 rounded-tl-sm'
      }`}>
        {isUser ? (
          <p className="text-sm">{message.content}</p>
        ) : (
          <>
            <RenderMarkdown text={message.content} />
            {isStreaming && <span className="inline-block w-1.5 h-4 bg-primary/60 ml-0.5 animate-pulse rounded-sm" />}
          </>
        )}
      </div>

      {!isUser && sources.length > 0 && !isStreaming && (
        <div className="max-w-[85%] w-full">
          <button
            onClick={() => setShowSources(s => !s)}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-1.5"
          >
            <BookOpen className="w-3 h-3" />
            {sources.length} source{sources.length !== 1 ? 's' : ''}
            <ChevronDown className={`w-3 h-3 transition-transform ${showSources ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {showSources && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="flex flex-wrap gap-1.5 overflow-hidden">
                {sources.map((s, i) => <SourceBadge key={i} source={s} />)}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {!isUser && suggests.length > 0 && !isStreaming && (
        <div className="max-w-[85%] w-full">
          <p className="text-xs text-muted-foreground mb-1.5">Follow-up:</p>
          <div className="flex flex-col gap-1.5">
            {suggests.map((q, i) => (
              <button key={i} onClick={() => onSuggestionClick(q)}
                className="text-xs px-2.5 py-1.5 rounded-xl border border-border bg-secondary/30 text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all text-left">
                {q}
              </button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default function CareerChat() {
  const [isOpen,       setIsOpen]       = useState(false);
  const [messages,     setMessages]     = useState([]);
  const [input,        setInput]        = useState('');
  const [isSending,    setIsSending]    = useState(false);
  const [convId,       setConvId]       = useState(null);
  const [conversations, setConversations] = useState([]);
  const [showHistory,  setShowHistory]  = useState(false);
  const [indexStatus,  setIndexStatus]  = useState({});

  const bottomRef  = useRef(null);
  const inputRef   = useRef(null);
  const abortRef   = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      loadIndexStatus();
    }
  }, [isOpen]);

  const loadIndexStatus = async () => {
    const userId = getUserId();
    if (!userId) return;
    try {
      const res = await chatApi.getIndexStatus(userId);
      setIndexStatus(res.data?.indexed || {});
    } catch {}
  };

  const loadConversations = async () => {
    const userId = getUserId();
    if (!userId) return;
    try {
      const res = await chatApi.getConversations(userId);
      setConversations(res.data?.conversations || []);
    } catch {}
  };

  const loadConversation = async (id) => {
    const userId = getUserId();
    if (!userId) return;
    try {
      const res = await chatApi.getMessages(userId, id);
      setMessages(res.data?.messages || []);
      setConvId(id);
      setShowHistory(false);
    } catch {}
  };

  const deleteConv = async (id, e) => {
    e.stopPropagation();
    const userId = getUserId();
    if (!userId) return;
    try {
      await chatApi.deleteConversation(userId, id);
      setConversations(prev => prev.filter(c => c.id !== id));
      if (id === convId) startNewChat();
    } catch {}
  };

  const startNewChat = () => {
    if (abortRef.current) abortRef.current.abort();
    setMessages([]);
    setConvId(null);
    setShowHistory(false);
  };

  const sendMessage = useCallback(async (text) => {
    const msg = (typeof text === 'string' ? text : input).trim();
    if (!msg || isSending) return;

    const userId   = getUserId();
    const userInfo = getUser();
    if (!userId) return;

    setInput('');
    setIsSending(true);

    const userMsgId   = `u-${Date.now()}`;
    const streamMsgId = `a-${Date.now()}`;

    setMessages(prev => [
      ...prev,
      { id: userMsgId,   role: 'user',      content: msg },
      { id: streamMsgId, role: 'assistant', content: '', _streaming: true },
    ]);

    try {
      abortRef.current = new AbortController();

      const res = await chatApi.sendMessage(
        userId, msg, convId, userInfo?.name || null
      );

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = '';

      const processBlocks = (raw) => {
        const blocks = raw.split('\n\n');
        for (const block of blocks) {
          if (!block.trim()) continue;
          const lines = block.trim().split('\n');
          let eventType = 'delta', dataLine = '';
          for (const l of lines) {
            if (l.startsWith('event:')) eventType = l.slice(6).trim();
            if (l.startsWith('data:'))  dataLine  = l.slice(5).trim();
          }
          if (!dataLine) continue;
          try {
            const data = JSON.parse(dataLine);
            if (eventType === 'meta') {
              setConvId(data.conversation_id);
            } else if (eventType === 'delta') {
              setMessages(prev => prev.map(m =>
                m.id === streamMsgId ? { ...m, content: m.content + data.text } : m
              ));
            } else if (eventType === 'done') {
              setMessages(prev => prev.map(m =>
                m.id === streamMsgId ? {
                  ...m,
                  _streaming:          false,
                  source_chunks:        data.sources || [],
                  suggested_questions:  data.suggested_questions || [],
                } : m
              ));
            } else if (eventType === 'error') {
              setMessages(prev => prev.map(m =>
                m.id === streamMsgId ? { ...m, content: data.message, _streaming: false } : m
              ));
            }
          } catch {}
        }
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const last = buf.lastIndexOf('\n\n');
        if (last !== -1) {
          processBlocks(buf.slice(0, last + 2));
          buf = buf.slice(last + 2);
        }
      }

    } catch (err) {
      if (err.name !== 'AbortError') {
        setMessages(prev => prev.map(m =>
          m.id === streamMsgId
            ? { ...m, content: 'Connection error. Please try again.', _streaming: false }
            : m
        ));
      }
    } finally {
      setIsSending(false);
    }
  }, [input, isSending, convId]);

  const totalIndexed = Object.values(indexStatus).reduce((a, b) => a + b, 0);
  const isEmpty      = messages.length === 0;

  return (
    <>
      {/* Floating button */}
      <button onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-xl hover:scale-105 transition-transform">
        <Sparkles className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', duration: 0.35, bounce: 0.15 }}
            className="fixed bottom-24 right-6 z-50 w-[400px] max-w-[calc(100vw-2rem)] flex flex-col rounded-3xl border border-border/60 bg-card/95 backdrop-blur-xl shadow-2xl overflow-hidden"
            style={{ height: '580px' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 shrink-0">
              <div className="flex items-center gap-2">
                {showHistory && (
                  <button onClick={() => setShowHistory(false)} className="p-1 rounded-lg hover:bg-secondary transition-colors">
                    <ChevronLeft className="w-4 h-4 text-muted-foreground" />
                  </button>
                )}
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{showHistory ? 'Chat history' : 'Career AI'}</p>
                  {!showHistory && (
                    <p className="text-[11px] text-muted-foreground">
                      {totalIndexed > 0 ? `${totalIndexed} chunks indexed` : 'Upload resume to start'}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1">
                {!showHistory && (
                  <>
                    <button onClick={() => { loadConversations(); setShowHistory(true); }}
                      className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground" title="History">
                      <BookOpen className="w-4 h-4" />
                    </button>
                    <button onClick={startNewChat}
                      className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground" title="New chat">
                      <Plus className="w-4 h-4" />
                    </button>
                  </>
                )}
                <button onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* History panel */}
            {showHistory ? (
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {conversations.length === 0
                  ? <p className="text-center text-sm text-muted-foreground py-8">No conversations yet</p>
                  : conversations.map(conv => (
                    <button key={conv.id} onClick={() => loadConversation(conv.id)}
                      className="w-full flex items-center justify-between p-3 rounded-xl border border-border hover:bg-secondary/50 transition-colors text-left group">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{conv.title || 'Untitled'}</p>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">{conv.last_message}</p>
                      </div>
                      <button onClick={(e) => deleteConv(conv.id, e)}
                        className="ml-2 p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-400 transition-all shrink-0">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </button>
                  ))
                }
              </div>
            ) : (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
                  {isEmpty ? (
                    <div className="h-full flex flex-col justify-center">
                      <div className="text-center mb-5">
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-3">
                          <Sparkles className="w-6 h-6 text-blue-400" />
                        </div>
                        <p className="text-sm font-medium text-foreground">Ask me anything about your career</p>
                        <p className="text-xs text-muted-foreground mt-1">I have full context of your resume, jobs, and skill gaps</p>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {DEFAULT_QUESTIONS.map((q, i) => (
                          <button key={i} onClick={() => sendMessage(q)}
                            className="text-left text-xs px-3 py-2.5 rounded-xl border border-border bg-secondary/20 text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all">
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    messages.map(msg => (
                      <MessageBubble key={msg.id} message={msg}
                        isStreaming={msg._streaming}
                        onSuggestionClick={sendMessage} />
                    ))
                  )}
                  <div ref={bottomRef} />
                </div>

                {/* Input */}
                <div className="px-3 pb-3 pt-2 border-t border-border/50 shrink-0">
                  <div className="flex gap-2 items-end">
                    <textarea ref={inputRef} value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
                      placeholder="Ask about your career..."
                      rows={1}
                      className="flex-1 resize-none rounded-2xl border border-border bg-secondary/30 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all max-h-32"
                      style={{ minHeight: '42px' }}
                      onInput={e => { e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px'; }}
                    />
                    <button onClick={() => sendMessage(input)} disabled={!input.trim() || isSending}
                      className="w-10 h-10 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0">
                      {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-muted-foreground text-center mt-2">
                    Shift+Enter for new line · GPT-4o + RAG
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}