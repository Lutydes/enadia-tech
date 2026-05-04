'use client';

import { motion } from 'framer-motion';
import { EnadIAOrb } from '@/components/jarvis/EnadIAOrb';
import { useAppStore, type PanelType } from '@/store/app-store';
import { LogOut, ArrowLeft, Shield, GraduationCap } from 'lucide-react';
import React from 'react';

interface AdminLayoutProps {
  panelType: 'master' | 'professor';
  children: React.ReactNode;
}

export function AdminLayout({ panelType, children }: AdminLayoutProps) {
  const { user, logout, setPanel } = useAppStore();

  const panelTitle = panelType === 'master' ? 'Painel Master' : 'Painel Professor';
  const PanelIcon = panelType === 'master' ? Shield : GraduationCap;

  const handleBackToStudent = () => {
    setPanel('student');
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#0a0e17] jarvis-grid-bg">
      {/* Top Bar */}
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="flex-shrink-0 flex items-center justify-between px-4 md:px-6 py-3 bg-[#0d1321]/90 backdrop-blur-xl border-b border-cyan-500/15 z-50"
      >
        {/* Left: Logo + Title */}
        <div className="flex items-center gap-3">
          <EnadIAOrb size="sm" />
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold jarvis-glow tracking-[0.2em] font-mono">EnadIA</span>
            <div className="hidden sm:block w-px h-5 bg-cyan-500/20" />
            <span className="hidden sm:flex items-center gap-1.5 text-sm text-cyan-400/80 font-mono">
              <PanelIcon size={14} />
              {panelTitle}
            </span>
          </div>
        </div>

        {/* Right: User info + Actions */}
        <div className="flex items-center gap-2 md:gap-3">
          <button
            onClick={handleBackToStudent}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono text-cyan-400/70 border border-cyan-500/20 hover:bg-cyan-500/10 hover:text-cyan-400 transition-all"
          >
            <ArrowLeft size={14} />
            <span className="hidden sm:inline">Voltar ao Estudo</span>
          </button>

          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-cyan-500/10">
            <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center">
              <span className="text-[10px] font-bold text-cyan-400">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className="text-left">
              <p className="text-xs font-medium text-white leading-tight">{user?.name || 'Usuário'}</p>
              <p className="text-[10px] text-gray-500 font-mono">{user?.role || '—'}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono text-red-400/70 border border-red-500/20 hover:bg-red-500/10 hover:text-red-400 transition-all"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </motion.header>

      {/* Content Area */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6"
      >
        <div className="scanline-overlay pointer-events-none" />
        {children}
      </motion.main>
    </div>
  );
}
