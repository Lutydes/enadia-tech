'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { EnadIAOrb } from '@/components/jarvis/EnadIAOrb';
import { ParticleBackground } from '@/components/jarvis/ParticleBackground';
import { useAppStore } from '@/store/app-store';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AlertCircle, Eye, EyeOff, Mail, Lock } from 'lucide-react';

export function LoginForm() {
  const { login, setPanel } = useAppStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Preencha todos os campos');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password: password.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Erro ao fazer login. Verifique suas credenciais.');
        setIsLoading(false);
        return;
      }

      login(data.user, data.token);

      // Route to appropriate panel
      if (data.user.role === 'MASTER') {
        setPanel('master');
      } else if (data.user.role === 'PROFESSOR') {
        setPanel('professor');
      } else {
        setPanel('student');
      }
    } catch {
      setError('Erro de conexão. Tente novamente.');
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#0a0e17] jarvis-grid-bg">
      <ParticleBackground />
      <div className="scanline-overlay" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        {/* Glass Card */}
        <div className="jarvis-card p-8 md:p-10">
          {/* Orb */}
          <div className="flex justify-center mb-6">
            <motion.div
              animate={isLoading ? { scale: [1, 1.05, 1] } : {}}
              transition={isLoading ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut' } : {}}
            >
              <EnadIAOrb size="xl" isThinking={isLoading} />
            </motion.div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-3xl font-bold jarvis-glow tracking-[0.3em] font-mono mb-2"
            >
              EnadIA
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-sm text-gray-400 font-mono tracking-wider"
            >
              Sistema de Preparação ENADE — UNIFECAF
            </motion.p>
          </div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* Email */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-gray-400 tracking-wider uppercase">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-500/40" size={16} />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu.email@unifecaf.br"
                  disabled={isLoading}
                  className="pl-10 h-11 bg-[#0a0e17] border-cyan-500/20 text-white placeholder:text-gray-600 font-mono text-sm focus:border-cyan-500/50 focus:ring-cyan-500/20"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-gray-400 tracking-wider uppercase">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-500/40" size={16} />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isLoading}
                  className="pl-10 pr-10 h-11 bg-[#0a0e17] border-cyan-500/20 text-white placeholder:text-gray-600 font-mono text-sm focus:border-cyan-500/50 focus:ring-cyan-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-cyan-400 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20"
              >
                <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-400 font-mono">{error}</p>
              </motion.div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-sm tracking-wider transition-all hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Autenticando...
                </span>
              ) : (
                'ENTRAR'
              )}
            </Button>
          </motion.form>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-8 pt-6 border-t border-cyan-500/10 text-center"
          >
            <p className="text-[11px] text-gray-600 font-mono">
              Acesso restrito — UNIFECAF • ENADE 2025
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
