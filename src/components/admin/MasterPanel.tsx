'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminLayout } from './AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAppStore } from '@/store/app-store';
import {
  BarChart3,
  Users,
  FileQuestion,
  Layers,
  GraduationCap,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  Activity,
  Edit,
  Eye,
  Trash2,
  Plus,
  Shield,
  Target,
  Zap,
  Upload,
  FileSpreadsheet,
  Trophy,
  AlertTriangle,
  RotateCcw,
  MapPin,
  Save,
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
  active?: boolean;
}

interface QuestionData {
  id: string;
  code: string;
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
  createdAt?: string;
  createdBy?: string;
  type?: string;
  explanation?: string;
}

interface MicroareaData {
  id: string;
  name: string;
  code: string;
  macroarea: string;
  description?: string;
  color?: string;
  order?: number;
  elementCount: number;
  questionCount: number;
}

interface ElementData {
  id: string;
  code: string;
  name: string;
  description?: string;
  skillLevel?: string;
  microareaId: string;
  order?: number;
  questionCount?: number;
}

interface BatchResult {
  success: number;
  errors: number;
  errorDetails: Array<{ row: number; name: string; error: string }>;
}

interface RankingStudent {
  position: number;
  userId: string;
  name: string;
  ra: string | null;
  curso: string | null;
  modalidade: string | null;
  periodo: number | null;
  totalAnswered: number;
  totalCorrect: number;
  hitRate: number;
  avgResponseTime: number | null;
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
    createdAt: q.createdAt as string | undefined,
    createdBy: q.createdBy as string | undefined,
    type: q.type as string | undefined,
    explanation: q.explanation as string | undefined,
  };
}

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

const emptyMicroareaForm = { name: '', code: '', macroarea: '', description: '', color: '#3b82f6', order: 0 };
const emptyElementForm = { code: '', name: '', description: '', microareaId: '', skillLevel: 'compreensão', order: 0 };

// === CUSTOM TOOLTIP ===
const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0d1321] border border-cyan-500/20 rounded-lg p-3 shadow-lg">
        <p className="text-xs text-gray-400 font-mono mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="text-sm font-mono" style={{ color: p.color }}>{p.name}: {p.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

// === CONFIRM DIALOG ===
function ConfirmDialog({ open, onOpenChange, title, message, onConfirm, confirmLabel = 'Confirmar', variant = 'destructive' }: {
  open: boolean; onOpenChange: (v: boolean) => void; title: string; message: string; onConfirm: () => void; confirmLabel?: string; variant?: 'destructive' | 'default';
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0d1321] border-cyan-500/20 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-cyan-400 font-mono flex items-center gap-2">
            {variant === 'destructive' ? <AlertTriangle size={16} className="text-red-400" /> : <Shield size={16} />}
            {title}
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-300 font-mono">{message}</p>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="text-gray-400 font-mono text-xs">Cancelar</Button>
          <Button onClick={() => { onConfirm(); onOpenChange(false); }} className={`font-mono text-xs ${variant === 'destructive' ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-cyan-600 hover:bg-cyan-500 text-white'}`}>
            {confirmLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// === KPI CARD ===
function KPICard({ title, value, icon, color, subtitle }: { title: string; value: string | number; icon: React.ReactNode; color: string; subtitle?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="jarvis-card p-4 h-full">
        <div className="flex items-start justify-between mb-3">
          <div className={`p-2 rounded-lg ${color}`}>{icon}</div>
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
  const { token } = useAppStore();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  // Dashboard data
  const [kpi, setKpi] = useState<KPIData>({ totalAlunos: 0, totalQuestoes: 0, questoesAtivas: 0, coberturaElementos: 0, totalElementos: 450, mediaGeral: 0, maiorPerformador: '—', microareaDificil: '—' });
  const [macroareaChart, setMacroareaChart] = useState<Array<{ name: string; questoes: number }>>([]);
  const [statusChart, setStatusChart] = useState<Array<{ name: string; value: number; color: string }>>([]);
  const [recentActivity, setRecentActivity] = useState<Array<{ student: string; action: string; time: string; score?: number }>>([]);

  // Users
  const [professors, setProfessors] = useState<UserData[]>([]);
  const [students, setStudents] = useState<UserData[]>([]);
  const [studentSearch, setStudentSearch] = useState('');
  const [profSearch, setProfSearch] = useState('');

  // Questions
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [questionTotal, setQuestionTotal] = useState(0);
  const [questionFilter, setQuestionFilter] = useState({ status: '', microarea: '', source: '', difficulty: '' });
  const [showQuestionFormDialog, setShowQuestionFormDialog] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuestionData | null>(null);
  const [questionForm, setQuestionForm] = useState({ ...emptyQuestionForm, alternatives: emptyAlternatives() });
  const [questionSaving, setQuestionSaving] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState<Set<string>>(new Set());
  const [bulkStatus, setBulkStatus] = useState('');
  const [viewingQuestion, setViewingQuestion] = useState<QuestionData | null>(null);

  // Batch question insert
  const [showBatchQuestionDialog, setShowBatchQuestionDialog] = useState(false);
  const [batchQuestionJson, setBatchQuestionJson] = useState('');
  const [batchQuestionImporting, setBatchQuestionImporting] = useState(false);
  const [batchQuestionResult, setBatchQuestionResult] = useState<BatchResult | null>(null);

  // Microareas / Elements
  const [microareas, setMicroareas] = useState<MicroareaData[]>([]);
  const [elements, setElements] = useState<ElementData[]>([]);
  const [showMicroareaDialog, setShowMicroareaDialog] = useState(false);
  const [editingMicroarea, setEditingMicroarea] = useState<MicroareaData | null>(null);
  const [microareaForm, setMicroareaForm] = useState({ ...emptyMicroareaForm });
  const [showElementDialog, setShowElementDialog] = useState(false);
  const [editingElement, setEditingElement] = useState<ElementData | null>(null);
  const [elementForm, setElementForm] = useState({ ...emptyElementForm });
  const [selectedMicroareaId, setSelectedMicroareaId] = useState<string | null>(null);
  const [microareaElements, setMicroareaElements] = useState<ElementData[]>([]);

  // Ranking
  const [rankingData, setRankingData] = useState<RankingStudent[]>([]);
  const [rankingSearch, setRankingSearch] = useState('');

  // User dialogs
  const [newProfessor, setNewProfessor] = useState({ name: '', email: '', ra: '', disciplina: '', password: '' });
  const [showNewProfDialog, setShowNewProfDialog] = useState(false);
  const [showStudentBatchDialog, setShowStudentBatchDialog] = useState(false);
  const [showProfBatchDialog, setShowProfBatchDialog] = useState(false);
  const [batchCsv, setBatchCsv] = useState('');
  const [batchImporting, setBatchImporting] = useState(false);
  const [batchProgress, setBatchProgress] = useState({ current: 0, total: 0 });
  const [batchResult, setBatchResult] = useState<BatchResult | null>(null);
  const [batchMode, setBatchMode] = useState<'csv' | 'individual'>('csv');
  const [newStudent, setNewStudent] = useState({ name: '', email: '', ra: '', curso: '', periodo: '', modalidade: 'PRESENCIAL', senha: '' });
  const [newProfIndividual, setNewProfIndividual] = useState({ name: '', email: '', ra: '', disciplina: '', senha: '' });
  const [editingUser, setEditingUser] = useState<UserData | null>(null);

  // Confirm dialog
  const [confirmAction, setConfirmAction] = useState<{ title: string; message: string; onConfirm: () => void } | null>(null);

  const fetchHeaders = useCallback(() => ({
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }), [token]);

  // Load all data
  const loadDashboard = useCallback(async () => {
    try {
      const [dashRes, microRes, usersRes, qRes] = await Promise.allSettled([
        fetch('/api/dashboard/collective', { headers: fetchHeaders() }),
        fetch('/api/microareas', { headers: fetchHeaders() }),
        fetch('/api/auth/users', { headers: fetchHeaders() }),
        fetch('/api/questions?limit=100&page=1', { headers: fetchHeaders() }),
      ]);

      if (dashRes.status === 'fulfilled' && dashRes.value.ok) {
        const d = await dashRes.value.json();
        setKpi(prev => {
            const overview = d.overview as Record<string, unknown> | undefined;
            return { ...prev, totalAlunos: (overview?.totalAlunos ?? d.totalAlunos ?? prev.totalAlunos) as number, totalQuestoes: (overview?.totalQuestions ?? d.totalQuestoes ?? prev.totalQuestoes) as number, questoesAtivas: (overview?.activeQuestions ?? d.questoesAtivas ?? prev.questoesAtivas) as number, mediaGeral: (overview?.avgHitRate ?? d.mediaGeral ?? prev.mediaGeral) as number, maiorPerformador: (d.maiorPerformador as string) || prev.maiorPerformador, microareaDificil: (d.microareaDificil as string) || prev.microareaDificil };
          });
        if (d.macroareaChart) setMacroareaChart(d.macroareaChart);
        if (d.statusChart) setStatusChart(d.statusChart);
        if (d.recentActivity) setRecentActivity(d.recentActivity);
      }

      if (microRes.status === 'fulfilled' && microRes.value.ok) {
        const m = await microRes.value.json();
        const mData = Array.isArray(m) ? m : m.microareas || [];
        setMicroareas(mData.map((ma: Record<string, unknown>) => ({
          id: ma.id as string, name: ma.name as string, code: ma.code as string, macroarea: ma.macroarea as string,
          description: ma.description as string | undefined, color: ma.color as string | undefined, order: ma.order as number | undefined,
          elementCount: (ma._count as Record<string, number>)?.elements ?? (ma as Record<string, number>).elementCount ?? 0,
          questionCount: (ma._count as Record<string, number>)?.questions ?? (ma as Record<string, number>).questionCount ?? 0,
        })));
      }

      if (usersRes.status === 'fulfilled' && usersRes.value.ok) {
        const u = await usersRes.value.json();
        const users = Array.isArray(u) ? u : u.users || [];
        setProfessors(users.filter((usr: UserData) => usr.role === 'PROFESSOR'));
        setStudents(users.filter((usr: UserData) => usr.role === 'ALUNO'));
      }

      if (qRes.status === 'fulfilled' && qRes.value.ok) {
        const q = await qRes.value.json();
        const rawQuestions = q.questions || q.data || [];
        setQuestions(rawQuestions.map((item: Record<string, unknown>) => mapQuestionFromAPI(item)));
        setQuestionTotal(q.total || q.pagination?.total || 0);
      }
    } catch (err) {
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  }, [fetchHeaders]);

  // Load ranking
  const loadRanking = useCallback(async () => {
    try {
      const res = await fetch('/api/ranking?limit=200', { headers: fetchHeaders() });
      if (res.ok) {
        const data = await res.json();
        setRankingData(data.ranking || []);
      }
    } catch (err) {
      console.error('Error loading ranking:', err);
    }
  }, [fetchHeaders]);

  // Load elements for a microarea
  const loadMicroareaElements = useCallback(async (microareaId: string) => {
    try {
      const res = await fetch(`/api/elements?microareaId=${microareaId}`, { headers: fetchHeaders() });
      if (res.ok) {
        const data = await res.json();
        setMicroareaElements((data.elements || []).map((el: Record<string, unknown>) => ({
          id: el.id as string, code: el.code as string, name: el.name as string, description: el.description as string | undefined,
          skillLevel: el.skillLevel as string | undefined, microareaId: el.microareaId as string, order: el.order as number | undefined,
          questionCount: (el._count as Record<string, number>)?.questions ?? 0,
        })));
      }
    } catch (err) {
      console.error('Error loading elements:', err);
    }
  }, [fetchHeaders]);

  useEffect(() => { loadDashboard(); }, [loadDashboard]);
  useEffect(() => { loadRanking(); }, [loadRanking]);

  // Load elements when question form microarea changes
  useEffect(() => {
    if (questionForm.microareaId) {
      fetch(`/api/elements?microareaId=${questionForm.microareaId}`, { headers: fetchHeaders() })
        .then(res => res.ok ? res.json() : [])
        .then(data => setElements(Array.isArray(data) ? data : data.elements || []))
        .catch(() => setElements([]));
    } else { setElements([]); }
  }, [questionForm.microareaId, fetchHeaders]);

  // Load elements when a microarea is selected in the microareas tab
  useEffect(() => {
    if (selectedMicroareaId) { loadMicroareaElements(selectedMicroareaId); }
    else { setMicroareaElements([]); }
  }, [selectedMicroareaId, loadMicroareaElements]);

  // ==================== HANDLERS ====================

  // === USER CRUD ===
  const handleCreateProfessor = async () => {
    if (!newProfessor.name || !newProfessor.email || !newProfessor.password) return;
    try {
      const res = await fetch('/api/auth/users', { method: 'POST', headers: fetchHeaders(), body: JSON.stringify({ ...newProfessor, role: 'PROFESSOR' }) });
      if (res.ok) { setShowNewProfDialog(false); setNewProfessor({ name: '', email: '', ra: '', disciplina: '', password: '' }); loadDashboard(); }
      else { const d = await res.json().catch(() => ({ error: 'Erro' })); alert(d.error || 'Erro ao criar professor'); }
    } catch (err) { console.error(err); }
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;
    try {
      const updateData: Record<string, unknown> = { name: editingUser.name, email: editingUser.email, ra: editingUser.ra };
      if (editingUser.role === 'ALUNO') { updateData.curso = editingUser.curso || ''; updateData.periodo = editingUser.periodo || ''; updateData.modalidade = editingUser.modalidade || 'PRESENCIAL'; }
      if (editingUser.role === 'PROFESSOR') { updateData.disciplina = editingUser.disciplina || ''; }
      const res = await fetch(`/api/auth/users/${editingUser.id}`, { method: 'PUT', headers: fetchHeaders(), body: JSON.stringify(updateData) });
      if (res.ok) { setEditingUser(null); loadDashboard(); }
      else { const d = await res.json().catch(() => ({ error: 'Erro' })); alert(d.error || 'Erro ao atualizar'); }
    } catch (err) { console.error(err); }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const res = await fetch(`/api/auth/users/${userId}`, { method: 'DELETE', headers: fetchHeaders() });
      if (res.ok) { loadDashboard(); } else { const d = await res.json().catch(() => ({ error: 'Erro' })); alert(d.error || 'Erro ao excluir'); }
    } catch (err) { console.error(err); }
  };

  // === BATCH USER REGISTRATION ===
  const handleBatchStudentImport = async () => {
    if (!batchCsv.trim()) return;
    setBatchImporting(true); setBatchResult(null);
    const lines = batchCsv.trim().split('\n').filter(l => l.trim()); const total = lines.length;
    setBatchProgress({ current: 0, total });
    let success = 0; const errors: BatchResult['errorDetails'] = [];
    for (let i = 0; i < lines.length; i++) {
      const parts = lines[i].split(',').map(p => p.trim());
      if (parts.length < 7) { errors.push({ row: i + 1, name: parts[0] || `Linha ${i + 1}`, error: 'Formato: nome,email,ra,curso,periodo,modalidade,senha' }); setBatchProgress({ current: i + 1, total }); continue; }
      const [nome, email, ra, curso, periodo, modalidade, senha] = parts;
      try {
        const res = await fetch('/api/auth/users', { method: 'POST', headers: fetchHeaders(), body: JSON.stringify({ name: nome, email, ra, curso, periodo: parseInt(periodo) || 1, modalidade: modalidade.toUpperCase() === 'EAD' ? 'EAD' : modalidade.toUpperCase() === 'SEMIPRESENCIAL' ? 'SEMIPRESENCIAL' : 'PRESENCIAL', password: senha, role: 'ALUNO' }) });
        if (res.ok) success++; else { const d = await res.json().catch(() => ({ error: 'Erro' })); errors.push({ row: i + 1, name: nome, error: d.error || `HTTP ${res.status}` }); }
      } catch { errors.push({ row: i + 1, name: nome, error: 'Conexão' }); }
      setBatchProgress({ current: i + 1, total });
    }
    setBatchResult({ success, errors: errors.length, errorDetails: errors }); setBatchImporting(false); loadDashboard();
  };

  const handleBatchProfImport = async () => {
    if (!batchCsv.trim()) return;
    setBatchImporting(true); setBatchResult(null);
    const lines = batchCsv.trim().split('\n').filter(l => l.trim()); const total = lines.length;
    setBatchProgress({ current: 0, total });
    let success = 0; const errors: BatchResult['errorDetails'] = [];
    for (let i = 0; i < lines.length; i++) {
      const parts = lines[i].split(',').map(p => p.trim());
      if (parts.length < 5) { errors.push({ row: i + 1, name: parts[0] || `Linha ${i + 1}`, error: 'Formato: nome,email,ra,disciplina,senha' }); setBatchProgress({ current: i + 1, total }); continue; }
      const [nome, email, ra, disciplina, senha] = parts;
      try {
        const res = await fetch('/api/auth/users', { method: 'POST', headers: fetchHeaders(), body: JSON.stringify({ name: nome, email, ra, disciplina, password: senha, role: 'PROFESSOR' }) });
        if (res.ok) success++; else { const d = await res.json().catch(() => ({ error: 'Erro' })); errors.push({ row: i + 1, name: nome, error: d.error || `HTTP ${res.status}` }); }
      } catch { errors.push({ row: i + 1, name: nome, error: 'Conexão' }); }
      setBatchProgress({ current: i + 1, total });
    }
    setBatchResult({ success, errors: errors.length, errorDetails: errors }); setBatchImporting(false); loadDashboard();
  };

  const handleAddIndividualStudent = async () => {
    if (!newStudent.name || !newStudent.email || !newStudent.senha) return;
    try {
      const res = await fetch('/api/auth/users', { method: 'POST', headers: fetchHeaders(), body: JSON.stringify({ name: newStudent.name, email: newStudent.email, ra: newStudent.ra || undefined, curso: newStudent.curso || undefined, periodo: parseInt(newStudent.periodo) || undefined, modalidade: newStudent.modalidade, password: newStudent.senha, role: 'ALUNO' }) });
      if (res.ok) { setNewStudent({ name: '', email: '', ra: '', curso: '', periodo: '', modalidade: 'PRESENCIAL', senha: '' }); loadDashboard(); }
      else { const d = await res.json().catch(() => ({ error: 'Erro' })); alert(d.error || 'Erro'); }
    } catch (err) { console.error(err); }
  };

  const handleAddIndividualProf = async () => {
    if (!newProfIndividual.name || !newProfIndividual.email || !newProfIndividual.senha) return;
    try {
      const res = await fetch('/api/auth/users', { method: 'POST', headers: fetchHeaders(), body: JSON.stringify({ name: newProfIndividual.name, email: newProfIndividual.email, ra: newProfIndividual.ra || undefined, disciplina: newProfIndividual.disciplina || undefined, password: newProfIndividual.senha, role: 'PROFESSOR' }) });
      if (res.ok) { setNewProfIndividual({ name: '', email: '', ra: '', disciplina: '', senha: '' }); loadDashboard(); }
      else { const d = await res.json().catch(() => ({ error: 'Erro' })); alert(d.error || 'Erro'); }
    } catch (err) { console.error(err); }
  };

  // === QUESTION CRUD ===
  const handleSaveQuestion = async (status: string) => {
    setQuestionSaving(true);
    try {
      const body: Record<string, unknown> = {
        type: questionForm.type === 'Objetiva' ? 'OBJETIVA' : 'DISSERTATIVA', statement: questionForm.statement, context: questionForm.context || null,
        correctAnswer: questionForm.type === 'Objetiva' ? questionForm.alternatives.find(a => a.isCorrect)?.key || 'A' : 'DISSERTATIVA',
        explanation: questionForm.explanation || null, difficulty: questionForm.difficulty?.toLowerCase() || 'médio',
        microareaId: questionForm.microareaId, elementId: questionForm.elementId || null, source: questionForm.source, sourceYear: questionForm.year || null,
        alternatives: questionForm.type === 'Objetiva' ? questionForm.alternatives.filter(a => a.text.trim()).map(a => ({ letter: a.key, text: a.text })) : [],
        tags: questionForm.tags.split(',').map(t => t.trim()).filter(Boolean), status,
      };
      let res;
      if (editingQuestion) { res = await fetch(`/api/questions/${editingQuestion.id}`, { method: 'PUT', headers: fetchHeaders(), body: JSON.stringify(body) }); }
      else { res = await fetch('/api/questions', { method: 'POST', headers: fetchHeaders(), body: JSON.stringify(body) }); }
      if (res.ok) { setShowQuestionFormDialog(false); setEditingQuestion(null); setQuestionForm({ ...emptyQuestionForm, alternatives: emptyAlternatives() }); loadDashboard(); }
      else { const d = await res.json().catch(() => ({ error: 'Erro' })); alert(d.error || 'Erro ao salvar'); }
    } catch (err) { console.error(err); } finally { setQuestionSaving(false); }
  };

  const handleDeleteQuestion = async (id: string) => {
    try {
      const res = await fetch(`/api/questions/${id}`, { method: 'DELETE', headers: fetchHeaders() });
      if (res.ok) loadDashboard(); else { const d = await res.json().catch(() => ({ error: 'Erro' })); alert(d.error || 'Erro ao excluir'); }
    } catch (err) { console.error(err); }
  };

  const handleBulkStatusChange = async () => {
    if (!bulkStatus || selectedQuestions.size === 0) return;
    try {
      await Promise.allSettled(Array.from(selectedQuestions).map(id => fetch(`/api/questions/${id}`, { method: 'PUT', headers: fetchHeaders(), body: JSON.stringify({ status: bulkStatus }) })));
      setSelectedQuestions(new Set()); setBulkStatus(''); loadDashboard();
    } catch (err) { console.error(err); }
  };

  const openEditQuestion = (q: QuestionData) => {
    setEditingQuestion(q);
    // Normalize difficulty to capitalized form for the form dropdown
    const diffNormalized = q.difficulty?.toLowerCase() === 'fácil' ? 'Fácil' : q.difficulty?.toLowerCase() === 'difícil' ? 'Difícil' : 'Médio';
    setQuestionForm({
      type: q.type === 'DISSERTATIVA' ? 'Dissertativa' : 'Objetiva', microareaId: q.microareaId || '', elementId: q.elementId || '', difficulty: diffNormalized,
      context: q.context || '', statement: q.statement || '',
      alternatives: q.alternatives && q.alternatives.length > 0 ? q.alternatives.map(a => ({ key: a.key, text: a.text, isCorrect: a.isCorrect })) : emptyAlternatives(),
      explanation: q.explanation || '', tags: q.tags?.join(', ') || '', source: q.source || 'elaborada', year: q.year || new Date().getFullYear(),
    });
    setShowQuestionFormDialog(true);
  };

  // === BATCH QUESTION INSERT ===
  const handleBatchQuestionImport = async () => {
    if (!batchQuestionJson.trim()) return;
    setBatchQuestionImporting(true); setBatchQuestionResult(null);
    try {
      const parsed = JSON.parse(batchQuestionJson);
      const items = Array.isArray(parsed) ? parsed : [parsed];
      let success = 0; const errors: BatchResult['errorDetails'] = [];
      for (let i = 0; i < items.length; i++) {
        try {
          const res = await fetch('/api/questions', { method: 'POST', headers: fetchHeaders(), body: JSON.stringify({ ...items[i], status: items[i].status || 'RASCUNHO' }) });
          if (res.ok) success++; else { const d = await res.json().catch(() => ({ error: 'Erro' })); errors.push({ row: i + 1, name: items[i].code || `Q${i + 1}`, error: d.error || `HTTP ${res.status}` }); }
        } catch { errors.push({ row: i + 1, name: items[i].code || `Q${i + 1}`, error: 'Conexão' }); }
      }
      setBatchQuestionResult({ success, errors: errors.length, errorDetails: errors });
      if (success > 0) loadDashboard();
    } catch {
      alert('JSON inválido. Verifique o formato.');
    }
    setBatchQuestionImporting(false);
  };

  // === MICROAREA CRUD ===
  const handleSaveMicroarea = async () => {
    try {
      let res;
      if (editingMicroarea) {
        res = await fetch(`/api/microareas/${editingMicroarea.id}`, { method: 'PUT', headers: fetchHeaders(), body: JSON.stringify(microareaForm) });
      } else {
        res = await fetch('/api/microareas', { method: 'POST', headers: fetchHeaders(), body: JSON.stringify(microareaForm) });
      }
      if (res.ok) { setShowMicroareaDialog(false); setEditingMicroarea(null); setMicroareaForm({ ...emptyMicroareaForm }); loadDashboard(); }
      else { const d = await res.json().catch(() => ({ error: 'Erro' })); alert(d.error || 'Erro ao salvar'); }
    } catch (err) { console.error(err); }
  };

  const handleDeleteMicroarea = async (id: string) => {
    try {
      const res = await fetch(`/api/microareas/${id}`, { method: 'DELETE', headers: fetchHeaders() });
      if (res.ok) { setSelectedMicroareaId(null); loadDashboard(); } else { const d = await res.json().catch(() => ({ error: 'Erro' })); alert(d.error || 'Erro'); }
    } catch (err) { console.error(err); }
  };

  // === ELEMENT CRUD ===
  const handleSaveElement = async () => {
    try {
      let res;
      if (editingElement) {
        res = await fetch(`/api/elements/${editingElement.id}`, { method: 'PUT', headers: fetchHeaders(), body: JSON.stringify(elementForm) });
      } else {
        res = await fetch('/api/elements', { method: 'POST', headers: fetchHeaders(), body: JSON.stringify(elementForm) });
      }
      if (res.ok) { setShowElementDialog(false); setEditingElement(null); setElementForm({ ...emptyElementForm }); if (selectedMicroareaId) loadMicroareaElements(selectedMicroareaId); loadDashboard(); }
      else { const d = await res.json().catch(() => ({ error: 'Erro' })); alert(d.error || 'Erro ao salvar'); }
    } catch (err) { console.error(err); }
  };

  const handleDeleteElement = async (id: string) => {
    try {
      const res = await fetch(`/api/elements/${id}`, { method: 'DELETE', headers: fetchHeaders() });
      if (res.ok) { if (selectedMicroareaId) loadMicroareaElements(selectedMicroareaId); loadDashboard(); } else { const d = await res.json().catch(() => ({ error: 'Erro' })); alert(d.error || 'Erro'); }
    } catch (err) { console.error(err); }
  };

  // === RANKING RESET ===
  const handleResetRanking = async () => {
    try {
      const res = await fetch('/api/ranking', { method: 'DELETE', headers: fetchHeaders() });
      if (res.ok) { loadRanking(); loadDashboard(); } else { const d = await res.json().catch(() => ({ error: 'Erro' })); alert(d.error || 'Erro'); }
    } catch (err) { console.error(err); }
  };

  // === DERIVED DATA ===
  const filteredStudents = studentSearch ? students.filter(s => s.name.toLowerCase().includes(studentSearch.toLowerCase()) || (s.ra && s.ra.includes(studentSearch))) : students;
  const filteredProfessors = profSearch ? professors.filter(p => p.name.toLowerCase().includes(profSearch.toLowerCase()) || (p.ra && p.ra.includes(profSearch))) : professors;
  const filteredQuestions = questions.filter(q => {
    if (questionFilter.status && q.status !== questionFilter.status) return false;
    if (questionFilter.difficulty && q.difficulty?.toLowerCase() !== questionFilter.difficulty.toLowerCase()) return false;
    if (questionFilter.microarea && q.microareaId !== questionFilter.microarea && q.microarea !== questionFilter.microarea) return false;
    if (questionFilter.source && q.source !== questionFilter.source) return false;
    return true;
  });
  const filteredRanking = rankingSearch ? rankingData.filter(r => r.name.toLowerCase().includes(rankingSearch.toLowerCase()) || (r.ra && r.ra.toLowerCase().includes(rankingSearch.toLowerCase()))) : rankingData;

  if (loading) {
    return (
      <AdminLayout panelType="master">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="inline-flex items-center justify-center mb-4"><div className="w-12 h-12 rounded-full border-2 border-cyan-500/30 border-t-cyan-400 animate-spin" /></div>
            <p className="text-cyan-400/60 font-mono text-sm tracking-widest">CARREGANDO PAINEL MASTER...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Action button style helper
  const actionBtn = (icon: React.ReactNode, onClick: () => void, color = 'text-cyan-400/60 hover:text-cyan-400 hover:bg-cyan-500/10') => (
    <Button size="icon" variant="ghost" className={`h-7 w-7 ${color}`} onClick={onClick}>{icon}</Button>
  );

  return (
    <AdminLayout panelType="master">
      {/* Confirm Dialog */}
      <ConfirmDialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)} title={confirmAction?.title || ''} message={confirmAction?.message || ''} onConfirm={confirmAction?.onConfirm || (() => {})} />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
        {/* Tab Navigation */}
        <div className="mb-6 overflow-x-auto">
          <TabsList className="bg-white/5 border border-cyan-500/10 h-auto p-1 gap-1 flex-wrap">
            {[
              { value: 'dashboard', label: 'Dashboard', icon: <BarChart3 size={14} /> },
              { value: 'professors', label: 'Docentes', icon: <GraduationCap size={14} /> },
              { value: 'students', label: 'Alunos', icon: <Users size={14} /> },
              { value: 'questions', label: 'Questões', icon: <FileQuestion size={14} /> },
              { value: 'microareas', label: 'Microáreas', icon: <Layers size={14} /> },
              { value: 'ranking', label: 'Ranking', icon: <Trophy size={14} /> },
            ].map(tab => (
              <TabsTrigger key={tab.value} value={tab.value} className="flex items-center gap-1.5 px-3 py-2 text-xs font-mono data-[state=active]:bg-cyan-500/15 data-[state=active]:text-cyan-400 data-[state=active]:border-cyan-500/30 rounded-md whitespace-nowrap transition-all">
                {tab.icon} {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <AnimatePresence mode="wait">
          {/* ======================== DASHBOARD ======================== */}
          <TabsContent value="dashboard">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard title="Total Alunos" value={kpi.totalAlunos} icon={<Users size={20} className="text-cyan-400" />} color="bg-cyan-500/10" />
                <KPICard title="Questões Ativas" value={kpi.questoesAtivas} icon={<FileQuestion size={20} className="text-green-400" />} color="bg-green-500/10" subtitle={`Total: ${kpi.totalQuestoes}`} />
                <KPICard title="Cobertura Elementos" value={`${kpi.coberturaElementos}/${kpi.totalElementos}`} icon={<Target size={20} className="text-purple-400" />} color="bg-purple-500/10" />
                <KPICard title="Média Geral" value={`${kpi.mediaGeral}%`} icon={<TrendingUp size={20} className="text-amber-400" />} color="bg-amber-500/10" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="jarvis-card p-4">
                  <h3 className="text-sm font-mono text-cyan-400 tracking-wider mb-4 flex items-center gap-2"><Layers size={14} /> Questões por Macroárea</h3>
                  <div className="h-64">{isMounted && macroareaChart.length > 0 ? (<ResponsiveContainer width="100%" height="100%"><BarChart data={macroareaChart}><XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }} axisLine={{ stroke: '#1e293b' }} /><YAxis tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }} axisLine={{ stroke: '#1e293b' }} /><Tooltip content={<CustomTooltip />} /><Bar dataKey="questoes" name="Questões" fill="#00f0ff" radius={[4, 4, 0, 0]} barSize={32} /></BarChart></ResponsiveContainer>) : (<div className="flex items-center justify-center h-full"><p className="text-xs text-gray-500 font-mono">Nenhum dado disponível</p></div>)}</div>
                </div>
                <div className="jarvis-card p-4">
                  <h3 className="text-sm font-mono text-cyan-400 tracking-wider mb-4 flex items-center gap-2"><Activity size={14} /> Questões por Status</h3>
                  <div className="h-64">{isMounted && statusChart.length > 0 ? (<ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={statusChart} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">{statusChart.map((_, i) => <Cell key={i} fill={['#00f0ff', '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#6b7280'][i % 7]} />)}</Pie><Tooltip content={<CustomTooltip />} /><Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} /></PieChart></ResponsiveContainer>) : (<div className="flex items-center justify-center h-full"><p className="text-xs text-gray-500 font-mono">Nenhum dado disponível</p></div>)}</div>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 jarvis-card p-4">
                  <h3 className="text-sm font-mono text-cyan-400 tracking-wider mb-4 flex items-center gap-2"><Clock size={14} /> Atividade Recente</h3>
                  <div className="space-y-2 max-h-72 overflow-y-auto">
                    {recentActivity.length === 0 ? <p className="text-xs text-gray-500 font-mono text-center py-8">Nenhuma atividade registrada</p> : recentActivity.map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-cyan-500/5 hover:border-cyan-500/15 transition-colors">
                        <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center"><span className="text-xs font-bold text-cyan-400">{item.student.charAt(0)}</span></div><div><p className="text-sm text-white font-mono">{item.student}</p><p className="text-xs text-gray-500 font-mono">{item.action}</p></div></div>
                        <div className="text-right">{item.score !== undefined && <span className={`text-xs font-mono font-bold ${item.score >= 70 ? 'text-green-400' : item.score >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>{item.score}%</span>}<p className="text-[10px] text-gray-600 font-mono">{item.time}</p></div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="jarvis-card p-4">
                  <h3 className="text-sm font-mono text-cyan-400 tracking-wider mb-4 flex items-center gap-2"><Zap size={14} /> Estatísticas Rápidas</h3>
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-white/[0.03] border border-cyan-500/5"><p className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">Melhor Performador</p><p className="text-sm text-white font-mono font-bold mt-1">{kpi.maiorPerformador}</p></div>
                    <div className="p-3 rounded-lg bg-white/[0.03] border border-cyan-500/5"><p className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">Microárea Mais Difícil</p><p className="text-sm text-white font-mono font-bold mt-1">{kpi.microareaDificil}</p></div>
                    <div className="p-3 rounded-lg bg-white/[0.03] border border-cyan-500/5"><p className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">Docentes Cadastrados</p><p className="text-sm text-white font-mono font-bold mt-1">{professors.length}</p></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </TabsContent>

          {/* ======================== DOCENTES ======================== */}
          <TabsContent value="professors">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h3 className="text-sm font-mono text-cyan-400 tracking-wider flex items-center gap-2"><GraduationCap size={14} /> Docentes ({professors.length})</h3>
                <div className="flex items-center gap-2">
                  <div className="relative w-full sm:w-56"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-500/40" size={14} /><Input value={profSearch} onChange={e => setProfSearch(e.target.value)} placeholder="Buscar..." className="pl-9 h-9 bg-[#0a0e17] border-cyan-500/20 text-white placeholder:text-gray-600 font-mono text-xs" /></div>
                  <Button onClick={() => { setBatchMode('csv'); setBatchCsv(''); setBatchResult(null); setShowProfBatchDialog(true); }} className="bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs whitespace-nowrap"><Upload size={14} className="mr-1.5" /> Lote</Button>
                  <Button onClick={() => setShowNewProfDialog(true)} className="bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs whitespace-nowrap"><Plus size={14} className="mr-1.5" /> Adicionar</Button>
                </div>
              </div>
              <div className="jarvis-card overflow-hidden">
                <Table>
                  <TableHeader><TableRow className="border-b border-cyan-500/10 hover:bg-transparent">
                    <TableHead className="text-xs font-mono text-gray-400">Nome</TableHead><TableHead className="text-xs font-mono text-gray-400">Email</TableHead><TableHead className="text-xs font-mono text-gray-400">RA</TableHead><TableHead className="text-xs font-mono text-gray-400">Disciplina</TableHead><TableHead className="text-xs font-mono text-gray-400 text-center">Último Login</TableHead><TableHead className="text-xs font-mono text-gray-400 text-center">Ações</TableHead>
                  </TableRow></TableHeader>
                  <TableBody>
                    {filteredProfessors.length === 0 ? <TableRow><TableCell colSpan={6} className="text-center py-8 text-gray-500 font-mono text-xs">Nenhum professor</TableCell></TableRow> : filteredProfessors.map(prof => (
                      <TableRow key={prof.id} className="border-b border-cyan-500/5 hover:bg-white/[0.02]">
                        <TableCell className="text-sm text-white font-mono">{prof.name}</TableCell>
                        <TableCell className="text-sm text-gray-400 font-mono">{prof.email}</TableCell>
                        <TableCell className="text-xs text-cyan-400/70 font-mono">{prof.ra || '—'}</TableCell>
                        <TableCell className="text-xs text-cyan-400/70 font-mono">{prof.disciplina || '—'}</TableCell>
                        <TableCell className="text-xs text-gray-500 font-mono text-center">{prof.lastLogin ? new Date(prof.lastLogin).toLocaleDateString('pt-BR') : '—'}</TableCell>
                        <TableCell><div className="flex items-center justify-center gap-1">
                          {actionBtn(<Edit size={14} />, () => setEditingUser(prof))}
                          {actionBtn(<Trash2 size={14} />, () => setConfirmAction({ title: 'Excluir Professor', message: `Tem certeza que deseja excluir ${prof.name}?`, onConfirm: () => handleDeleteUser(prof.id) }), 'text-red-400/60 hover:text-red-400 hover:bg-red-500/10')}
                        </div></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {/* New Professor Dialog */}
              <Dialog open={showNewProfDialog} onOpenChange={setShowNewProfDialog}><DialogContent className="bg-[#0d1321] border-cyan-500/20"><DialogHeader><DialogTitle className="text-cyan-400 font-mono">Novo Professor</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div><Label className="text-xs font-mono text-gray-400">Nome</Label><Input value={newProfessor.name} onChange={e => setNewProfessor(p => ({ ...p, name: e.target.value }))} placeholder="Prof. Dr. Nome" className="mt-1 bg-[#0a0e17] border-cyan-500/20 text-white font-mono text-sm" /></div>
                  <div><Label className="text-xs font-mono text-gray-400">Email</Label><Input value={newProfessor.email} onChange={e => setNewProfessor(p => ({ ...p, email: e.target.value }))} placeholder="professor@seuemail.com.br" className="mt-1 bg-[#0a0e17] border-cyan-500/20 text-white font-mono text-sm" /></div>
                  <div><Label className="text-xs font-mono text-gray-400">RA</Label><Input value={newProfessor.ra} onChange={e => setNewProfessor(p => ({ ...p, ra: e.target.value }))} placeholder="RA" className="mt-1 bg-[#0a0e17] border-cyan-500/20 text-white font-mono text-sm" /></div>
                  <div><Label className="text-xs font-mono text-gray-400">Disciplina</Label><Input value={newProfessor.disciplina} onChange={e => setNewProfessor(p => ({ ...p, disciplina: e.target.value }))} placeholder="Disciplina" className="mt-1 bg-[#0a0e17] border-cyan-500/20 text-white font-mono text-sm" /></div>
                  <div><Label className="text-xs font-mono text-gray-400">Senha</Label><Input value={newProfessor.password} onChange={e => setNewProfessor(p => ({ ...p, password: e.target.value }))} type="password" className="mt-1 bg-[#0a0e17] border-cyan-500/20 text-white font-mono text-sm" /></div>
                  <Button onClick={handleCreateProfessor} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-mono">Criar Professor</Button>
                </div>
              </DialogContent></Dialog>
              {/* Prof Batch Dialog */}
              <Dialog open={showProfBatchDialog} onOpenChange={setShowProfBatchDialog}><DialogContent className="bg-[#0d1321] border-cyan-500/20 max-w-2xl"><DialogHeader><DialogTitle className="text-cyan-400 font-mono flex items-center gap-2"><Upload size={16} /> Cadastro em Lote — Docentes</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Button size="sm" variant={batchMode === 'csv' ? 'default' : 'outline'} onClick={() => setBatchMode('csv')} className={batchMode === 'csv' ? 'bg-cyan-600 text-white font-mono text-xs' : 'border-cyan-500/30 text-cyan-400 font-mono text-xs'}><FileSpreadsheet size={14} className="mr-1.5" /> CSV</Button>
                    <Button size="sm" variant={batchMode === 'individual' ? 'default' : 'outline'} onClick={() => setBatchMode('individual')} className={batchMode === 'individual' ? 'bg-cyan-600 text-white font-mono text-xs' : 'border-cyan-500/30 text-cyan-400 font-mono text-xs'}><Plus size={14} className="mr-1.5" /> Individual</Button>
                  </div>
                  {batchMode === 'csv' ? (<>
                    <Label className="text-xs font-mono text-gray-400">Formato: nome,email,ra,disciplina,senha</Label>
                    <Textarea value={batchCsv} onChange={e => setBatchCsv(e.target.value)} placeholder={`João,joao@seuemail.com.br,12345,Eng Software,senha123`} className="min-h-[150px] bg-[#0a0e17] border-cyan-500/20 text-white placeholder:text-gray-600 font-mono text-sm resize-none" />
                    {batchImporting && <div className="p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/20"><p className="text-sm text-cyan-400 font-mono">Importando {batchProgress.current}/{batchProgress.total}...</p><div className="w-full bg-cyan-500/10 rounded-full h-2 mt-2"><div className="bg-cyan-400 h-2 rounded-full transition-all" style={{ width: `${batchProgress.total > 0 ? (batchProgress.current / batchProgress.total) * 100 : 0}%` }} /></div></div>}
                    {batchResult && <div className="p-3 rounded-lg border border-cyan-500/20"><div className="flex items-center gap-4"><span className="text-sm text-green-400 font-mono flex items-center gap-1"><CheckCircle2 size={14} /> {batchResult.success}</span><span className="text-sm text-red-400 font-mono flex items-center gap-1"><XCircle size={14} /> {batchResult.errors}</span></div></div>}
                    <Button onClick={handleBatchProfImport} disabled={batchImporting || !batchCsv.trim()} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-mono">{batchImporting ? 'Importando...' : <><Upload size={14} className="mr-1.5" /> Importar</>}</Button>
                  </>) : (<>
                    <div className="grid grid-cols-2 gap-3">
                      <div><Label className="text-xs font-mono text-gray-400">Nome</Label><Input value={newProfIndividual.name} onChange={e => setNewProfIndividual(p => ({ ...p, name: e.target.value }))} className="mt-1 bg-[#0a0e17] border-cyan-500/20 text-white font-mono text-sm" /></div>
                      <div><Label className="text-xs font-mono text-gray-400">Email</Label><Input value={newProfIndividual.email} onChange={e => setNewProfIndividual(p => ({ ...p, email: e.target.value }))} className="mt-1 bg-[#0a0e17] border-cyan-500/20 text-white font-mono text-sm" /></div>
                      <div><Label className="text-xs font-mono text-gray-400">RA</Label><Input value={newProfIndividual.ra} onChange={e => setNewProfIndividual(p => ({ ...p, ra: e.target.value }))} className="mt-1 bg-[#0a0e17] border-cyan-500/20 text-white font-mono text-sm" /></div>
                      <div><Label className="text-xs font-mono text-gray-400">Disciplina</Label><Input value={newProfIndividual.disciplina} onChange={e => setNewProfIndividual(p => ({ ...p, disciplina: e.target.value }))} className="mt-1 bg-[#0a0e17] border-cyan-500/20 text-white font-mono text-sm" /></div>
                    </div>
                    <div><Label className="text-xs font-mono text-gray-400">Senha</Label><Input value={newProfIndividual.senha} onChange={e => setNewProfIndividual(p => ({ ...p, senha: e.target.value }))} type="password" className="mt-1 bg-[#0a0e17] border-cyan-500/20 text-white font-mono text-sm" /></div>
                    <Button onClick={handleAddIndividualProf} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-mono"><Plus size={14} className="mr-1.5" /> Adicionar</Button>
                  </>)}
                </div>
              </DialogContent></Dialog>
            </motion.div>
          </TabsContent>

          {/* ======================== ALUNOS ======================== */}
          <TabsContent value="students">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h3 className="text-sm font-mono text-cyan-400 tracking-wider flex items-center gap-2"><Users size={14} /> Alunos ({students.length})</h3>
                <div className="flex items-center gap-2">
                  <div className="relative w-full sm:w-56"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-500/40" size={14} /><Input value={studentSearch} onChange={e => setStudentSearch(e.target.value)} placeholder="Buscar..." className="pl-9 h-9 bg-[#0a0e17] border-cyan-500/20 text-white placeholder:text-gray-600 font-mono text-xs" /></div>
                  <Button onClick={() => { setBatchMode('csv'); setBatchCsv(''); setBatchResult(null); setShowStudentBatchDialog(true); }} className="bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs whitespace-nowrap"><Upload size={14} className="mr-1.5" /> Lote</Button>
                </div>
              </div>
              <div className="jarvis-card overflow-hidden">
                <Table>
                  <TableHeader><TableRow className="border-b border-cyan-500/10 hover:bg-transparent">
                    <TableHead className="text-xs font-mono text-gray-400">RA</TableHead><TableHead className="text-xs font-mono text-gray-400">Nome</TableHead><TableHead className="text-xs font-mono text-gray-400">Curso</TableHead><TableHead className="text-xs font-mono text-gray-400 text-center">Período</TableHead><TableHead className="text-xs font-mono text-gray-400 text-center">Modalidade</TableHead><TableHead className="text-xs font-mono text-gray-400 text-center">Média</TableHead><TableHead className="text-xs font-mono text-gray-400 text-center">Ações</TableHead>
                  </TableRow></TableHeader>
                  <TableBody>
                    {filteredStudents.length === 0 ? <TableRow><TableCell colSpan={7} className="text-center py-8 text-gray-500 font-mono text-xs">Nenhum aluno</TableCell></TableRow> : filteredStudents.slice(0, 50).map(student => (
                      <TableRow key={student.id} className="border-b border-cyan-500/5 hover:bg-white/[0.02]">
                        <TableCell className="text-xs text-cyan-400/70 font-mono">{student.ra || '—'}</TableCell>
                        <TableCell className="text-sm text-white font-mono">{student.name}</TableCell>
                        <TableCell className="text-xs text-gray-300 font-mono">{student.curso || '—'}</TableCell>
                        <TableCell className="text-xs text-gray-300 font-mono text-center">{student.periodo || '—'}</TableCell>
                        <TableCell className="text-center"><Badge className="text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border-cyan-500/20">{student.modalidade || '—'}</Badge></TableCell>
                        <TableCell className="text-center"><span className={`text-sm font-mono font-bold ${(student.avgScore || 0) >= 70 ? 'text-green-400' : (student.avgScore || 0) >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>{student.avgScore ? `${student.avgScore}%` : '—'}</span></TableCell>
                        <TableCell><div className="flex items-center justify-center gap-1">
                          {actionBtn(<Edit size={14} />, () => setEditingUser(student))}
                          {actionBtn(<Trash2 size={14} />, () => setConfirmAction({ title: 'Excluir Aluno', message: `Tem certeza que deseja excluir ${student.name}?`, onConfirm: () => handleDeleteUser(student.id) }), 'text-red-400/60 hover:text-red-400 hover:bg-red-500/10')}
                        </div></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {/* Student Batch Dialog */}
              <Dialog open={showStudentBatchDialog} onOpenChange={setShowStudentBatchDialog}><DialogContent className="bg-[#0d1321] border-cyan-500/20 max-w-2xl"><DialogHeader><DialogTitle className="text-cyan-400 font-mono flex items-center gap-2"><Upload size={16} /> Cadastro em Lote — Alunos</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Button size="sm" variant={batchMode === 'csv' ? 'default' : 'outline'} onClick={() => setBatchMode('csv')} className={batchMode === 'csv' ? 'bg-cyan-600 text-white font-mono text-xs' : 'border-cyan-500/30 text-cyan-400 font-mono text-xs'}><FileSpreadsheet size={14} className="mr-1.5" /> CSV</Button>
                    <Button size="sm" variant={batchMode === 'individual' ? 'default' : 'outline'} onClick={() => setBatchMode('individual')} className={batchMode === 'individual' ? 'bg-cyan-600 text-white font-mono text-xs' : 'border-cyan-500/30 text-cyan-400 font-mono text-xs'}><Plus size={14} className="mr-1.5" /> Individual</Button>
                  </div>
                  {batchMode === 'csv' ? (<>
                    <Label className="text-xs font-mono text-gray-400">Formato: nome,email,ra,curso,periodo,modalidade,senha</Label>
                    <Textarea value={batchCsv} onChange={e => setBatchCsv(e.target.value)} placeholder={`Ana,ana@seuemail.com.br,1001,Eng Software,3,Presencial,senha123`} className="min-h-[150px] bg-[#0a0e17] border-cyan-500/20 text-white placeholder:text-gray-600 font-mono text-sm resize-none" />
                    {batchImporting && <div className="p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/20"><p className="text-sm text-cyan-400 font-mono">Importando {batchProgress.current}/{batchProgress.total}...</p><div className="w-full bg-cyan-500/10 rounded-full h-2 mt-2"><div className="bg-cyan-400 h-2 rounded-full transition-all" style={{ width: `${batchProgress.total > 0 ? (batchProgress.current / batchProgress.total) * 100 : 0}%` }} /></div></div>}
                    {batchResult && <div className="p-3 rounded-lg border border-cyan-500/20"><div className="flex items-center gap-4"><span className="text-sm text-green-400 font-mono flex items-center gap-1"><CheckCircle2 size={14} /> {batchResult.success}</span><span className="text-sm text-red-400 font-mono flex items-center gap-1"><XCircle size={14} /> {batchResult.errors}</span></div></div>}
                    <Button onClick={handleBatchStudentImport} disabled={batchImporting || !batchCsv.trim()} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-mono">{batchImporting ? 'Importando...' : <><Upload size={14} className="mr-1.5" /> Importar</>}</Button>
                  </>) : (<>
                    <div className="grid grid-cols-2 gap-3">
                      <div><Label className="text-xs font-mono text-gray-400">Nome</Label><Input value={newStudent.name} onChange={e => setNewStudent(p => ({ ...p, name: e.target.value }))} className="mt-1 bg-[#0a0e17] border-cyan-500/20 text-white font-mono text-sm" /></div>
                      <div><Label className="text-xs font-mono text-gray-400">Email</Label><Input value={newStudent.email} onChange={e => setNewStudent(p => ({ ...p, email: e.target.value }))} className="mt-1 bg-[#0a0e17] border-cyan-500/20 text-white font-mono text-sm" /></div>
                      <div><Label className="text-xs font-mono text-gray-400">RA</Label><Input value={newStudent.ra} onChange={e => setNewStudent(p => ({ ...p, ra: e.target.value }))} className="mt-1 bg-[#0a0e17] border-cyan-500/20 text-white font-mono text-sm" /></div>
                      <div><Label className="text-xs font-mono text-gray-400">Curso</Label><Input value={newStudent.curso} onChange={e => setNewStudent(p => ({ ...p, curso: e.target.value }))} className="mt-1 bg-[#0a0e17] border-cyan-500/20 text-white font-mono text-sm" /></div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div><Label className="text-xs font-mono text-gray-400">Período</Label><Input type="number" value={newStudent.periodo} onChange={e => setNewStudent(p => ({ ...p, periodo: e.target.value }))} min="1" max="10" className="mt-1 bg-[#0a0e17] border-cyan-500/20 text-white font-mono text-sm" /></div>
                      <div><Label className="text-xs font-mono text-gray-400">Modalidade</Label><select value={newStudent.modalidade} onChange={e => setNewStudent(p => ({ ...p, modalidade: e.target.value }))} className="w-full mt-1 bg-[#0a0e17] border border-cyan-500/20 text-white text-sm font-mono rounded-lg px-3 py-2.5 focus:border-cyan-500/40 outline-none"><option value="PRESENCIAL">Presencial</option><option value="EAD">EAD</option><option value="SEMIPRESENCIAL">Semipresencial</option></select></div>
                      <div><Label className="text-xs font-mono text-gray-400">Senha</Label><Input value={newStudent.senha} onChange={e => setNewStudent(p => ({ ...p, senha: e.target.value }))} type="password" className="mt-1 bg-[#0a0e17] border-cyan-500/20 text-white font-mono text-sm" /></div>
                    </div>
                    <Button onClick={handleAddIndividualStudent} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-mono"><Plus size={14} className="mr-1.5" /> Adicionar</Button>
                  </>)}
                </div>
              </DialogContent></Dialog>
            </motion.div>
          </TabsContent>

          {/* ======================== QUESTÕES ======================== */}
          <TabsContent value="questions">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[{ label: 'Total', value: questionTotal, color: 'text-cyan-400' }, { label: 'Ativas', value: questions.filter(q => q.status === 'ATIVA').length, color: 'text-emerald-400' }, { label: 'Em Teste', value: questions.filter(q => ['EM_TESTE', 'AGUARDANDO_TESTE'].includes(q.status)).length, color: 'text-purple-400' }, { label: 'Rascunho', value: questions.filter(q => q.status === 'RASCUNHO').length, color: 'text-yellow-400' }].map(s => (
                  <div key={s.label} className="jarvis-card p-3 text-center"><p className={`text-xl font-bold font-mono ${s.color}`}>{s.value}</p><p className="text-[10px] text-gray-500 font-mono">{s.label}</p></div>
                ))}
              </div>
              <div className="jarvis-card p-4">
                <div className="flex flex-wrap gap-3 items-center">
                  <select value={questionFilter.status} onChange={e => setQuestionFilter(f => ({ ...f, status: e.target.value }))} className="bg-[#0a0e17] border border-cyan-500/20 text-gray-300 text-xs font-mono rounded-lg px-3 py-2 focus:border-cyan-500/40 outline-none"><option value="">Todos Status</option>{Object.entries(statusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
                  <select value={questionFilter.difficulty} onChange={e => setQuestionFilter(f => ({ ...f, difficulty: e.target.value }))} className="bg-[#0a0e17] border border-cyan-500/20 text-gray-300 text-xs font-mono rounded-lg px-3 py-2 focus:border-cyan-500/40 outline-none"><option value="">Dificuldade</option><option value="fácil">Fácil</option><option value="médio">Médio</option><option value="difícil">Difícil</option></select>
                  <div className="ml-auto flex gap-2">
                    <Button onClick={() => { setShowBatchQuestionDialog(true); setBatchQuestionJson(''); setBatchQuestionResult(null); }} className="bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs"><Upload size={14} className="mr-1.5" /> Inserir em Lote</Button>
                    <Button onClick={() => { setEditingQuestion(null); setQuestionForm({ ...emptyQuestionForm, alternatives: emptyAlternatives() }); setShowQuestionFormDialog(true); }} className="bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs"><Plus size={14} className="mr-1.5" /> Criar Questão</Button>
                  </div>
                </div>
                {selectedQuestions.size > 0 && (<div className="mt-3 pt-3 border-t border-cyan-500/10 flex items-center gap-3"><span className="text-xs text-gray-400 font-mono">{selectedQuestions.size} selecionada(s)</span><select value={bulkStatus} onChange={e => setBulkStatus(e.target.value)} className="bg-[#0a0e17] border border-cyan-500/20 text-gray-300 text-xs font-mono rounded-lg px-3 py-2"><option value="">Alterar status...</option>{Object.entries(statusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select><Button size="sm" onClick={handleBulkStatusChange} disabled={!bulkStatus} className="bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs">Aplicar</Button><Button size="sm" variant="ghost" onClick={() => { setSelectedQuestions(new Set()); setBulkStatus(''); }} className="text-gray-400 font-mono text-xs">Limpar</Button></div>)}
              </div>
              <div className="jarvis-card overflow-hidden">
                <Table>
                  <TableHeader><TableRow className="border-b border-cyan-500/10 hover:bg-transparent">
                    <TableHead className="text-xs font-mono text-gray-400 w-8">#</TableHead><TableHead className="text-xs font-mono text-gray-400">Código</TableHead><TableHead className="text-xs font-mono text-gray-400">Microárea</TableHead><TableHead className="text-xs font-mono text-gray-400">Tipo</TableHead><TableHead className="text-xs font-mono text-gray-400">Dificuldade</TableHead><TableHead className="text-xs font-mono text-gray-400">Status</TableHead><TableHead className="text-xs font-mono text-gray-400 text-center">Ações</TableHead>
                  </TableRow></TableHeader>
                  <TableBody>
                    {filteredQuestions.length === 0 ? <TableRow><TableCell colSpan={7} className="text-center py-8 text-gray-500 font-mono text-xs">Nenhuma questão</TableCell></TableRow> : filteredQuestions.map((q, idx) => (
                      <TableRow key={q.id} className="border-b border-cyan-500/5 hover:bg-white/[0.02]">
                        <TableCell className="text-xs text-gray-600 font-mono"><input type="checkbox" checked={selectedQuestions.has(q.id)} onChange={e => { const s = new Set(selectedQuestions); if (e.target.checked) { s.add(q.id); } else { s.delete(q.id); } setSelectedQuestions(s); }} className="rounded border-cyan-500/30 bg-[#0a0e17]" /></TableCell>
                        <TableCell className="text-xs text-cyan-400/80 font-mono">{q.code}</TableCell>
                        <TableCell className="text-xs text-gray-300 font-mono max-w-[150px] truncate">{q.microarea}</TableCell>
                        <TableCell><Badge variant="outline" className="text-[10px] font-mono border-cyan-500/20 text-cyan-400/70">{q.type === 'DISSERTATIVA' ? 'Diss.' : 'Obj.'}</Badge></TableCell>
                        <TableCell className={`text-xs font-mono ${difficultyColors[q.difficulty] || 'text-gray-400'}`}>{capitalizeFirst(q.difficulty)}</TableCell>
                        <TableCell><Badge className={`text-[10px] font-mono ${statusColors[q.status] || 'bg-gray-500/20 text-gray-400'}`}>{statusLabels[q.status] || q.status}</Badge></TableCell>
                        <TableCell><div className="flex items-center justify-center gap-1">
                          {actionBtn(<Eye size={14} />, () => setViewingQuestion(q))}
                          {actionBtn(<Edit size={14} />, () => openEditQuestion(q))}
                          {actionBtn(<Trash2 size={14} />, () => setConfirmAction({ title: 'Excluir Questão', message: `Excluir questão ${q.code}? O MASTER pode excluir qualquer questão.`, onConfirm: () => handleDeleteQuestion(q.id) }), 'text-red-400/60 hover:text-red-400 hover:bg-red-500/10')}
                        </div></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {/* Question Form Dialog */}
              <Dialog open={showQuestionFormDialog} onOpenChange={setShowQuestionFormDialog}><DialogContent className="bg-[#0d1321] border-cyan-500/20 max-w-3xl max-h-[85vh] overflow-y-auto"><DialogHeader><DialogTitle className="text-cyan-400 font-mono">{editingQuestion ? 'Editar Questão' : 'Nova Questão'}</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label className="text-xs font-mono text-gray-400 uppercase">Tipo</Label><select value={questionForm.type} onChange={e => setQuestionForm(f => ({ ...f, type: e.target.value }))} className="w-full bg-[#0a0e17] border border-cyan-500/20 text-white text-sm font-mono rounded-lg px-3 py-2.5 focus:border-cyan-500/40 outline-none"><option value="Objetiva">Objetiva</option><option value="Dissertativa">Dissertativa</option></select></div>
                    <div><Label className="text-xs font-mono text-gray-400 uppercase">Dificuldade</Label><select value={questionForm.difficulty} onChange={e => setQuestionForm(f => ({ ...f, difficulty: e.target.value }))} className="w-full bg-[#0a0e17] border border-cyan-500/20 text-white text-sm font-mono rounded-lg px-3 py-2.5 focus:border-cyan-500/40 outline-none"><option value="Fácil">Fácil</option><option value="Médio">Médio</option><option value="Difícil">Difícil</option></select></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label className="text-xs font-mono text-gray-400 uppercase">Microárea</Label><select value={questionForm.microareaId} onChange={e => setQuestionForm(f => ({ ...f, microareaId: e.target.value, elementId: '' }))} className="w-full bg-[#0a0e17] border border-cyan-500/20 text-white text-sm font-mono rounded-lg px-3 py-2.5 focus:border-cyan-500/40 outline-none"><option value="">Selecione...</option>{microareas.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}</select></div>
                    <div><Label className="text-xs font-mono text-gray-400 uppercase">Elemento</Label><select value={questionForm.elementId} onChange={e => setQuestionForm(f => ({ ...f, elementId: e.target.value }))} className="w-full bg-[#0a0e17] border border-cyan-500/20 text-white text-sm font-mono rounded-lg px-3 py-2.5 focus:border-cyan-500/40 outline-none" disabled={!questionForm.microareaId}><option value="">Selecione...</option>{elements.map(el => <option key={el.id} value={el.id}>{el.name}</option>)}</select></div>
                  </div>
                  <div><Label className="text-xs font-mono text-gray-400 uppercase">Contexto</Label><Textarea value={questionForm.context} onChange={e => setQuestionForm(f => ({ ...f, context: e.target.value }))} className="min-h-[60px] bg-[#0a0e17] border-cyan-500/20 text-white placeholder:text-gray-600 font-mono text-sm resize-none" /></div>
                  <div><Label className="text-xs font-mono text-gray-400 uppercase">Enunciado *</Label><Textarea value={questionForm.statement} onChange={e => setQuestionForm(f => ({ ...f, statement: e.target.value }))} className="min-h-[80px] bg-[#0a0e17] border-cyan-500/20 text-white placeholder:text-gray-600 font-mono text-sm resize-none" /></div>
                  {questionForm.type === 'Objetiva' && (<div className="space-y-2"><Label className="text-xs font-mono text-gray-400 uppercase">Alternativas <span className="text-gray-600">(clique na letra para marcar a correta)</span></Label>{questionForm.alternatives.map((alt, idx) => (
                    <div key={alt.key} className={`flex items-center gap-2 p-2.5 rounded-lg border transition-all ${alt.isCorrect ? 'bg-green-500/10 border-green-500/30' : 'bg-white/[0.02] border-cyan-500/10 hover:border-cyan-500/20'}`}>
                      <button type="button" onClick={() => setQuestionForm(f => ({ ...f, alternatives: f.alternatives.map((a, i) => ({ ...a, isCorrect: i === idx })) }))} className={`w-7 h-7 rounded flex items-center justify-center text-xs font-bold font-mono flex-shrink-0 ${alt.isCorrect ? 'bg-green-500/20 text-green-400 border border-green-500/40' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'}`}>{alt.key}</button>
                      <input value={alt.text} onChange={e => { const a = [...questionForm.alternatives]; a[idx] = { ...a[idx], text: e.target.value }; setQuestionForm(f => ({ ...f, alternatives: a })); }} placeholder={`Alternativa ${alt.key}...`} className="flex-1 bg-transparent text-white placeholder:text-gray-600 font-mono text-sm outline-none" />
                    </div>
                  ))}</div>)}
                  <div><Label className="text-xs font-mono text-gray-400 uppercase">Justificativa</Label><Textarea value={questionForm.explanation} onChange={e => setQuestionForm(f => ({ ...f, explanation: e.target.value }))} className="min-h-[60px] bg-[#0a0e17] border-cyan-500/20 text-white placeholder:text-gray-600 font-mono text-sm resize-none" /></div>
                  <div className="grid grid-cols-3 gap-4">
                    <div><Label className="text-xs font-mono text-gray-400 uppercase">Tags</Label><Input value={questionForm.tags} onChange={e => setQuestionForm(f => ({ ...f, tags: e.target.value }))} placeholder="tag1, tag2" className="bg-[#0a0e17] border-cyan-500/20 text-white placeholder:text-gray-600 font-mono text-sm" /></div>
                    <div><Label className="text-xs font-mono text-gray-400 uppercase">Fonte</Label><select value={questionForm.source} onChange={e => setQuestionForm(f => ({ ...f, source: e.target.value }))} className="w-full bg-[#0a0e17] border border-cyan-500/20 text-white text-sm font-mono rounded-lg px-3 py-2.5"><option value="elaborada">Elaborada</option><option value="enade-oficial">ENADE Oficial</option><option value="externa">Externa</option></select></div>
                    <div><Label className="text-xs font-mono text-gray-400 uppercase">Ano</Label><Input type="number" value={questionForm.year} onChange={e => setQuestionForm(f => ({ ...f, year: parseInt(e.target.value) || 2026 }))} className="bg-[#0a0e17] border-cyan-500/20 text-white font-mono text-sm" /></div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button onClick={() => handleSaveQuestion('RASCUNHO')} disabled={questionSaving} className="flex-1 bg-yellow-600 hover:bg-yellow-500 text-white font-mono text-xs"><Save className="mr-1.5" size={14} />Salvar Rascunho</Button>
                    <Button onClick={() => handleSaveQuestion('ATIVA')} disabled={questionSaving} className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs"><CheckCircle2 className="mr-1.5" size={14} />Salvar Ativa</Button>
                  </div>
                </div>
              </DialogContent></Dialog>
              {/* View Question Dialog */}
              <Dialog open={!!viewingQuestion} onOpenChange={() => setViewingQuestion(null)}><DialogContent className="bg-[#0d1321] border-cyan-500/20 max-w-2xl max-h-[80vh] overflow-y-auto"><DialogHeader><DialogTitle className="text-cyan-400 font-mono flex items-center gap-2"><FileQuestion size={16} /> Questão {viewingQuestion?.code}</DialogTitle></DialogHeader>
                {viewingQuestion && (<div className="space-y-4">
                  <div className="flex flex-wrap gap-2"><Badge className={`text-[10px] font-mono ${statusColors[viewingQuestion.status]}`}>{statusLabels[viewingQuestion.status]}</Badge><Badge variant="outline" className="text-[10px] font-mono border-cyan-500/20 text-cyan-400/70">{capitalizeFirst(viewingQuestion.difficulty)}</Badge><Badge variant="outline" className="text-[10px] font-mono border-cyan-500/20 text-cyan-400/70">{viewingQuestion.type}</Badge></div>
                  <div><p className="text-xs text-gray-500 font-mono mb-1">MICROÁREA / ELEMENTO</p><p className="text-sm text-white font-mono">{viewingQuestion.microarea}{viewingQuestion.element ? ` — ${viewingQuestion.element}` : ''}</p></div>
                  {viewingQuestion.context && <div><p className="text-xs text-gray-500 font-mono mb-1">CONTEXTO</p><p className="text-sm text-gray-300 font-mono whitespace-pre-wrap">{viewingQuestion.context}</p></div>}
                  <div><p className="text-xs text-gray-500 font-mono mb-1">ENUNCIADO</p><p className="text-sm text-gray-300 font-mono whitespace-pre-wrap">{viewingQuestion.statement}</p></div>
                  {viewingQuestion.alternatives && viewingQuestion.alternatives.length > 0 && <div><p className="text-xs text-gray-500 font-mono mb-2">ALTERNATIVAS</p><div className="space-y-1">{viewingQuestion.alternatives.map(alt => (<div key={alt.key} className={`text-xs font-mono p-2.5 rounded ${alt.isCorrect ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-white/[0.02] text-gray-400'}`}><span className="font-bold mr-2">{alt.key})</span> {alt.text}</div>))}</div></div>}
                  {viewingQuestion.explanation && <div><p className="text-xs text-gray-500 font-mono mb-1">JUSTIFICATIVA</p><p className="text-sm text-gray-300 font-mono whitespace-pre-wrap">{viewingQuestion.explanation}</p></div>}
                </div>)}
              </DialogContent></Dialog>
              {/* Batch Question Dialog */}
              <Dialog open={showBatchQuestionDialog} onOpenChange={setShowBatchQuestionDialog}><DialogContent className="bg-[#0d1321] border-cyan-500/20 max-w-3xl"><DialogHeader><DialogTitle className="text-cyan-400 font-mono flex items-center gap-2"><Upload size={16} /> Inserir Questões em Lote (JSON)</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <Label className="text-xs font-mono text-gray-400">Formato: Array JSON com objetos de questão. Campos: type (OBJETIVA/DISSERTATIVA), statement, context, correctAnswer, difficulty, microareaId, elementId, alternatives [{letter, text}], explanation, tags [], source, sourceYear, status</Label>
                  <Textarea value={batchQuestionJson} onChange={e => setBatchQuestionJson(e.target.value)} placeholder={`[{"type":"OBJETIVA","statement":"Qual a resposta?","correctAnswer":"A","difficulty":"médio","microareaId":"xxx","alternatives":[{"letter":"A","text":"Resposta A"},{"letter":"B","text":"Resposta B"}],"explanation":"Porque sim","status":"RASCUNHO"}]`} className="min-h-[200px] bg-[#0a0e17] border-cyan-500/20 text-white placeholder:text-gray-600 font-mono text-xs resize-none" />
                  {batchQuestionImporting && <div className="p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/20"><p className="text-sm text-cyan-400 font-mono">Importando questões...</p></div>}
                  {batchQuestionResult && <div className="p-3 rounded-lg border border-cyan-500/20"><div className="flex items-center gap-4"><span className="text-sm text-green-400 font-mono flex items-center gap-1"><CheckCircle2 size={14} /> {batchQuestionResult.success}</span><span className="text-sm text-red-400 font-mono flex items-center gap-1"><XCircle size={14} /> {batchQuestionResult.errors}</span></div>{batchQuestionResult.errorDetails.length > 0 && <div className="mt-2 max-h-32 overflow-y-auto space-y-1">{batchQuestionResult.errorDetails.map((err, i) => <p key={i} className="text-xs text-red-400/80 font-mono">Q{err.row}: {err.error}</p>)}</div>}</div>}
                  <Button onClick={handleBatchQuestionImport} disabled={batchQuestionImporting || !batchQuestionJson.trim()} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-mono">{batchQuestionImporting ? 'Importando...' : <><Upload size={14} className="mr-1.5" /> Importar JSON</>}</Button>
                </div>
              </DialogContent></Dialog>
            </motion.div>
          </TabsContent>

          {/* ======================== MICROÁREAS & ELEMENTOS ======================== */}
          <TabsContent value="microareas">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h3 className="text-sm font-mono text-cyan-400 tracking-wider flex items-center gap-2"><Layers size={14} /> Microáreas ({microareas.length})</h3>
                <Button onClick={() => { setEditingMicroarea(null); setMicroareaForm({ ...emptyMicroareaForm }); setShowMicroareaDialog(true); }} className="bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs whitespace-nowrap"><Plus size={14} className="mr-1.5" /> Nova Microárea</Button>
              </div>
              <div className="jarvis-card overflow-hidden">
                <Table>
                  <TableHeader><TableRow className="border-b border-cyan-500/10 hover:bg-transparent">
                    <TableHead className="text-xs font-mono text-gray-400">Nome</TableHead><TableHead className="text-xs font-mono text-gray-400">Código</TableHead><TableHead className="text-xs font-mono text-gray-400">Macroárea</TableHead><TableHead className="text-xs font-mono text-gray-400 text-center">Cor</TableHead><TableHead className="text-xs font-mono text-gray-400 text-center">Elementos</TableHead><TableHead className="text-xs font-mono text-gray-400 text-center">Questões</TableHead><TableHead className="text-xs font-mono text-gray-400 text-center">Ações</TableHead>
                  </TableRow></TableHeader>
                  <TableBody>
                    {microareas.length === 0 ? <TableRow><TableCell colSpan={7} className="text-center py-8 text-gray-500 font-mono text-xs">Nenhuma microárea</TableCell></TableRow> : microareas.map(ma => (
                      <TableRow key={ma.id} className={`border-b border-cyan-500/5 hover:bg-white/[0.02] cursor-pointer ${selectedMicroareaId === ma.id ? 'bg-cyan-500/5' : ''}`} onClick={() => setSelectedMicroareaId(selectedMicroareaId === ma.id ? null : ma.id)}>
                        <TableCell className="text-sm text-white font-mono">{ma.name}</TableCell>
                        <TableCell className="text-xs text-cyan-400/70 font-mono">{ma.code}</TableCell>
                        <TableCell className="text-xs text-gray-300 font-mono">{ma.macroarea}</TableCell>
                        <TableCell className="text-center"><div className="flex items-center justify-center gap-2"><div className="w-4 h-4 rounded-full border border-white/10" style={{ backgroundColor: ma.color || '#3b82f6' }} /></div></TableCell>
                        <TableCell className="text-xs text-cyan-400 font-mono text-center">{ma.elementCount}</TableCell>
                        <TableCell className="text-xs text-cyan-400 font-mono text-center">{ma.questionCount}</TableCell>
                        <TableCell onClick={e => e.stopPropagation()}><div className="flex items-center justify-center gap-1">
                          {actionBtn(<Edit size={14} />, () => { setEditingMicroarea(ma); setMicroareaForm({ name: ma.name, code: ma.code, macroarea: ma.macroarea, description: ma.description || '', color: ma.color || '#3b82f6', order: ma.order || 0 }); setShowMicroareaDialog(true); })}
                          {actionBtn(<Trash2 size={14} />, () => setConfirmAction({ title: 'Excluir Microárea', message: `Excluir "${ma.name}" e todos seus elementos?`, onConfirm: () => handleDeleteMicroarea(ma.id) }), 'text-red-400/60 hover:text-red-400 hover:bg-red-500/10')}
                        </div></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {/* Microarea Dialog */}
              <Dialog open={showMicroareaDialog} onOpenChange={setShowMicroareaDialog}><DialogContent className="bg-[#0d1321] border-cyan-500/20"><DialogHeader><DialogTitle className="text-cyan-400 font-mono">{editingMicroarea ? 'Editar Microárea' : 'Nova Microárea'}</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div><Label className="text-xs font-mono text-gray-400">Nome *</Label><Input value={microareaForm.name} onChange={e => setMicroareaForm(f => ({ ...f, name: e.target.value }))} className="mt-1 bg-[#0a0e17] border-cyan-500/20 text-white font-mono text-sm" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label className="text-xs font-mono text-gray-400">Código *</Label><Input value={microareaForm.code} onChange={e => setMicroareaForm(f => ({ ...f, code: e.target.value }))} className="mt-1 bg-[#0a0e17] border-cyan-500/20 text-white font-mono text-sm" /></div>
                    <div><Label className="text-xs font-mono text-gray-400">Macroárea *</Label><Input value={microareaForm.macroarea} onChange={e => setMicroareaForm(f => ({ ...f, macroarea: e.target.value }))} className="mt-1 bg-[#0a0e17] border-cyan-500/20 text-white font-mono text-sm" /></div>
                  </div>
                  <div><Label className="text-xs font-mono text-gray-400">Descrição *</Label><Textarea value={microareaForm.description} onChange={e => setMicroareaForm(f => ({ ...f, description: e.target.value }))} className="mt-1 bg-[#0a0e17] border-cyan-500/20 text-white font-mono text-sm resize-none min-h-[60px]" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label className="text-xs font-mono text-gray-400">Cor</Label><div className="flex gap-2 mt-1"><input type="color" value={microareaForm.color} onChange={e => setMicroareaForm(f => ({ ...f, color: e.target.value }))} className="w-10 h-10 rounded border border-cyan-500/20 cursor-pointer" /><Input value={microareaForm.color} onChange={e => setMicroareaForm(f => ({ ...f, color: e.target.value }))} className="flex-1 bg-[#0a0e17] border-cyan-500/20 text-white font-mono text-sm" /></div></div>
                    <div><Label className="text-xs font-mono text-gray-400">Ordem</Label><Input type="number" value={microareaForm.order} onChange={e => setMicroareaForm(f => ({ ...f, order: parseInt(e.target.value) || 0 }))} className="mt-1 bg-[#0a0e17] border-cyan-500/20 text-white font-mono text-sm" /></div>
                  </div>
                  <Button onClick={handleSaveMicroarea} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-mono">{editingMicroarea ? 'Salvar Alterações' : 'Criar Microárea'}</Button>
                </div>
              </DialogContent></Dialog>
              {/* Elements for selected microarea */}
              {selectedMicroareaId && (<div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-mono text-cyan-400 tracking-wider flex items-center gap-2"><MapPin size={14} /> Elementos de {microareas.find(m => m.id === selectedMicroareaId)?.name}</h4>
                  <Button onClick={() => { setEditingElement(null); setElementForm({ ...emptyElementForm, microareaId: selectedMicroareaId }); setShowElementDialog(true); }} className="bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs"><Plus size={14} className="mr-1.5" /> Novo Elemento</Button>
                </div>
                <div className="jarvis-card overflow-hidden">
                  <Table>
                    <TableHeader><TableRow className="border-b border-cyan-500/10 hover:bg-transparent">
                      <TableHead className="text-xs font-mono text-gray-400">Código</TableHead><TableHead className="text-xs font-mono text-gray-400">Nome</TableHead><TableHead className="text-xs font-mono text-gray-400">Nível</TableHead><TableHead className="text-xs font-mono text-gray-400 text-center">Questões</TableHead><TableHead className="text-xs font-mono text-gray-400 text-center">Ações</TableHead>
                    </TableRow></TableHeader>
                    <TableBody>
                      {microareaElements.length === 0 ? <TableRow><TableCell colSpan={5} className="text-center py-6 text-gray-500 font-mono text-xs">Nenhum elemento</TableCell></TableRow> : microareaElements.map(el => (
                        <TableRow key={el.id} className="border-b border-cyan-500/5 hover:bg-white/[0.02]">
                          <TableCell className="text-xs text-cyan-400/70 font-mono">{el.code}</TableCell>
                          <TableCell className="text-sm text-white font-mono">{el.name}</TableCell>
                          <TableCell className="text-xs text-gray-400 font-mono">{el.skillLevel || '—'}</TableCell>
                          <TableCell className="text-xs text-cyan-400 font-mono text-center">{el.questionCount || 0}</TableCell>
                          <TableCell><div className="flex items-center justify-center gap-1">
                            {actionBtn(<Edit size={14} />, () => { setEditingElement(el); setElementForm({ code: el.code, name: el.name, description: el.description || '', microareaId: el.microareaId, skillLevel: el.skillLevel || 'compreensão', order: el.order || 0 }); setShowElementDialog(true); })}
                            {actionBtn(<Trash2 size={14} />, () => setConfirmAction({ title: 'Excluir Elemento', message: `Excluir "${el.name}"?`, onConfirm: () => handleDeleteElement(el.id) }), 'text-red-400/60 hover:text-red-400 hover:bg-red-500/10')}
                          </div></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>)}
              {/* Element Dialog */}
              <Dialog open={showElementDialog} onOpenChange={setShowElementDialog}><DialogContent className="bg-[#0d1321] border-cyan-500/20"><DialogHeader><DialogTitle className="text-cyan-400 font-mono">{editingElement ? 'Editar Elemento' : 'Novo Elemento'}</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label className="text-xs font-mono text-gray-400">Código *</Label><Input value={elementForm.code} onChange={e => setElementForm(f => ({ ...f, code: e.target.value }))} className="mt-1 bg-[#0a0e17] border-cyan-500/20 text-white font-mono text-sm" /></div>
                    <div><Label className="text-xs font-mono text-gray-400">Nome *</Label><Input value={elementForm.name} onChange={e => setElementForm(f => ({ ...f, name: e.target.value }))} className="mt-1 bg-[#0a0e17] border-cyan-500/20 text-white font-mono text-sm" /></div>
                  </div>
                  <div><Label className="text-xs font-mono text-gray-400">Descrição *</Label><Textarea value={elementForm.description} onChange={e => setElementForm(f => ({ ...f, description: e.target.value }))} className="mt-1 bg-[#0a0e17] border-cyan-500/20 text-white font-mono text-sm resize-none min-h-[60px]" /></div>
                  <div className="grid grid-cols-3 gap-4">
                    <div><Label className="text-xs font-mono text-gray-400">Microárea</Label><select value={elementForm.microareaId} onChange={e => setElementForm(f => ({ ...f, microareaId: e.target.value }))} className="w-full mt-1 bg-[#0a0e17] border border-cyan-500/20 text-white text-sm font-mono rounded-lg px-3 py-2.5"><option value="">Selecione...</option>{microareas.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}</select></div>
                    <div><Label className="text-xs font-mono text-gray-400">Nível</Label><select value={elementForm.skillLevel} onChange={e => setElementForm(f => ({ ...f, skillLevel: e.target.value }))} className="w-full mt-1 bg-[#0a0e17] border border-cyan-500/20 text-white text-sm font-mono rounded-lg px-3 py-2.5"><option value="compreensão">Compreensão</option><option value="aplicação">Aplicação</option><option value="análise">Análise</option><option value="avaliação">Avaliação</option></select></div>
                    <div><Label className="text-xs font-mono text-gray-400">Ordem</Label><Input type="number" value={elementForm.order} onChange={e => setElementForm(f => ({ ...f, order: parseInt(e.target.value) || 0 }))} className="mt-1 bg-[#0a0e17] border-cyan-500/20 text-white font-mono text-sm" /></div>
                  </div>
                  <Button onClick={handleSaveElement} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-mono">{editingElement ? 'Salvar Alterações' : 'Criar Elemento'}</Button>
                </div>
              </DialogContent></Dialog>
            </motion.div>
          </TabsContent>

          {/* ======================== RANKING ======================== */}
          <TabsContent value="ranking">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h3 className="text-sm font-mono text-cyan-400 tracking-wider flex items-center gap-2"><Trophy size={14} /> Ranking de Alunos</h3>
                <div className="flex items-center gap-2">
                  <div className="relative w-full sm:w-56"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-500/40" size={14} /><Input value={rankingSearch} onChange={e => setRankingSearch(e.target.value)} placeholder="Buscar aluno..." className="pl-9 h-9 bg-[#0a0e17] border-cyan-500/20 text-white placeholder:text-gray-600 font-mono text-xs" /></div>
                  <Button onClick={() => setConfirmAction({ title: 'Resetar Ranking', message: 'Isso apagará TODAS as respostas dos alunos e ensaios. Esta ação é irreversível!', onConfirm: handleResetRanking })} className="bg-red-600/80 hover:bg-red-600 text-white font-mono text-xs whitespace-nowrap"><RotateCcw size={14} className="mr-1.5" /> Resetar</Button>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[{ label: 'Alunos Ativos', value: rankingData.length, color: 'text-cyan-400' }, { label: 'Média Acertos', value: rankingData.length > 0 ? `${Math.round(rankingData.reduce((a, r) => a + r.hitRate, 0) / rankingData.length)}%` : '0%', color: 'text-green-400' }, { label: 'Total Respostas', value: rankingData.reduce((a, r) => a + r.totalAnswered, 0), color: 'text-purple-400' }, { label: 'Melhor Taxa', value: rankingData.length > 0 ? `${rankingData[0]?.hitRate || 0}%` : '0%', color: 'text-amber-400' }].map(s => (
                  <div key={s.label} className="jarvis-card p-3 text-center"><p className={`text-xl font-bold font-mono ${s.color}`}>{s.value}</p><p className="text-[10px] text-gray-500 font-mono">{s.label}</p></div>
                ))}
              </div>
              <div className="jarvis-card overflow-hidden">
                <Table>
                  <TableHeader><TableRow className="border-b border-cyan-500/10 hover:bg-transparent">
                    <TableHead className="text-xs font-mono text-gray-400 text-center">#</TableHead><TableHead className="text-xs font-mono text-gray-400">Nome</TableHead><TableHead className="text-xs font-mono text-gray-400">RA</TableHead><TableHead className="text-xs font-mono text-gray-400">Curso</TableHead><TableHead className="text-xs font-mono text-gray-400 text-center">Respondidas</TableHead><TableHead className="text-xs font-mono text-gray-400 text-center">Acertos</TableHead><TableHead className="text-xs font-mono text-gray-400 text-center">Taxa</TableHead><TableHead className="text-xs font-mono text-gray-400 text-center">Tempo Médio</TableHead>
                  </TableRow></TableHeader>
                  <TableBody>
                    {filteredRanking.length === 0 ? <TableRow><TableCell colSpan={8} className="text-center py-8 text-gray-500 font-mono text-xs">Nenhum dado no ranking</TableCell></TableRow> : filteredRanking.slice(0, 50).map(r => (
                      <TableRow key={r.userId} className="border-b border-cyan-500/5 hover:bg-white/[0.02]">
                        <TableCell className="text-center"><span className={`text-sm font-bold font-mono ${r.position <= 3 ? 'text-amber-400' : 'text-gray-400'}`}>{r.position}</span></TableCell>
                        <TableCell className="text-sm text-white font-mono">{r.name}</TableCell>
                        <TableCell className="text-xs text-cyan-400/70 font-mono">{r.ra || '—'}</TableCell>
                        <TableCell className="text-xs text-gray-300 font-mono">{r.curso || '—'}</TableCell>
                        <TableCell className="text-xs text-gray-300 font-mono text-center">{r.totalAnswered}</TableCell>
                        <TableCell className="text-xs text-gray-300 font-mono text-center">{r.totalCorrect}</TableCell>
                        <TableCell className="text-center"><span className={`text-sm font-mono font-bold ${r.hitRate >= 70 ? 'text-green-400' : r.hitRate >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>{r.hitRate}%</span></TableCell>
                        <TableCell className="text-xs text-gray-400 font-mono text-center">{r.avgResponseTime ? `${(r.avgResponseTime / 1000).toFixed(1)}s` : '—'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </motion.div>
          </TabsContent>
        </AnimatePresence>

        {/* ==================== SHARED DIALOGS ==================== */}
        {/* Edit User Dialog */}
        <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}><DialogContent className="bg-[#0d1321] border-cyan-500/20 max-w-md"><DialogHeader><DialogTitle className="text-cyan-400 font-mono flex items-center gap-2"><Edit size={16} /> Editar {editingUser?.role === 'PROFESSOR' ? 'Docente' : 'Aluno'}</DialogTitle></DialogHeader>
          {editingUser && (<div className="space-y-4">
            <div><Label className="text-xs font-mono text-gray-400">Nome</Label><Input value={editingUser.name} onChange={e => setEditingUser({ ...editingUser, name: e.target.value })} className="mt-1 bg-[#0a0e17] border-cyan-500/20 text-white font-mono text-sm" /></div>
            <div><Label className="text-xs font-mono text-gray-400">Email</Label><Input value={editingUser.email} onChange={e => setEditingUser({ ...editingUser, email: e.target.value })} className="mt-1 bg-[#0a0e17] border-cyan-500/20 text-white font-mono text-sm" /></div>
            <div><Label className="text-xs font-mono text-gray-400">RA</Label><Input value={editingUser.ra || ''} onChange={e => setEditingUser({ ...editingUser, ra: e.target.value })} className="mt-1 bg-[#0a0e17] border-cyan-500/20 text-white font-mono text-sm" /></div>
            {editingUser.role === 'ALUNO' && (<>
              <div><Label className="text-xs font-mono text-gray-400">Curso</Label><Input value={editingUser.curso || ''} onChange={e => setEditingUser({ ...editingUser, curso: e.target.value })} className="mt-1 bg-[#0a0e17] border-cyan-500/20 text-white font-mono text-sm" /></div>
              <div><Label className="text-xs font-mono text-gray-400">Período</Label><Input type="number" value={editingUser.periodo || ''} onChange={e => setEditingUser({ ...editingUser, periodo: parseInt(e.target.value) || undefined })} className="mt-1 bg-[#0a0e17] border-cyan-500/20 text-white font-mono text-sm" /></div>
              <div><Label className="text-xs font-mono text-gray-400">Modalidade</Label><select value={editingUser.modalidade || 'PRESENCIAL'} onChange={e => setEditingUser({ ...editingUser, modalidade: e.target.value })} className="w-full mt-1 bg-[#0a0e17] border border-cyan-500/20 text-white text-sm font-mono rounded-lg px-3 py-2.5"><option value="PRESENCIAL">Presencial</option><option value="EAD">EAD</option><option value="SEMIPRESENCIAL">Semipresencial</option></select></div>
            </>)}
            {editingUser.role === 'PROFESSOR' && (<div><Label className="text-xs font-mono text-gray-400">Disciplina</Label><Input value={editingUser.disciplina || ''} onChange={e => setEditingUser({ ...editingUser, disciplina: e.target.value })} className="mt-1 bg-[#0a0e17] border-cyan-500/20 text-white font-mono text-sm" /></div>)}
            <Button onClick={handleUpdateUser} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-mono">Salvar Alterações</Button>
          </div>)}
        </DialogContent></Dialog>
      </Tabs>
    </AdminLayout>
  );
}
