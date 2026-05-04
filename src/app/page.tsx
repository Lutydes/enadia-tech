'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store/app-store';
import { JarvisSidebar } from '@/components/jarvis/JarvisSidebar';
import { JarvisChat } from '@/components/jarvis/JarvisChat';
import { SimuladoEnade } from '@/components/jarvis/SimuladoEnade';
import { RevisaoTemas } from '@/components/jarvis/RevisaoTemas';
import { Dashboard } from '@/components/jarvis/Dashboard';
import { DicasEnade } from '@/components/jarvis/DicasEnade';
import { RankingAlunos } from '@/components/jarvis/RankingAlunos';
import { ParticleBackground } from '@/components/jarvis/ParticleBackground';
import { LoginForm } from '@/components/auth/LoginForm';
import { MasterPanel } from '@/components/admin/MasterPanel';
import { ProfessorPanel } from '@/components/admin/ProfessorPanel';
import { AnimatePresence, motion } from 'framer-motion';
import { useSyncExternalStore } from 'react';

const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export default function Home() {
  const { currentView, user, isLoading, currentPanel, restoreSession } = useAppStore();
  const mounted = useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot);

  const { login, setPanel } = useAppStore();

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  // Auto-login as master
  useEffect(() => {
    if (mounted && !user) {
      login(
        { id: 'master', name: 'Coordenação ENADE', email: 'master@unifecaf.br', role: 'MASTER', ra: 'MASTER001' },
        'auto-master-token'
      );
      setPanel('master');
    }
  }, [mounted, user, login, setPanel]);

  if (!mounted || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0a0e17]">
        <div className="text-center">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="w-12 h-12 rounded-full border-2 border-cyan-500/30 border-t-cyan-400 animate-spin" />
          </div>
          <p className="text-cyan-400/60 font-mono text-sm tracking-widest">INICIALIZANDO ENADIA...</p>
        </div>
      </div>
    );
  }

  // Auth gate: show login if no user
  if (!user) {
    return <LoginForm />;
  }

  // Master panel
  if (currentPanel === 'master' && user.role === 'MASTER') {
    return <MasterPanel />;
  }

  // Professor panel
  if (currentPanel === 'professor' && user.role === 'PROFESSOR') {
    return <ProfessorPanel />;
  }

  // Default: Student view
  return (
    <div className="flex h-screen overflow-hidden bg-[#0a0e17] jarvis-grid-bg">
      <ParticleBackground />
      <div className="scanline-overlay" />
      <JarvisSidebar />
      <main className="flex-1 overflow-hidden relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {currentView === 'chat' && <JarvisChat />}
            {currentView === 'simulado' && <SimuladoEnade />}
            {currentView === 'revisao' && <RevisaoTemas />}
            {currentView === 'dashboard' && <Dashboard />}
            {currentView === 'dicas' && <DicasEnade />}
            {currentView === 'ranking' && <RankingAlunos />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
