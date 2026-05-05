'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Target,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  BookOpen,
  MessageSquare,
  Trophy,
  AlertTriangle,
  ArrowRight,
  Activity,
  Flame,
  Zap,
} from 'lucide-react';
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { useAppStore } from '@/store/app-store';
// Phase system removed - all features unlocked

interface DashboardStats {
  overview: {
    totalResponses: number;
    correctResponses: number;
    incorrectResponses: number;
    hitRate: number;
    simuladosTaken: number;
    avgResponseTime: number | null;
    bestMicroarea: { name: string; hitRate: number; total: number } | null;
    worstMicroarea: { name: string; hitRate: number; total: number } | null;
  };
  byMicroarea: Array<{
    microareaId: string;
    name: string;
    code: string;
    color: string;
    macroarea: string;
    total: number;
    correct: number;
    hitRate: number;
  }>;
  byMacroarea: Array<{
    name: string;
    total: number;
    correct: number;
    hitRate: number;
  }>;
  byDifficulty: Array<{
    difficulty: string;
    total: number;
    correct: number;
    hitRate: number;
  }>;
  recentResponses: Array<{
    id: string;
    isCorrect: boolean | null;
    responseTime: number | null;
    createdAt: string;
    answer: string;
    microarea: string;
    difficulty: string | null;
  }>;
  triEvolution: Array<{
    date: string;
    theta: number;
    cumulativeCorrect: number;
    cumulativeTotal: number;
  }>;
  allMicroareas: Array<{
    id: string;
    name: string;
    code: string;
    color: string;
    macroarea: string;
  }>;
}

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) {
  if (active && payload && payload.length) {
    return (
      <div className="jarvis-card p-3 text-xs border border-cyan-500/20">
        <p className="text-slate-300 font-medium">{label || payload[0].name}</p>
        <p style={{ color: payload[0].color }} className="font-mono">{payload[0].value}%</p>
      </div>
    );
  }
  return null;
}

function TriTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string }>; label?: string }) {
  if (active && payload && payload.length) {
    return (
      <div className="jarvis-card p-3 text-xs border border-cyan-500/20">
        <p className="text-slate-300 font-medium">{label}</p>
        <p className="text-cyan-400 font-mono">θ = {payload[0].value.toFixed(2)}</p>
      </div>
    );
  }
  return null;
}

export function Dashboard() {
  const { token, setCurrentView, totalAnswered, totalCorrect, topicStats, quizHistory } = useAppStore();
  // Phase system removed - all features unlocked
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch('/api/dashboard/stats', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch {
        // Fallback to local store data
      }
      setLoading(false);
    }
    loadStats();
  }, [token]);

  // Use API data if available, fallback to local store
  const overview = stats?.overview || {
    totalResponses: totalAnswered,
    correctResponses: totalCorrect,
    incorrectResponses: totalAnswered - totalCorrect,
    hitRate: totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0,
    simuladosTaken: quizHistory.length,
    avgResponseTime: null,
    bestMicroarea: null,
    worstMicroarea: null,
  };

  const { hitRate, totalResponses, correctResponses, simuladosTaken } = overview;

  // Radar chart data — performance by macroarea
  const radarData = useMemo(() => {
    if (stats?.byMacroarea && stats.byMacroarea.length > 0) {
      return stats.byMacroarea.map((ma) => ({
        subject: ma.name.length > 18 ? ma.name.substring(0, 18) + '...' : ma.name,
        fullSubject: ma.name,
        pontuação: ma.hitRate,
      }));
    }
    // Fallback from local topicStats
    return [
      { subject: 'Fundamentos', fullSubject: 'Fundamentos da Computação', pontuação: 0 },
      { subject: 'Teoria', fullSubject: 'Teoria da Computação', pontuação: 0 },
      { subject: 'Paradigmas', fullSubject: 'Paradigmas de Programação', pontuação: 0 },
      { subject: 'Algoritmos', fullSubject: 'Algoritmos', pontuação: 0 },
      { subject: 'Desenvolvimento', fullSubject: 'Desenvolvimento', pontuação: 0 },
      { subject: 'Segurança/IA', fullSubject: 'Segurança/IA', pontuação: 0 },
    ];
  }, [stats]);

  // Heatmap data — performance by microarea
  const heatmapData = useMemo(() => {
    if (stats?.allMicroareas && stats.allMicroareas.length > 0) {
      return stats.allMicroareas.map((ma) => {
        const perf = stats.byMicroarea.find((m) => m.microareaId === ma.id);
        return {
          id: ma.id,
          name: ma.name,
          code: ma.code,
          color: ma.color,
          macroarea: ma.macroarea,
          hitRate: perf?.hitRate ?? null,
          total: perf?.total ?? 0,
          correct: perf?.correct ?? 0,
        };
      });
    }
    return [];
  }, [stats]);

  // TRI evolution data
  const triData = useMemo(() => {
    if (stats?.triEvolution && stats.triEvolution.length > 1) {
      // Sample every N points to avoid crowding
      const step = Math.max(1, Math.floor(stats.triEvolution.length / 20));
      return stats.triEvolution
        .filter((_, i) => i % step === 0 || i === stats.triEvolution.length - 1)
        .map((t, i) => ({
          index: i + 1,
          theta: t.theta,
          date: new Date(t.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        }));
    }
    return [];
  }, [stats]);

  // Recent responses
  const recentActivity = stats?.recentResponses || [];

  // Motivational message
  const getMotivation = () => {
    if (totalResponses === 0) {
      return {
        message: 'Comece resolvendo simulados para ver seu desempenho aqui!',
        icon: <Target className="w-6 h-6 text-cyan-400" />,
        color: 'text-cyan-400',
      };
    }
    if (hitRate >= 80) {
      return {
        message: 'Excelente desempenho! Você está muito bem preparado para o ENADE!',
        icon: <Trophy className="w-6 h-6 text-emerald-400" />,
        color: 'text-emerald-400',
      };
    }
    if (hitRate >= 60) {
      return {
        message: 'Bom progresso! Continue praticando e você chegará lá!',
        icon: <TrendingUp className="w-6 h-6 text-yellow-400" />,
        color: 'text-yellow-400',
      };
    }
    return {
      message: 'Não desanime! Revisar os fundamentos é o melhor caminho. Use a revisão por tema!',
      icon: <BookOpen className="w-6 h-6 text-blue-400" />,
      color: 'text-blue-400',
    };
  };

  const motivation = getMotivation();

  const getHeatmapColor = (hitRate: number | null, total: number) => {
    if (total === 0) return 'bg-slate-800/50 border-slate-700/50';
    if (hitRate === null) return 'bg-slate-800/50 border-slate-700/50';
    if (hitRate >= 70) return 'bg-emerald-500/15 border-emerald-500/30';
    if (hitRate >= 50) return 'bg-yellow-500/15 border-yellow-500/30';
    if (hitRate >= 30) return 'bg-orange-500/15 border-orange-500/30';
    return 'bg-red-500/15 border-red-500/30';
  };

  const getHeatmapTextColor = (hitRate: number | null, total: number) => {
    if (total === 0 || hitRate === null) return 'text-slate-500';
    if (hitRate >= 70) return 'text-emerald-400';
    if (hitRate >= 50) return 'text-yellow-400';
    if (hitRate >= 30) return 'text-orange-400';
    return 'text-red-400';
  };

  const getHeatmapDot = (hitRate: number | null, total: number) => {
    if (total === 0 || hitRate === null) return 'bg-slate-600';
    if (hitRate >= 70) return 'bg-emerald-500';
    if (hitRate >= 50) return 'bg-yellow-500';
    if (hitRate >= 30) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-[#1e293b] bg-[#0d1321]/50 backdrop-blur-sm">
        <h2 className="text-lg font-semibold jarvis-gradient">Dashboard</h2>
        <p className="text-xs text-slate-500 mt-1">Acompanhe seu desempenho nos simulados</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* EnadIA TECH Banner */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="jarvis-card p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full animate-pulse bg-[#00f0ff]" />
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#00f0ff]">
                    EnadIA TECH
                  </span>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Todas as funcionalidades desbloqueadas
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Zap size={14} className="text-[#00f0ff]" />
              </div>
            </div>
          </motion.div>

          {/* Motivation banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="jarvis-card p-5 flex items-center gap-4"
          >
            <div className="flex-shrink-0">{motivation.icon}</div>
            <p className={`text-sm font-medium ${motivation.color}`}>{motivation.message}</p>
          </motion.div>

          {/* B. KPI Cards Row */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              {
                label: 'Questões Respondidas',
                value: totalResponses,
                icon: <BarChart3 size={18} className="text-cyan-400" />,
              },
              {
                label: 'Taxa de Acerto',
                value: `${hitRate}%`,
                icon: <Target size={18} className="text-emerald-400" />,
              },
              {
                label: 'Simulados Completos',
                value: simuladosTaken,
                icon: <Clock size={18} className="text-blue-400" />,
              },
              {
                label: 'Melhor Microárea',
                value: overview.bestMicroarea
                  ? overview.bestMicroarea.name.length > 14
                    ? overview.bestMicroarea.name.substring(0, 14) + '...'
                    : overview.bestMicroarea.name
                  : '—',
                icon: <Trophy size={18} className="text-yellow-400" />,
              },
              {
                label: 'Pior Microárea',
                value: overview.worstMicroarea
                  ? overview.worstMicroarea.name.length > 14
                    ? overview.worstMicroarea.name.substring(0, 14) + '...'
                    : overview.worstMicroarea.name
                  : '—',
                icon: <AlertTriangle size={18} className="text-red-400" />,
              },
            ].map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="jarvis-card p-4 text-center"
              >
                <div className="flex justify-center mb-2">{stat.icon}</div>
                <div className="text-xl font-bold font-mono text-slate-200">{stat.value}</div>
                <div className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* C. Radar Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="jarvis-card p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Activity size={16} className="text-cyan-400" />
                <h3 className="text-sm font-semibold text-slate-300">Desempenho por Macroárea</h3>
              </div>
              {totalResponses > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                    <PolarGrid stroke="#1e293b" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fill: '#94a3b8', fontSize: 10 }}
                    />
                    <PolarRadiusAxis
                      angle={90}
                      domain={[0, 100]}
                      tick={{ fill: '#475569', fontSize: 9 }}
                    />
                    <Radar
                      name="Pontuação"
                      dataKey="pontuação"
                      stroke="#00f0ff"
                      fill="#00f0ff"
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                    <Tooltip content={<ChartTooltip />} />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-64 text-slate-500 text-sm">
                  Nenhum dado disponível
                </div>
              )}
            </motion.div>

            {/* E. TRI Evolution Line Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="jarvis-card p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={16} className="text-purple-400" />
                <h3 className="text-sm font-semibold text-slate-300">Evolução TRI (Habilidade Estimada)</h3>
              </div>
              {triData.length > 1 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={triData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: '#64748b', fontSize: 9 }}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      tick={{ fill: '#64748b', fontSize: 9 }}
                      domain={['auto', 'auto']}
                    />
                    <Tooltip content={<TriTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="theta"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4, fill: '#8b5cf6', stroke: '#0a0e17', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-64 text-slate-500 text-sm">
                  {totalResponses > 0 ? 'Dados insuficientes para evolução TRI' : 'Nenhum dado disponível'}
                </div>
              )}
            </motion.div>
          </div>

          {/* D. Heatmap Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="jarvis-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Flame size={16} className="text-orange-400" />
                <h3 className="text-sm font-semibold text-slate-300">Desempenho por Microárea</h3>
              </div>
              <div className="flex items-center gap-3 text-[10px]">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> ≥70%</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500" /> 50-69%</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500" /> 30-49%</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> &lt;30%</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-600" /> Sem dados</span>
              </div>
            </div>
            {heatmapData.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {heatmapData.map((cell) => (
                  <motion.button
                    key={cell.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setCurrentView('revisao')}
                    className={`p-3 rounded-lg border text-left transition-all ${getHeatmapColor(cell.hitRate, cell.total)}`}
                    title={`Clique para revisar ${cell.name}`}
                  >
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${getHeatmapDot(cell.hitRate, cell.total)}`} />
                      <span className="text-[11px] font-medium text-slate-300 leading-tight line-clamp-2">
                        {cell.name}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-bold font-mono ${getHeatmapTextColor(cell.hitRate, cell.total)}`}>
                        {cell.hitRate !== null ? `${cell.hitRate}%` : '—'}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {cell.total}q
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 text-sm">
                Dados não disponíveis
              </div>
            )}
          </motion.div>

          {/* F. Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="jarvis-card p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Activity size={16} className="text-cyan-400" />
              <h3 className="text-sm font-semibold text-slate-300">Atividade Recente</h3>
            </div>
            {recentActivity.length > 0 ? (
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {recentActivity.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-[#0a0e17] border border-[#1e293b]"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                        r.isCorrect ? 'bg-emerald-500/20' : 'bg-red-500/20'
                      }`}>
                        {r.isCorrect ? (
                          <CheckCircle size={14} className="text-emerald-400" />
                        ) : (
                          <XCircle size={14} className="text-red-400" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-slate-300 truncate">{r.microarea}</p>
                        <p className="text-[10px] text-slate-600 font-mono">
                          {new Date(r.createdAt).toLocaleDateString('pt-BR')}
                          {r.responseTime ? ` • ${formatTime(r.responseTime)}` : ''}
                        </p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                      r.isCorrect
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {r.isCorrect ? 'Correta' : 'Incorreta'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 text-sm">
                Nenhuma atividade recente
              </div>
            )}
          </motion.div>

          {/* G. Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentView('simulado')}
              className="jarvis-card p-4 flex items-center gap-3 text-left hover:border-cyan-500/30 transition-all"
            >
              <BarChart3 size={20} className="text-cyan-400" />
              <div>
                <p className="text-sm font-medium text-slate-200">Fazer Simulado</p>
                <p className="text-xs text-slate-500">Pratique com questões reais</p>
              </div>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentView('revisao')}
              className="jarvis-card p-4 flex items-center gap-3 text-left hover:border-cyan-500/30 transition-all"
            >
              <BookOpen size={20} className="text-yellow-400" />
              <div>
                <p className="text-sm font-medium text-slate-200">Revisar Microáreas Fracas</p>
                <p className="text-xs text-slate-500">Foque no que precisa melhorar</p>
              </div>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentView('dicas')}
              className="jarvis-card p-4 flex items-center gap-3 text-left hover:border-cyan-500/30 transition-all"
            >
              <Zap size={20} className="text-purple-400" />
              <div>
                <p className="text-sm font-medium text-slate-200">Ver Dicas</p>
                <p className="text-xs text-slate-500">Estratégias para o ENADE</p>
              </div>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
