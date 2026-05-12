'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { EnadIAOrb } from './EnadIAOrb';
import { useAppStore } from '@/store/app-store';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const welcomeMessage: Message = {
  id: 'welcome',
  role: 'assistant',
  content: `Olá! Sou a **EnadIA**, sua assistente de estudos para o **ENADE**! 🎓

Estou aqui para ajudar você a se preparar para o Exame Nacional de Desempenho dos Estudantes em **Computação**.

**Como posso ajudar:**
- 📝 Explicar conceitos e resolver questões
- 🎯 Criar questões no estilo ENADE
- 📊 Dicas de estudo por tema
- 💡 Estratégias para o dia da prova

**Meus conhecimentos incluem:**
Algoritmos, Banco de Dados, POO, Redes, Sistemas Operacionais, Engenharia de Software, Arquitetura de Computadores e muito mais!

**Por que não começa me perguntando algo?** Pode ser um conceito que não entendeu, uma questão que errou, ou simplesmente peça um simulado sobre algum tema específico!`,
};

export function JarvisChat() {
  const [messages, setMessages] = useState<Message[]>([welcomeMessage]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatPreFilledQuestion = useAppStore((s) => s.chatPreFilledQuestion);
  const setChatPreFilledQuestion = useAppStore((s) => s.setChatPreFilledQuestion);

  // Handle pre-filled question from other views
  useEffect(() => {
    if (chatPreFilledQuestion) {
      setInput(chatPreFilledQuestion);
      setChatPreFilledQuestion(null);
      inputRef.current?.focus();
    }
  }, [chatPreFilledQuestion, setChatPreFilledQuestion]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const chatHistory = messages
        .filter((m) => m.id !== 'welcome')
        .concat(userMessage)
        .map((m) => ({ role: m.role, content: m.content }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: chatHistory }),
      });

      if (!response.ok) {
        throw new Error('Erro na resposta do servidor');
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '⚠️ Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([welcomeMessage]);
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e293b] bg-[#0d1321]/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <EnadIAOrb size="sm" />
          <div>
            <h2 className="text-sm font-semibold text-cyan-400">Chat EnadIA</h2>
            <p className="text-xs text-slate-500">Assistente de estudos ENADE</p>
          </div>
        </div>
        <button
          onClick={clearChat}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-colors"
          title="Limpar conversa"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <AnimatePresence mode="popLayout">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              {message.role === 'assistant' && (
                <div className="flex-shrink-0 mt-1">
                  <EnadIAOrb size="sm" />
                </div>
              )}

              {/* Message bubble */}
              <div
                className={`max-w-[75%] px-4 py-3 ${
                  message.role === 'assistant' ? 'jarvis-message' : 'jarvis-message-user'
                }`}
              >
                {message.role === 'assistant' && (
                  <p className="text-[10px] font-mono text-cyan-400/60 mb-1 uppercase tracking-wider">
                    ENADIA
                  </p>
                )}
                <div className={`text-sm leading-relaxed ${
                  message.role === 'assistant' ? 'jarvis-chat-content text-slate-300' : 'text-slate-200'
                }`}>
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3"
          >
            <div className="flex-shrink-0 mt-1">
              <EnadIAOrb size="sm" isThinking />
            </div>
            <div className="jarvis-message px-4 py-3">
              <p className="text-[10px] font-mono text-cyan-400/60 mb-2 uppercase tracking-wider">
                ENADIA
              </p>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-cyan-400 typing-dot" />
                <div className="w-2 h-2 rounded-full bg-cyan-400 typing-dot" />
                <div className="w-2 h-2 rounded-full bg-cyan-400 typing-dot" />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-[#1e293b] bg-[#0d1321]/50 backdrop-blur-sm p-4">
        <div className="flex items-end gap-3 max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Faça sua pergunta à EnadIA..."
              rows={1}
              className="w-full resize-none rounded-xl bg-[#1e293b] border border-[#1e293b] focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 text-sm text-slate-200 placeholder-slate-500 px-4 py-3 pr-12 outline-none transition-all min-h-[44px] max-h-32"
              style={{
                height: 'auto',
                overflow: input.split('\n').length > 3 ? 'auto' : 'hidden',
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = Math.min(target.scrollHeight, 128) + 'px';
              }}
            />
          </div>
          <motion.button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-shrink-0 p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <Send size={18} />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
