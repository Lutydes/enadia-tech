'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Medal,
  Crown,
  Target,
  Clock,
  TrendingUp,
  BarChart3,
  Zap,
  ChevronUp,
  Users,
} from 'lucide-react';

interface RankingEntry {
  position: number;
  userId: string;
  name: string;
  email: string;
  ra: string | null;
  role: string;
  totalAnswered: number;
  totalCorrect: number;
  hitRate: number;
  avgResponseTime: number | null;
}

function getPodiumStyle(position: number) {
  switch (position) {
    case 1:
      return {
        bg: 'bg-gradient-to-br from-yellow-500/20 to-amber-500/10',
        border: 'border-yellow-500/40',
        icon: <Crown size={28} className="text-yellow-400" />,
        badge: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        label: '1º Lugar',
        glow: 'shadow-[0_0_30px_rgba(234,179,8,0.15)]',
      };
    case 2:
      return {
        bg: 'bg-gradient-to-br from-slate-300/20 to-slate-400/10',
        border: 'border-slate-300/40',
        icon: <Medal size={28} className="text-slate-300" />,
        badge: 'bg-slate-300/20 text-slate-300 border-slate-300/30',
        label: '2º Lugar',
        glow: 'shadow-[0_0_20px_rgba(148,163,184,0.1)]',
      };
    case 3:
      return {
        bg: 'bg-gradient-to-br from-amber-700/20 to-orange-700/10',
        border: 'border-amber-700/40',
        icon: <Medal size={28} className="text-amber-600" />,
        badge: 'bg-amber-700/20 text-amber-500 border-amber-700/30',
        label: '3º Lugar',
        glow: 'shadow-[0_0_20px_rgba(180,83,9,0.1)]',
      };
    default:
      return null;
  }
}

export function RankingAlunos() {
  const [ranking, setRanking] = useState<RankingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'hitRate' | 'totalAnswered' | 'avgTime'>('hitRate');

  useEffect(() => {
    async function loadRanking() {
      try {
        const res = await fetch('/api/ranking?limit=50');
        if (res.ok) {
          const data = await res.json();
          setRanking(data.ranking || []);
        }
      } catch {
        // Fallback empty
      }
      setLoading(false);
    }
    loadRanking();
  }, []);

  const sortedRanking = [...ranking].sort((a, b) => {
    switch (sortBy) {
      case 'hitRate':
        return b.hitRate !== a.hitRate ? b.hitRate - a.hitRate : b.totalCorrect - a.totalCorrect;
      case 'totalAnswered':
        return b.totalAnswered - a.totalAnswered;
      case 'avgTime':
        if (a.avgResponseTime === null && b.avgResponseTime === null) return 0;
        if (a.avgResponseTime === null) return 1;
        if (b.avgResponseTime === null) return -1;
        return a.avgResponseTime - b.avgResponseTime; // Faster is better
      default:
        return 0;
    }
  }).map((item, idx) => ({ ...item, position: idx + 1 }));

  const podium = sortedRanking.slice(0, 3);
  const rest = sortedRanking.slice(3);

  const formatTime = (seconds: number | null) => {
    if (seconds === null) return '—';
    if (seconds < 60) return `${seconds}s`;
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-[#1e293b] bg-[#0d1321]/50 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold jarvis-gradient flex items-center gap-2">
              <Trophy size={20} /> Ranking dos Alunos
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Compare seu desempenho com outros estudantes
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Users size={14} className="text-cyan-400/60" />
            <span className="text-xs text-slate-500 font-mono">{ranking.length} participantes</span>
          </div>
        </div>

        {/* Sort buttons */}
        <div className="flex gap-2 mt-4">
          {[
            { key: 'hitRate' as const, label: 'Taxa de Acerto', icon: <Target size={12} /> },
            { key: 'totalAnswered' as const, label: 'Questões', icon: <BarChart3 size={12} /> },
            { key: 'avgTime' as const, label: 'Velocidade', icon: <Clock size={12} /> },
          ].map((opt) => (
            <button
              key={opt.key}
              onClick={() => setSortBy(opt.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                sortBy === opt.key
                  ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                  : 'bg-[#1e293b] border-[#1e293b] text-slate-400 hover:border-slate-600'
              }`}
            >
              {opt.icon} {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-10 h-10 rounded-full border-2 border-cyan-500/30 border-t-cyan-400 animate-spin mx-auto mb-3" />
                <p className="text-slate-500 text-sm">Carregando ranking...</p>
              </div>
            </div>
          ) : ranking.length === 0 ? (
            <div className="text-center py-20">
              <Trophy size={48} className="mx-auto text-slate-700 mb-4" />
              <p className="text-slate-400 text-lg font-medium mb-2">Nenhum dado ainda</p>
              <p className="text-slate-500 text-sm">
                Complete simulados para aparecer no ranking!
              </p>
            </div>
          ) : (
            <>
              {/* Podium - Top 3 */}
              {podium.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Show 2nd place first on desktop for visual podium */}
                  {podium.length >= 2 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="md:mt-8"
                    >
                      <PodiumCard entry={podium[1]} />
                    </motion.div>
                  )}
                  {podium.length >= 1 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <PodiumCard entry={podium[0]} />
                    </motion.div>
                  )}
                  {podium.length >= 3 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="md:mt-12"
                    >
                      <PodiumCard entry={podium[2]} />
                    </motion.div>
                  )}
                </div>
              )}

              {/* Full Ranking Table */}
              <div className="jarvis-card overflow-hidden">
                <div className="p-4 border-b border-[#1e293b] flex items-center gap-2">
                  <BarChart3 size={14} className="text-cyan-400" />
                  <h3 className="text-sm font-semibold text-slate-300">Classificação Completa</h3>
                </div>
                <div className="divide-y divide-[#1e293b]/50">
                  {sortedRanking.map((entry, idx) => (
                    <motion.div
                      key={entry.userId}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className={`flex items-center gap-4 px-4 py-3 hover:bg-white/[0.02] transition-colors ${
                        idx < 3 ? 'bg-cyan-500/[0.02]' : ''
                      }`}
                    >
                      {/* Position */}
                      <div className="w-8 text-center flex-shrink-0">
                        {entry.position <= 3 ? (
                          <span className={`text-sm font-bold ${
                            entry.position === 1 ? 'text-yellow-400' :
                            entry.position === 2 ? 'text-slate-300' :
                            'text-amber-600'
                          }`}>
                            {entry.position <= 3 ? ['🥇', '🥈', '🥉'][entry.position - 1] : entry.position}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-500 font-mono">{entry.position}</span>
                        )}
                      </div>

                      {/* Avatar */}
                      <div className="w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-cyan-400">
                          {entry.name.charAt(0).toUpperCase()}
                        </span>
                      </div>

                      {/* Name & RA */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-200 truncate">{entry.name}</p>
                        <p className="text-[10px] text-slate-500 font-mono">
                          {entry.ra || entry.email}
                        </p>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-4 flex-shrink-0">
                        <div className="text-center hidden sm:block">
                          <p className="text-xs text-slate-500">Questões</p>
                          <p className="text-sm font-mono text-slate-300">{entry.totalAnswered}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-slate-500">Acerto</p>
                          <p className={`text-sm font-mono font-bold ${
                            entry.hitRate >= 70 ? 'text-emerald-400' :
                            entry.hitRate >= 50 ? 'text-yellow-400' :
                            entry.totalAnswered > 0 ? 'text-red-400' : 'text-slate-500'
                          }`}>
                            {entry.totalAnswered > 0 ? `${entry.hitRate}%` : '—'}
                          </p>
                        </div>
                        <div className="text-center hidden sm:block">
                          <p className="text-xs text-slate-500">Tempo</p>
                          <p className="text-sm font-mono text-slate-300">
                            {formatTime(entry.avgResponseTime)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function PodiumCard({ entry }: { entry: RankingEntry }) {
  const style = getPodiumStyle(entry.position);
  if (!style) return null;

  return (
    <div className={`jarvis-card p-5 text-center ${style.glow} ${style.border}`}>
      <div className="flex justify-center mb-3">
        {style.icon}
      </div>
      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${style.badge} border`}>
        {style.label}
      </span>
      <div className="mt-3 mb-1">
        <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto">
          <span className="text-lg font-bold text-cyan-400">
            {entry.name.charAt(0).toUpperCase()}
          </span>
        </div>
      </div>
      <h4 className="text-sm font-semibold text-slate-200 truncate">{entry.name}</h4>
      <p className="text-[10px] text-slate-500 font-mono mb-3">{entry.ra || entry.email}</p>

      <div className="grid grid-cols-3 gap-2">
        <div className="p-2 rounded-lg bg-black/20">
          <p className="text-[10px] text-slate-500">Acerto</p>
          <p className={`text-sm font-mono font-bold ${
            entry.hitRate >= 70 ? 'text-emerald-400' :
            entry.hitRate >= 50 ? 'text-yellow-400' : 'text-red-400'
          }`}>
            {entry.totalAnswered > 0 ? `${entry.hitRate}%` : '—'}
          </p>
        </div>
        <div className="p-2 rounded-lg bg-black/20">
          <p className="text-[10px] text-slate-500">Corretas</p>
          <p className="text-sm font-mono text-slate-300">{entry.totalCorrect}</p>
        </div>
        <div className="p-2 rounded-lg bg-black/20">
          <p className="text-[10px] text-slate-500">Total</p>
          <p className="text-sm font-mono text-slate-300">{entry.totalAnswered}</p>
        </div>
      </div>
    </div>
  );
}
