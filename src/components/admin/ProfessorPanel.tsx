'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminLayout } from './AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
} from '@/components/ui/dialog';
import { useAppStore } from '@/store/app-store';
import { printReport } from '@/lib/print-utils';
import {
  FileQuestion,
  Plus,
  Brain,
  CheckCircle2,
  XCircle,
  Clock,
  Edit,
  Trash2,
  Eye,
  Send,
  Save,
  AlertTriangle,
  BarChart3,
  TrendingUp,
  BookOpen,
  Target,
  Search,
  Filter,
  Sparkles,
  Users,
  Printer,
  GraduationCap,
  ClipboardList,
  UserCheck,
  Activity,
  FileText,
  MessageSquare,
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
} from 'recharts';

// === TYPES ===
interface QuestionData {
  id: string;
  code: string;
  macroarea: string;
  microarea: string;
  microareaId?: string;
  element: string;
  elementId?: string;
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
  type: string;
  explanation?: string;
  createdAt?: string;
  geminiFeedback?: string;
  geminiApproved?: boolean;
  geminiScore?: number;
  geminiTriSuggestion?: { a: number; b: number; c: number };
}

interface MicroareaData {
  id: string;
  name: string;
  macroarea: string;
  elementCount: number;
  questionCount: number;
}

interface ElementData {
  id: string;
  name: string;
  microareaId: string;
}

interface RankingStudent {
  position: number;
  userId: string;
  name: string;
  email: string;
  ra: string | null;
  curso: string | null;
  modalidade: string | null;
  periodo: number | null;
  totalAnswered: number;
  totalCorrect: number;
  hitRate: number;
  avgResponseTime: number | null;
}

interface StudentReport {
  user: { id: string; name: string; ra: string | null; role: string; createdAt: string };
  overview: {
    totalResponses: number;
    correctResponses: number;
    hitRate: number;
    avgResponseTime: number | null;
    recentActivity: number;
  };
  byMicroarea: Array<{
    name: string; code: string; color: string; macroarea: string;
    total: number; correct: number; hitRate: number;
  }>;
  byDifficulty: Array<{
    difficulty: string; total: number; correct: number; hitRate: number;
  }>;
  simuladoHistory: Array<{
    simulado: string; total: number; correct: number; hitRate: number; date: string;
  }>;
  strengths: Array<{
    name: string; code: string; color: string; macroarea: string;
    total: number; correct: number; hitRate: number;
  }>;
  weaknesses: Array<{
    name: string; code: string; color: string; macroarea: string;
    total: number; correct: number; hitRate: number;
  }>;
  generatedAt: string;
}

interface EssayAnswerData {
  id: string;
  answer: string;
  aiFeedback: string | null;
  aiScore: number | null;
  createdAt: string;
  question: { id: string; code: string; statement: string; microarea: { name: string } };
}

interface ClassDashboard {
  overview: {
    totalUsers: number;
    activeUsers: number;
    studentsCount: number;
    totalQuestions: number;
    activeQuestions: number;
    totalResponses: number;
    avgHitRate: number;
  };
  questionsByStatus: Array<{ status: string; count: number }>;
  byMicroarea: Array<{
    name: string; code: string; color: string;
    total: number; correct: number; hitRate: number;
  }>;
  studentRanking: Array<{
    id: string; name: string; ra: string | null;
    totalResponses: number; correct: number; hitRate: number;
  }>;
  simuladoStats: Array<{
    id: string; title: string; type: string;
    _count: { responses: number };
  }>;
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
  'Médio': 'text-yellow-400',
  'Difícil': 'text-red-400',
  fácil: 'text-green-400',
  médio: 'text-yellow-400',
  difícil: 'text-red-400',
};

// Helper: capitalize first letter for display
const capitalizeFirst = (s: string) => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;

// Helper: map API question to internal QuestionData format
// API returns: microarea as {id, name, code, color}, element as {id, name, code},
// alternatives as [{id, letter, text}], difficulty as lowercase ("médio"), correctAnswer as letter
function mapQuestionFromAPI(q: Record<string, unknown>): QuestionData {
  const microareaObj = q.microarea as Record<string, string> | null | undefined;
  const elementObj = q.element as Record<string, string> | null | undefined;
  const correctAnswer = (q.correctAnswer as string) || '';
  const rawAlts = q.alternatives as Array<Record<string, string>> | null | undefined;
  return {
    id: q.id as string,
    code: q.code as string,
    macroarea: microareaObj?.macroarea || '',
    microarea: microareaObj?.name || '',
    microareaId: microareaObj?.id || (q.microareaId as string) || '',
    element: elementObj?.name || '',
    elementId: elementObj?.id || (q.elementId as string) || '',
    difficulty: (q.difficulty as string) || 'médio',
    status: q.status as string,
    source: q.source as string,
    triA: q.triA as number | undefined,
    triB: q.triB as number | undefined,
    triC: q.triC as number | undefined,
    statement: q.statement as string | undefined,
    context: q.context as string | undefined,
    alternatives: rawAlts && rawAlts.length > 0
      ? rawAlts.map(a => ({
          key: (a.letter as string) || 'A',
          text: a.text as string,
          isCorrect: (a.letter as string) === correctAnswer,
        }))
      : undefined,
    tags: q.tags as string[] | undefined,
    year: (q.sourceYear as number | undefined) ?? (q.year as number | undefined),
    type: q.type as string,
    explanation: q.explanation as string | undefined,
    createdAt: q.createdAt as string | undefined,
    geminiFeedback: q.geminiFeedback as string | undefined,
    geminiApproved: q.geminiApproved as boolean | undefined,
    geminiScore: q.geminiScore as number | undefined,
    geminiTriSuggestion: q.geminiTriSuggestion as { a: number; b: number; c: number } | undefined,
  };
}

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

// === EMPTY ALTERNATIVES ===
const emptyAlternatives = () => [
  { key: 'A', text: '', isCorrect: false },
  { key: 'B', text: '', isCorrect: false },
  { key: 'C', text: '', isCorrect: false },
  { key: 'D', text: '', isCorrect: false },
  { key: 'E', text: '', isCorrect: false },
];

const emptyForm = {
  type: 'Objetiva',
  microareaId: '',
  elementId: '',
  difficulty: 'Médio',
  context: '',
  statement: '',
  alternatives: emptyAlternatives(),
  explanation: '',
  tags: '',
  source: 'elaborada',
  year: new Date().getFullYear(),
};

// === MAIN COMPONENT ===
export function ProfessorPanel() {
  const { token, setPanel, setCurrentView } = useAppStore();
  const [activeTab, setActiveTab] = useState('my-questions');
  const [loading, setLoading] = useState(true);

  // Questions
  const [allQuestions, setAllQuestions] = useState<QuestionData[]>([]);
  const [questionFilter, setQuestionFilter] = useState({ status: '', microarea: '', difficulty: '' });
  const [viewingQuestion, setViewingQuestion] = useState<QuestionData | null>(null);

  // Create form
  const [form, setForm] = useState({ ...emptyForm, alternatives: emptyAlternatives() });
  const [saving, setSaving] = useState(false);
  const [sendingToTest, setSendingToTest] = useState(false);

  // Microareas & Elements
  const [microareas, setMicroareas] = useState<MicroareaData[]>([]);
  const [elements, setElements] = useState<ElementData[]>([]);

  // Stats
  const [stats, setStats] = useState({
    total: 0, aprovadas: 0, pendentes: 0, reprovadas: 0,
    chartData: [] as Array<{ month: string; criadas: number; aprovadas: number }>,
    radarData: [] as Array<{ microarea: string; questoes: number }>,
  });

  // Student Reports
  const [rankingStudents, setRankingStudents] = useState<RankingStudent[]>([]);
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedStudentReport, setSelectedStudentReport] = useState<StudentReport | null>(null);
  const [studentEssays, setStudentEssays] = useState<EssayAnswerData[]>([]);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportStudentInfo, setReportStudentInfo] = useState<RankingStudent | null>(null);

  // Class Dashboard
  const [classDashboard, setClassDashboard] = useState<ClassDashboard | null>(null);

  const fetchHeaders = useCallback(() => ({
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }), [token]);

  const loadData = useCallback(async () => {
    try {
      const [qRes, microRes, dashRes] = await Promise.allSettled([
        fetch('/api/questions?limit=100&page=1', { headers: fetchHeaders() }),
        fetch('/api/microareas', { headers: fetchHeaders() }),
        fetch('/api/dashboard/collective', { headers: fetchHeaders() }),
      ]);

      if (qRes.status === 'fulfilled' && qRes.value.ok) {
        const q = await qRes.value.json();
        const rawData = q.questions || q.data || [];
        setAllQuestions(rawData.map((item: Record<string, unknown>) => mapQuestionFromAPI(item)));
      }

      if (microRes.status === 'fulfilled' && microRes.value.ok) {
        const m = await microRes.value.json();
        const mData = Array.isArray(m) ? m : m.microareas || [];
        setMicroareas(mData);
      }

      if (dashRes.status === 'fulfilled' && dashRes.value.ok) {
        const d = await dashRes.value.json();
        if (d.professorStats) {
          setStats(d.professorStats);
        } else {
          const qs = allQuestions.length > 0 ? allQuestions : [];
          setStats({
            total: qs.length,
            aprovadas: qs.filter(q => q.status === 'APROVADA' || q.status === 'ATIVA').length,
            pendentes: qs.filter(q => ['RASCUNHO', 'AGUARDANDO_TESTE', 'EM_TESTE'].includes(q.status)).length,
            reprovadas: qs.filter(q => q.status === 'REPROVADA').length,
            chartData: d.chartData || [],
            radarData: d.radarData || [],
          });
        }
        // Store class dashboard data
        if (d.overview) {
          setClassDashboard(d as ClassDashboard);
        }
      }
    } catch (err) {
      console.error('Error loading professor data:', err);
    } finally {
      setLoading(false);
    }
  }, [fetchHeaders, allQuestions.length]);

  // Load ranking students
  const loadRankingStudents = useCallback(async () => {
    try {
      const res = await fetch('/api/ranking?limit=100', { headers: fetchHeaders() });
      if (res.ok) {
        const data = await res.json();
        setRankingStudents(data.ranking || []);
      }
    } catch (err) {
      console.error('Error loading ranking:', err);
    }
  }, [fetchHeaders]);

  // Load class dashboard
  const loadClassDashboard = useCallback(async () => {
    try {
      const res = await fetch('/api/dashboard/collective', { headers: fetchHeaders() });
      if (res.ok) {
        const data = await res.json();
        if (data.overview) {
          setClassDashboard(data);
        }
      }
    } catch (err) {
      console.error('Error loading class dashboard:', err);
    }
  }, [fetchHeaders]);

  useEffect(() => {
    loadData();
    loadRankingStudents();
  }, [loadData, loadRankingStudents]);

  // Load elements when microarea changes
  useEffect(() => {
    if (form.microareaId) {
      fetch(`/api/elements?microareaId=${form.microareaId}`, { headers: fetchHeaders() })
        .then(res => res.ok ? res.json() : [])
        .then(data => setElements(Array.isArray(data) ? data : data.elements || []))
        .catch(() => setElements([]));
    } else {
      setElements([]);
    }
  }, [form.microareaId, fetchHeaders]);

  // Load class dashboard when dashboard tab is selected
  useEffect(() => {
    if (activeTab === 'dashboard') {
      loadClassDashboard();
    }
  }, [activeTab, loadClassDashboard]);

  // Filter questions
  const filteredQuestions = allQuestions.filter(q => {
    if (questionFilter.status && q.status !== questionFilter.status) return false;
    if (questionFilter.difficulty && q.difficulty?.toLowerCase() !== questionFilter.difficulty.toLowerCase()) return false;
    if (questionFilter.microarea && q.microareaId !== questionFilter.microarea) return false;
    return true;
  });

  // Filter students by search
  const filteredStudents = rankingStudents.filter(s => {
    if (!studentSearch) return true;
    const term = studentSearch.toLowerCase();
    return (
      s.name.toLowerCase().includes(term) ||
      (s.ra && s.ra.toLowerCase().includes(term)) ||
      (s.curso && s.curso.toLowerCase().includes(term))
    );
  });

  // Load student report
  const handleViewStudentReport = async (student: RankingStudent) => {
    setReportLoading(true);
    setReportStudentInfo(student);
    setSelectedStudentReport(null);
    setStudentEssays([]);
    try {
      const [reportRes, essayRes] = await Promise.allSettled([
        fetch(`/api/reports/individual/${student.userId}`, { headers: fetchHeaders() }),
        fetch(`/api/reports/individual/${student.userId}/essays`, { headers: fetchHeaders() }),
      ]);

      if (reportRes.status === 'fulfilled' && reportRes.value.ok) {
        const reportData = await reportRes.value.json();
        setSelectedStudentReport(reportData);
      }

      if (essayRes.status === 'fulfilled' && essayRes.value.ok) {
        const essayData = await essayRes.value.json();
        setStudentEssays(essayData.essays || []);
      }
    } catch (err) {
      console.error('Error loading student report:', err);
    } finally {
      setReportLoading(false);
    }
  };

  // Handle create question
  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      const body = {
        type: form.type,
        microareaId: form.microareaId,
        elementId: form.elementId,
        difficulty: form.difficulty?.toLowerCase() || 'médio',
        context: form.context,
        statement: form.statement,
        alternatives: form.type === 'Objetiva' ? form.alternatives.map(a => ({ letter: a.key, text: a.text })) : [],
        correctAnswer: form.type === 'Objetiva' ? form.alternatives.find(a => a.isCorrect)?.key || 'A' : 'DISSERTATIVA',
        explanation: form.explanation,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        source: form.source,
        sourceYear: form.year,
        status: 'RASCUNHO',
      };

      const res = await fetch('/api/questions', {
        method: 'POST',
        headers: fetchHeaders(),
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setForm({ ...emptyForm, alternatives: emptyAlternatives() });
        setActiveTab('my-questions');
        loadData();
      }
    } catch (err) {
      console.error('Error saving draft:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAndTest = async () => {
    setSendingToTest(true);
    try {
      const body = {
        type: form.type,
        microareaId: form.microareaId,
        elementId: form.elementId,
        difficulty: form.difficulty?.toLowerCase() || 'médio',
        context: form.context,
        statement: form.statement,
        alternatives: form.type === 'Objetiva' ? form.alternatives.map(a => ({ letter: a.key, text: a.text })) : [],
        correctAnswer: form.type === 'Objetiva' ? form.alternatives.find(a => a.isCorrect)?.key || 'A' : 'DISSERTATIVA',
        explanation: form.explanation,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        source: form.source,
        sourceYear: form.year,
        status: 'AGUARDANDO_TESTE',
      };

      const res = await fetch('/api/questions', {
        method: 'POST',
        headers: fetchHeaders(),
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const data = await res.json();
        const questionId = data.id || data.question?.id;
        if (questionId) {
          await fetch(`/api/questions/${questionId}/test`, {
            method: 'POST',
            headers: fetchHeaders(),
          });
        }
        setForm({ ...emptyForm, alternatives: emptyAlternatives() });
        setActiveTab('pre-test');
        loadData();
      }
    } catch (err) {
      console.error('Error saving and testing:', err);
    } finally {
      setSendingToTest(false);
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    try {
      const res = await fetch(`/api/questions/${id}`, {
        method: 'DELETE',
        headers: fetchHeaders(),
      });
      if (res.ok) loadData();
    } catch (err) {
      console.error('Error deleting question:', err);
    }
  };

  const handleApproveQuestion = async (id: string) => {
    try {
      const res = await fetch(`/api/questions/${id}`, {
        method: 'PUT',
        headers: fetchHeaders(),
        body: JSON.stringify({ status: 'ATIVA' }),
      });
      if (res.ok) loadData();
    } catch (err) {
      console.error('Error approving question:', err);
    }
  };

  const handleRejectQuestion = async (id: string) => {
    try {
      const res = await fetch(`/api/questions/${id}`, {
        method: 'PUT',
        headers: fetchHeaders(),
        body: JSON.stringify({ status: 'RASCUNHO' }),
      });
      if (res.ok) loadData();
    } catch (err) {
      console.error('Error rejecting question:', err);
    }
  };

  if (loading) {
    return (
      <AdminLayout panelType="professor">
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

  const pretestQuestions = allQuestions.filter(q => ['EM_TESTE', 'AGUARDANDO_TESTE'].includes(q.status));
  const validationQuestions = allQuestions.filter(q => q.status === 'AGUARDANDO_VALIDACAO');

  // Hit rate color helper
  const hitRateColor = (rate: number) => {
    if (rate >= 70) return 'text-emerald-400';
    if (rate >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const hitRateBg = (rate: number) => {
    if (rate >= 70) return 'bg-emerald-500/10';
    if (rate >= 50) return 'bg-yellow-500/10';
    return 'bg-red-500/10';
  };

  return (
    <AdminLayout panelType="professor">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
        {/* Tab Navigation */}
        <div className="mb-6 overflow-x-auto">
          <TabsList className="bg-white/5 border border-cyan-500/10 h-auto p-1 gap-1 flex-wrap">
            {[
              { value: 'my-questions', label: 'Minhas Questões', icon: <FileQuestion size={14} />, badge: allQuestions.length },
              { value: 'create', label: 'Criar Questão', icon: <Plus size={14} /> },
              { value: 'pre-test', label: 'Pré-teste EnadIA', icon: <Brain size={14} />, badge: pretestQuestions.length },
              { value: 'validate', label: 'Validar Questões', icon: <CheckCircle2 size={14} />, badge: validationQuestions.length },
              { value: 'student-reports', label: 'Relatório de Alunos', icon: <Users size={14} />, badge: rankingStudents.length },
              { value: 'simulados', label: 'Simulados', icon: <ClipboardList size={14} /> },
              { value: 'dashboard', label: 'Dashboard', icon: <BarChart3 size={14} /> },
            ].map(tab => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-mono data-[state=active]:bg-cyan-500/15 data-[state=active]:text-cyan-400 data-[state=active]:border-cyan-500/30 rounded-md whitespace-nowrap transition-all"
              >
                {tab.icon}
                {tab.label}
                {tab.badge ? (
                  <Badge className="ml-1 text-[10px] h-4 px-1.5 bg-cyan-500/20 text-cyan-400">{tab.badge}</Badge>
                ) : null}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <AnimatePresence mode="wait">
          {/* ======================== MINHAS QUESTÕES ======================== */}
          <TabsContent value="my-questions">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Total Criadas', value: stats.total, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
                  { label: 'Aprovadas', value: stats.aprovadas, color: 'text-green-400', bg: 'bg-green-500/10' },
                  { label: 'Pendentes', value: stats.pendentes, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
                  { label: 'Reprovadas', value: stats.reprovadas, color: 'text-red-400', bg: 'bg-red-500/10' },
                ].map(stat => (
                  <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="jarvis-card p-4 text-center">
                      <p className={`text-2xl font-bold font-mono ${stat.color}`}>{stat.value}</p>
                      <p className="text-[10px] text-gray-500 font-mono mt-1">{stat.label}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
                  <Filter size={12} />
                  Filtros:
                </div>
                <select
                  value={questionFilter.status}
                  onChange={e => setQuestionFilter(f => ({ ...f, status: e.target.value }))}
                  className="bg-[#0a0e17] border border-cyan-500/20 text-gray-300 text-xs font-mono rounded-lg px-3 py-2 focus:border-cyan-500/40 outline-none"
                >
                  <option value="">Todos Status</option>
                  {Object.entries(statusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
                <select
                  value={questionFilter.difficulty}
                  onChange={e => setQuestionFilter(f => ({ ...f, difficulty: e.target.value }))}
                  className="bg-[#0a0e17] border border-cyan-500/20 text-gray-300 text-xs font-mono rounded-lg px-3 py-2 focus:border-cyan-500/40 outline-none"
                >
                  <option value="">Todas Dificuldades</option>
                  <option value="fácil">Fácil</option>
                  <option value="médio">Médio</option>
                  <option value="difícil">Difícil</option>
                </select>
                <select
                  value={questionFilter.microarea}
                  onChange={e => setQuestionFilter(f => ({ ...f, microarea: e.target.value }))}
                  className="bg-[#0a0e17] border border-cyan-500/20 text-gray-300 text-xs font-mono rounded-lg px-3 py-2 focus:border-cyan-500/40 outline-none"
                >
                  <option value="">Todas Microáreas</option>
                  {microareas.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>

              {/* Questions Table */}
              <div className="jarvis-card overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-cyan-500/10 hover:bg-transparent">
                      <TableHead className="text-xs font-mono text-gray-400">Código</TableHead>
                      <TableHead className="text-xs font-mono text-gray-400">Microárea</TableHead>
                      <TableHead className="text-xs font-mono text-gray-400">Dificuldade</TableHead>
                      <TableHead className="text-xs font-mono text-gray-400">Status</TableHead>
                      <TableHead className="text-xs font-mono text-gray-400">Fonte</TableHead>
                      <TableHead className="text-xs font-mono text-gray-400 text-center">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredQuestions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-gray-500 font-mono text-xs">
                          Nenhuma questão encontrada
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredQuestions.map((q) => (
                        <TableRow key={q.id} className="border-b border-cyan-500/5 hover:bg-white/[0.02]">
                          <TableCell className="text-xs text-cyan-400/80 font-mono">{q.code}</TableCell>
                          <TableCell className="text-xs text-gray-300 font-mono max-w-[200px] truncate">
                            {q.macroarea && <span className="text-[10px] text-gray-500 block">{q.macroarea}</span>}
                            {q.microarea}
                            {q.element && <span className="text-[10px] text-cyan-400/70 block">{q.element}</span>}
                          </TableCell>
                          <TableCell className={`text-xs font-mono ${difficultyColors[q.difficulty] || 'text-gray-400'}`}>{capitalizeFirst(q.difficulty)}</TableCell>
                          <TableCell>
                            <Badge className={`text-[10px] font-mono ${statusColors[q.status] || 'bg-gray-500/20 text-gray-400'}`}>
                              {statusLabels[q.status] || q.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs text-gray-400 font-mono">{q.source}</TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center gap-1">
                              <Button size="icon" variant="ghost" className="h-7 w-7 text-cyan-400/60 hover:text-cyan-400 hover:bg-cyan-500/10" onClick={() => setViewingQuestion(q)}>
                                <Eye size={14} />
                              </Button>
                              <Button size="icon" variant="ghost" className="h-7 w-7 text-red-400/60 hover:text-red-400 hover:bg-red-500/10" onClick={() => handleDeleteQuestion(q.id)}>
                                <Trash2 size={14} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* View Question Dialog */}
              <Dialog open={!!viewingQuestion} onOpenChange={() => setViewingQuestion(null)}>
                <DialogContent className="bg-[#0d1321] border-cyan-500/20 max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-cyan-400 font-mono flex items-center gap-2">
                      <FileQuestion size={16} /> Questão {viewingQuestion?.code}
                    </DialogTitle>
                  </DialogHeader>
                  {viewingQuestion && (
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        <Badge className={`text-[10px] font-mono ${statusColors[viewingQuestion.status]}`}>
                          {statusLabels[viewingQuestion.status]}
                        </Badge>
                        <Badge variant="outline" className="text-[10px] font-mono border-cyan-500/20 text-cyan-400/70">
                          {capitalizeFirst(viewingQuestion.difficulty)}
                        </Badge>
                        <Badge variant="outline" className="text-[10px] font-mono border-cyan-500/20 text-cyan-400/70">
                          {viewingQuestion.type}
                        </Badge>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 font-mono mb-1">MICROÁREA / ELEMENTO</p>
                        <p className="text-sm text-white font-mono">{viewingQuestion.microarea}{viewingQuestion.element ? ` — ${viewingQuestion.element}` : ''}</p>
                      </div>

                      {viewingQuestion.context && (
                        <div>
                          <p className="text-xs text-gray-500 font-mono mb-1">CONTEXTO / COMANDO</p>
                          <p className="text-sm text-gray-300 font-mono whitespace-pre-wrap">{viewingQuestion.context}</p>
                        </div>
                      )}

                      <div>
                        <p className="text-xs text-gray-500 font-mono mb-1">ENUNCIADO</p>
                        <p className="text-sm text-gray-300 font-mono whitespace-pre-wrap">{viewingQuestion.statement}</p>
                      </div>

                      {viewingQuestion.alternatives && viewingQuestion.alternatives.length > 0 && (
                        <div>
                          <p className="text-xs text-gray-500 font-mono mb-2">ALTERNATIVAS</p>
                          <div className="space-y-1">
                            {viewingQuestion.alternatives.map((alt) => (
                              <div key={alt.key} className={`text-xs font-mono p-2.5 rounded ${alt.isCorrect ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-white/[0.02] text-gray-400'}`}>
                                <span className="font-bold mr-2">{alt.key})</span> {alt.text}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {viewingQuestion.explanation && (
                        <div>
                          <p className="text-xs text-gray-500 font-mono mb-1">JUSTIFICATIVA</p>
                          <p className="text-sm text-gray-300 font-mono whitespace-pre-wrap">{viewingQuestion.explanation}</p>
                        </div>
                      )}

                      {viewingQuestion.geminiFeedback && (
                        <div>
                          <p className="text-xs text-gray-500 font-mono mb-1 flex items-center gap-1">
                            <Brain size={12} /> FEEDBACK ENADIA
                          </p>
                          <div className={`p-3 rounded-lg border ${viewingQuestion.geminiApproved ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
                            <p className="text-xs text-gray-300 font-mono whitespace-pre-wrap">{viewingQuestion.geminiFeedback}</p>
                            {viewingQuestion.geminiTriSuggestion && (
                              <p className="text-xs text-cyan-400/70 font-mono mt-2">
                                TRI sugerido: a={viewingQuestion.geminiTriSuggestion.a}, b={viewingQuestion.geminiTriSuggestion.b}, c={viewingQuestion.geminiTriSuggestion.c}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </motion.div>
          </TabsContent>

          {/* ======================== CRIAR QUESTÃO ======================== */}
          <TabsContent value="create">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="jarvis-card p-6">
                <h3 className="text-sm font-mono text-cyan-400 tracking-wider mb-6 flex items-center gap-2">
                  <Plus size={14} /> Nova Questão
                </h3>

                <div className="space-y-5">
                  {/* Row 1: Type + Difficulty */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-mono text-gray-400 tracking-wider uppercase">Tipo</Label>
                      <select
                        value={form.type}
                        onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                        className="w-full bg-[#0a0e17] border border-cyan-500/20 text-white text-sm font-mono rounded-lg px-3 py-2.5 focus:border-cyan-500/40 outline-none"
                      >
                        <option value="Objetiva">Objetiva</option>
                        <option value="Dissertativa">Dissertativa</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-mono text-gray-400 tracking-wider uppercase">Dificuldade</Label>
                      <select
                        value={form.difficulty}
                        onChange={e => setForm(f => ({ ...f, difficulty: e.target.value }))}
                        className="w-full bg-[#0a0e17] border border-cyan-500/20 text-white text-sm font-mono rounded-lg px-3 py-2.5 focus:border-cyan-500/40 outline-none"
                      >
                        <option value="Fácil">Fácil</option>
                        <option value="Médio">Médio</option>
                        <option value="Difícil">Difícil</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 2: Microarea + Element */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-mono text-gray-400 tracking-wider uppercase">Microárea</Label>
                      <select
                        value={form.microareaId}
                        onChange={e => setForm(f => ({ ...f, microareaId: e.target.value, elementId: '' }))}
                        className="w-full bg-[#0a0e17] border border-cyan-500/20 text-white text-sm font-mono rounded-lg px-3 py-2.5 focus:border-cyan-500/40 outline-none"
                      >
                        <option value="">Selecione...</option>
                        {microareas.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-mono text-gray-400 tracking-wider uppercase">Elemento</Label>
                      <select
                        value={form.elementId}
                        onChange={e => setForm(f => ({ ...f, elementId: e.target.value }))}
                        className="w-full bg-[#0a0e17] border border-cyan-500/20 text-white text-sm font-mono rounded-lg px-3 py-2.5 focus:border-cyan-500/40 outline-none"
                        disabled={!form.microareaId}
                      >
                        <option value="">Selecione a microárea...</option>
                        {elements.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Context */}
                  <div className="space-y-2">
                    <Label className="text-xs font-mono text-gray-400 tracking-wider uppercase">Contexto / Comando</Label>
                    <Textarea
                      value={form.context}
                      onChange={e => setForm(f => ({ ...f, context: e.target.value }))}
                      placeholder="Contexto ou situação-problema que fundamenta a questão..."
                      className="min-h-[80px] bg-[#0a0e17] border-cyan-500/20 text-white placeholder:text-gray-600 font-mono text-sm resize-none focus:border-cyan-500/40"
                    />
                  </div>

                  {/* Statement */}
                  <div className="space-y-2">
                    <Label className="text-xs font-mono text-gray-400 tracking-wider uppercase">Enunciado</Label>
                    <Textarea
                      value={form.statement}
                      onChange={e => setForm(f => ({ ...f, statement: e.target.value }))}
                      placeholder="Texto do enunciado da questão..."
                      className="min-h-[100px] bg-[#0a0e17] border-cyan-500/20 text-white placeholder:text-gray-600 font-mono text-sm resize-none focus:border-cyan-500/40"
                    />
                  </div>

                  {/* Alternatives (only for Objetiva) */}
                  {form.type === 'Objetiva' && (
                    <div className="space-y-3">
                      <Label className="text-xs font-mono text-gray-400 tracking-wider uppercase flex items-center gap-2">
                        Alternativas
                        <span className="text-[10px] text-gray-600">(Clique na letra para marcar a correta)</span>
                      </Label>
                      <div className="space-y-2">
                        {form.alternatives.map((alt, idx) => (
                          <div key={alt.key} className={`flex items-center gap-2 p-2.5 rounded-lg border transition-all ${alt.isCorrect ? 'bg-green-500/10 border-green-500/30' : 'bg-white/[0.02] border-cyan-500/10 hover:border-cyan-500/20'}`}>
                            <button
                              type="button"
                              onClick={() => {
                                setForm(f => ({
                                  ...f,
                                  alternatives: f.alternatives.map((a, i) => ({ ...a, isCorrect: i === idx })),
                                }));
                              }}
                              className={`w-7 h-7 rounded flex items-center justify-center text-xs font-bold font-mono flex-shrink-0 transition-all ${alt.isCorrect ? 'bg-green-500/20 text-green-400 border border-green-500/40' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20'}`}
                            >
                              {alt.key}
                            </button>
                            <input
                              value={alt.text}
                              onChange={e => {
                                const newAlts = [...form.alternatives];
                                newAlts[idx] = { ...newAlts[idx], text: e.target.value };
                                setForm(f => ({ ...f, alternatives: newAlts }));
                              }}
                              placeholder={`Alternativa ${alt.key}...`}
                              className="flex-1 bg-transparent text-white placeholder:text-gray-600 font-mono text-sm outline-none"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Explanation */}
                  <div className="space-y-2">
                    <Label className="text-xs font-mono text-gray-400 tracking-wider uppercase">Justificativa / Explicação</Label>
                    <Textarea
                      value={form.explanation}
                      onChange={e => setForm(f => ({ ...f, explanation: e.target.value }))}
                      placeholder="Explicação detalhada da resposta correta..."
                      className="min-h-[80px] bg-[#0a0e17] border-cyan-500/20 text-white placeholder:text-gray-600 font-mono text-sm resize-none focus:border-cyan-500/40"
                    />
                  </div>

                  {/* Row: Tags + Source + Year */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-mono text-gray-400 tracking-wider uppercase">Tags</Label>
                      <Input
                        value={form.tags}
                        onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                        placeholder="tag1, tag2, tag3"
                        className="bg-[#0a0e17] border-cyan-500/20 text-white placeholder:text-gray-600 font-mono text-sm focus:border-cyan-500/40"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-mono text-gray-400 tracking-wider uppercase">Fonte</Label>
                      <select
                        value={form.source}
                        onChange={e => setForm(f => ({ ...f, source: e.target.value }))}
                        className="w-full bg-[#0a0e17] border border-cyan-500/20 text-white text-sm font-mono rounded-lg px-3 py-2.5 focus:border-cyan-500/40 outline-none"
                      >
                        <option value="elaborada">Elaborada</option>
                        <option value="enade-oficial">ENADE Oficial</option>
                        <option value="externa">Externa</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-mono text-gray-400 tracking-wider uppercase">Ano</Label>
                      <Input
                        type="number"
                        value={form.year}
                        onChange={e => setForm(f => ({ ...f, year: parseInt(e.target.value) || 2025 }))}
                        className="bg-[#0a0e17] border-cyan-500/20 text-white placeholder:text-gray-600 font-mono text-sm focus:border-cyan-500/40"
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Button
                      onClick={handleSaveDraft}
                      disabled={saving}
                      variant="outline"
                      className="flex-1 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 font-mono text-sm h-11"
                    >
                      <Save size={16} className="mr-2" />
                      {saving ? 'Salvando...' : 'Salvar Rascunho'}
                    </Button>
                    <Button
                      onClick={handleSaveAndTest}
                      disabled={sendingToTest || !form.statement.trim()}
                      className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-sm h-11"
                    >
                      <Send size={16} className="mr-2" />
                      {sendingToTest ? 'Enviando...' : 'Salvar e Enviar para Pré-teste'}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </TabsContent>

          {/* ======================== PRÉ-TESTE ENADIA ======================== */}
          <TabsContent value="pre-test">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <Brain size={16} className="text-purple-400" />
                <h3 className="text-sm font-mono text-cyan-400 tracking-wider">Questões em Pré-teste EnadIA</h3>
                <Badge className="text-[10px] font-mono bg-purple-500/20 text-purple-400">{pretestQuestions.length}</Badge>
              </div>

              {pretestQuestions.length === 0 ? (
                <div className="jarvis-card p-12 text-center">
                  <Sparkles size={40} className="mx-auto text-purple-500/20 mb-4" />
                  <p className="text-gray-500 font-mono text-sm">Nenhuma questão aguardando pré-teste</p>
                  <p className="text-gray-600 font-mono text-xs mt-1">Envie questões para que a EnadIA as analise</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pretestQuestions.map((q, i) => (
                    <motion.div
                      key={q.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="jarvis-card p-5"
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-mono text-cyan-400/80">{q.code}</span>
                            <Badge className={`text-[10px] font-mono ${statusColors[q.status]}`}>
                              {statusLabels[q.status]}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-400 font-mono">{q.microarea} • {capitalizeFirst(q.difficulty)}</p>
                        </div>
                        <Badge variant="outline" className="text-[10px] font-mono border-cyan-500/20 text-cyan-400/70 flex-shrink-0">
                          {q.source}
                        </Badge>
                      </div>

                      <p className="text-sm text-gray-300 font-mono mb-3 line-clamp-2">{q.statement}</p>

                      {/* Gemini Feedback */}
                      {q.geminiFeedback ? (
                        <div className={`p-4 rounded-lg border ${q.geminiApproved ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
                          <div className="flex items-center gap-2 mb-2">
                            {q.geminiApproved ? (
                              <CheckCircle2 size={14} className="text-green-400" />
                            ) : (
                              <XCircle size={14} className="text-red-400" />
                            )}
                            <span className={`text-xs font-bold font-mono ${q.geminiApproved ? 'text-green-400' : 'text-red-400'}`}>
                              {q.geminiApproved ? 'APROVADA PELA ENADIA' : 'REPROVADA PELA ENADIA'}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 font-mono whitespace-pre-wrap">{q.geminiFeedback}</p>
                          {q.geminiTriSuggestion && (
                            <div className="mt-3 flex items-center gap-4">
                              <span className="text-[10px] text-cyan-400/70 font-mono">
                                TRI sugerido: <span className="text-cyan-400">a={q.geminiTriSuggestion.a}</span> | <span className="text-cyan-400">b={q.geminiTriSuggestion.b}</span> | <span className="text-cyan-400">c={q.geminiTriSuggestion.c}</span>
                              </span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="p-4 rounded-lg bg-purple-500/5 border border-purple-500/20 flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full border-2 border-purple-500/30 border-t-purple-400 animate-spin" />
                          <span className="text-xs text-purple-400 font-mono">EnadIA está analisando esta questão...</span>
                        </div>
                      )}

                      {/* Actions */}
                      {q.geminiFeedback && (
                        <div className="flex items-center gap-2 mt-3">
                          {q.geminiApproved && (
                            <Button size="sm" onClick={() => handleApproveQuestion(q.id)} className="bg-green-600 hover:bg-green-500 text-white font-mono text-xs">
                              <CheckCircle2 size={12} className="mr-1" /> Aprovar
                            </Button>
                          )}
                          <Button size="sm" variant="outline" onClick={() => handleRejectQuestion(q.id)} className="border-red-500/30 text-red-400 hover:bg-red-500/10 font-mono text-xs">
                            <XCircle size={12} className="mr-1" /> Reprovar
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => { setForm({ ...emptyForm, alternatives: emptyAlternatives() }); setActiveTab('create'); }} className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 font-mono text-xs">
                            <Edit size={12} className="mr-1" /> Editar e Reenviar
                          </Button>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </TabsContent>

          {/* ======================== VALIDAR QUESTÕES ======================== */}
          <TabsContent value="validate">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle2 size={16} className="text-blue-400" />
                <h3 className="text-sm font-mono text-cyan-400 tracking-wider">Questões Aguardando Validação</h3>
                <Badge className="text-[10px] font-mono bg-blue-500/20 text-blue-400">{validationQuestions.length}</Badge>
              </div>

              {validationQuestions.length === 0 ? (
                <div className="jarvis-card p-12 text-center">
                  <CheckCircle2 size={40} className="mx-auto text-blue-500/20 mb-4" />
                  <p className="text-gray-500 font-mono text-sm">Nenhuma questão aguardando validação</p>
                  <p className="text-gray-600 font-mono text-xs mt-1">Questões aprovadas no pré-teste aparecerão aqui</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {validationQuestions.map((q, i) => (
                    <motion.div
                      key={q.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="jarvis-card p-5"
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-mono text-cyan-400/80">{q.code}</span>
                            <Badge className="text-[10px] font-mono bg-blue-500/20 text-blue-400">
                              Aguardando Validação
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-400 font-mono">{q.microarea}{q.element ? ` • ${q.element}` : ''} • {capitalizeFirst(q.difficulty)}</p>
                        </div>
                      </div>

                      {q.context && (
                        <p className="text-xs text-gray-400 font-mono mb-2 italic">{q.context}</p>
                      )}

                      <p className="text-sm text-gray-300 font-mono mb-3">{q.statement}</p>

                      {q.alternatives && (
                        <div className="space-y-1 mb-3">
                          {q.alternatives.map(alt => (
                            <div key={alt.key} className={`text-xs font-mono p-2 rounded ${alt.isCorrect ? 'bg-green-500/10 text-green-400' : 'text-gray-400'}`}>
                              <span className="font-bold mr-2">{alt.key})</span> {alt.text}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* EnadIA feedback for validation */}
                      {q.geminiFeedback && (
                        <div className="p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/10 mb-3">
                          <p className="text-[10px] text-gray-500 font-mono mb-1">FEEDBACK DA ENADIA</p>
                          <p className="text-xs text-gray-400 font-mono line-clamp-3">{q.geminiFeedback}</p>
                          {q.geminiTriSuggestion && (
                            <p className="text-[10px] text-cyan-400/70 font-mono mt-1">
                              TRI: a={q.geminiTriSuggestion.a} | b={q.geminiTriSuggestion.b} | c={q.geminiTriSuggestion.c}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Validation Actions */}
                      <div className="flex items-center gap-2">
                        <Button size="sm" onClick={() => handleApproveQuestion(q.id)} className="bg-green-600 hover:bg-green-500 text-white font-mono text-xs">
                          <CheckCircle2 size={12} className="mr-1" /> Aprovar e Ativar
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleRejectQuestion(q.id)} className="border-red-500/30 text-red-400 hover:bg-red-500/10 font-mono text-xs">
                          <XCircle size={12} className="mr-1" /> Rejeitar
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setViewingQuestion(q)} className="text-cyan-400/60 hover:text-cyan-400 font-mono text-xs">
                          <Eye size={12} className="mr-1" /> Ver Detalhes
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* View Question Dialog (reuse) */}
              <Dialog open={!!viewingQuestion} onOpenChange={() => setViewingQuestion(null)}>
                <DialogContent className="bg-[#0d1321] border-cyan-500/20 max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-cyan-400 font-mono">Questão {viewingQuestion?.code}</DialogTitle>
                  </DialogHeader>
                  {viewingQuestion && (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-300 font-mono whitespace-pre-wrap">{viewingQuestion.statement}</p>
                      {viewingQuestion.alternatives?.map(alt => (
                        <div key={alt.key} className={`text-xs font-mono p-2 rounded ${alt.isCorrect ? 'bg-green-500/10 text-green-400' : 'text-gray-400'}`}>
                          <span className="font-bold mr-2">{alt.key})</span> {alt.text}
                        </div>
                      ))}
                      {viewingQuestion.explanation && (
                        <p className="text-xs text-gray-400 font-mono whitespace-pre-wrap">{viewingQuestion.explanation}</p>
                      )}
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </motion.div>
          </TabsContent>

          {/* ======================== RELATÓRIO DE ALUNOS ======================== */}
          <TabsContent value="student-reports">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <Users size={16} className="text-cyan-400" />
                  <h3 className="text-sm font-mono text-cyan-400 tracking-wider">Relatório de Alunos</h3>
                  <Badge className="text-[10px] font-mono bg-cyan-500/20 text-cyan-400">{rankingStudents.length} alunos</Badge>
                </div>
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <Input
                    value={studentSearch}
                    onChange={e => setStudentSearch(e.target.value)}
                    placeholder="Buscar aluno..."
                    className="pl-9 bg-[#0a0e17] border-cyan-500/20 text-white placeholder:text-gray-600 font-mono text-xs h-9 w-64"
                  />
                </div>
              </div>

              {filteredStudents.length === 0 ? (
                <div className="jarvis-card p-12 text-center">
                  <Users size={40} className="mx-auto text-cyan-500/20 mb-4" />
                  <p className="text-gray-500 font-mono text-sm">Nenhum aluno encontrado</p>
                  <p className="text-gray-600 font-mono text-xs mt-1">Alunos aparecerão aqui após responderem questões</p>
                </div>
              ) : (
                <div className="jarvis-card overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b border-cyan-500/10 hover:bg-transparent">
                        <TableHead className="text-xs font-mono text-gray-400">#</TableHead>
                        <TableHead className="text-xs font-mono text-gray-400">Aluno</TableHead>
                        <TableHead className="text-xs font-mono text-gray-400 hidden sm:table-cell">RA</TableHead>
                        <TableHead className="text-xs font-mono text-gray-400 hidden md:table-cell">Curso</TableHead>
                        <TableHead className="text-xs font-mono text-gray-400 text-center">Questões</TableHead>
                        <TableHead className="text-xs font-mono text-gray-400 text-center">Acerto</TableHead>
                        <TableHead className="text-xs font-mono text-gray-400 text-center">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.map((s) => (
                        <TableRow key={s.userId} className="border-b border-cyan-500/5 hover:bg-white/[0.02]">
                          <TableCell className="text-xs text-gray-500 font-mono">{s.position}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
                                <span className="text-[10px] font-bold text-cyan-400">{s.name.charAt(0).toUpperCase()}</span>
                              </div>
                              <div>
                                <p className="text-xs text-gray-200 font-mono">{s.name}</p>
                                {s.modalidade && (
                                  <span className="text-[9px] px-1 py-0.5 rounded bg-purple-500/10 text-purple-400/70 border border-purple-500/10">{s.modalidade}</span>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs text-gray-400 font-mono hidden sm:table-cell">{s.ra || '—'}</TableCell>
                          <TableCell className="text-xs text-gray-400 font-mono hidden md:table-cell max-w-[120px] truncate">{s.curso || '—'}</TableCell>
                          <TableCell className="text-xs text-gray-300 font-mono text-center">{s.totalAnswered}</TableCell>
                          <TableCell className="text-center">
                            <span className={`text-xs font-mono font-bold ${s.totalAnswered > 0 ? hitRateColor(s.hitRate) : 'text-gray-600'}`}>
                              {s.totalAnswered > 0 ? `${s.hitRate}%` : '—'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 font-mono text-[11px]"
                                onClick={() => handleViewStudentReport(s)}
                              >
                                <Eye size={12} className="mr-1" /> Ver Relatório
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* Student Report Dialog */}
              <Dialog open={!!selectedStudentReport} onOpenChange={() => { setSelectedStudentReport(null); setStudentEssays([]); setReportStudentInfo(null); }}>
                <DialogContent className="bg-[#0d1321] border-cyan-500/20 max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-cyan-400 font-mono flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <FileText size={16} /> Relatório do Aluno
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 font-mono text-xs ml-4"
                        onClick={() => printReport('student-report-content')}
                      >
                        <Printer size={12} className="mr-1" /> Imprimir Relatório
                      </Button>
                    </DialogTitle>
                  </DialogHeader>

                  {reportLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="w-8 h-8 rounded-full border-2 border-cyan-500/30 border-t-cyan-400 animate-spin" />
                    </div>
                  ) : selectedStudentReport && reportStudentInfo ? (
                    <div id="student-report-content" className="space-y-6">
                      {/* Student Info */}
                      <div className="jarvis-card p-4">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
                            <span className="text-lg font-bold text-cyan-400">{reportStudentInfo.name.charAt(0).toUpperCase()}</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-mono text-white font-bold">{reportStudentInfo.name}</h4>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                              {reportStudentInfo.ra && <span className="text-xs text-gray-400 font-mono">RA: {reportStudentInfo.ra}</span>}
                              {reportStudentInfo.curso && <span className="text-xs text-gray-400 font-mono">Curso: {reportStudentInfo.curso}</span>}
                              {reportStudentInfo.periodo && <span className="text-xs text-gray-400 font-mono">Período: {reportStudentInfo.periodo}º</span>}
                              {reportStudentInfo.modalidade && <span className="text-xs text-gray-400 font-mono">Modalidade: {reportStudentInfo.modalidade}</span>}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Overview Stats */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                          { label: 'Total Respondidas', value: selectedStudentReport.overview.totalResponses, color: 'text-cyan-400' },
                          { label: 'Corretas', value: selectedStudentReport.overview.correctResponses, color: 'text-green-400' },
                          { label: 'Taxa de Acerto', value: `${selectedStudentReport.overview.hitRate}%`, color: hitRateColor(selectedStudentReport.overview.hitRate) },
                          { label: 'Atividade Recente', value: selectedStudentReport.overview.recentActivity, color: 'text-purple-400' },
                        ].map(stat => (
                          <div key={stat.label} className="jarvis-card p-3 text-center">
                            <p className={`text-xl font-bold font-mono ${stat.color}`}>{stat.value}</p>
                            <p className="text-[10px] text-gray-500 font-mono mt-1">{stat.label}</p>
                          </div>
                        ))}
                      </div>

                      {/* Performance by Microarea - Radar Chart */}
                      {selectedStudentReport.byMicroarea.length > 0 && (
                        <div className="jarvis-card p-4">
                          <h4 className="text-sm font-mono text-cyan-400 tracking-wider mb-4 flex items-center gap-2">
                            <Target size={14} /> Desempenho por Microárea
                          </h4>
                          <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                              <RadarChart data={selectedStudentReport.byMicroarea.slice(0, 8).map(m => ({
                                microarea: m.name.length > 15 ? m.name.substring(0, 15) + '...' : m.name,
                                taxa: m.hitRate,
                                total: m.total,
                              }))}>
                                <PolarGrid stroke="#1e293b" />
                                <PolarAngleAxis dataKey="microarea" tick={{ fill: '#94a3b8', fontSize: 9, fontFamily: 'monospace' }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 9 }} />
                                <Radar name="Taxa de Acerto (%)" dataKey="taxa" stroke="#00f0ff" fill="#00f0ff" fillOpacity={0.15} />
                                <Tooltip content={<CustomTooltip />} />
                              </RadarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      )}

                      {/* Strengths & Weaknesses */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedStudentReport.strengths.length > 0 && (
                          <div className="jarvis-card p-4">
                            <h4 className="text-sm font-mono text-green-400 tracking-wider mb-3 flex items-center gap-2">
                              <TrendingUp size={14} /> Pontos Fortes
                            </h4>
                            <div className="space-y-2">
                              {selectedStudentReport.strengths.map((s, i) => (
                                <div key={i} className="flex items-center justify-between p-2 rounded bg-green-500/5 border border-green-500/10">
                                  <span className="text-xs text-gray-300 font-mono truncate flex-1">{s.name}</span>
                                  <span className="text-xs font-mono font-bold text-green-400 ml-2">{s.hitRate}%</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {selectedStudentReport.weaknesses.length > 0 && (
                          <div className="jarvis-card p-4">
                            <h4 className="text-sm font-mono text-red-400 tracking-wider mb-3 flex items-center gap-2">
                              <AlertTriangle size={14} /> Pontos a Melhorar
                            </h4>
                            <div className="space-y-2">
                              {selectedStudentReport.weaknesses.map((w, i) => (
                                <div key={i} className="flex items-center justify-between p-2 rounded bg-red-500/5 border border-red-500/10">
                                  <span className="text-xs text-gray-300 font-mono truncate flex-1">{w.name}</span>
                                  <span className="text-xs font-mono font-bold text-red-400 ml-2">{w.hitRate}%</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Simulado History */}
                      {selectedStudentReport.simuladoHistory.length > 0 && (
                        <div className="jarvis-card p-4">
                          <h4 className="text-sm font-mono text-cyan-400 tracking-wider mb-3 flex items-center gap-2">
                            <ClipboardList size={14} /> Resultados de Simulados
                          </h4>
                          <div className="space-y-2">
                            {selectedStudentReport.simuladoHistory.map((sim, i) => (
                              <div key={i} className="flex items-center justify-between p-3 rounded bg-white/[0.02] border border-cyan-500/10">
                                <div>
                                  <p className="text-xs text-gray-200 font-mono">{sim.simulado}</p>
                                  <p className="text-[10px] text-gray-500 font-mono">{new Date(sim.date).toLocaleDateString('pt-BR')}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="text-xs text-gray-400 font-mono">{sim.correct}/{sim.total}</span>
                                  <span className={`text-xs font-mono font-bold ${hitRateColor(sim.hitRate)}`}>{sim.hitRate}%</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Essay Answers with AI Feedback */}
                      {studentEssays.length > 0 && (
                        <div className="jarvis-card p-4">
                          <h4 className="text-sm font-mono text-cyan-400 tracking-wider mb-3 flex items-center gap-2">
                            <MessageSquare size={14} /> Respostas Dissertativas com Feedback IA
                          </h4>
                          <div className="space-y-3 max-h-96 overflow-y-auto">
                            {studentEssays.map((essay) => (
                              <div key={essay.id} className="p-3 rounded-lg border border-cyan-500/10 bg-white/[0.02]">
                                <div className="flex items-center justify-between mb-2">
                                  <div>
                                    <span className="text-xs text-cyan-400/80 font-mono">{essay.question.code}</span>
                                    <span className="text-xs text-gray-500 font-mono ml-2">— {essay.question.microarea.name}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {essay.aiScore !== null && (
                                      <Badge className={`text-[10px] font-mono ${essay.aiScore >= 7 ? 'bg-green-500/20 text-green-400' : essay.aiScore >= 5 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                                        Nota: {essay.aiScore.toFixed(1)}/10
                                      </Badge>
                                    )}
                                    <span className="text-[10px] text-gray-500 font-mono">{new Date(essay.createdAt).toLocaleDateString('pt-BR')}</span>
                                  </div>
                                </div>
                                <p className="text-[10px] text-gray-500 font-mono mb-1 line-clamp-1">Questão: {essay.question.statement}</p>
                                <p className="text-xs text-gray-300 font-mono mb-2 line-clamp-2 italic">Resposta: {essay.answer}</p>
                                {essay.aiFeedback && (
                                  <div className="p-2 rounded bg-purple-500/5 border border-purple-500/10">
                                    <p className="text-[10px] text-purple-400/80 font-mono mb-1">FEEDBACK IA:</p>
                                    <p className="text-xs text-gray-400 font-mono whitespace-pre-wrap line-clamp-4">{essay.aiFeedback}</p>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Performance by Difficulty */}
                      {selectedStudentReport.byDifficulty.length > 0 && (
                        <div className="jarvis-card p-4">
                          <h4 className="text-sm font-mono text-cyan-400 tracking-wider mb-3 flex items-center gap-2">
                            <BarChart3 size={14} /> Desempenho por Dificuldade
                          </h4>
                          <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={selectedStudentReport.byDifficulty.map(d => ({
                                difficulty: d.difficulty,
                                taxa: d.hitRate,
                                total: d.total,
                              }))}>
                                <XAxis dataKey="difficulty" tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }} axisLine={{ stroke: '#1e293b' }} />
                                <YAxis domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }} axisLine={{ stroke: '#1e293b' }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="taxa" name="Taxa de Acerto (%)" fill="#00f0ff" radius={[4, 4, 0, 0]} />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      )}

                      {/* Generated At */}
                      <p className="text-[10px] text-gray-600 font-mono text-center">
                        Relatório gerado em {new Date(selectedStudentReport.generatedAt).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  ) : null}
                </DialogContent>
              </Dialog>
            </motion.div>
          </TabsContent>

          {/* ======================== SIMULADOS ======================== */}
          <TabsContent value="simulados">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <ClipboardList size={16} className="text-cyan-400" />
                <h3 className="text-sm font-mono text-cyan-400 tracking-wider">Simulados como Professor</h3>
              </div>

              {/* Warning Notice */}
              <div className="jarvis-card p-4 border-yellow-500/20 bg-yellow-500/5">
                <div className="flex items-start gap-3">
                  <AlertTriangle size={18} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-yellow-400 font-mono font-bold mb-1">Atenção</p>
                    <p className="text-xs text-gray-400 font-mono">
                      Simulados realizados como professor <span className="text-yellow-400 font-bold">NÃO contam para o ranking</span>.
                      Use esta opção apenas para testar questões e simulados. Seu desempenho aqui não será registrado no ranking dos alunos.
                    </p>
                  </div>
                </div>
              </div>

              {/* Go to Student View */}
              <div className="jarvis-card p-6">
                <div className="text-center">
                  <GraduationCap size={40} className="mx-auto text-cyan-500/30 mb-4" />
                  <h4 className="text-sm text-white font-mono mb-2">Fazer Simulado</h4>
                  <p className="text-xs text-gray-400 font-mono mb-6 max-w-md mx-auto">
                    Para fazer simulados, acesse a visão do aluno. Seus resultados como professor serão marcados e excluídos do ranking automaticamente.
                  </p>
                  <Button
                    onClick={() => { setPanel('student'); setCurrentView('simulado'); }}
                    className="bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-sm h-11 px-8"
                  >
                    <GraduationCap size={16} className="mr-2" />
                    Ir para Visão do Aluno
                  </Button>
                </div>
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="jarvis-card p-4 text-center">
                  <ClipboardList size={20} className="mx-auto text-cyan-400/60 mb-2" />
                  <p className="text-xs text-gray-400 font-mono">Simulados Disponíveis</p>
                  <p className="text-lg font-bold font-mono text-cyan-400">{classDashboard?.simuladoStats?.length || 0}</p>
                </div>
                <div className="jarvis-card p-4 text-center">
                  <FileQuestion size={20} className="mx-auto text-green-400/60 mb-2" />
                  <p className="text-xs text-gray-400 font-mono">Questões Ativas</p>
                  <p className="text-lg font-bold font-mono text-green-400">{classDashboard?.overview?.activeQuestions || 0}</p>
                </div>
                <div className="jarvis-card p-4 text-center">
                  <Users size={20} className="mx-auto text-purple-400/60 mb-2" />
                  <p className="text-xs text-gray-400 font-mono">Alunos Ativos</p>
                  <p className="text-lg font-bold font-mono text-purple-400">{classDashboard?.overview?.studentsCount || 0}</p>
                </div>
              </div>
            </motion.div>
          </TabsContent>

          {/* ======================== DASHBOARD ======================== */}
          <TabsContent value="dashboard">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              {/* Class Overview */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Total Alunos', value: classDashboard?.overview?.studentsCount ?? 0, color: 'text-cyan-400', icon: <Users size={16} /> },
                  { label: 'Média da Turma', value: `${classDashboard?.overview?.avgHitRate ?? 0}%`, color: 'text-emerald-400', icon: <TrendingUp size={16} /> },
                  { label: 'Questões Ativas', value: classDashboard?.overview?.activeQuestions ?? 0, color: 'text-green-400', icon: <FileQuestion size={16} /> },
                  { label: 'Total Respostas', value: classDashboard?.overview?.totalResponses ?? 0, color: 'text-purple-400', icon: <Activity size={16} /> },
                ].map(stat => (
                  <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="jarvis-card p-4 text-center">
                      <div className="flex items-center justify-center mb-1 text-gray-500">{stat.icon}</div>
                      <p className={`text-2xl font-bold font-mono ${stat.color}`}>{stat.value}</p>
                      <p className="text-[10px] text-gray-500 font-mono mt-1">{stat.label}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Top Performing Students */}
              <div className="jarvis-card p-4">
                <h4 className="text-sm font-mono text-cyan-400 tracking-wider mb-4 flex items-center gap-2">
                  <UserCheck size={14} /> Alunos com Melhor Desempenho
                </h4>
                {classDashboard?.studentRanking && classDashboard.studentRanking.length > 0 ? (
                  <div className="space-y-2">
                    {classDashboard.studentRanking.slice(0, 5).map((student, idx) => (
                      <div key={student.id} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-cyan-500/5 hover:border-cyan-500/10 transition-colors">
                        <div className="flex items-center gap-3">
                          <span className={`text-xs font-mono font-bold ${
                            idx === 0 ? 'text-yellow-400' :
                            idx === 1 ? 'text-slate-300' :
                            idx === 2 ? 'text-amber-600' :
                            'text-gray-500'
                          }`}>
                            {idx + 1}º
                          </span>
                          <div className="w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                            <span className="text-xs font-bold text-cyan-400">{student.name.charAt(0).toUpperCase()}</span>
                          </div>
                          <div>
                            <p className="text-xs text-gray-200 font-mono">{student.name}</p>
                            <p className="text-[10px] text-gray-500 font-mono">{student.ra || ''} • {student.totalResponses} questões</p>
                          </div>
                        </div>
                        <span className={`text-sm font-mono font-bold ${hitRateColor(student.hitRate)}`}>
                          {student.hitRate}%
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Users size={32} className="mx-auto text-gray-600 mb-2" />
                    <p className="text-xs text-gray-500 font-mono">Nenhum dado de aluno disponível</p>
                  </div>
                )}
              </div>

              {/* Recent Student Activity */}
              <div className="jarvis-card p-4">
                <h4 className="text-sm font-mono text-cyan-400 tracking-wider mb-4 flex items-center gap-2">
                  <Activity size={14} /> Atividade Recente dos Alunos
                </h4>
                {classDashboard?.byMicroarea && classDashboard.byMicroarea.length > 0 ? (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {classDashboard.byMicroarea.slice(0, 8).map((ma, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded bg-white/[0.02] border border-cyan-500/5">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ma.color || '#06b6d4' }} />
                          <span className="text-xs text-gray-300 font-mono truncate">{ma.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] text-gray-500 font-mono">{ma.total} resp.</span>
                          <span className={`text-xs font-mono font-bold ${hitRateColor(ma.hitRate)}`}>{ma.hitRate}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Activity size={32} className="mx-auto text-gray-600 mb-2" />
                    <p className="text-xs text-gray-500 font-mono">Nenhuma atividade registrada ainda</p>
                  </div>
                )}
              </div>

              {/* Question Stats (existing) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="jarvis-card p-4 text-center">
                  <p className="text-2xl font-bold font-mono text-cyan-400">{stats.total}</p>
                  <p className="text-[10px] text-gray-500 font-mono">Total Criadas</p>
                </div>
                <div className="jarvis-card p-4 text-center">
                  <p className="text-2xl font-bold font-mono text-green-400">{stats.aprovadas}</p>
                  <p className="text-[10px] text-gray-500 font-mono">Aprovadas</p>
                </div>
                <div className="jarvis-card p-4 text-center">
                  <p className="text-2xl font-bold font-mono text-yellow-400">
                    {stats.total > 0 ? Math.round((stats.aprovadas / stats.total) * 100) : 0}%
                  </p>
                  <p className="text-[10px] text-gray-500 font-mono">Taxa de Aprovação</p>
                </div>
                <div className="jarvis-card p-4 text-center">
                  <p className="text-2xl font-bold font-mono text-purple-400">{stats.pendentes}</p>
                  <p className="text-[10px] text-gray-500 font-mono">Pendentes</p>
                </div>
              </div>

              {/* Charts (existing) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Questions over time */}
                <div className="jarvis-card p-4">
                  <h4 className="text-sm font-mono text-cyan-400 tracking-wider mb-4 flex items-center gap-2">
                    <TrendingUp size={14} /> Questões Criadas ao Longo do Tempo
                  </h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      {stats.chartData.length > 0 ? (
                        <LineChart data={stats.chartData}>
                          <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }} axisLine={{ stroke: '#1e293b' }} />
                          <YAxis tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }} axisLine={{ stroke: '#1e293b' }} />
                          <Tooltip content={<CustomTooltip />} />
                          <Line type="monotone" dataKey="criadas" name="Criadas" stroke="#00f0ff" strokeWidth={2} dot={{ fill: '#00f0ff', r: 3 }} />
                          <Line type="monotone" dataKey="aprovadas" name="Aprovadas" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 3 }} />
                        </LineChart>
                      ) : (
                        <div className="h-full flex items-center justify-center">
                          <p className="text-xs text-gray-600 font-mono">Dados insuficientes</p>
                        </div>
                      )}
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Microarea Coverage */}
                <div className="jarvis-card p-4">
                  <h4 className="text-sm font-mono text-cyan-400 tracking-wider mb-4 flex items-center gap-2">
                    <BookOpen size={14} /> Cobertura por Microárea
                  </h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      {stats.radarData.length > 0 ? (
                        <RadarChart data={stats.radarData}>
                          <PolarGrid stroke="#1e293b" />
                          <PolarAngleAxis dataKey="microarea" tick={{ fill: '#94a3b8', fontSize: 9, fontFamily: 'monospace' }} />
                          <PolarRadiusAxis tick={{ fill: '#94a3b8', fontSize: 9 }} />
                          <Radar name="Questões" dataKey="questoes" stroke="#00f0ff" fill="#00f0ff" fillOpacity={0.15} />
                        </RadarChart>
                      ) : (
                        <div className="h-full flex items-center justify-center">
                          <p className="text-xs text-gray-600 font-mono">Dados insuficientes</p>
                        </div>
                      )}
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Class Performance by Microarea */}
              {classDashboard?.byMicroarea && classDashboard.byMicroarea.length > 0 && (
                <div className="jarvis-card p-4">
                  <h4 className="text-sm font-mono text-cyan-400 tracking-wider mb-4 flex items-center gap-2">
                    <BarChart3 size={14} /> Desempenho da Turma por Microárea
                  </h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={classDashboard.byMicroarea.slice(0, 10).map(m => ({
                        name: m.name.length > 12 ? m.name.substring(0, 12) + '...' : m.name,
                        taxa: m.hitRate,
                        respostas: m.total,
                      }))}>
                        <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 9, fontFamily: 'monospace' }} axisLine={{ stroke: '#1e293b' }} />
                        <YAxis domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }} axisLine={{ stroke: '#1e293b' }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="taxa" name="Taxa de Acerto (%)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Status Distribution (existing) */}
              <div className="jarvis-card p-4">
                <h4 className="text-sm font-mono text-cyan-400 tracking-wider mb-4 flex items-center gap-2">
                  <Target size={14} /> Distribuição por Status
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Rascunho', count: allQuestions.filter(q => q.status === 'RASCUNHO').length, color: 'border-yellow-500/20', bg: 'bg-yellow-500/5', textColor: 'text-yellow-400' },
                    { label: 'Em Teste', count: allQuestions.filter(q => ['AGUARDANDO_TESTE', 'EM_TESTE'].includes(q.status)).length, color: 'border-purple-500/20', bg: 'bg-purple-500/5', textColor: 'text-purple-400' },
                    { label: 'Aprovada', count: allQuestions.filter(q => q.status === 'APROVADA').length, color: 'border-green-500/20', bg: 'bg-green-500/5', textColor: 'text-green-400' },
                    { label: 'Ativa', count: allQuestions.filter(q => q.status === 'ATIVA').length, color: 'border-emerald-500/20', bg: 'bg-emerald-500/5', textColor: 'text-emerald-400' },
                  ].map(s => (
                    <div key={s.label} className={`p-4 rounded-lg border ${s.color} ${s.bg}`}>
                      <p className={`text-2xl font-bold font-mono ${s.textColor}`}>{s.count}</p>
                      <p className="text-[10px] text-gray-500 font-mono">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </TabsContent>
        </AnimatePresence>
      </Tabs>
    </AdminLayout>
  );
}
