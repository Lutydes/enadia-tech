'use client';

import { motion } from 'framer-motion';
import {
  MessageSquare,
  FileQuestion,
  BookOpen,
  BarChart3,
  Lightbulb,
  Trophy,
  Menu,
  X,
  Lock,
  Shield,
  LogOut,
  User,
} from 'lucide-react';
import { useAppStore, ViewType } from '@/store/app-store';
import { EnadIAOrb } from './EnadIAOrb';
import { usePhaseAccess, PHASE_COLORS, PHASE_NAMES } from '@/hooks/usePhaseAccess';

interface NavItem {
  view: ViewType;
  label: string;
  icon: React.ReactNode;
  requiredPhase: number | null; // null = always available
}

const navItems: NavItem[] = [
  { view: 'chat', label: 'Chat EnadIA', icon: <MessageSquare size={18} />, requiredPhase: 1 },
  { view: 'simulado', label: 'Simulado ENADE', icon: <FileQuestion size={18} />, requiredPhase: 1 },
  { view: 'revisao', label: 'Revisão por Tema', icon: <BookOpen size={18} />, requiredPhase: 1 },
  { view: 'dashboard', label: 'Dashboard', icon: <BarChart3 size={18} />, requiredPhase: 2 },
  { view: 'dicas', label: 'Dicas', icon: <Lightbulb size={18} />, requiredPhase: 2 },
  { view: 'ranking', label: 'Ranking', icon: <Trophy size={18} />, requiredPhase: 2 },
];

export function JarvisSidebar() {
  const { currentView, setCurrentView, sidebarOpen, toggleSidebar, setSidebarOpen, user, logout, setPanel } = useAppStore();
  const { currentPhase, loading: phaseLoading, isViewEnabled, getMinPhaseForView } = usePhaseAccess();

  const handleNavClick = (view: ViewType, requiredPhase: number | null) => {
    // Check if view is enabled by phase
    if (requiredPhase && !isViewEnabled(view)) return;
    setCurrentView(view);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const isAdmin = user?.role === 'MASTER' || user?.role === 'PROFESSOR';

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg bg-[#0d1321] border border-[#1e293b] text-cyan-400 hover:bg-[#1e293b] transition-colors"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: sidebarOpen ? 0 : -280,
          width: sidebarOpen ? 280 : 0,
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed md:relative z-40 h-full flex-shrink-0 overflow-hidden"
      >
        <div className="w-[280px] h-full bg-[#0d1321]/95 backdrop-blur-xl border-r border-[#1e293b] flex flex-col">
          {/* Logo */}
          <div className="p-6 flex flex-col items-center gap-3">
            <EnadIAOrb size="xl" />
            <div className="text-center">
              <h1 className="text-xl font-bold jarvis-glow tracking-[0.3em]">EnadIA</h1>
              <p className="text-[10px] text-cyan-400/60 font-mono tracking-widest uppercase">
                ENADE Assistant
              </p>
            </div>
          </div>

          {/* A. Phase Badge */}
          <div className="px-4 mb-2">
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-center justify-center"
              style={{
                backgroundColor: `${PHASE_COLORS[currentPhase?.phase || 1]}10`,
                border: `1px solid ${PHASE_COLORS[currentPhase?.phase || 1]}20`,
              }}
            >
              <div
                className="w-2 h-2 rounded-full animate-pulse flex-shrink-0"
                style={{ backgroundColor: PHASE_COLORS[currentPhase?.phase || 1] }}
              />
              <span
                className="text-[10px] font-bold uppercase tracking-wider"
                style={{ color: PHASE_COLORS[currentPhase?.phase || 1] }}
              >
                {phaseLoading
                  ? 'Carregando fase...'
                  : currentPhase
                    ? `Fase ${currentPhase.phase}: ${PHASE_NAMES[currentPhase.phase]}`
                    : 'Fase 1: Diagnóstico'}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="mx-4 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

          {/* B. Navigation with lock icons */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = currentView === item.view;
              const isEnabled = item.requiredPhase === null || isViewEnabled(item.view);
              const minPhase = getMinPhaseForView(item.view);

              return (
                <motion.button
                  key={item.view}
                  onClick={() => handleNavClick(item.view, item.requiredPhase)}
                  whileHover={isEnabled ? { x: 4 } : {}}
                  whileTap={isEnabled ? { scale: 0.98 } : {}}
                  disabled={!isEnabled}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    !isEnabled
                      ? 'text-slate-600 opacity-50 cursor-not-allowed'
                      : isActive
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(0,240,255,0.1)]'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                  }`}
                  title={
                    !isEnabled && minPhase
                      ? `Disponível na Fase ${minPhase}: ${PHASE_NAMES[minPhase]}`
                      : item.label
                  }
                >
                  <span className={isActive ? 'text-cyan-400' : ''}>
                    {!isEnabled ? <Lock size={18} className="text-slate-600" /> : item.icon}
                  </span>
                  <span className="flex-1 text-left">{item.label}</span>
                  {!isEnabled && minPhase && (
                    <span className="text-[9px] text-slate-600 font-mono">F{minPhase}</span>
                  )}
                  {isActive && isEnabled && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400"
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </motion.button>
              );
            })}
          </nav>

          {/* C. User info section at bottom */}
          <div className="p-4 border-t border-[#1e293b]">
            {/* User info */}
            {user && (
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-cyan-400">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-300 truncate">{user.name}</p>
                  <p className="text-[9px] text-slate-500">
                    {user.role === 'MASTER' && 'Gestor Master'}
                    {user.role === 'PROFESSOR' && user.disciplina}
                    {user.role === 'ALUNO' && [user.curso, user.periodo ? `${user.periodo}º período` : null].filter(Boolean).join(' • ')}
                  </p>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
                      user.role === 'MASTER'
                        ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                        : user.role === 'PROFESSOR'
                          ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                          : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                    }`}
                  >
                    {user.role}
                  </span>
                </div>
              </div>
            )}

            {/* Admin panel button */}
            {isAdmin && (
              <button
                onClick={() => setPanel(user?.role === 'MASTER' ? 'master' : 'professor')}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all mb-1"
              >
                <Shield size={14} />
                <span>{user?.role === 'MASTER' ? 'Painel Gestor' : 'Painel Professor'}</span>
              </button>
            )}

            {/* Logout button */}
            <button
              onClick={logout}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-red-400/70 hover:text-red-400 hover:bg-red-500/5 transition-all"
            >
              <LogOut size={14} />
              <span>Sair</span>
            </button>

            {/* System status */}
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono">System Online</span>
            </div>
            <p className="text-[10px] text-slate-600 mt-1 font-mono">
              v2.0.0 • ENADE 2025
            </p>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
