'use client';

import { useState, useEffect, useCallback, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminLayout } from './AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAppStore } from '@/store/app-store';
import {
  BarChart3,
  Users,
  FileQuestion,
  Layers,
  GraduationCap,
  Calendar,
  Search,
  RefreshCw,
  Download,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Activity,
  BookOpen,
  Edit,
  Eye,
  Trash2,
  ChevronDown,
  ChevronUp,
  Plus,
  Play,
  Pause,
  Shield,
  Brain,
  Target,
  Zap,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from 'recharts';

// === TYPES ===
interface KPIData {
  totalAlunos: number;
  totalQuestoes: number;
  questoesAtivas: number;
  coberturaElementos: number;
  totalElementos: number;
  mediaGeral: number;
  maiorPerformador: string;
  microareaDificil: string;
}

interface PhaseData {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  order: number;
  features: string[];
}

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  ra?: string;
  questionsCreated?: number;
  lastLogin?: string;
  simuladosCompleted?: number;
  avgScore?: number;
}

interface QuestionData {
  id: string;
  code: string;
  microarea: string;
  element: string;
  difficulty: string;
  status: string;
  source: string;
  triA?: number;
  triB?: number;
  triC?: number;
  statement?: string;
  context?: string;
  alternatives?: Array<{ key: string; text: string; isCorrect: boolean }>;
  tags?: string[];
  year?: number;
  createdAt?: string;
  createdBy?: string;
}

interface MicroareaData {
  id: string;
  name: string;
  macroarea: string;
  elementCount: number;
  questionCount: number;
}

// === STATUS COLORS ===
const statusColors: Record<string, string> = {
  RASCUNHO: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  AGUARDANDO_TESTE: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  EM_TESTE: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  AGUARDANDO_VALIDACAO: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  APROVADA: 'bg-green-500/20 text-green-400 border-green-500/30',
  REPROVADA: 'bg-red-500/20 text-red-400 border-red-500/30',
  ATIVA: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  INATIVA: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

const statusLabels: Record<string, string> = {
  RASCUNHO: 'Rascunho',
  AGUARDANDO_TESTE: 'Aguardando Teste',
  EM_TESTE: 'Em Teste',
  AGUARDANDO_VALIDACAO: 'Aguardando Validação',
  APROVADA: 'Aprovada',
  REPROVADA: 'Reprovada',
  ATIVA: 'Ativa',
  INATIVA: 'Inativa',
};

const difficultyColors: Record<string, string> = {
  Fácil: 'text-green-400',
  Médio: 'text-yellow-400',
  Difícil: 'text-red-400',
};

// === CUSTOM TOOLTIP ===
const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0d1321] border border-cyan-500/20 rounded-lg p-3 shadow-lg">
        <p className="text-xs text-gray-400 font-mono mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="text-sm font-mono" style={{ color: p.color }}>
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// === SUB-COMPONENTS ===

function KPICard({ title, value, icon, color, subtitle }: { title: string; value: string | number; icon: React.ReactNode; color: string; subtitle?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="jarvis-card p-4 h-full">
        <div className="flex items-start justify-between mb-3">
          <div className={`p-2 rounded-lg ${color}`}>
            {icon}
          </div>
        </div>
        <p className="text-2xl font-bold font-mono text-white">{value}</p>
        <p className="text-xs text-gray-400 font-mono mt-1 tracking-wider">{title}</p>
        {subtitle && <p className="text-[10px] text-gray-500 font-mono mt-0.5">{subtitle}</p>}
      </div>
    </motion.div>
  );
}

// === MAIN COMPONENT ===
export function MasterPanel() {
  const { user, token } = useAppStore();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  // Dashboard data
  const [kpi, setKpi] = useState<KPIData>({
    totalAlunos: 0, totalQuestoes: 0, questoesAtivas: 0,
    coberturaElementos: 0, totalElementos: 450, mediaGeral: 0,
    maiorPerformador: '—', microareaDificil: '—',
  });
  const [macroareaChart, setMacroareaChart] = useState<Array<{ name: string; questoes: number }>>([]);
  const [statusChart, setStatusChart] = useState<Array<{ name: string; value: number; color: string }>>([]);
  const [recentActivity, setRecentActivity] = useState<Array<{ student: string; action: string; time: string; score?: number }>>([]);

  // Phases data
  const [phases, setPhases] = useState<PhaseData[]>([]);
  const [editingPhase, setEditingPhase] = useState<PhaseData | null>(null);

  // Users data
  const [professors, setProfessors] = useState<UserData[]>([]);
  const [students, setStudents] = useState<UserData[]>([]);
  const [studentSearch, setStudentSearch] = useState('');

  // Questions data
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [questionPage, setQuestionPage] = useState(1);
  const [questionTotal, setQuestionTotal] = useState(0);
  const [questionFilter, setQuestionFilter] = useState({ status: '', microarea: '', source: '', difficulty: '' });
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  // Microareas
  const [microareas, setMicroareas] = useState<MicroareaData[]>([]);

  // New professor dialog
  const [newProfessor, setNewProfessor] = useState({ name: '', email: '', password: '' });
  const [showNewProfDialog, setShowNewProfDialog] = useState(false);

  // Report
  const [reportLoading, setReportLoading] = useState(false);
  const [reportData, setReportData] = useState<Record<string, unknown> | null>(null);

  const fetchHeaders = useCallback(() => ({
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }), [token]);

  // Load all data
  const loadDashboard = useCallback(async () => {
    try {
      const [dashRes, microRes, phaseRes, usersRes, qRes] = await Promise.allSettled([
        fetch('/api/dashboard/collective', { headers: fetchHeaders() }),
        fetch('/api/microareas', { headers: fetchHeaders() }),
        fetch('/api/phases', { headers: fetchHeaders() }),
        fetch('/api/auth/users', { headers: fetchHeaders() }),
        fetch('/api/questions?limit=20&page=1', { headers: fetchHeaders() }),
      ]);

      if (dashRes.status === 'fulfilled' && dashRes.value.ok) {
        const d = await dashRes.value.json();
        setKpi(prev => ({
          ...prev,
          totalAlunos: d.totalAlunos || prev.totalAlunos,
          totalQuestoes: d.totalQuestoes || prev.totalQuestoes,
          questoesAtivas: d.questoesAtivas || prev.questoesAtivas,
          coberturaElementos: d.coberturaElementos || prev.coberturaElementos,
          mediaGeral: d.mediaGeral || prev.mediaGeral,
          maiorPerformador: d.maiorPerformador || prev.maiorPerformador,
          microareaDificil: d.microareaDificil || prev.microareaDificil,
          macroareaChart: d.macroareaChart || prev.macroareaChart,
          statusChart: d.statusChart || prev.statusChart,
          recentActivity: d.recentActivity || prev.recentActivity,
        }));
        if (d.macroareaChart) setMacroareaChart(d.macroareaChart);
        if (d.statusChart) setStatusChart(d.statusChart);
        if (d.recentActivity) setRecentActivity(d.recentActivity);
      }

      if (microRes.status === 'fulfilled' && microRes.value.ok) {
        const m = await microRes.value.json();
        setMicroareas(Array.isArray(m) ? m : m.microareas || []);
      }

      if (phaseRes.status === 'fulfilled' && phaseRes.value.ok) {
        const p = await phaseRes.value.json();
        setPhases(Array.isArray(p) ? p : p.phases || []);
      }

      if (usersRes.status === 'fulfilled' && usersRes.value.ok) {
        const u = await usersRes.value.json();
        const users = Array.isArray(u) ? u : u.users || [];
        setProfessors(users.filter((u: UserData) => u.role === 'PROFESSOR'));
        setStudents(users.filter((u: UserData) => u.role === 'ALUNO'));
      }

      if (qRes.status === 'fulfilled' && qRes.value.ok) {
        const q = await qRes.value.json();
        setQuestions(q.questions || q.data || []);
        setQuestionTotal(q.total || q.pagination?.total || 0);
      }
    } catch (err) {
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  }, [fetchHeaders]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const handleTogglePhase = async (phaseId: string, isActive: boolean) => {
    try {
      const res = await fetch(`/api/phases/${phaseId}`, {
        method: 'PUT',
        headers: fetchHeaders(),
        body: JSON.stringify({ isActive: !isActive }),
      });
      if (res.ok) {
        setPhases(prev => prev.map(p => p.id === phaseId ? { ...p, isActive: !isActive } : p));
      }
    } catch (err) {
      console.error('Error toggling phase:', err);
    }
  };

  const handleCreateProfessor = async () => {
    if (!newProfessor.name || !newProfessor.email || !newProfessor.password) return;
    try {
      const res = await fetch('/api/auth/users', {
        method: 'POST',
        headers: fetchHeaders(),
        body: JSON.stringify({ ...newProfessor, role: 'PROFESSOR' }),
      });
      if (res.ok) {
        setShowNewProfDialog(false);
        setNewProfessor({ name: '', email: '', password: '' });
        loadDashboard();
      }
    } catch (err) {
      console.error('Error creating professor:', err);
    }
  };

  const handleGenerateReport = async () => {
    setReportLoading(true);
    try {
      const res = await fetch('/api/reports/collective', {
        method: 'POST',
        headers: fetchHeaders(),
        body: JSON.stringify({}),
      });
      if (res.ok) {
        const data = await res.json();
        setReportData(data);
      }
    } catch (err) {
      console.error('Error generating report:', err);
    } finally {
      setReportLoading(false);
    }
  };

  const filteredStudents = studentSearch
    ? students.filter(s =>
        s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
        (s.ra && s.ra.includes(studentSearch))
      )
    : students;

  const chartColors = ['#00f0ff', '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

  if (loading) {
    return (
      <AdminLayout panelType="master">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="inline-flex items-center justify-center mb-4">
              <div className="w-12 h-12 rounded-full border-2 border-cyan-500/30 border-t-cyan-400 animate-spin" />
            </div>
            <p className="text-cyan-400/60 font-mono text-sm tracking-widest">CARREGANDO PAINEL...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout panelType="master">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
        {/* Tab Navigation */}
        <div className="mb-6 overflow-x-auto">
          <TabsList className="bg-white/5 border border-cyan-500/10 h-auto p-1 gap-1 flex-wrap">
            {[
              { value: 'dashboard', label: 'Dashboard Geral', icon: <BarChart3 size={14} /> },
              { value: 'phases', label: 'Gestão de Fases', icon: <Calendar size={14} /> },
              { value: 'professors', label: 'Gestão de Docentes', icon: <GraduationCap size={14} /> },
              { value: 'students', label: 'Gestão de Alunos', icon: <Users size={14} /> },
              { value: 'questions', label: 'Banco de Questões', icon: <FileQuestion size={14} /> },
              { value: 'reports', label: 'Relatórios', icon: <Activity size={14} /> },
            ].map(tab => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-mono data-[state=active]:bg-cyan-500/15 data-[state=active]:text-cyan-400 data-[state=active]:border-cyan-500/30 rounded-md whitespace-nowrap transition-all"
              >
                {tab.icon}
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <AnimatePresence mode="wait">
          {/* ======================== DASHBOARD GERAL ======================== */}
          <TabsContent value="dashboard">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard title="Total Alunos" value={kpi.totalAlunos} icon={<Users size={20} className="text-cyan-400" />} color="bg-cyan-500/10" />
                <KPICard title="Questões Ativas" value={kpi.questoesAtivas} icon={<FileQuestion size={20} className="text-green-400" />} color="bg-green-500/10" subtitle={`Total: ${kpi.totalQuestoes}`} />
                <KPICard title="Cobertura Elementos" value={`${kpi.coberturaElementos}/${kpi.totalElementos}`} icon={<Target size={20} className="text-purple-400" />} color="bg-purple-500/10" />
                <KPICard title="Média Geral" value={`${kpi.mediaGeral}%`} icon={<TrendingUp size={20} className="text-amber-400" />} color="bg-amber-500/10" />
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Macroarea Chart */}
                <div className="jarvis-card p-4">
                  <h3 className="text-sm font-mono text-cyan-400 tracking-wider mb-4 flex items-center gap-2">
                    <Layers size={14} /> Questões por Macroárea
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={macroareaChart}>
                        <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }} axisLine={{ stroke: '#1e293b' }} />
                        <YAxis tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }} axisLine={{ stroke: '#1e293b' }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="questoes" name="Questões" fill="#00f0ff" radius={[4, 4, 0, 0]} barSize={32} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Status Pie */}
                <div className="jarvis-card p-4">
                  <h3 className="text-sm font-mono text-cyan-400 tracking-wider mb-4 flex items-center gap-2">
                    <Activity size={14} /> Questões por Status
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={statusChart} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                          {statusChart.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                          iconType="circle"
                          iconSize={8}
                          wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Bottom Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <div className="lg:col-span-2 jarvis-card p-4">
                  <h3 className="text-sm font-mono text-cyan-400 tracking-wider mb-4 flex items-center gap-2">
                    <Clock size={14} /> Atividade Recente
                  </h3>
                  <div className="space-y-2 max-h-72 overflow-y-auto">
                    {recentActivity.length === 0 ? (
                      <p className="text-xs text-gray-500 font-mono text-center py-8">Nenhuma atividade registrada</p>
                    ) : (
                      recentActivity.map((item, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-cyan-500/5 hover:border-cyan-500/15 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center">
                              <span className="text-xs font-bold text-cyan-400">{item.student.charAt(0)}</span>
                            </div>
                            <div>
                              <p className="text-sm text-white font-mono">{item.student}</p>
                              <p className="text-xs text-gray-500 font-mono">{item.action}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            {item.score !== undefined && (
                              <span className={`text-xs font-mono font-bold ${item.score >= 70 ? 'text-green-400' : item.score >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                                {item.score}%
                              </span>
                            )}
                            <p className="text-[10px] text-gray-600 font-mono">{item.time}</p>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="jarvis-card p-4">
                  <h3 className="text-sm font-mono text-cyan-400 tracking-wider mb-4 flex items-center gap-2">
                    <Zap size={14} /> Estatísticas Rápidas
                  </h3>
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-white/[0.03] border border-cyan-500/5">
                      <p className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">Melhor Performador</p>
                      <p className="text-sm text-white font-mono font-bold mt-1">{kpi.maiorPerformador}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-white/[0.03] border border-cyan-500/5">
                      <p className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">Microárea Mais Difícil</p>
                      <p className="text-sm text-white font-mono font-bold mt-1">{kpi.microareaDificil}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-white/[0.03] border border-cyan-500/5">
                      <p className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">Docentes Cadastrados</p>
                      <p className="text-sm text-white font-mono font-bold mt-1">{professors.length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </TabsContent>

          {/* ======================== GESTÃO DE FASES ======================== */}
          <TabsContent value="phases">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              {/* Phase Timeline */}
              <div className="jarvis-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-mono text-cyan-400 tracking-wider flex items-center gap-2">
                    <Calendar size={14} /> Timeline de Fases
                  </h3>
                  <Button onClick={loadDashboard} variant="ghost" size="sm" className="text-cyan-400/60 hover:text-cyan-400">
                    <RefreshCw size={14} />
                  </Button>
                </div>

                <div className="space-y-4">
                  {phases.map((phase, index) => (
                    <motion.div
                      key={phase.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative"
                    >
                      {/* Timeline connector */}
                      {index < phases.length - 1 && (
                        <div className="absolute left-5 top-16 bottom-0 w-px bg-cyan-500/15" />
                      )}

                      <div className={`jarvis-card p-5 ml-0 transition-all ${phase.isActive ? 'border-cyan-500/40 shadow-[0_0_20px_rgba(0,240,255,0.08)]' : ''}`}>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${phase.isActive ? 'bg-cyan-500/20' : 'bg-white/5'}`}>
                              {phase.isActive ? <Play size={16} className="text-cyan-400" /> : <Pause size={16} className="text-gray-500" />}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-sm font-bold text-white font-mono">Fase {phase.order}: {phase.name}</h4>
                                <Badge className={`text-[10px] font-mono ${phase.isActive ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
                                  {phase.isActive ? 'ATIVA' : 'INATIVA'}
                                </Badge>
                              </div>
                              <p className="text-xs text-gray-400 font-mono mb-2">
                                {new Date(phase.startDate).toLocaleDateString('pt-BR')} — {new Date(phase.endDate).toLocaleDateString('pt-BR')}
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {phase.features?.map((f, fi) => (
                                  <span key={fi} className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/5 text-cyan-400/70 font-mono border border-cyan-500/10">
                                    {f}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setEditingPhase(phase)}
                              className="text-cyan-400/60 hover:text-cyan-400 hover:bg-cyan-500/10"
                            >
                              <Edit size={14} />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleTogglePhase(phase.id, phase.isActive)}
                              className={phase.isActive ? 'text-red-400/60 hover:text-red-400 hover:bg-red-500/10' : 'text-green-400/60 hover:text-green-400 hover:bg-green-500/10'}
                            >
                              {phase.isActive ? <Pause size={14} /> : <Play size={14} />}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Edit Phase Dialog */}
              <Dialog open={!!editingPhase} onOpenChange={() => setEditingPhase(null)}>
                <DialogContent className="bg-[#0d1321] border-cyan-500/20">
                  <DialogHeader>
                    <DialogTitle className="text-cyan-400 font-mono">Editar Fase</DialogTitle>
                  </DialogHeader>
                  {editingPhase && (
                    <div className="space-y-4">
                      <div>
                        <Label className="text-xs font-mono text-gray-400">Nome da Fase</Label>
                        <Input value={editingPhase.name} onChange={e => setEditingPhase({ ...editingPhase, name: e.target.value })} className="mt-1 bg-[#0a0e17] border-cyan-500/20 text-white font-mono text-sm" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs font-mono text-gray-400">Data Início</Label>
                          <Input type="date" value={editingPhase.startDate} onChange={e => setEditingPhase({ ...editingPhase, startDate: e.target.value })} className="mt-1 bg-[#0a0e17] border-cyan-500/20 text-white font-mono text-sm" />
                        </div>
                        <div>
                          <Label className="text-xs font-mono text-gray-400">Data Fim</Label>
                          <Input type="date" value={editingPhase.endDate} onChange={e => setEditingPhase({ ...editingPhase, endDate: e.target.value })} className="mt-1 bg-[#0a0e17] border-cyan-500/20 text-white font-mono text-sm" />
                        </div>
                      </div>
                      <Button onClick={async () => {
                        try {
                          await fetch(`/api/phases/${editingPhase.id}`, { method: 'PUT', headers: fetchHeaders(), body: JSON.stringify(editingPhase) });
                          setEditingPhase(null);
                          loadDashboard();
                        } catch (err) { console.error(err); }
                      }} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-mono">
                        Salvar Alterações
                      </Button>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </motion.div>
          </TabsContent>

          {/* ======================== GESTÃO DE DOCENTES ======================== */}
          <TabsContent value="professors">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-mono text-cyan-400 tracking-wider flex items-center gap-2">
                  <GraduationCap size={14} /> Docentes Cadastrados ({professors.length})
                </h3>
                <Button onClick={() => setShowNewProfDialog(true)} className="bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs">
                  <Plus size={14} className="mr-1.5" /> Adicionar Professor
                </Button>
              </div>

              <div className="jarvis-card overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-cyan-500/10 hover:bg-transparent">
                      <TableHead className="text-xs font-mono text-gray-400">Nome</TableHead>
                      <TableHead className="text-xs font-mono text-gray-400">Email</TableHead>
                      <TableHead className="text-xs font-mono text-gray-400 text-center">Questões Criadas</TableHead>
                      <TableHead className="text-xs font-mono text-gray-400 text-center">Último Login</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {professors.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-gray-500 font-mono text-xs">
                          Nenhum professor cadastrado
                        </TableCell>
                      </TableRow>
                    ) : (
                      professors.map((prof) => (
                        <TableRow key={prof.id} className="border-b border-cyan-500/5 hover:bg-white/[0.02]">
                          <TableCell className="text-sm text-white font-mono">{prof.name}</TableCell>
                          <TableCell className="text-sm text-gray-400 font-mono">{prof.email}</TableCell>
                          <TableCell className="text-sm text-cyan-400 font-mono text-center">{prof.questionsCreated || 0}</TableCell>
                          <TableCell className="text-xs text-gray-500 font-mono text-center">{prof.lastLogin ? new Date(prof.lastLogin).toLocaleDateString('pt-BR') : '—'}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* New Professor Dialog */}
              <Dialog open={showNewProfDialog} onOpenChange={setShowNewProfDialog}>
                <DialogContent className="bg-[#0d1321] border-cyan-500/20">
                  <DialogHeader>
                    <DialogTitle className="text-cyan-400 font-mono">Novo Professor</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-xs font-mono text-gray-400">Nome Completo</Label>
                      <Input value={newProfessor.name} onChange={e => setNewProfessor(p => ({ ...p, name: e.target.value }))} placeholder="Prof. Dr. Nome" className="mt-1 bg-[#0a0e17] border-cyan-500/20 text-white font-mono text-sm" />
                    </div>
                    <div>
                      <Label className="text-xs font-mono text-gray-400">Email Institucional</Label>
                      <Input value={newProfessor.email} onChange={e => setNewProfessor(p => ({ ...p, email: e.target.value }))} placeholder="professor@unifecaf.br" className="mt-1 bg-[#0a0e17] border-cyan-500/20 text-white font-mono text-sm" />
                    </div>
                    <div>
                      <Label className="text-xs font-mono text-gray-400">Senha Temporária</Label>
                      <Input value={newProfessor.password} onChange={e => setNewProfessor(p => ({ ...p, password: e.target.value }))} type="password" placeholder="••••••••" className="mt-1 bg-[#0a0e17] border-cyan-500/20 text-white font-mono text-sm" />
                    </div>
                    <Button onClick={handleCreateProfessor} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-mono">
                      Criar Professor
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </motion.div>
          </TabsContent>

          {/* ======================== GESTÃO DE ALUNOS ======================== */}
          <TabsContent value="students">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h3 className="text-sm font-mono text-cyan-400 tracking-wider flex items-center gap-2">
                  <Users size={14} /> Alunos Cadastrados ({students.length})
                </h3>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-500/40" size={14} />
                  <Input
                    value={studentSearch}
                    onChange={e => setStudentSearch(e.target.value)}
                    placeholder="Buscar por nome ou RA..."
                    className="pl-9 h-9 bg-[#0a0e17] border-cyan-500/20 text-white placeholder:text-gray-600 font-mono text-xs"
                  />
                </div>
              </div>

              <div className="jarvis-card overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-cyan-500/10 hover:bg-transparent">
                      <TableHead className="text-xs font-mono text-gray-400">RA</TableHead>
                      <TableHead className="text-xs font-mono text-gray-400">Nome</TableHead>
                      <TableHead className="text-xs font-mono text-gray-400">Email</TableHead>
                      <TableHead className="text-xs font-mono text-gray-400 text-center">Simulados</TableHead>
                      <TableHead className="text-xs font-mono text-gray-400 text-center">Média</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-gray-500 font-mono text-xs">
                          {studentSearch ? 'Nenhum aluno encontrado' : 'Nenhum aluno cadastrado'}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredStudents.slice(0, 50).map((student) => (
                        <TableRow key={student.id} className="border-b border-cyan-500/5 hover:bg-white/[0.02] cursor-pointer">
                          <TableCell className="text-xs text-cyan-400/70 font-mono">{student.ra || '—'}</TableCell>
                          <TableCell className="text-sm text-white font-mono">{student.name}</TableCell>
                          <TableCell className="text-xs text-gray-400 font-mono">{student.email}</TableCell>
                          <TableCell className="text-sm text-gray-300 font-mono text-center">{student.simuladosCompleted || 0}</TableCell>
                          <TableCell className="text-center">
                            <span className={`text-sm font-mono font-bold ${(student.avgScore || 0) >= 70 ? 'text-green-400' : (student.avgScore || 0) >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                              {student.avgScore ? `${student.avgScore}%` : '—'}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </motion.div>
          </TabsContent>

          {/* ======================== BANCO DE QUESTÕES ======================== */}
          <TabsContent value="questions">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              {/* Summary Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Total', value: questionTotal, color: 'text-cyan-400' },
                  { label: 'Ativas', value: questions.filter(q => q.status === 'ATIVA').length, color: 'text-emerald-400' },
                  { label: 'Em Teste', value: questions.filter(q => q.status === 'EM_TESTE' || q.status === 'AGUARDANDO_TESTE').length, color: 'text-purple-400' },
                  { label: 'Rascunho', value: questions.filter(q => q.status === 'RASCUNHO').length, color: 'text-yellow-400' },
                ].map(stat => (
                  <div key={stat.label} className="jarvis-card p-3 text-center">
                    <p className={`text-xl font-bold font-mono ${stat.color}`}>{stat.value}</p>
                    <p className="text-[10px] text-gray-500 font-mono">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Filters */}
              <div className="jarvis-card p-4">
                <div className="flex flex-wrap gap-3">
                  <select
                    value={questionFilter.status}
                    onChange={e => setQuestionFilter(f => ({ ...f, status: e.target.value }))}
                    className="bg-[#0a0e17] border border-cyan-500/20 text-gray-300 text-xs font-mono rounded-lg px-3 py-2 focus:border-cyan-500/40 outline-none"
                  >
                    <option value="">Todos Status</option>
                    {Object.entries(statusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                  <select
                    value={questionFilter.microarea}
                    onChange={e => setQuestionFilter(f => ({ ...f, microarea: e.target.value }))}
                    className="bg-[#0a0e17] border border-cyan-500/20 text-gray-300 text-xs font-mono rounded-lg px-3 py-2 focus:border-cyan-500/40 outline-none"
                  >
                    <option value="">Todas Microáreas</option>
                    {microareas.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                  <select
                    value={questionFilter.difficulty}
                    onChange={e => setQuestionFilter(f => ({ ...f, difficulty: e.target.value }))}
                    className="bg-[#0a0e17] border border-cyan-500/20 text-gray-300 text-xs font-mono rounded-lg px-3 py-2 focus:border-cyan-500/40 outline-none"
                  >
                    <option value="">Todas Dificuldades</option>
                    <option value="Fácil">Fácil</option>
                    <option value="Médio">Médio</option>
                    <option value="Difícil">Difícil</option>
                  </select>
                  <select
                    value={questionFilter.source}
                    onChange={e => setQuestionFilter(f => ({ ...f, source: e.target.value }))}
                    className="bg-[#0a0e17] border border-cyan-500/20 text-gray-300 text-xs font-mono rounded-lg px-3 py-2 focus:border-cyan-500/40 outline-none"
                  >
                    <option value="">Todas Fontes</option>
                    <option value="enade-oficial">ENADE Oficial</option>
                    <option value="elaborada">Elaborada</option>
                    <option value="externa">Externa</option>
                  </select>
                </div>
              </div>

              {/* Questions Table */}
              <div className="jarvis-card overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-cyan-500/10 hover:bg-transparent">
                      <TableHead className="text-xs font-mono text-gray-400 w-8"></TableHead>
                      <TableHead className="text-xs font-mono text-gray-400">Código</TableHead>
                      <TableHead className="text-xs font-mono text-gray-400">Microárea</TableHead>
                      <TableHead className="text-xs font-mono text-gray-400">Dificuldade</TableHead>
                      <TableHead className="text-xs font-mono text-gray-400">Status</TableHead>
                      <TableHead className="text-xs font-mono text-gray-400">Fonte</TableHead>
                      <TableHead className="text-xs font-mono text-gray-400 text-center">TRI</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {questions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-gray-500 font-mono text-xs">
                          Nenhuma questão encontrada
                        </TableCell>
                      </TableRow>
                    ) : (
                      questions.map((q) => (
                        <Fragment key={q.id}>
                          <TableRow
                            className="border-b border-cyan-500/5 hover:bg-white/[0.02] cursor-pointer"
                            onClick={() => setExpandedQuestion(expandedQuestion === q.id ? null : q.id)}
                          >
                            <TableCell className="text-gray-500">
                              {expandedQuestion === q.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </TableCell>
                            <TableCell className="text-xs text-cyan-400/80 font-mono">{q.code}</TableCell>
                            <TableCell className="text-xs text-gray-300 font-mono max-w-[150px] truncate">{q.microarea}</TableCell>
                            <TableCell className={`text-xs font-mono ${difficultyColors[q.difficulty] || 'text-gray-400'}`}>{q.difficulty}</TableCell>
                            <TableCell>
                              <Badge className={`text-[10px] font-mono ${statusColors[q.status] || 'bg-gray-500/20 text-gray-400'}`}>
                                {statusLabels[q.status] || q.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-xs text-gray-400 font-mono">{q.source}</TableCell>
                            <TableCell className="text-xs text-gray-500 font-mono text-center">
                              {q.triA ? `a=${q.triA} b=${q.triB} c=${q.triC}` : '—'}
                            </TableCell>
                          </TableRow>
                          {expandedQuestion === q.id && (
                            <TableRow className="border-b border-cyan-500/5 hover:bg-transparent">
                              <TableCell colSpan={7} className="p-4 bg-white/[0.01]">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-xs text-gray-500 font-mono mb-1">CONTEXTO / COMANDO</p>
                                    <p className="text-sm text-gray-300 font-mono">{q.context || '—'}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500 font-mono mb-1">ENUNCIADO</p>
                                    <p className="text-sm text-gray-300 font-mono line-clamp-4">{q.statement || '—'}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500 font-mono mb-1">ELEMENTO</p>
                                    <p className="text-sm text-gray-300 font-mono">{q.element || '—'}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500 font-mono mb-1">TAGS</p>
                                    <div className="flex flex-wrap gap-1">
                                      {q.tags?.map((t, i) => (
                                        <Badge key={i} variant="outline" className="text-[10px] font-mono border-cyan-500/20 text-cyan-400/70">{t}</Badge>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                                {q.alternatives && (
                                  <div className="mt-3">
                                    <p className="text-xs text-gray-500 font-mono mb-2">ALTERNATIVAS</p>
                                    <div className="space-y-1">
                                      {q.alternatives.map((alt, i) => (
                                        <div key={i} className={`text-xs font-mono p-2 rounded ${alt.isCorrect ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-white/[0.02] text-gray-400'}`}>
                                          <span className="font-bold mr-2">{alt.key})</span> {alt.text}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </TableCell>
                            </TableRow>
                          )}
                        </Fragment>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500 font-mono">
                  Mostrando {questions.length} de {questionTotal} questões
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={questionPage <= 1}
                    onClick={() => setQuestionPage(p => p - 1)}
                    className="text-cyan-400/60 hover:text-cyan-400 font-mono text-xs"
                  >
                    Anterior
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={questions.length < 20}
                    onClick={() => setQuestionPage(p => p + 1)}
                    className="text-cyan-400/60 hover:text-cyan-400 font-mono text-xs"
                  >
                    Próxima
                  </Button>
                </div>
              </div>
            </motion.div>
          </TabsContent>

          {/* ======================== RELATÓRIOS ======================== */}
          <TabsContent value="reports">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-mono text-cyan-400 tracking-wider flex items-center gap-2">
                  <Activity size={14} /> Relatórios Coletivos
                </h3>
                <Button
                  onClick={handleGenerateReport}
                  disabled={reportLoading}
                  className="bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs"
                >
                  {reportLoading ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw size={14} className="animate-spin" /> Gerando...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Brain size={14} /> Gerar Relatório
                    </span>
                  )}
                </Button>
              </div>

              {reportData ? (
                <div className="space-y-6">
                  {/* Report Overview */}
                  <div className="jarvis-card p-6">
                    <h4 className="text-sm font-mono text-cyan-400 tracking-wider mb-4 flex items-center gap-2">
                      <BarChart3 size={14} /> Visão Geral do Desempenho
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[
                        { label: 'Média da Turma', value: `${(reportData as Record<string, number>).averageScore || 0}%`, icon: <TrendingUp size={16} className="text-cyan-400" /> },
                        { label: 'Taxa de Acerto', value: `${(reportData as Record<string, number>).accuracyRate || 0}%`, icon: <Target size={16} className="text-green-400" /> },
                        { label: 'Participação', value: `${(reportData as Record<string, number>).participationRate || 0}%`, icon: <Users size={16} className="text-purple-400" /> },
                      ].map(stat => (
                        <div key={stat.label} className="p-4 rounded-lg bg-white/[0.03] border border-cyan-500/10 text-center">
                          <div className="flex justify-center mb-2">{stat.icon}</div>
                          <p className="text-xl font-bold font-mono text-white">{stat.value}</p>
                          <p className="text-[10px] text-gray-500 font-mono mt-1">{stat.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Microarea Performance */}
                  {(reportData as Record<string, unknown>).microareaPerformance && (
                    <div className="jarvis-card p-6">
                      <h4 className="text-sm font-mono text-cyan-400 tracking-wider mb-4 flex items-center gap-2">
                        <BookOpen size={14} /> Desempenho por Microárea
                      </h4>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={(reportData as Record<string, unknown>).microareaPerformance as Array<{ name: string; score: number }>} layout="vertical">
                            <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }} domain={[0, 100]} />
                            <YAxis type="category" dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }} width={150} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="score" name="Nota Média" fill="#00f0ff" radius={[0, 4, 4, 0]} barSize={16} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}

                  {/* Recommendations */}
                  {(reportData as Record<string, unknown>).recommendations && (
                    <div className="jarvis-card p-6">
                      <h4 className="text-sm font-mono text-cyan-400 tracking-wider mb-4 flex items-center gap-2">
                        <AlertTriangle size={14} /> Recomendações
                      </h4>
                      <div className="space-y-2">
                        {((reportData as Record<string, unknown>).recommendations as string[]).map((rec, i) => (
                          <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
                            <AlertTriangle size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-gray-300 font-mono">{rec}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Export */}
                  <div className="jarvis-card p-4 flex items-center justify-between">
                    <p className="text-xs text-gray-400 font-mono">Exportar dados do relatório</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 font-mono text-xs"
                      onClick={() => {
                        const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `relatorio-enadia-${new Date().toISOString().slice(0, 10)}.json`;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                    >
                      <Download size={14} className="mr-1.5" /> Baixar JSON
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="jarvis-card p-12 text-center">
                  <Brain size={40} className="mx-auto text-cyan-500/20 mb-4" />
                  <p className="text-gray-500 font-mono text-sm">Clique em &quot;Gerar Relatório&quot; para criar uma análise coletiva completa</p>
                </div>
              )}
            </motion.div>
          </TabsContent>
        </AnimatePresence>
      </Tabs>
    </AdminLayout>
  );
}
