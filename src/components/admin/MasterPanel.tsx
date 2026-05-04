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
import { printReport } from '@/lib/print-utils';
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
  Upload,
  Save,
  Send,
  Printer,
  User,
  Filter,
  CheckSquare,
  Square,
  FileSpreadsheet,
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
  curso?: string;
  periodo?: number;
  modalidade?: string;
  disciplina?: string;
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
  type?: string;
  explanation?: string;
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

interface BatchResult {
  success: number;
  errors: number;
  errorDetails: Array<{ row: number; name: string; error: string }>;
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
};

const emptyAlternatives = () => [
  { key: 'A', text: '', isCorrect: false },
  { key: 'B', text: '', isCorrect: false },
  { key: 'C', text: '', isCorrect: false },
  { key: 'D', text: '', isCorrect: false },
  { key: 'E', text: '', isCorrect: false },
];

const emptyQuestionForm = {
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
  const [profSearch, setProfSearch] = useState('');

  // Questions data
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [questionPage, setQuestionPage] = useState(1);
  const [questionTotal, setQuestionTotal] = useState(0);
  const [questionFilter, setQuestionFilter] = useState({ status: '', microarea: '', source: '', difficulty: '' });
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  // Microareas
  const [microareas, setMicroareas] = useState<MicroareaData[]>([]);
  const [elements, setElements] = useState<ElementData[]>([]);

  // New professor dialog
  const [newProfessor, setNewProfessor] = useState({ name: '', email: '', ra: '', disciplina: '', password: '' });
  const [showNewProfDialog, setShowNewProfDialog] = useState(false);

  // Batch registration
  const [showStudentBatchDialog, setShowStudentBatchDialog] = useState(false);
  const [showProfBatchDialog, setShowProfBatchDialog] = useState(false);
  const [batchCsv, setBatchCsv] = useState('');
  const [batchImporting, setBatchImporting] = useState(false);
  const [batchProgress, setBatchProgress] = useState({ current: 0, total: 0 });
  const [batchResult, setBatchResult] = useState<BatchResult | null>(null);
  const [batchMode, setBatchMode] = useState<'csv' | 'individual'>('csv');

  // Individual add forms
  const [newStudent, setNewStudent] = useState({ name: '', email: '', ra: '', curso: '', periodo: '', modalidade: 'PRESENCIAL', senha: '' });
  const [newProfIndividual, setNewProfIndividual] = useState({ name: '', email: '', ra: '', disciplina: '', senha: '' });

  // Edit user
  const [editingUser, setEditingUser] = useState<UserData | null>(null);

  // Question CRUD
  const [showQuestionFormDialog, setShowQuestionFormDialog] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuestionData | null>(null);
  const [questionForm, setQuestionForm] = useState({ ...emptyQuestionForm, alternatives: emptyAlternatives() });
  const [questionSaving, setQuestionSaving] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState<Set<string>>(new Set());
  const [bulkStatus, setBulkStatus] = useState('');
  const [viewingQuestion, setViewingQuestion] = useState<QuestionData | null>(null);

  // Reports
  const [reportLoading, setReportLoading] = useState(false);
  const [reportData, setReportData] = useState<Record<string, unknown> | null>(null);
  const [reportSubTab, setReportSubTab] = useState('individual');
  const [reportStudentId, setReportStudentId] = useState('');
  const [reportCurso, setReportCurso] = useState('');
  const [reportPeriodo, setReportPeriodo] = useState('');
  const [individualReport, setIndividualReport] = useState<Record<string, unknown> | null>(null);
  const [turmaReport, setTurmaReport] = useState<Record<string, unknown> | null>(null);
  const [cursoReport, setCursoReport] = useState<Record<string, unknown> | null>(null);

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

  // Load elements when question form microarea changes
  useEffect(() => {
    if (questionForm.microareaId) {
      fetch(`/api/elements?microareaId=${questionForm.microareaId}`, { headers: fetchHeaders() })
        .then(res => res.ok ? res.json() : [])
        .then(data => setElements(Array.isArray(data) ? data : data.elements || []))
        .catch(() => setElements([]));
    } else {
      setElements([]);
    }
  }, [questionForm.microareaId, fetchHeaders]);

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
        setNewProfessor({ name: '', email: '', ra: '', disciplina: '', password: '' });
        loadDashboard();
      }
    } catch (err) {
      console.error('Error creating professor:', err);
    }
  };

  // === BATCH REGISTRATION ===
  const handleBatchStudentImport = async () => {
    if (!batchCsv.trim()) return;
    setBatchImporting(true);
    setBatchResult(null);

    const lines = batchCsv.trim().split('\n').filter(l => l.trim());
    const total = lines.length;
    setBatchProgress({ current: 0, total });

    let success = 0;
    const errors: BatchResult['errorDetails'] = [];

    for (let i = 0; i < lines.length; i++) {
      const parts = lines[i].split(',').map(p => p.trim());
      if (parts.length < 7) {
        errors.push({ row: i + 1, name: parts[0] || 'Linha ' + (i + 1), error: 'Formato inválido (esperado: nome,email,ra,curso,periodo,modalidade,senha)' });
        setBatchProgress({ current: i + 1, total });
        continue;
      }

      const [nome, email, ra, curso, periodo, modalidade, senha] = parts;
      try {
        const res = await fetch('/api/auth/users', {
          method: 'POST',
          headers: fetchHeaders(),
          body: JSON.stringify({
            name: nome, email, ra, curso,
            periodo: parseInt(periodo) || 1,
            modalidade: modalidade.toUpperCase() === 'EAD' ? 'EAD' : modalidade.toUpperCase() === 'SEMIPRESENCIAL' ? 'SEMIPRESENCIAL' : 'PRESENCIAL',
            password: senha,
            role: 'ALUNO',
          }),
        });
        if (res.ok) {
          success++;
        } else {
          const data = await res.json().catch(() => ({ error: 'Erro desconhecido' }));
          errors.push({ row: i + 1, name: nome, error: data.error || `Erro HTTP ${res.status}` });
        }
      } catch {
        errors.push({ row: i + 1, name: nome, error: 'Erro de conexão' });
      }
      setBatchProgress({ current: i + 1, total });
    }

    setBatchResult({ success, errors: errors.length, errorDetails: errors });
    setBatchImporting(false);
    loadDashboard();
  };

  const handleBatchProfImport = async () => {
    if (!batchCsv.trim()) return;
    setBatchImporting(true);
    setBatchResult(null);

    const lines = batchCsv.trim().split('\n').filter(l => l.trim());
    const total = lines.length;
    setBatchProgress({ current: 0, total });

    let success = 0;
    const errors: BatchResult['errorDetails'] = [];

    for (let i = 0; i < lines.length; i++) {
      const parts = lines[i].split(',').map(p => p.trim());
      if (parts.length < 5) {
        errors.push({ row: i + 1, name: parts[0] || 'Linha ' + (i + 1), error: 'Formato inválido (esperado: nome,email,ra,disciplina,senha)' });
        setBatchProgress({ current: i + 1, total });
        continue;
      }

      const [nome, email, ra, disciplina, senha] = parts;
      try {
        const res = await fetch('/api/auth/users', {
          method: 'POST',
          headers: fetchHeaders(),
          body: JSON.stringify({ name: nome, email, ra, disciplina, password: senha, role: 'PROFESSOR' }),
        });
        if (res.ok) {
          success++;
        } else {
          const data = await res.json().catch(() => ({ error: 'Erro desconhecido' }));
          errors.push({ row: i + 1, name: nome, error: data.error || `Erro HTTP ${res.status}` });
        }
      } catch {
        errors.push({ row: i + 1, name: nome, error: 'Erro de conexão' });
      }
      setBatchProgress({ current: i + 1, total });
    }

    setBatchResult({ success, errors: errors.length, errorDetails: errors });
    setBatchImporting(false);
    loadDashboard();
  };

  const handleAddIndividualStudent = async () => {
    if (!newStudent.name || !newStudent.email || !newStudent.senha) return;
    try {
      const res = await fetch('/api/auth/users', {
        method: 'POST',
        headers: fetchHeaders(),
        body: JSON.stringify({
          name: newStudent.name,
          email: newStudent.email,
          ra: newStudent.ra || undefined,
          curso: newStudent.curso || undefined,
          periodo: parseInt(newStudent.periodo) || undefined,
          modalidade: newStudent.modalidade,
          password: newStudent.senha,
          role: 'ALUNO',
        }),
      });
      if (res.ok) {
        setNewStudent({ name: '', email: '', ra: '', curso: '', periodo: '', modalidade: 'PRESENCIAL', senha: '' });
        loadDashboard();
      } else {
        const data = await res.json().catch(() => ({ error: 'Erro desconhecido' }));
        alert(data.error || 'Erro ao criar aluno');
      }
    } catch (err) {
      console.error('Error creating student:', err);
    }
  };

  const handleAddIndividualProf = async () => {
    if (!newProfIndividual.name || !newProfIndividual.email || !newProfIndividual.senha) return;
    try {
      const res = await fetch('/api/auth/users', {
        method: 'POST',
        headers: fetchHeaders(),
        body: JSON.stringify({
          name: newProfIndividual.name,
          email: newProfIndividual.email,
          ra: newProfIndividual.ra || undefined,
          disciplina: newProfIndividual.disciplina || undefined,
          password: newProfIndividual.senha,
          role: 'PROFESSOR',
        }),
      });
      if (res.ok) {
        setNewProfIndividual({ name: '', email: '', ra: '', disciplina: '', senha: '' });
        loadDashboard();
      } else {
        const data = await res.json().catch(() => ({ error: 'Erro desconhecido' }));
        alert(data.error || 'Erro ao criar professor');
      }
    } catch (err) {
      console.error('Error creating professor:', err);
    }
  };

  // === EDIT USER ===
  const handleUpdateUser = async () => {
    if (!editingUser) return;
    try {
      const updateData: Record<string, unknown> = {
        name: editingUser.name,
        email: editingUser.email,
      };
      if (editingUser.role === 'ALUNO') {
        updateData.curso = editingUser.curso || '';
        updateData.periodo = editingUser.periodo || '';
        updateData.modalidade = editingUser.modalidade || 'PRESENCIAL';
      }
      if (editingUser.role === 'PROFESSOR') {
        updateData.disciplina = editingUser.disciplina || '';
      }

      const res = await fetch(`/api/auth/users/${editingUser.id}`, {
        method: 'PUT',
        headers: fetchHeaders(),
        body: JSON.stringify(updateData),
      });
      if (res.ok) {
        setEditingUser(null);
        loadDashboard();
      } else {
        const data = await res.json().catch(() => ({ error: 'Erro desconhecido' }));
        alert(data.error || 'Erro ao atualizar usuário');
      }
    } catch (err) {
      console.error('Error updating user:', err);
    }
  };

  // === QUESTION CRUD ===
  const handleSaveQuestion = async (status: string) => {
    setQuestionSaving(true);
    try {
      const body: Record<string, unknown> = {
        type: questionForm.type === 'Objetiva' ? 'OBJETIVA' : 'DISSERTATIVA',
        statement: questionForm.statement,
        context: questionForm.context || null,
        correctAnswer: questionForm.type === 'Objetiva'
          ? questionForm.alternatives.find(a => a.isCorrect)?.key || 'A'
          : 'DISSERTATIVA',
        explanation: questionForm.explanation || null,
        difficulty: questionForm.difficulty?.toLowerCase() || 'médio',
        microareaId: questionForm.microareaId,
        elementId: questionForm.elementId || null,
        source: questionForm.source,
        sourceYear: questionForm.year || null,
        alternatives: questionForm.type === 'Objetiva'
          ? questionForm.alternatives.filter(a => a.text.trim()).map(a => ({ letter: a.key, text: a.text }))
          : [],
        tags: questionForm.tags.split(',').map(t => t.trim()).filter(Boolean),
        status,
      };

      let res;
      if (editingQuestion) {
        res = await fetch(`/api/questions/${editingQuestion.id}`, {
          method: 'PUT',
          headers: fetchHeaders(),
          body: JSON.stringify(body),
        });
      } else {
        res = await fetch('/api/questions', {
          method: 'POST',
          headers: fetchHeaders(),
          body: JSON.stringify(body),
        });
      }

      if (res.ok) {
        setShowQuestionFormDialog(false);
        setEditingQuestion(null);
        setQuestionForm({ ...emptyQuestionForm, alternatives: emptyAlternatives() });
        loadDashboard();
      } else {
        const data = await res.json().catch(() => ({ error: 'Erro desconhecido' }));
        alert(data.error || 'Erro ao salvar questão');
      }
    } catch (err) {
      console.error('Error saving question:', err);
    } finally {
      setQuestionSaving(false);
    }
  };

  const handleQuestionStatusChange = async (questionId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/questions/${questionId}`, {
        method: 'PUT',
        headers: fetchHeaders(),
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        loadDashboard();
      }
    } catch (err) {
      console.error('Error changing question status:', err);
    }
  };

  const handleBulkStatusChange = async () => {
    if (!bulkStatus || selectedQuestions.size === 0) return;
    try {
      const updates = Array.from(selectedQuestions).map(id =>
        fetch(`/api/questions/${id}`, {
          method: 'PUT',
          headers: fetchHeaders(),
          body: JSON.stringify({ status: bulkStatus }),
        })
      );
      await Promise.allSettled(updates);
      setSelectedQuestions(new Set());
      setBulkStatus('');
      loadDashboard();
    } catch (err) {
      console.error('Error in bulk status change:', err);
    }
  };

  const openEditQuestion = (q: QuestionData) => {
    setEditingQuestion(q);
    setQuestionForm({
      type: q.type === 'DISSERTATIVA' ? 'Dissertativa' : 'Objetiva',
      microareaId: '',
      elementId: '',
      difficulty: q.difficulty,
      context: q.context || '',
      statement: q.statement || '',
      alternatives: q.alternatives && q.alternatives.length > 0
        ? q.alternatives.map(a => ({ key: a.key, text: a.text, isCorrect: a.isCorrect }))
        : emptyAlternatives(),
      explanation: q.explanation || '',
      tags: q.tags?.join(', ') || '',
      source: q.source || 'elaborada',
      year: q.year || new Date().getFullYear(),
    });
    setShowQuestionFormDialog(true);
  };

  // === REPORTS ===
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

  const handleIndividualReport = async () => {
    if (!reportStudentId) return;
    setReportLoading(true);
    try {
      const res = await fetch(`/api/ranking?userId=${reportStudentId}`, { headers: fetchHeaders() });
      if (res.ok) {
        const data = await res.json();
        setIndividualReport(data);
      }
    } catch (err) {
      console.error('Error generating individual report:', err);
    } finally {
      setReportLoading(false);
    }
  };

  const handleTurmaReport = async () => {
    if (!reportCurso) return;
    setReportLoading(true);
    try {
      const res = await fetch(`/api/ranking?curso=${encodeURIComponent(reportCurso)}&periodo=${reportPeriodo}`, { headers: fetchHeaders() });
      if (res.ok) {
        const data = await res.json();
        setTurmaReport(data);
      }
    } catch (err) {
      console.error('Error generating turma report:', err);
    } finally {
      setReportLoading(false);
    }
  };

  const handleCursoReport = async () => {
    if (!reportCurso) return;
    setReportLoading(true);
    try {
      const res = await fetch(`/api/ranking?curso=${encodeURIComponent(reportCurso)}`, { headers: fetchHeaders() });
      if (res.ok) {
        const data = await res.json();
        setCursoReport(data);
      }
    } catch (err) {
      console.error('Error generating curso report:', err);
    } finally {
      setReportLoading(false);
    }
  };

  // === DERIVED DATA ===
  const filteredStudents = studentSearch
    ? students.filter(s =>
        s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
        (s.ra && s.ra.includes(studentSearch))
      )
    : students;

  const filteredProfessors = profSearch
    ? professors.filter(p =>
        p.name.toLowerCase().includes(profSearch.toLowerCase()) ||
        (p.ra && p.ra.includes(profSearch))
      )
    : professors;

  const filteredQuestions = questions.filter(q => {
    if (questionFilter.status && q.status !== questionFilter.status) return false;
    if (questionFilter.difficulty && q.difficulty !== questionFilter.difficulty) return false;
    if (questionFilter.microarea && q.microarea !== questionFilter.microarea) return false;
    if (questionFilter.source && q.source !== questionFilter.source) return false;
    return true;
  });

  const chartColors = ['#00f0ff', '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];
  const uniqueCursos = [...new Set(students.map(s => s.curso).filter(Boolean))];
  const uniquePeriodos = [...new Set(students.map(s => s.periodo).filter(Boolean))];

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
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h3 className="text-sm font-mono text-cyan-400 tracking-wider flex items-center gap-2">
                  <GraduationCap size={14} /> Docentes Cadastrados ({professors.length})
                </h3>
                <div className="flex items-center gap-2">
                  <div className="relative w-full sm:w-56">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-500/40" size={14} />
                    <Input
                      value={profSearch}
                      onChange={e => setProfSearch(e.target.value)}
                      placeholder="Buscar por nome ou RA..."
                      className="pl-9 h-9 bg-[#0a0e17] border-cyan-500/20 text-white placeholder:text-gray-600 font-mono text-xs"
                    />
                  </div>
                  <Button onClick={() => { setBatchMode('csv'); setBatchCsv(''); setBatchResult(null); setShowProfBatchDialog(true); }} className="bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs whitespace-nowrap">
                    <Upload size={14} className="mr-1.5" /> Cadastro em Lote
                  </Button>
                  <Button onClick={() => setShowNewProfDialog(true)} className="bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs whitespace-nowrap">
                    <Plus size={14} className="mr-1.5" /> Adicionar
                  </Button>
                </div>
              </div>

              <div className="jarvis-card overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-cyan-500/10 hover:bg-transparent">
                      <TableHead className="text-xs font-mono text-gray-400">Nome</TableHead>
                      <TableHead className="text-xs font-mono text-gray-400">Email</TableHead>
                      <TableHead className="text-xs font-mono text-gray-400">RA</TableHead>
                      <TableHead className="text-xs font-mono text-gray-400">Disciplina</TableHead>
                      <TableHead className="text-xs font-mono text-gray-400 text-center">Questões</TableHead>
                      <TableHead className="text-xs font-mono text-gray-400 text-center">Último Login</TableHead>
                      <TableHead className="text-xs font-mono text-gray-400 text-center">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProfessors.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-gray-500 font-mono text-xs">
                          Nenhum professor cadastrado
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredProfessors.map((prof) => (
                        <TableRow key={prof.id} className="border-b border-cyan-500/5 hover:bg-white/[0.02]">
                          <TableCell className="text-sm text-white font-mono">{prof.name}</TableCell>
                          <TableCell className="text-sm text-gray-400 font-mono">{prof.email}</TableCell>
                          <TableCell className="text-xs text-cyan-400/70 font-mono">{prof.ra || '—'}</TableCell>
                          <TableCell className="text-xs text-cyan-400/70 font-mono">{prof.disciplina || '—'}</TableCell>
                          <TableCell className="text-sm text-cyan-400 font-mono text-center">{prof.questionsCreated || 0}</TableCell>
                          <TableCell className="text-xs text-gray-500 font-mono text-center">{prof.lastLogin ? new Date(prof.lastLogin).toLocaleDateString('pt-BR') : '—'}</TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center gap-1">
                              <Button size="icon" variant="ghost" className="h-7 w-7 text-cyan-400/60 hover:text-cyan-400 hover:bg-cyan-500/10" onClick={() => setEditingUser(prof)}>
                                <Edit size={14} />
                              </Button>
                            </div>
                          </TableCell>
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
                      <Label className="text-xs font-mono text-gray-400">RA</Label>
                      <Input value={newProfessor.ra} onChange={e => setNewProfessor(p => ({ ...p, ra: e.target.value }))} placeholder="RA do professor" className="mt-1 bg-[#0a0e17] border-cyan-500/20 text-white font-mono text-sm" />
                    </div>
                    <div>
                      <Label className="text-xs font-mono text-gray-400">Disciplina</Label>
                      <Input value={newProfessor.disciplina} onChange={e => setNewProfessor(p => ({ ...p, disciplina: e.target.value }))} placeholder="Disciplina que leciona" className="mt-1 bg-[#0a0e17] border-cyan-500/20 text-white font-mono text-sm" />
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

              {/* Professor Batch Registration Dialog */}
              <Dialog open={showProfBatchDialog} onOpenChange={setShowProfBatchDialog}>
                <DialogContent className="bg-[#0d1321] border-cyan-500/20 max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-cyan-400 font-mono flex items-center gap-2">
                      <Upload size={16} /> Cadastro em Lote — Docentes
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    {/* Mode toggle */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={batchMode === 'csv' ? 'default' : 'outline'}
                        onClick={() => setBatchMode('csv')}
                        className={batchMode === 'csv' ? 'bg-cyan-600 text-white font-mono text-xs' : 'border-cyan-500/30 text-cyan-400 font-mono text-xs'}
                      >
                        <FileSpreadsheet size={14} className="mr-1.5" /> Importar CSV
                      </Button>
                      <Button
                        size="sm"
                        variant={batchMode === 'individual' ? 'default' : 'outline'}
                        onClick={() => setBatchMode('individual')}
                        className={batchMode === 'individual' ? 'bg-cyan-600 text-white font-mono text-xs' : 'border-cyan-500/30 text-cyan-400 font-mono text-xs'}
                      >
                        <Plus size={14} className="mr-1.5" /> Adicionar Individual
                      </Button>
                    </div>

                    {batchMode === 'csv' ? (
                      <>
                        <div>
                          <Label className="text-xs font-mono text-gray-400 mb-2 block">
                            Formato CSV: nome,email,ra,disciplina,senha
                          </Label>
                          <Textarea
                            value={batchCsv}
                            onChange={e => setBatchCsv(e.target.value)}
                            placeholder={`João Silva,joao@unifecaf.br,12345,Engenharia de Software,senha123\nMaria Santos,maria@unifecaf.br,12346,Banco de Dados,senha456`}
                            className="min-h-[200px] bg-[#0a0e17] border-cyan-500/20 text-white placeholder:text-gray-600 font-mono text-sm resize-none"
                          />
                        </div>
                        {batchImporting && (
                          <div className="p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
                            <p className="text-sm text-cyan-400 font-mono">
                              Importando {batchProgress.current}/{batchProgress.total}...
                            </p>
                            <div className="w-full bg-cyan-500/10 rounded-full h-2 mt-2">
                              <div className="bg-cyan-400 h-2 rounded-full transition-all" style={{ width: `${batchProgress.total > 0 ? (batchProgress.current / batchProgress.total) * 100 : 0}%` }} />
                            </div>
                          </div>
                        )}
                        {batchResult && (
                          <div className="p-3 rounded-lg border border-cyan-500/20 space-y-2">
                            <div className="flex items-center gap-4">
                              <span className="text-sm text-green-400 font-mono flex items-center gap-1">
                                <CheckCircle2 size={14} /> {batchResult.success} sucesso(s)
                              </span>
                              <span className="text-sm text-red-400 font-mono flex items-center gap-1">
                                <XCircle size={14} /> {batchResult.errors} erro(s)
                              </span>
                            </div>
                            {batchResult.errorDetails.length > 0 && (
                              <div className="max-h-32 overflow-y-auto space-y-1">
                                {batchResult.errorDetails.map((err, i) => (
                                  <p key={i} className="text-xs text-red-400/80 font-mono">
                                    Linha {err.row} ({err.name}): {err.error}
                                  </p>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                        <Button
                          onClick={handleBatchProfImport}
                          disabled={batchImporting || !batchCsv.trim()}
                          className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-mono"
                        >
                          {batchImporting ? 'Importando...' : <><Upload size={14} className="mr-1.5" /> Importar CSV</>}
                        </Button>
                      </>
                    ) : (
                      <>
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label className="text-xs font-mono text-gray-400">Nome</Label>
                              <Input value={newProfIndividual.name} onChange={e => setNewProfIndividual(p => ({ ...p, name: e.target.value }))} placeholder="Prof. Dr. Nome" className="mt-1 bg-[#0a0e17] border-cyan-500/20 text-white font-mono text-sm" />
                            </div>
                            <div>
                              <Label className="text-xs font-mono text-gray-400">Email</Label>
                              <Input value={newProfIndividual.email} onChange={e => setNewProfIndividual(p => ({ ...p, email: e.target.value }))} placeholder="email@unifecaf.br" className="mt-1 bg-[#0a0e17] border-cyan-500/20 text-white font-mono text-sm" />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label className="text-xs font-mono text-gray-400">RA</Label>
                              <Input value={newProfIndividual.ra} onChange={e => setNewProfIndividual(p => ({ ...p, ra: e.target.value }))} placeholder="RA" className="mt-1 bg-[#0a0e17] border-cyan-500/20 text-white font-mono text-sm" />
                            </div>
                            <div>
                              <Label className="text-xs font-mono text-gray-400">Disciplina</Label>
                              <Input value={newProfIndividual.disciplina} onChange={e => setNewProfIndividual(p => ({ ...p, disciplina: e.target.value }))} placeholder="Disciplina" className="mt-1 bg-[#0a0e17] border-cyan-500/20 text-white font-mono text-sm" />
                            </div>
                          </div>
                          <div>
                            <Label className="text-xs font-mono text-gray-400">Senha</Label>
                            <Input value={newProfIndividual.senha} onChange={e => setNewProfIndividual(p => ({ ...p, senha: e.target.value }))} type="password" placeholder="••••••••" className="mt-1 bg-[#0a0e17] border-cyan-500/20 text-white font-mono text-sm" />
                          </div>
                        </div>
                        <Button onClick={handleAddIndividualProf} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-mono">
                          <Plus size={14} className="mr-1.5" /> Adicionar Professor
                        </Button>
                      </>
                    )}
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
                <div className="flex items-center gap-2">
                  <div className="relative w-full sm:w-56">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-500/40" size={14} />
                    <Input
                      value={studentSearch}
                      onChange={e => setStudentSearch(e.target.value)}
                      placeholder="Buscar por nome ou RA..."
                      className="pl-9 h-9 bg-[#0a0e17] border-cyan-500/20 text-white placeholder:text-gray-600 font-mono text-xs"
                    />
                  </div>
                  <Button onClick={() => { setBatchMode('csv'); setBatchCsv(''); setBatchResult(null); setShowStudentBatchDialog(true); }} className="bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs whitespace-nowrap">
                    <Upload size={14} className="mr-1.5" /> Cadastro em Lote
                  </Button>
                </div>
              </div>

              <div className="jarvis-card overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-cyan-500/10 hover:bg-transparent">
                      <TableHead className="text-xs font-mono text-gray-400">RA</TableHead>
                      <TableHead className="text-xs font-mono text-gray-400">Nome</TableHead>
                      <TableHead className="text-xs font-mono text-gray-400">Email</TableHead>
                      <TableHead className="text-xs font-mono text-gray-400">Curso</TableHead>
                      <TableHead className="text-xs font-mono text-gray-400 text-center">Período</TableHead>
                      <TableHead className="text-xs font-mono text-gray-400 text-center">Modalidade</TableHead>
                      <TableHead className="text-xs font-mono text-gray-400 text-center">Simulados</TableHead>
                      <TableHead className="text-xs font-mono text-gray-400 text-center">Média</TableHead>
                      <TableHead className="text-xs font-mono text-gray-400 text-center">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8 text-gray-500 font-mono text-xs">
                          {studentSearch ? 'Nenhum aluno encontrado' : 'Nenhum aluno cadastrado'}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredStudents.slice(0, 50).map((student) => (
                        <TableRow key={student.id} className="border-b border-cyan-500/5 hover:bg-white/[0.02] cursor-pointer">
                          <TableCell className="text-xs text-cyan-400/70 font-mono">{student.ra || '—'}</TableCell>
                          <TableCell className="text-sm text-white font-mono">{student.name}</TableCell>
                          <TableCell className="text-xs text-gray-400 font-mono">{student.email}</TableCell>
                          <TableCell className="text-xs text-gray-300 font-mono">{student.curso || '—'}</TableCell>
                          <TableCell className="text-xs text-gray-300 font-mono text-center">{student.periodo || '—'}</TableCell>
                          <TableCell className="text-center">
                            <Badge className="text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border-cyan-500/20">
                              {student.modalidade || '—'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-gray-300 font-mono text-center">{student.simuladosCompleted || 0}</TableCell>
                          <TableCell className="text-center">
                            <span className={`text-sm font-mono font-bold ${(student.avgScore || 0) >= 70 ? 'text-green-400' : (student.avgScore || 0) >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                              {student.avgScore ? `${student.avgScore}%` : '—'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center gap-1">
                              <Button size="icon" variant="ghost" className="h-7 w-7 text-cyan-400/60 hover:text-cyan-400 hover:bg-cyan-500/10" onClick={() => setEditingUser(student)}>
                                <Edit size={14} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Student Batch Registration Dialog */}
              <Dialog open={showStudentBatchDialog} onOpenChange={setShowStudentBatchDialog}>
                <DialogContent className="bg-[#0d1321] border-cyan-500/20 max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-cyan-400 font-mono flex items-center gap-2">
                      <Upload size={16} /> Cadastro em Lote — Alunos
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    {/* Mode toggle */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={batchMode === 'csv' ? 'default' : 'outline'}
                        onClick={() => setBatchMode('csv')}
                        className={batchMode === 'csv' ? 'bg-cyan-600 text-white font-mono text-xs' : 'border-cyan-500/30 text-cyan-400 font-mono text-xs'}
                      >
                        <FileSpreadsheet size={14} className="mr-1.5" /> Importar CSV
                      </Button>
                      <Button
                        size="sm"
                        variant={batchMode === 'individual' ? 'default' : 'outline'}
                        onClick={() => setBatchMode('individual')}
                        className={batchMode === 'individual' ? 'bg-cyan-600 text-white font-mono text-xs' : 'border-cyan-500/30 text-cyan-400 font-mono text-xs'}
                      >
                        <Plus size={14} className="mr-1.5" /> Adicionar Individual
                      </Button>
                    </div>

                    {batchMode === 'csv' ? (
                      <>
                        <div>
                          <Label className="text-xs font-mono text-gray-400 mb-2 block">
                            Formato CSV: nome,email,ra,curso,periodo,modalidade,senha
                          </Label>
                          <Textarea
                            value={batchCsv}
                            onChange={e => setBatchCsv(e.target.value)}
                            placeholder={`Ana Silva,ana@unifecaf.br,1001,Engenharia de Software,3,Presencial,senha123\nCarlos Oliveira,carlos@unifecaf.br,1002,Sistemas de Informação,5,EAD,senha456`}
                            className="min-h-[200px] bg-[#0a0e17] border-cyan-500/20 text-white placeholder:text-gray-600 font-mono text-sm resize-none"
                          />
                        </div>
                        {batchImporting && (
                          <div className="p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
                            <p className="text-sm text-cyan-400 font-mono">
                              Importando {batchProgress.current}/{batchProgress.total}...
                            </p>
                            <div className="w-full bg-cyan-500/10 rounded-full h-2 mt-2">
                              <div className="bg-cyan-400 h-2 rounded-full transition-all" style={{ width: `${batchProgress.total > 0 ? (batchProgress.current / batchProgress.total) * 100 : 0}%` }} />
                            </div>
                          </div>
                        )}
                        {batchResult && (
                          <div className="p-3 rounded-lg border border-cyan-500/20 space-y-2">
                            <div className="flex items-center gap-4">
                              <span className="text-sm text-green-400 font-mono flex items-center gap-1">
                                <CheckCircle2 size={14} /> {batchResult.success} sucesso(s)
                              </span>
                              <span className="text-sm text-red-400 font-mono flex items-center gap-1">
                                <XCircle size={14} /> {batchResult.errors} erro(s)
                              </span>
                            </div>
                            {batchResult.errorDetails.length > 0 && (
                              <div className="max-h-32 overflow-y-auto space-y-1">
                                {batchResult.errorDetails.map((err, i) => (
                                  <p key={i} className="text-xs text-red-400/80 font-mono">
                                    Linha {err.row} ({err.name}): {err.error}
                                  </p>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                        <Button
                          onClick={handleBatchStudentImport}
                          disabled={batchImporting || !batchCsv.trim()}
                          className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-mono"
                        >
                          {batchImporting ? 'Importando...' : <><Upload size={14} className="mr-1.5" /> Importar CSV</>}
                        </Button>
                      </>
                    ) : (
                      <>
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label className="text-xs font-mono text-gray-400">Nome</Label>
                              <Input value={newStudent.name} onChange={e => setNewStudent(p => ({ ...p, name: e.target.value }))} placeholder="Nome do aluno" className="mt-1 bg-[#0a0e17] border-cyan-500/20 text-white font-mono text-sm" />
                            </div>
                            <div>
                              <Label className="text-xs font-mono text-gray-400">Email</Label>
                              <Input value={newStudent.email} onChange={e => setNewStudent(p => ({ ...p, email: e.target.value }))} placeholder="email@unifecaf.br" className="mt-1 bg-[#0a0e17] border-cyan-500/20 text-white font-mono text-sm" />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label className="text-xs font-mono text-gray-400">RA</Label>
                              <Input value={newStudent.ra} onChange={e => setNewStudent(p => ({ ...p, ra: e.target.value }))} placeholder="RA" className="mt-1 bg-[#0a0e17] border-cyan-500/20 text-white font-mono text-sm" />
                            </div>
                            <div>
                              <Label className="text-xs font-mono text-gray-400">Curso</Label>
                              <Input value={newStudent.curso} onChange={e => setNewStudent(p => ({ ...p, curso: e.target.value }))} placeholder="Curso" className="mt-1 bg-[#0a0e17] border-cyan-500/20 text-white font-mono text-sm" />
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-3">
                            <div>
                              <Label className="text-xs font-mono text-gray-400">Período</Label>
                              <Input type="number" value={newStudent.periodo} onChange={e => setNewStudent(p => ({ ...p, periodo: e.target.value }))} placeholder="1" min="1" max="10" className="mt-1 bg-[#0a0e17] border-cyan-500/20 text-white font-mono text-sm" />
                            </div>
                            <div>
                              <Label className="text-xs font-mono text-gray-400">Modalidade</Label>
                              <select
                                value={newStudent.modalidade}
                                onChange={e => setNewStudent(p => ({ ...p, modalidade: e.target.value }))}
                                className="w-full mt-1 bg-[#0a0e17] border border-cyan-500/20 text-white text-sm font-mono rounded-lg px-3 py-2.5 focus:border-cyan-500/40 outline-none"
                              >
                                <option value="PRESENCIAL">Presencial</option>
                                <option value="EAD">EAD</option>
                                <option value="SEMIPRESENCIAL">Semipresencial</option>
                              </select>
                            </div>
                            <div>
                              <Label className="text-xs font-mono text-gray-400">Senha</Label>
                              <Input value={newStudent.senha} onChange={e => setNewStudent(p => ({ ...p, senha: e.target.value }))} type="password" placeholder="••••••••" className="mt-1 bg-[#0a0e17] border-cyan-500/20 text-white font-mono text-sm" />
                            </div>
                          </div>
                        </div>
                        <Button onClick={handleAddIndividualStudent} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-mono">
                          <Plus size={14} className="mr-1.5" /> Adicionar Aluno
                        </Button>
                      </>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
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

              {/* Filters + Actions */}
              <div className="jarvis-card p-4">
                <div className="flex flex-wrap gap-3 items-center">
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

                  <div className="ml-auto flex gap-2">
                    <Button
                      onClick={() => {
                        setEditingQuestion(null);
                        setQuestionForm({ ...emptyQuestionForm, alternatives: emptyAlternatives() });
                        setShowQuestionFormDialog(true);
                      }}
                      className="bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs"
                    >
                      <Plus size={14} className="mr-1.5" /> Criar Questão
                    </Button>
                  </div>
                </div>

                {/* Bulk actions */}
                {selectedQuestions.size > 0 && (
                  <div className="mt-3 pt-3 border-t border-cyan-500/10 flex items-center gap-3">
                    <span className="text-xs text-gray-400 font-mono">{selectedQuestions.size} selecionada(s)</span>
                    <select
                      value={bulkStatus}
                      onChange={e => setBulkStatus(e.target.value)}
                      className="bg-[#0a0e17] border border-cyan-500/20 text-gray-300 text-xs font-mono rounded-lg px-3 py-2 focus:border-cyan-500/40 outline-none"
                    >
                      <option value="">Alterar status para...</option>
                      {Object.entries(statusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                    <Button
                      size="sm"
                      onClick={handleBulkStatusChange}
                      disabled={!bulkStatus}
                      className="bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs"
                    >
                      Aplicar
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => { setSelectedQuestions(new Set()); setBulkStatus(''); }}
                      className="text-gray-400 hover:text-gray-300 font-mono text-xs"
                    >
                      Desmarcar
                    </Button>
                  </div>
                )}
              </div>

              {/* Questions Table */}
              <div className="jarvis-card overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-cyan-500/10 hover:bg-transparent">
                      <TableHead className="text-xs font-mono text-gray-400 w-8">
                        <button
                          onClick={() => {
                            if (selectedQuestions.size === filteredQuestions.length) {
                              setSelectedQuestions(new Set());
                            } else {
                              setSelectedQuestions(new Set(filteredQuestions.map(q => q.id)));
                            }
                          }}
                          className="text-cyan-400/60 hover:text-cyan-400"
                        >
                          {selectedQuestions.size === filteredQuestions.length && filteredQuestions.length > 0 ? <CheckSquare size={14} /> : <Square size={14} />}
                        </button>
                      </TableHead>
                      <TableHead className="text-xs font-mono text-gray-400 w-8"></TableHead>
                      <TableHead className="text-xs font-mono text-gray-400">Código</TableHead>
                      <TableHead className="text-xs font-mono text-gray-400">Microárea</TableHead>
                      <TableHead className="text-xs font-mono text-gray-400">Dificuldade</TableHead>
                      <TableHead className="text-xs font-mono text-gray-400">Status</TableHead>
                      <TableHead className="text-xs font-mono text-gray-400">Fonte</TableHead>
                      <TableHead className="text-xs font-mono text-gray-400 text-center">TRI</TableHead>
                      <TableHead className="text-xs font-mono text-gray-400 text-center">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredQuestions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8 text-gray-500 font-mono text-xs">
                          Nenhuma questão encontrada
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredQuestions.map((q) => (
                        <Fragment key={q.id}>
                          <TableRow
                            className="border-b border-cyan-500/5 hover:bg-white/[0.02]"
                          >
                            <TableCell>
                              <button
                                onClick={() => {
                                  const next = new Set(selectedQuestions);
                                  if (next.has(q.id)) next.delete(q.id);
                                  else next.add(q.id);
                                  setSelectedQuestions(next);
                                }}
                                className="text-cyan-400/60 hover:text-cyan-400"
                              >
                                {selectedQuestions.has(q.id) ? <CheckSquare size={14} /> : <Square size={14} />}
                              </button>
                            </TableCell>
                            <TableCell
                              className="text-gray-500 cursor-pointer"
                              onClick={() => setExpandedQuestion(expandedQuestion === q.id ? null : q.id)}
                            >
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
                            <TableCell>
                              <div className="flex items-center justify-center gap-1">
                                <Button size="icon" variant="ghost" className="h-7 w-7 text-cyan-400/60 hover:text-cyan-400 hover:bg-cyan-500/10" onClick={() => setViewingQuestion(q)}>
                                  <Eye size={14} />
                                </Button>
                                <Button size="icon" variant="ghost" className="h-7 w-7 text-cyan-400/60 hover:text-cyan-400 hover:bg-cyan-500/10" onClick={() => openEditQuestion(q)}>
                                  <Edit size={14} />
                                </Button>
                                {/* Quick status change */}
                                {q.status !== 'ATIVA' && (
                                  <Button size="icon" variant="ghost" className="h-7 w-7 text-green-400/60 hover:text-green-400 hover:bg-green-500/10" onClick={() => handleQuestionStatusChange(q.id, 'ATIVA')} title="Ativar">
                                    <CheckCircle2 size={14} />
                                  </Button>
                                )}
                                {q.status !== 'REPROVADA' && q.status !== 'RASCUNHO' && (
                                  <Button size="icon" variant="ghost" className="h-7 w-7 text-red-400/60 hover:text-red-400 hover:bg-red-500/10" onClick={() => handleQuestionStatusChange(q.id, 'REPROVADA')} title="Reprovar">
                                    <XCircle size={14} />
                                  </Button>
                                )}
                                {q.status === 'ATIVA' && (
                                  <Button size="icon" variant="ghost" className="h-7 w-7 text-gray-400/60 hover:text-gray-400 hover:bg-gray-500/10" onClick={() => handleQuestionStatusChange(q.id, 'INATIVA')} title="Desativar">
                                    <Pause size={14} />
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                          {expandedQuestion === q.id && (
                            <TableRow className="border-b border-cyan-500/5 hover:bg-transparent">
                              <TableCell colSpan={9} className="p-4 bg-white/[0.01]">
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

              {/* Question Create/Edit Dialog */}
              <Dialog open={showQuestionFormDialog} onOpenChange={setShowQuestionFormDialog}>
                <DialogContent className="bg-[#0d1321] border-cyan-500/20 max-w-2xl max-h-[85vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-cyan-400 font-mono">
                      {editingQuestion ? `Editar Questão ${editingQuestion.code}` : 'Criar Nova Questão'}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-5">
                    {/* Row 1: Type + Difficulty */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs font-mono text-gray-400 tracking-wider uppercase">Tipo</Label>
                        <select
                          value={questionForm.type}
                          onChange={e => setQuestionForm(f => ({ ...f, type: e.target.value }))}
                          className="w-full bg-[#0a0e17] border border-cyan-500/20 text-white text-sm font-mono rounded-lg px-3 py-2.5 focus:border-cyan-500/40 outline-none"
                        >
                          <option value="Objetiva">Objetiva</option>
                          <option value="Dissertativa">Dissertativa</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-mono text-gray-400 tracking-wider uppercase">Dificuldade</Label>
                        <select
                          value={questionForm.difficulty}
                          onChange={e => setQuestionForm(f => ({ ...f, difficulty: e.target.value }))}
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
                          value={questionForm.microareaId}
                          onChange={e => setQuestionForm(f => ({ ...f, microareaId: e.target.value, elementId: '' }))}
                          className="w-full bg-[#0a0e17] border border-cyan-500/20 text-white text-sm font-mono rounded-lg px-3 py-2.5 focus:border-cyan-500/40 outline-none"
                        >
                          <option value="">Selecione...</option>
                          {microareas.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-mono text-gray-400 tracking-wider uppercase">Elemento</Label>
                        <select
                          value={questionForm.elementId}
                          onChange={e => setQuestionForm(f => ({ ...f, elementId: e.target.value }))}
                          className="w-full bg-[#0a0e17] border border-cyan-500/20 text-white text-sm font-mono rounded-lg px-3 py-2.5 focus:border-cyan-500/40 outline-none"
                          disabled={!questionForm.microareaId}
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
                        value={questionForm.context}
                        onChange={e => setQuestionForm(f => ({ ...f, context: e.target.value }))}
                        placeholder="Contexto ou situação-problema que fundamenta a questão..."
                        className="min-h-[80px] bg-[#0a0e17] border-cyan-500/20 text-white placeholder:text-gray-600 font-mono text-sm resize-none focus:border-cyan-500/40"
                      />
                    </div>

                    {/* Statement */}
                    <div className="space-y-2">
                      <Label className="text-xs font-mono text-gray-400 tracking-wider uppercase">Enunciado</Label>
                      <Textarea
                        value={questionForm.statement}
                        onChange={e => setQuestionForm(f => ({ ...f, statement: e.target.value }))}
                        placeholder="Texto do enunciado da questão..."
                        className="min-h-[100px] bg-[#0a0e17] border-cyan-500/20 text-white placeholder:text-gray-600 font-mono text-sm resize-none focus:border-cyan-500/40"
                      />
                    </div>

                    {/* Alternatives (only for Objetiva) */}
                    {questionForm.type === 'Objetiva' && (
                      <div className="space-y-3">
                        <Label className="text-xs font-mono text-gray-400 tracking-wider uppercase flex items-center gap-2">
                          Alternativas
                          <span className="text-[10px] text-gray-600">(Clique na letra para marcar a correta)</span>
                        </Label>
                        <div className="space-y-2">
                          {questionForm.alternatives.map((alt, idx) => (
                            <div key={alt.key} className={`flex items-center gap-2 p-2.5 rounded-lg border transition-all ${alt.isCorrect ? 'bg-green-500/10 border-green-500/30' : 'bg-white/[0.02] border-cyan-500/10 hover:border-cyan-500/20'}`}>
                              <button
                                type="button"
                                onClick={() => {
                                  setQuestionForm(f => ({
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
                                  const newAlts = [...questionForm.alternatives];
                                  newAlts[idx] = { ...newAlts[idx], text: e.target.value };
                                  setQuestionForm(f => ({ ...f, alternatives: newAlts }));
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
                        value={questionForm.explanation}
                        onChange={e => setQuestionForm(f => ({ ...f, explanation: e.target.value }))}
                        placeholder="Explicação detalhada da resposta correta..."
                        className="min-h-[80px] bg-[#0a0e17] border-cyan-500/20 text-white placeholder:text-gray-600 font-mono text-sm resize-none focus:border-cyan-500/40"
                      />
                    </div>

                    {/* Row: Tags + Source + Year */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs font-mono text-gray-400 tracking-wider uppercase">Tags</Label>
                        <Input
                          value={questionForm.tags}
                          onChange={e => setQuestionForm(f => ({ ...f, tags: e.target.value }))}
                          placeholder="tag1, tag2, tag3"
                          className="bg-[#0a0e17] border-cyan-500/20 text-white placeholder:text-gray-600 font-mono text-sm focus:border-cyan-500/40"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-mono text-gray-400 tracking-wider uppercase">Fonte</Label>
                        <select
                          value={questionForm.source}
                          onChange={e => setQuestionForm(f => ({ ...f, source: e.target.value }))}
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
                          value={questionForm.year}
                          onChange={e => setQuestionForm(f => ({ ...f, year: parseInt(e.target.value) || 2025 }))}
                          className="bg-[#0a0e17] border-cyan-500/20 text-white placeholder:text-gray-600 font-mono text-sm focus:border-cyan-500/40"
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <Button
                        onClick={() => handleSaveQuestion('RASCUNHO')}
                        disabled={questionSaving}
                        variant="outline"
                        className="flex-1 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 font-mono text-sm h-11"
                      >
                        <Save size={16} className="mr-2" />
                        {questionSaving ? 'Salvando...' : 'Salvar Rascunho'}
                      </Button>
                      <Button
                        onClick={() => handleSaveQuestion('AGUARDANDO_TESTE')}
                        disabled={questionSaving || !questionForm.statement.trim()}
                        className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-sm h-11"
                      >
                        <Send size={16} className="mr-2" />
                        {questionSaving ? 'Enviando...' : 'Salvar e Enviar para Teste'}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

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
                          {viewingQuestion.difficulty}
                        </Badge>
                        {viewingQuestion.type && (
                          <Badge variant="outline" className="text-[10px] font-mono border-cyan-500/20 text-cyan-400/70">
                            {viewingQuestion.type}
                          </Badge>
                        )}
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 font-mono mb-1">MICROÁREA / ELEMENTO</p>
                        <p className="text-sm text-white font-mono">{viewingQuestion.microarea} — {viewingQuestion.element}</p>
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
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </motion.div>
          </TabsContent>

          {/* ======================== RELATÓRIOS ======================== */}
          <TabsContent value="reports">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              {/* Report Sub-tabs */}
              <div className="flex items-center gap-2 flex-wrap">
                {[
                  { value: 'individual', label: 'Individual', icon: <User size={14} /> },
                  { value: 'turma', label: 'Turma', icon: <Users size={14} /> },
                  { value: 'curso', label: 'Curso', icon: <GraduationCap size={14} /> },
                  { value: 'macroarea', label: 'Macroárea', icon: <Layers size={14} /> },
                  { value: 'questoes', label: 'Questões', icon: <FileQuestion size={14} /> },
                ].map(tab => (
                  <Button
                    key={tab.value}
                    size="sm"
                    variant={reportSubTab === tab.value ? 'default' : 'outline'}
                    onClick={() => setReportSubTab(tab.value)}
                    className={reportSubTab === tab.value ? 'bg-cyan-600 text-white font-mono text-xs' : 'border-cyan-500/30 text-cyan-400 font-mono text-xs'}
                  >
                    {tab.icon} <span className="ml-1.5">{tab.label}</span>
                  </Button>
                ))}
              </div>

              {/* ==================== INDIVIDUAL REPORT ==================== */}
              {reportSubTab === 'individual' && (
                <div className="space-y-4">
                  <div className="jarvis-card p-4">
                    <h4 className="text-sm font-mono text-cyan-400 tracking-wider mb-4 flex items-center gap-2">
                      <User size={14} /> Relatório Individual do Aluno
                    </h4>
                    <div className="flex flex-wrap items-end gap-3">
                      <div className="flex-1 min-w-[200px]">
                        <Label className="text-xs font-mono text-gray-400">Selecionar Aluno</Label>
                        <select
                          value={reportStudentId}
                          onChange={e => setReportStudentId(e.target.value)}
                          className="w-full mt-1 bg-[#0a0e17] border border-cyan-500/20 text-white text-sm font-mono rounded-lg px-3 py-2.5 focus:border-cyan-500/40 outline-none"
                        >
                          <option value="">Selecione um aluno...</option>
                          {students.map(s => (
                            <option key={s.id} value={s.id}>{s.name} ({s.ra || 'sem RA'})</option>
                          ))}
                        </select>
                      </div>
                      <Button onClick={handleIndividualReport} disabled={!reportStudentId || reportLoading} className="bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs">
                        {reportLoading ? <RefreshCw size={14} className="animate-spin" /> : <Brain size={14} className="mr-1.5" />}
                        Gerar Relatório
                      </Button>
                    </div>
                  </div>

                  {individualReport && (
                    <div className="jarvis-card p-6" id="report-individual">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="text-sm font-mono text-cyan-400 tracking-wider">Resultado — Relatório Individual</h4>
                        <Button size="sm" variant="ghost" onClick={() => printReport('report-individual')} className="text-cyan-400/60 hover:text-cyan-400 font-mono text-xs">
                          <Printer size={14} className="mr-1" /> Imprimir
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                        {[
                          { label: 'Média Geral', value: `${(individualReport as Record<string, number>).averageScore || 0}%`, color: 'text-cyan-400' },
                          { label: 'Simulados Realizados', value: (individualReport as Record<string, number>).simuladosCompleted || 0, color: 'text-green-400' },
                          { label: 'Posição no Ranking', value: `#${(individualReport as Record<string, number>).rank || '—'}`, color: 'text-purple-400' },
                        ].map(stat => (
                          <div key={stat.label} className="p-4 rounded-lg bg-white/[0.03] border border-cyan-500/10 text-center">
                            <p className={`text-xl font-bold font-mono ${stat.color}`}>{stat.value}</p>
                            <p className="text-[10px] text-gray-500 font-mono mt-1">{stat.label}</p>
                          </div>
                        ))}
                      </div>
                      {(individualReport as Record<string, unknown>).microareaScores && (
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <RadarChart data={(individualReport as Record<string, unknown>).microareaScores as Array<{ name: string; score: number }>} cx="50%" cy="50%" outerRadius="70%">
                              <PolarGrid stroke="#1e293b" />
                              <PolarAngleAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }} />
                              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 9 }} />
                              <Radar name="Nota" dataKey="score" stroke="#00f0ff" fill="#00f0ff" fillOpacity={0.2} />
                            </RadarChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* ==================== TURMA REPORT ==================== */}
              {reportSubTab === 'turma' && (
                <div className="space-y-4">
                  <div className="jarvis-card p-4">
                    <h4 className="text-sm font-mono text-cyan-400 tracking-wider mb-4 flex items-center gap-2">
                      <Users size={14} /> Relatório por Turma
                    </h4>
                    <div className="flex flex-wrap items-end gap-3">
                      <div className="flex-1 min-w-[160px]">
                        <Label className="text-xs font-mono text-gray-400">Curso</Label>
                        <select
                          value={reportCurso}
                          onChange={e => setReportCurso(e.target.value)}
                          className="w-full mt-1 bg-[#0a0e17] border border-cyan-500/20 text-white text-sm font-mono rounded-lg px-3 py-2.5 focus:border-cyan-500/40 outline-none"
                        >
                          <option value="">Selecione um curso...</option>
                          {uniqueCursos.map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                      <div className="w-32">
                        <Label className="text-xs font-mono text-gray-400">Período</Label>
                        <select
                          value={reportPeriodo}
                          onChange={e => setReportPeriodo(e.target.value)}
                          className="w-full mt-1 bg-[#0a0e17] border border-cyan-500/20 text-white text-sm font-mono rounded-lg px-3 py-2.5 focus:border-cyan-500/40 outline-none"
                        >
                          <option value="">Todos</option>
                          {uniquePeriodos.map(p => (
                            <option key={p} value={String(p)}>{p}º</option>
                          ))}
                        </select>
                      </div>
                      <Button onClick={handleTurmaReport} disabled={!reportCurso || reportLoading} className="bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs">
                        {reportLoading ? <RefreshCw size={14} className="animate-spin" /> : <Brain size={14} className="mr-1.5" />}
                        Gerar Relatório
                      </Button>
                    </div>
                  </div>

                  {turmaReport && (
                    <div className="jarvis-card p-6" id="report-turma">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="text-sm font-mono text-cyan-400 tracking-wider">
                          Resultado — Turma {reportCurso} {reportPeriodo ? `${reportPeriodo}º Período` : ''}
                        </h4>
                        <Button size="sm" variant="ghost" onClick={() => printReport('report-turma')} className="text-cyan-400/60 hover:text-cyan-400 font-mono text-xs">
                          <Printer size={14} className="mr-1" /> Imprimir
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                        {[
                          { label: 'Média da Turma', value: `${(turmaReport as Record<string, number>).averageScore || 0}%`, color: 'text-cyan-400' },
                          { label: 'Total Alunos', value: (turmaReport as Record<string, number>).totalStudents || 0, color: 'text-green-400' },
                          { label: 'Taxa de Participação', value: `${(turmaReport as Record<string, number>).participationRate || 0}%`, color: 'text-purple-400' },
                        ].map(stat => (
                          <div key={stat.label} className="p-4 rounded-lg bg-white/[0.03] border border-cyan-500/10 text-center">
                            <p className={`text-xl font-bold font-mono ${stat.color}`}>{stat.value}</p>
                            <p className="text-[10px] text-gray-500 font-mono mt-1">{stat.label}</p>
                          </div>
                        ))}
                      </div>
                      {(turmaReport as Record<string, unknown>).ranking && Array.isArray((turmaReport as Record<string, unknown>).ranking) && (
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm font-mono">
                            <thead>
                              <tr className="border-b border-cyan-500/10">
                                <th className="text-xs text-gray-400 py-2 px-3 text-left">#</th>
                                <th className="text-xs text-gray-400 py-2 px-3 text-left">Nome</th>
                                <th className="text-xs text-gray-400 py-2 px-3 text-left">RA</th>
                                <th className="text-xs text-gray-400 py-2 px-3 text-center">Média</th>
                              </tr>
                            </thead>
                            <tbody>
                              {((turmaReport as Record<string, unknown>).ranking as Array<{ name: string; ra: string; score: number }>).slice(0, 30).map((s, i) => (
                                <tr key={i} className="border-b border-cyan-500/5 hover:bg-white/[0.02]">
                                  <td className="py-2 px-3 text-cyan-400/70">{i + 1}</td>
                                  <td className="py-2 px-3 text-white">{s.name}</td>
                                  <td className="py-2 px-3 text-gray-400">{s.ra}</td>
                                  <td className="py-2 px-3 text-center">
                                    <span className={`font-bold ${s.score >= 70 ? 'text-green-400' : s.score >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                                      {s.score}%
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* ==================== CURSO REPORT ==================== */}
              {reportSubTab === 'curso' && (
                <div className="space-y-4">
                  <div className="jarvis-card p-4">
                    <h4 className="text-sm font-mono text-cyan-400 tracking-wider mb-4 flex items-center gap-2">
                      <GraduationCap size={14} /> Relatório por Curso
                    </h4>
                    <div className="flex flex-wrap items-end gap-3">
                      <div className="flex-1 min-w-[200px]">
                        <Label className="text-xs font-mono text-gray-400">Curso</Label>
                        <select
                          value={reportCurso}
                          onChange={e => setReportCurso(e.target.value)}
                          className="w-full mt-1 bg-[#0a0e17] border border-cyan-500/20 text-white text-sm font-mono rounded-lg px-3 py-2.5 focus:border-cyan-500/40 outline-none"
                        >
                          <option value="">Selecione um curso...</option>
                          {uniqueCursos.map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                      <Button onClick={handleCursoReport} disabled={!reportCurso || reportLoading} className="bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs">
                        {reportLoading ? <RefreshCw size={14} className="animate-spin" /> : <Brain size={14} className="mr-1.5" />}
                        Gerar Relatório
                      </Button>
                    </div>
                  </div>

                  {cursoReport && (
                    <div className="jarvis-card p-6" id="report-curso">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="text-sm font-mono text-cyan-400 tracking-wider">Resultado — Curso {reportCurso}</h4>
                        <Button size="sm" variant="ghost" onClick={() => printReport('report-curso')} className="text-cyan-400/60 hover:text-cyan-400 font-mono text-xs">
                          <Printer size={14} className="mr-1" /> Imprimir
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
                        {[
                          { label: 'Média do Curso', value: `${(cursoReport as Record<string, number>).averageScore || 0}%`, color: 'text-cyan-400' },
                          { label: 'Total Alunos', value: (cursoReport as Record<string, number>).totalStudents || 0, color: 'text-green-400' },
                          { label: 'Aprovados (≥70%)', value: (cursoReport as Record<string, number>).approved || 0, color: 'text-emerald-400' },
                          { label: 'Reprovados (<50%)', value: (cursoReport as Record<string, number>).failed || 0, color: 'text-red-400' },
                        ].map(stat => (
                          <div key={stat.label} className="p-4 rounded-lg bg-white/[0.03] border border-cyan-500/10 text-center">
                            <p className={`text-xl font-bold font-mono ${stat.color}`}>{stat.value}</p>
                            <p className="text-[10px] text-gray-500 font-mono mt-1">{stat.label}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ==================== MACROÁREA REPORT ==================== */}
              {reportSubTab === 'macroarea' && (
                <div className="space-y-4">
                  <div className="jarvis-card p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-mono text-cyan-400 tracking-wider flex items-center gap-2">
                        <Layers size={14} /> Desempenho por Macroárea
                      </h4>
                      <Button
                        onClick={handleGenerateReport}
                        disabled={reportLoading}
                        className="bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs"
                      >
                        {reportLoading ? (
                          <span className="flex items-center gap-2"><RefreshCw size={14} className="animate-spin" /> Gerando...</span>
                        ) : (
                          <span className="flex items-center gap-2"><Brain size={14} /> Gerar Relatório</span>
                        )}
                      </Button>
                    </div>
                  </div>

                  {reportData ? (
                    <div className="jarvis-card p-6" id="report-macroarea">
                      <div className="flex justify-end mb-2">
                        <Button size="sm" variant="ghost" onClick={() => printReport('report-macroarea')} className="text-cyan-400/60 hover:text-cyan-400 font-mono text-xs">
                          <Printer size={14} className="mr-1" /> Imprimir
                        </Button>
                      </div>
                      {/* Report Overview */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
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

                      {/* Microarea Performance */}
                      {(reportData as Record<string, unknown>).microareaPerformance && (
                        <div className="mb-6">
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
                        <div>
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
                      <div className="mt-6 pt-4 border-t border-cyan-500/10 flex items-center justify-between">
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
                </div>
              )}

              {/* ==================== QUESTÕES REPORT ==================== */}
              {reportSubTab === 'questoes' && (
                <div className="space-y-4">
                  <div className="jarvis-card p-4" id="report-questoes">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-mono text-cyan-400 tracking-wider flex items-center gap-2">
                        <FileQuestion size={14} /> Análise de Questões
                      </h4>
                      <Button size="sm" variant="ghost" onClick={() => printReport('report-questoes')} className="text-cyan-400/60 hover:text-cyan-400 font-mono text-xs">
                        <Printer size={14} className="mr-1" /> Imprimir
                      </Button>
                    </div>

                    {/* Difficulty distribution */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                      {[
                        { label: 'Fácil', count: questions.filter(q => q.difficulty === 'Fácil').length, color: 'text-green-400', bg: 'bg-green-500/10' },
                        { label: 'Médio', count: questions.filter(q => q.difficulty === 'Médio').length, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
                        { label: 'Difícil', count: questions.filter(q => q.difficulty === 'Difícil').length, color: 'text-red-400', bg: 'bg-red-500/10' },
                      ].map(stat => (
                        <div key={stat.label} className={`p-4 rounded-lg ${stat.bg} border border-cyan-500/10 text-center`}>
                          <p className={`text-xl font-bold font-mono ${stat.color}`}>{stat.count}</p>
                          <p className="text-[10px] text-gray-500 font-mono mt-1">{stat.label}</p>
                        </div>
                      ))}
                    </div>

                    {/* Status distribution */}
                    <h5 className="text-xs font-mono text-gray-400 tracking-wider mb-3">DISTRIBUIÇÃO POR STATUS</h5>
                    <div className="space-y-2 mb-6">
                      {Object.entries(statusLabels).map(([key, label]) => {
                        const count = questions.filter(q => q.status === key).length;
                        const pct = questions.length > 0 ? (count / questions.length) * 100 : 0;
                        return (
                          <div key={key} className="flex items-center gap-3">
                            <span className="text-xs font-mono text-gray-400 w-40">{label}</span>
                            <div className="flex-1 bg-cyan-500/10 rounded-full h-3">
                              <div
                                className={`h-3 rounded-full transition-all ${
                                  key === 'ATIVA' ? 'bg-emerald-400' :
                                  key === 'RASCUNHO' ? 'bg-yellow-400' :
                                  key === 'REPROVADA' ? 'bg-red-400' :
                                  key === 'APROVADA' ? 'bg-green-400' :
                                  'bg-cyan-400'
                                }`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="text-xs font-mono text-gray-300 w-16 text-right">{count} ({pct.toFixed(0)}%)</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Source distribution */}
                    <h5 className="text-xs font-mono text-gray-400 tracking-wider mb-3">DISTRIBUIÇÃO POR FONTE</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {['enade-oficial', 'elaborada', 'externa'].map(source => {
                        const count = questions.filter(q => q.source === source).length;
                        return (
                          <div key={source} className="p-3 rounded-lg bg-white/[0.03] border border-cyan-500/10 text-center">
                            <p className="text-lg font-bold font-mono text-cyan-400">{count}</p>
                            <p className="text-[10px] text-gray-500 font-mono mt-1">{source === 'enade-oficial' ? 'ENADE Oficial' : source === 'elaborada' ? 'Elaborada' : 'Externa'}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </TabsContent>
        </AnimatePresence>
      </Tabs>

      {/* ======================== EDIT USER DIALOG (shared) ======================== */}
      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent className="bg-[#0d1321] border-cyan-500/20">
          <DialogHeader>
            <DialogTitle className="text-cyan-400 font-mono">
              Editar {editingUser?.role === 'PROFESSOR' ? 'Professor' : 'Aluno'}
            </DialogTitle>
          </DialogHeader>
          {editingUser && (
            <div className="space-y-4">
              <div>
                <Label className="text-xs font-mono text-gray-400">Nome</Label>
                <Input value={editingUser.name} onChange={e => setEditingUser({ ...editingUser, name: e.target.value })} className="mt-1 bg-[#0a0e17] border-cyan-500/20 text-white font-mono text-sm" />
              </div>
              <div>
                <Label className="text-xs font-mono text-gray-400">Email</Label>
                <Input value={editingUser.email} onChange={e => setEditingUser({ ...editingUser, email: e.target.value })} className="mt-1 bg-[#0a0e17] border-cyan-500/20 text-white font-mono text-sm" />
              </div>
              <div>
                <Label className="text-xs font-mono text-gray-400">RA</Label>
                <Input value={editingUser.ra || ''} onChange={e => setEditingUser({ ...editingUser, ra: e.target.value })} className="mt-1 bg-[#0a0e17] border-cyan-500/20 text-white font-mono text-sm" />
              </div>
              {editingUser.role === 'ALUNO' && (
                <>
                  <div>
                    <Label className="text-xs font-mono text-gray-400">Curso</Label>
                    <Input value={editingUser.curso || ''} onChange={e => setEditingUser({ ...editingUser, curso: e.target.value })} className="mt-1 bg-[#0a0e17] border-cyan-500/20 text-white font-mono text-sm" />
                  </div>
                  <div>
                    <Label className="text-xs font-mono text-gray-400">Período</Label>
                    <Input type="number" value={editingUser.periodo || ''} onChange={e => setEditingUser({ ...editingUser, periodo: parseInt(e.target.value) || undefined })} className="mt-1 bg-[#0a0e17] border-cyan-500/20 text-white font-mono text-sm" />
                  </div>
                  <div>
                    <Label className="text-xs font-mono text-gray-400">Modalidade</Label>
                    <select
                      value={editingUser.modalidade || 'PRESENCIAL'}
                      onChange={e => setEditingUser({ ...editingUser, modalidade: e.target.value })}
                      className="w-full mt-1 bg-[#0a0e17] border border-cyan-500/20 text-white text-sm font-mono rounded-lg px-3 py-2.5 focus:border-cyan-500/40 outline-none"
                    >
                      <option value="PRESENCIAL">Presencial</option>
                      <option value="EAD">EAD</option>
                      <option value="SEMIPRESENCIAL">Semipresencial</option>
                    </select>
                  </div>
                </>
              )}
              {editingUser.role === 'PROFESSOR' && (
                <div>
                  <Label className="text-xs font-mono text-gray-400">Disciplina</Label>
                  <Input value={editingUser.disciplina || ''} onChange={e => setEditingUser({ ...editingUser, disciplina: e.target.value })} className="mt-1 bg-[#0a0e17] border-cyan-500/20 text-white font-mono text-sm" />
                </div>
              )}
              <Button onClick={handleUpdateUser} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-mono">
                Salvar Alterações
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
