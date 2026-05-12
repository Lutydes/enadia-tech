'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EnadIAOrb } from '@/components/jarvis/EnadIAOrb';
import { ParticleBackground } from '@/components/jarvis/ParticleBackground';
import { useAppStore } from '@/store/app-store';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  AlertCircle,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  GraduationCap,
  BookOpen,
  CheckCircle2,
} from 'lucide-react';

type TabType = 'login' | 'cadastro' | 'esqueceu';
type RoleType = 'ALUNO' | 'PROFESSOR';
type ModalidadeType = 'EAD' | 'PRESENCIAL' | 'SEMIPRESENCIAL';

export function LoginForm() {
  const { login, setPanel, setCurrentView } = useAppStore();

  // Tab state
  const [activeTab, setActiveTab] = useState<TabType>('login');

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Registration state
  const [regRole, setRegRole] = useState<RoleType>('ALUNO');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regRa, setRegRa] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regCurso, setRegCurso] = useState('');
  const [regPeriodo, setRegPeriodo] = useState('');
  const [regModalidade, setRegModalidade] = useState<ModalidadeType>('PRESENCIAL');
  const [regDisciplina, setRegDisciplina] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // General state
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setError('Preencha todos os campos');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail.trim(), password: loginPassword.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Erro ao fazer login. Verifique suas credenciais.');
        setIsLoading(false);
        return;
      }

      login(data.user, data.token);

      if (data.user.role === 'MASTER') {
        setPanel('master');
      } else if (data.user.role === 'PROFESSOR') {
        setPanel('professor');
      } else {
        setPanel('student');
        setCurrentView('chat');
      }
    } catch {
      setError('Erro de conexão. Tente novamente.');
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Common validation
    if (!regName.trim() || !regEmail.trim() || !regRa.trim() || !regPassword.trim() || !regConfirmPassword.trim()) {
      setError('Preencha todos os campos obrigatórios');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (regPassword.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    // Role-specific validation
    if (regRole === 'ALUNO') {
      if (!regCurso.trim()) {
        setError('Curso é obrigatório para alunos');
        return;
      }
      const periodoNum = parseInt(regPeriodo);
      if (!regPeriodo || isNaN(periodoNum) || periodoNum < 1 || periodoNum > 10) {
        setError('Período deve ser um número entre 1 e 10');
        return;
      }
    }

    if (regRole === 'PROFESSOR') {
      if (!regDisciplina.trim()) {
        setError('Disciplina é obrigatória para professores');
        return;
      }
    }

    setIsLoading(true);

    try {
      const body: Record<string, string | number> = {
        name: regName.trim(),
        email: regEmail.trim(),
        password: regPassword,
        ra: regRa.trim(),
        role: regRole,
      };

      if (regRole === 'ALUNO') {
        body.curso = regCurso.trim();
        body.periodo = parseInt(regPeriodo);
        body.modalidade = regModalidade;
      }

      if (regRole === 'PROFESSOR') {
        body.disciplina = regDisciplina.trim();
      }

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Erro ao criar conta. Tente novamente.');
        setIsLoading(false);
        return;
      }

      // Auto-login after registration
      login(data.user, data.token);

      if (data.user.role === 'MASTER') {
        setPanel('master');
      } else if (data.user.role === 'PROFESSOR') {
        setPanel('professor');
      } else {
        setPanel('student');
        setCurrentView('chat');
      }
    } catch {
      setError('Erro de conexão. Tente novamente.');
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!forgotEmail.trim()) {
      setError('Informe seu email');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Erro ao enviar email de recuperação.');
        setIsLoading(false);
        return;
      }

      setForgotSent(true);
      setIsLoading(false);
    } catch {
      setError('Erro de conexão. Tente novamente.');
      setIsLoading(false);
    }
  };

  const switchTab = (tab: TabType) => {
    setActiveTab(tab);
    setError('');
    setForgotSent(false);
  };

  const tabs: { key: TabType; label: string }[] = [
    { key: 'login', label: 'Login' },
    { key: 'cadastro', label: 'Cadastro' },
    { key: 'esqueceu', label: 'Esqueceu a Senha' },
  ];

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
          <div className="text-center mb-6">
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
              className="text-sm text-slate-400 font-mono tracking-wider"
            >
              EnadIA TECH — Preparação ENADE
            </motion.p>
          </div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="flex rounded-lg bg-[#1e293b] mb-6 overflow-hidden"
          >
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => switchTab(tab.key)}
                className={`
                  flex-1 py-2.5 px-2 text-xs font-mono tracking-wider uppercase transition-all duration-200 relative
                  ${
                    activeTab === tab.key
                      ? 'bg-cyan-500/10 text-cyan-400 border-b-2 border-cyan-400'
                      : 'text-slate-500 hover:text-slate-300 border-b-2 border-transparent'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </motion.div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {/* ===== LOGIN TAB ===== */}
            {activeTab === 'login' && (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleLogin}
                className="space-y-5"
              >
                {/* Email */}
                <div className="space-y-2">
                  <label className="text-xs font-mono text-slate-400 tracking-wider uppercase">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-500/40" size={16} />
                    <Input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="seu.email@unifecaf.br"
                      disabled={isLoading}
                      className="pl-10 h-11 bg-[#0a0e17] border-cyan-500/20 text-white placeholder:text-slate-600 font-mono text-sm focus:border-cyan-500/50 focus:ring-cyan-500/20"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="text-xs font-mono text-slate-400 tracking-wider uppercase">
                    Senha
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-500/40" size={16} />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      disabled={isLoading}
                      className="pl-10 pr-10 h-11 bg-[#0a0e17] border-cyan-500/20 text-white placeholder:text-slate-600 font-mono text-sm focus:border-cyan-500/50 focus:ring-cyan-500/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-400 transition-colors"
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

                {/* Forgot password link */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => switchTab('esqueceu')}
                    className="text-xs font-mono text-slate-500 hover:text-cyan-400 transition-colors tracking-wider"
                  >
                    Esqueceu sua senha?
                  </button>
                </div>
              </motion.form>
            )}

            {/* ===== CADASTRO TAB ===== */}
            {activeTab === 'cadastro' && (
              <motion.form
                key="cadastro"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleRegister}
                className="space-y-5 max-h-[55vh] overflow-y-auto pr-1 custom-scrollbar"
              >
                {/* Role Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-mono text-slate-400 tracking-wider uppercase">
                    Tipo de Conta
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRegRole('ALUNO')}
                      className={`
                        flex flex-col items-center gap-2 p-4 rounded-lg border transition-all duration-200
                        ${
                          regRole === 'ALUNO'
                            ? 'bg-cyan-500/10 border-cyan-400 text-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.15)]'
                            : 'bg-[#0a0e17] border-cyan-500/20 text-slate-500 hover:border-cyan-500/40 hover:text-slate-300'
                        }
                      `}
                    >
                      <GraduationCap size={24} />
                      <span className="text-xs font-mono tracking-wider uppercase">Aluno</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRegRole('PROFESSOR')}
                      className={`
                        flex flex-col items-center gap-2 p-4 rounded-lg border transition-all duration-200
                        ${
                          regRole === 'PROFESSOR'
                            ? 'bg-cyan-500/10 border-cyan-400 text-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.15)]'
                            : 'bg-[#0a0e17] border-cyan-500/20 text-slate-500 hover:border-cyan-500/40 hover:text-slate-300'
                        }
                      `}
                    >
                      <BookOpen size={24} />
                      <span className="text-xs font-mono tracking-wider uppercase">Professor</span>
                    </button>
                  </div>
                </div>

                {/* Nome */}
                <div className="space-y-2">
                  <label className="text-xs font-mono text-slate-400 tracking-wider uppercase">
                    Nome
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-500/40" size={16} />
                    <Input
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="Nome completo"
                      disabled={isLoading}
                      className="pl-10 h-11 bg-[#0a0e17] border-cyan-500/20 text-white placeholder:text-slate-600 font-mono text-sm focus:border-cyan-500/50 focus:ring-cyan-500/20"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-xs font-mono text-slate-400 tracking-wider uppercase">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-500/40" size={16} />
                    <Input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="seu.email@unifecaf.br"
                      disabled={isLoading}
                      className="pl-10 h-11 bg-[#0a0e17] border-cyan-500/20 text-white placeholder:text-slate-600 font-mono text-sm focus:border-cyan-500/50 focus:ring-cyan-500/20"
                    />
                  </div>
                </div>

                {/* RA */}
                <div className="space-y-2">
                  <label className="text-xs font-mono text-slate-400 tracking-wider uppercase">
                    RA
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-500/40" size={16} />
                    <Input
                      type="text"
                      value={regRa}
                      onChange={(e) => setRegRa(e.target.value)}
                      placeholder="Registro Acadêmico"
                      disabled={isLoading}
                      className="pl-10 h-11 bg-[#0a0e17] border-cyan-500/20 text-white placeholder:text-slate-600 font-mono text-sm focus:border-cyan-500/50 focus:ring-cyan-500/20"
                    />
                  </div>
                </div>

                {/* Senha */}
                <div className="space-y-2">
                  <label className="text-xs font-mono text-slate-400 tracking-wider uppercase">
                    Senha
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-500/40" size={16} />
                    <Input
                      type={showRegPassword ? 'text' : 'password'}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      disabled={isLoading}
                      className="pl-10 pr-10 h-11 bg-[#0a0e17] border-cyan-500/20 text-white placeholder:text-slate-600 font-mono text-sm focus:border-cyan-500/50 focus:ring-cyan-500/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-400 transition-colors"
                    >
                      {showRegPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Confirmar Senha */}
                <div className="space-y-2">
                  <label className="text-xs font-mono text-slate-400 tracking-wider uppercase">
                    Confirmar Senha
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-500/40" size={16} />
                    <Input
                      type={showRegConfirmPassword ? 'text' : 'password'}
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="Repita a senha"
                      disabled={isLoading}
                      className="pl-10 pr-10 h-11 bg-[#0a0e17] border-cyan-500/20 text-white placeholder:text-slate-600 font-mono text-sm focus:border-cyan-500/50 focus:ring-cyan-500/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-400 transition-colors"
                    >
                      {showRegConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* ALUNO-specific fields */}
                {regRole === 'ALUNO' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-5"
                  >
                    {/* Curso */}
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-slate-400 tracking-wider uppercase">
                        Curso
                      </label>
                      <div className="relative">
                        <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-500/40" size={16} />
                        <Input
                          type="text"
                          value={regCurso}
                          onChange={(e) => setRegCurso(e.target.value)}
                          placeholder="Ex: Ciência da Computação"
                          disabled={isLoading}
                          className="pl-10 h-11 bg-[#0a0e17] border-cyan-500/20 text-white placeholder:text-slate-600 font-mono text-sm focus:border-cyan-500/50 focus:ring-cyan-500/20"
                        />
                      </div>
                    </div>

                    {/* Período */}
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-slate-400 tracking-wider uppercase">
                        Período
                      </label>
                      <div className="relative">
                        <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-500/40" size={16} />
                        <Input
                          type="number"
                          min={1}
                          max={10}
                          value={regPeriodo}
                          onChange={(e) => setRegPeriodo(e.target.value)}
                          placeholder="1-10"
                          disabled={isLoading}
                          className="pl-10 h-11 bg-[#0a0e17] border-cyan-500/20 text-white placeholder:text-slate-600 font-mono text-sm focus:border-cyan-500/50 focus:ring-cyan-500/20"
                        />
                      </div>
                    </div>

                    {/* Modalidade */}
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-slate-400 tracking-wider uppercase">
                        Modalidade
                      </label>
                      <div className="flex gap-2">
                        {(['EAD', 'PRESENCIAL', 'SEMIPRESENCIAL'] as ModalidadeType[]).map((mod) => (
                          <button
                            key={mod}
                            type="button"
                            onClick={() => setRegModalidade(mod)}
                            className={`
                              flex-1 py-2 px-2 rounded-lg border text-xs font-mono tracking-wider transition-all duration-200
                              ${
                                regModalidade === mod
                                  ? 'bg-cyan-500/10 border-cyan-400 text-cyan-400'
                                  : 'bg-[#0a0e17] border-cyan-500/20 text-slate-500 hover:border-cyan-500/40 hover:text-slate-300'
                              }
                            `}
                          >
                            {mod}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* PROFESSOR-specific fields */}
                {regRole === 'PROFESSOR' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-5"
                  >
                    {/* Disciplina */}
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-slate-400 tracking-wider uppercase">
                        Disciplina que Leciona
                      </label>
                      <div className="relative">
                        <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-500/40" size={16} />
                        <Input
                          type="text"
                          value={regDisciplina}
                          onChange={(e) => setRegDisciplina(e.target.value)}
                          placeholder="Ex: Engenharia de Software"
                          disabled={isLoading}
                          className="pl-10 h-11 bg-[#0a0e17] border-cyan-500/20 text-white placeholder:text-slate-600 font-mono text-sm focus:border-cyan-500/50 focus:ring-cyan-500/20"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

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
                      Criando conta...
                    </span>
                  ) : (
                    'CRIAR CONTA'
                  )}
                </Button>
              </motion.form>
            )}

            {/* ===== ESQUECEU A SENHA TAB ===== */}
            {activeTab === 'esqueceu' && (
              <motion.form
                key="esqueceu"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleForgotPassword}
                className="space-y-5"
              >
                {!forgotSent ? (
                  <>
                    <div className="text-center mb-2">
                      <p className="text-sm text-slate-400 font-mono">
                        Informe seu email e enviaremos um link para redefinir sua senha.
                      </p>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-slate-400 tracking-wider uppercase">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-500/40" size={16} />
                        <Input
                          type="email"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          placeholder="seu.email@unifecaf.br"
                          disabled={isLoading}
                          className="pl-10 h-11 bg-[#0a0e17] border-cyan-500/20 text-white placeholder:text-slate-600 font-mono text-sm focus:border-cyan-500/50 focus:ring-cyan-500/20"
                        />
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
                      className="w-full h-11 bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs tracking-wider transition-all hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                          Enviando...
                        </span>
                      ) : (
                        'ENVIAR LINK DE RECUPERAÇÃO'
                      )}
                    </Button>

                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => switchTab('login')}
                        className="text-xs font-mono text-slate-500 hover:text-cyan-400 transition-colors tracking-wider"
                      >
                        Voltar ao login
                      </button>
                    </div>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="text-center py-4 space-y-4"
                  >
                    <div className="flex justify-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                      >
                        <CheckCircle2 size={48} className="text-cyan-400" />
                      </motion.div>
                    </div>
                    <div>
                      <h3 className="text-lg font-mono text-cyan-400 tracking-wider mb-2">
                        Email Enviado
                      </h3>
                      <p className="text-sm text-slate-400 font-mono leading-relaxed">
                        Se o email estiver cadastrado, você receberá instruções para redefinir sua senha.
                      </p>
                    </div>
                    <Button
                      type="button"
                      onClick={() => {
                        setForgotSent(false);
                        switchTab('login');
                      }}
                      className="h-10 bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs tracking-wider transition-all hover:shadow-[0_0_20px_rgba(0,240,255,0.3)]"
                    >
                      Voltar ao Login
                    </Button>
                  </motion.div>
                )}
              </motion.form>
            )}
          </AnimatePresence>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-8 pt-6 border-t border-cyan-500/10 text-center"
          >
            <p className="text-[11px] text-slate-600 font-mono">
              EnadIA TECH — ENADE 2026
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
