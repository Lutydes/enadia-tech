'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  XCircle,
  Clock,
  Trophy,
  ArrowRight,
  RotateCcw,
  ChevronRight,
  Layers,
  BookOpen,
  Hash,
  Timer,
  BookmarkCheck,
  AlertTriangle,
  Zap,
  FileText,
  Send,
  Loader2,
  Lightbulb,
  CheckSquare,
  XSquare,
  PenLine,
} from 'lucide-react';
import { useAppStore } from '@/store/app-store';
import {
  EnadeQuestionFull,
  MACROAREAS,
  getQuestionCountByMicroarea,
  getRandomFullQuestions,
} from '@/lib/enade-full-bank';

type SimuladoMode = 'diagnostico' | 'microarea' | 'enade_completo' | 'cronometrado';

interface SimuladoTypeOption {
  id: SimuladoMode;
  label: string;
  description: string;
  icon: React.ReactNode;
  minPhase: number;
  questionCount: number;
  timeLimit: number | null; // minutes, null = no limit
}

// All simulado types always available – no phase lock
const SIMULADO_TYPES: SimuladoTypeOption[] = [
  {
    id: 'diagnostico',
    label: 'Diagnóstico Geral',
    description: '20 questões aleatórias, sem limite de tempo',
    icon: <Layers size={18} />,
    minPhase: 1,
    questionCount: 20,
    timeLimit: null,
  },
  {
    id: 'microarea',
    label: 'Simulado por Microárea',
    description: 'Escolha uma microárea específica para praticar',
    icon: <BookOpen size={18} />,
    minPhase: 1,
    questionCount: 10,
    timeLimit: null,
  },
  {
    id: 'enade_completo',
    label: 'Simulado ENADE Completo',
    description: '35 questões, limite de 3 horas',
    icon: <Timer size={18} />,
    minPhase: 1,
    questionCount: 35,
    timeLimit: 180,
  },
  {
    id: 'cronometrado',
    label: 'Simulado Cronometrado',
    description: 'Questões com cronômetro, tempo limitado',
    icon: <Clock size={18} />,
    minPhase: 1,
    questionCount: 20,
    timeLimit: 90,
  },
];

// ---------------------------------------------------------------------------
// Essay (Dissertativa) question definitions
// ---------------------------------------------------------------------------
interface EssayQuestion {
  id: string;
  statement: string;
  topic: string;
  macroarea: string;
}

const ESSAY_QUESTIONS_POOL: EssayQuestion[] = [
  {
    id: 'essay-logica',
    statement:
      'CONTEXTO: A lógica proposicional é fundamental para a especificação e verificação de sistemas de software. Um engenheiro de software precisa argumentar formalmente sobre a corretude de um algoritmo de busca.\n\nCOMANDO: Discorra sobre a importância da lógica proposicional e da lógica de predicados na verificação formal de software. Apresente ao menos dois exemplos práticos de como estas ferramentas lógicas podem ser utilizadas para garantir a corretude de algoritmos. Justifique sua resposta com conceitos técnicos adequados.',
    topic: 'Lógica Proposicional',
    macroarea: 'Fundamentos da Computação',
  },
  {
    id: 'essay-bd',
    statement:
      'CONTEXTO: Um sistema de gestão hospitalar precisa armazenar dados de pacientes, consultas, médicos e exames. O volume de dados cresce rapidamente e há necessidade de relatórios complexos e acesso rápido a informações críticas.\n\nCOMANDO: Compare os paradigmas de banco de dados relacional e NoSQL, discutindo as vantagens e desvantagens de cada abordagem para o cenário descrito. Apresente critérios técnicos para a escolha do paradigma mais adequado e proponha uma arquitetura que contemple as necessidades do sistema.',
    topic: 'Banco de Dados',
    macroarea: 'Desenvolvimento',
  },
  {
    id: 'essay-engsoft',
    statement:
      'CONTEXTO: Uma startup de fintech está desenvolvendo uma plataforma de pagamento digital que deve atender a milhões de usuários, com requisitos rigorosos de segurança, disponibilidade e conformidade regulatória (LGPD).\n\nCOMANDO: Descreva quais metodologias de desenvolvimento de software e práticas de Engenharia de Software você adotaria para este projeto. Discuta como garantir a qualidade do software, a segurança dos dados dos usuários e a conformidade com a LGPD ao longo de todo o ciclo de vida do desenvolvimento.',
    topic: 'Engenharia de Software',
    macroarea: 'Desenvolvimento',
  },
  {
    id: 'essay-ia',
    statement:
      'CONTEXTO: O uso de inteligência artificial em processos seletivos de empresas tem gerado debate sobre vieses algorítmicos e discriminação. Um sistema de triagem de currículos baseado em IA foi acusado de reproduzir vieses de gênero presentes nos dados históricos de contratação.\n\nCOMANDO: Analise os desafios éticos e técnicos relacionados ao uso de IA em processos decisórios automatizados. Discuta estratégias para mitigar vieses algorítmicos e proponha diretrizes para o desenvolvimento responsável de sistemas de IA, considerando aspectos técnicos, éticos e legais.',
    topic: 'Inteligência Artificial',
    macroarea: 'Segurança/IA',
  },
  {
    id: 'essay-redes',
    statement:
      'CONTEXTO: Uma empresa multinacional precisa conectar suas filiais em diferentes continentes, garantindo segurança na transmissão de dados sensíveis e alta disponibilidade dos serviços de comunicação interna.\n\nCOMANDO: Proponha uma arquitetura de rede que atenda aos requisitos de segurança, disponibilidade e desempenho para o cenário descrito. Discuta as tecnologias e protocolos envolvidos, incluindo VPN, firewall, balanceamento de carga e redundância. Justifique tecnicamente cada escolha.',
    topic: 'Redes',
    macroarea: 'Desenvolvimento',
  },
  {
    id: 'essay-so',
    statement:
      'CONTEXTO: Um servidor de aplicação hospeda múltiplos serviços críticos que competem por recursos de CPU, memória e I/O. Em períodos de pico, alguns serviços apresentam degradação significativa de desempenho.\n\nCOMANDO: Explique como o sistema operacional gerencia a alocação de recursos entre processos concorrentes. Discuta as estratégias de escalonamento, gerenciamento de memória e sistemas de arquivos que podem ser aplicadas para otimizar o desempenho do servidor, considerando os trade-offs envolvidos.',
    topic: 'Sistemas Operacionais',
    macroarea: 'Desenvolvimento',
  },
];

// ---------------------------------------------------------------------------
// Essay feedback interface
// ---------------------------------------------------------------------------
interface EssayFeedback {
  score: number;
  feedback: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string;
}

export function SimuladoEnade() {
  const {
    quizQuestions,
    currentQuestionIndex,
    quizAnswers,
    quizCompleted,
    quizStartTime,
    quizEndTime,
    selectedTopic,
    selectedDifficulty,
    selectedCount,
    startQuiz,
    answerQuestion,
    nextQuestion,
    finishQuiz,
    resetQuiz,
    goToQuestion,
    setCurrentView,
    setChatPreFilledQuestion,
    token,
  } = useAppStore();

  const [localTopic, setLocalTopic] = useState(selectedTopic);
  const [localDifficulty, setLocalDifficulty] = useState(selectedDifficulty);
  const [localCount, setLocalCount] = useState(selectedCount);
  const [showExplanation, setShowExplanation] = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState<SimuladoMode | null>(null);
  const [markedForReview, setMarkedForReview] = useState<Set<string>>(new Set());
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());

  // Timer state
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Essay question state
  const [essayQuestions, setEssayQuestions] = useState<EssayQuestion[]>([]);
  const [essayAnswers, setEssayAnswers] = useState<Record<string, string>>({});
  const [essayFeedbacks, setEssayFeedbacks] = useState<Record<string, EssayFeedback>>({});
  const [essayLoading, setEssayLoading] = useState<Record<string, boolean>>({});

  const questionCounts = getQuestionCountByMicroarea();
  const currentQuestion = quizQuestions[currentQuestionIndex];
  const quizStarted = quizQuestions.length > 0 && !quizCompleted;

  // Get current simulado type config
  const currentTypeConfig = SIMULADO_TYPES.find((t) => t.id === selectedMode);
  const timeLimitSeconds = currentTypeConfig?.timeLimit ? currentTypeConfig.timeLimit * 60 : null;

  // Timer logic
  useEffect(() => {
    if (isTimerRunning && timeRemaining !== null && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev !== null && prev <= 1) {
            setIsTimerRunning(false);
            // Auto-submit
            finishQuiz();
            return 0;
          }
          return prev !== null ? prev - 1 : 0;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning, timeRemaining, finishQuiz]);

  // Save response to API
  const saveResponseToAPI = useCallback(async (questionId: string, answer: string, responseTime: number) => {
    if (!token) return;
    try {
      await fetch('/api/responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          questionId,
          answer,
          responseTime: Math.round(responseTime / 1000), // convert ms to seconds
        }),
      });
    } catch {
      // Silently fail - local state already handles it
    }
  }, [token]);

  // Pick 1-2 essay questions when a simulado starts
  const pickEssayQuestions = useCallback((): EssayQuestion[] => {
    const shuffled = [...ESSAY_QUESTIONS_POOL].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 2);
  }, []);

  const handleStart = () => {
    let count = localCount;
    let topic = localTopic;

    if (selectedMode === 'diagnostico') {
      count = 20;
      topic = 'Todos';
    } else if (selectedMode === 'enade_completo') {
      count = 35;
      topic = 'Todos';
    } else if (selectedMode === 'cronometrado') {
      count = 20;
      topic = 'Todos';
    }

    startQuiz(topic, localDifficulty, count);
    setShowExplanation(null);
    setMarkedForReview(new Set());
    setQuestionStartTime(Date.now());

    // Reset essay state and pick new essay questions
    setEssayQuestions(pickEssayQuestions());
    setEssayAnswers({});
    setEssayFeedbacks({});
    setEssayLoading({});

    // Start timer if needed
    if (timeLimitSeconds) {
      setTimeRemaining(timeLimitSeconds);
      setIsTimerRunning(true);
    } else {
      setTimeRemaining(null);
      setIsTimerRunning(false);
    }
  };

  const handleAnswer = (letter: string) => {
    if (!currentQuestion || quizAnswers[currentQuestion.id]) return;
    const responseTime = Date.now() - questionStartTime;
    answerQuestion(currentQuestion.id, letter);
    setShowExplanation(currentQuestion.id);
    saveResponseToAPI(currentQuestion.id, letter, responseTime);
  };

  const handleNext = () => {
    setShowExplanation(null);
    setQuestionStartTime(Date.now());
    if (currentQuestionIndex >= quizQuestions.length - 1) {
      setIsTimerRunning(false);
      finishQuiz();
    } else {
      nextQuestion();
    }
  };

  const toggleMarkForReview = (questionId: string) => {
    setMarkedForReview((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) next.delete(questionId);
      else next.add(questionId);
      return next;
    });
  };

  const getScore = () => {
    let correct = 0;
    quizQuestions.forEach((q) => {
      if (quizAnswers[q.id] === q.correctAnswer) correct++;
    });
    return correct;
  };

  const getPercentage = () => {
    if (quizQuestions.length === 0) return 0;
    return Math.round((getScore() / quizQuestions.length) * 100);
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTimerDisplay = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (timeRemaining === null) return 'text-slate-400';
    if (timeRemaining <= 300) return 'text-red-400 animate-pulse'; // 5 min warning
    if (timeRemaining <= 600) return 'text-yellow-400';
    return 'text-cyan-400';
  };

  const askEnadIA = (question: EnadeQuestionFull) => {
    setChatPreFilledQuestion(
      `Pode me explicar detalhadamente esta questão de ${question.topic} (${question.element})?\n\n${question.statement}\n\nAlternativas:\n${question.alternatives.map((a) => `${a.letter}) ${a.text}`).join('\n')}`
    );
    setCurrentView('chat');
  };

  // All modes always available – phase restrictions removed
  const isModeAvailable = (_mode: SimuladoTypeOption) => true;

  const answeredCount = Object.keys(quizAnswers).length;
  const markedCount = markedForReview.size;

  // ---------------------------------------------------------------------------
  // Essay correction handler
  // ---------------------------------------------------------------------------
  const handleEssaySubmit = async (question: EssayQuestion) => {
    const answer = essayAnswers[question.id];
    if (!answer || answer.trim().length < 20) return;

    setEssayLoading((prev) => ({ ...prev, [question.id]: true }));

    try {
      const res = await fetch('/api/chat/essay-correct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          questionId: question.id,
          questionStatement: question.statement,
          answer: answer.trim(),
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        const errorMessage = (errData as { error?: string }).error || 'Erro ao corrigir a resposta.';
        setEssayFeedbacks((prev) => ({
          ...prev,
          [question.id]: {
            score: 0,
            feedback: errorMessage,
            strengths: [],
            weaknesses: [],
            suggestions: 'Tente novamente mais tarde.',
          },
        }));
        return;
      }

      const data = await res.json();
      setEssayFeedbacks((prev) => ({
        ...prev,
        [question.id]: {
          score: data.score ?? 0,
          feedback: data.feedback ?? '',
          strengths: data.strengths ?? [],
          weaknesses: data.weaknesses ?? [],
          suggestions: data.suggestions ?? '',
        },
      }));
    } catch {
      setEssayFeedbacks((prev) => ({
        ...prev,
        [question.id]: {
          score: 0,
          feedback: 'Não foi possível conectar ao servidor de correção. Verifique sua conexão e tente novamente.',
          strengths: [],
          weaknesses: [],
          suggestions: 'Tente novamente mais tarde.',
        },
      }));
    } finally {
      setEssayLoading((prev) => ({ ...prev, [question.id]: false }));
    }
  };

  // ---------------------------------------------------------------------------
  // Score color helper
  // ---------------------------------------------------------------------------
  const getScoreColor = (score: number) => {
    if (score >= 7) return 'text-emerald-400';
    if (score >= 5) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBg = (score: number) => {
    if (score >= 7) return 'bg-emerald-500/10 border-emerald-500/20';
    if (score >= 5) return 'bg-yellow-500/10 border-yellow-500/20';
    return 'bg-red-500/10 border-red-500/20';
  };

  // START SCREEN
  if (!quizStarted && !quizCompleted) {
    return (
      <div className="flex flex-col h-full overflow-y-auto">
        <div className="p-6 border-b border-[#1e293b] bg-[#0d1321]/50 backdrop-blur-sm">
          <h2 className="text-lg font-semibold jarvis-gradient">Simulado ENADE</h2>
          <p className="text-xs text-slate-500 mt-1">
            Configure e inicie seu simulado · <span className="text-cyan-500 font-mono">{Object.values(questionCounts).reduce((a, b) => a + b, 0)} questões</span> disponíveis
          </p>
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl space-y-6"
          >
            {/* Simulado type selection */}
            <div>
              <label className="text-sm font-medium text-slate-300 mb-3 block">
                Tipo de Simulado
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SIMULADO_TYPES.map((mode) => {
                  const isSelected = selectedMode === mode.id;
                  return (
                    <motion.button
                      key={mode.id}
                      onClick={() => setSelectedMode(mode.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`relative p-4 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-cyan-500/10 border-cyan-500/30 shadow-[0_0_15px_rgba(0,240,255,0.1)]'
                          : 'bg-white/5 border-[#1e293b] hover:border-cyan-500/20 hover:bg-white/[0.08]'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-cyan-500/10 text-cyan-400">
                          {mode.icon}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-200">
                            {mode.label}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {mode.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <Hash size={10} /> {mode.questionCount} questões
                        </span>
                        {mode.timeLimit ? (
                          <span className="flex items-center gap-1">
                            <Clock size={10} /> {mode.timeLimit} min
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <Clock size={10} /> Sem limite
                          </span>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Additional options for microarea mode */}
            <AnimatePresence>
              {selectedMode === 'microarea' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="jarvis-card p-6 space-y-4">
                    <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                      <Layers size={14} className="text-cyan-400" />
                      Microárea
                    </label>
                    <div className="max-h-48 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                      {MACROAREAS.map((macro) => {
                        const availableTopics = macro.microareas.filter(
                          (t) => questionCounts[t] > 0
                        );
                        if (availableTopics.length === 0) return null;
                        return (
                          <div key={macro.name}>
                            <div
                              className="text-[10px] font-semibold uppercase tracking-wider mb-1 pl-1"
                              style={{ color: macro.color }}
                            >
                              {macro.name}
                            </div>
                            <div className="space-y-1">
                              {availableTopics.map((topic) => (
                                <button
                                  key={topic}
                                  onClick={() => setLocalTopic(topic)}
                                  className={`w-full text-left px-4 py-2 rounded-lg text-xs font-medium border transition-all ${
                                    localTopic === topic
                                      ? 'border-opacity-50 bg-opacity-10'
                                      : 'bg-[#1e293b] border-[#1e293b] text-slate-400 hover:border-slate-600'
                                  }`}
                                  style={
                                    localTopic === topic
                                      ? {
                                          borderColor: macro.color + '50',
                                          backgroundColor: macro.color + '10',
                                          color: macro.color,
                                        }
                                      : {}
                                  }
                                >
                                  <span className="flex items-center justify-between">
                                    <span className="flex items-center gap-2">
                                      <BookOpen size={12} /> {topic}
                                    </span>
                                    <span className="font-mono text-[10px] opacity-60">
                                      {questionCounts[topic] || 0} q
                                    </span>
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Difficulty (for relevant modes) */}
            {selectedMode && selectedMode !== 'enade_completo' && (
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">Dificuldade</label>
                <div className="flex gap-2">
                  {['Todos', 'fácil', 'médio', 'difícil'].map((d) => (
                    <button
                      key={d}
                      onClick={() => setLocalDifficulty(d)}
                      className={`px-4 py-2 rounded-lg text-xs font-medium border transition-all capitalize ${
                        localDifficulty === d
                          ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                          : 'bg-[#1e293b] border-[#1e293b] text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Count selector (for non-fixed modes) */}
            {selectedMode && selectedMode !== 'diagnostico' && selectedMode !== 'enade_completo' && (
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">
                  Número de questões: <span className="text-cyan-400 font-mono">{localCount}</span>
                </label>
                <div className="flex gap-2">
                  {[5, 10, 15, 20].map((n) => (
                    <button
                      key={n}
                      onClick={() => setLocalCount(n)}
                      className={`px-4 py-2 rounded-lg text-xs font-medium border transition-all font-mono ${
                        localCount === n
                          ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                          : 'bg-[#1e293b] border-[#1e293b] text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Essay notice */}
            {selectedMode && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-cyan-500/5 border border-cyan-500/10 text-xs text-cyan-400/70">
                <PenLine size={14} className="flex-shrink-0" />
                <span>Após as questões objetivas, haverá 2 questões dissertativas corrigidas por IA.</span>
              </div>
            )}

            {/* Start button */}
            <motion.button
              onClick={handleStart}
              disabled={!selectedMode}
              whileHover={selectedMode ? { scale: 1.02 } : {}}
              whileTap={selectedMode ? { scale: 0.98 } : {}}
              className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
                selectedMode
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400 hover:from-cyan-500/30 hover:to-blue-500/30'
                  : 'bg-[#1e293b] border border-[#1e293b] text-slate-600 cursor-not-allowed'
              }`}
            >
              Iniciar Simulado
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  // RESULTS SCREEN
  if (quizCompleted) {
    const score = getScore();
    const percentage = getPercentage();
    const timeTaken = quizEndTime && quizStartTime ? quizEndTime - quizStartTime : 0;

    return (
      <div className="flex flex-col h-full overflow-y-auto">
        <div className="p-6 border-b border-[#1e293b] bg-[#0d1321]/50 backdrop-blur-sm">
          <h2 className="text-lg font-semibold jarvis-gradient">Resultado do Simulado</h2>
        </div>
        <div className="flex-1 p-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto space-y-6"
          >
            {/* Score card */}
            <div className="jarvis-card p-8 text-center">
              <Trophy className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
              <div className="text-5xl font-bold font-mono jarvis-gradient mb-2">
                {percentage}%
              </div>
              <p className="text-slate-400 text-sm">
                {score} de {quizQuestions.length} questões corretas
              </p>
              <div className="flex items-center justify-center gap-6 mt-4 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <Clock size={14} /> {formatTime(timeTaken)}
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle size={14} className="text-emerald-500" /> {score} corretas
                </span>
                <span className="flex items-center gap-1">
                  <XCircle size={14} className="text-red-500" /> {quizQuestions.length - score} erradas
                </span>
              </div>
              {selectedMode && (
                <div className="mt-4">
                  <span
                    className="text-xs px-3 py-1 rounded-full font-medium"
                    style={{
                      backgroundColor: '#00f0ff' + '15',
                      color: '#00f0ff',
                      border: `1px solid ${'#00f0ff'}30`,
                    }}
                  >
                    {currentTypeConfig?.label}
                  </span>
                </div>
              )}
            </div>

            {/* Review questions */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-300">Revisão das Questões</h3>
              {quizQuestions.map((q, idx) => {
                const userAnswer = quizAnswers[q.id];
                const isCorrect = userAnswer === q.correctAnswer;
                const wasMarked = markedForReview.has(q.id);
                return (
                  <motion.div
                    key={q.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="jarvis-card p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`flex-shrink-0 mt-0.5 ${isCorrect ? 'text-emerald-500' : 'text-red-500'}`}>
                        {isCorrect ? <CheckCircle size={18} /> : <XCircle size={18} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-500 mb-1">
                          Q{idx + 1} • {q.topic} • {q.element} • {q.difficulty}
                          {wasMarked && <span className="ml-2 text-yellow-500">⭐ Marcada para revisão</span>}
                        </p>
                        <p className="text-sm text-slate-300 line-clamp-2 mb-2">{q.statement}</p>
                        <div className="flex items-center gap-2 text-xs">
                          <span className={isCorrect ? 'text-emerald-400' : 'text-red-400'}>
                            Sua resposta: {userAnswer || '—'}
                          </span>
                          {!isCorrect && (
                            <span className="text-emerald-400">Correta: {q.correctAnswer}</span>
                          )}
                        </div>
                        {!isCorrect && <p className="text-xs text-slate-500 mt-2">{q.explanation}</p>}
                        <button
                          onClick={() => askEnadIA(q)}
                          className="text-xs text-cyan-400/60 hover:text-cyan-400 mt-2 flex items-center gap-1 transition-colors"
                        >
                          Perguntar à EnadIA <ChevronRight size={12} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* ───────────────────────────────────────────────────────────────────
                ESSAY (DISSERTATIVA) QUESTIONS SECTION
            ─────────────────────────────────────────────────────────────────── */}
            {essayQuestions.length > 0 && (
              <div className="space-y-4">
                {/* Section header */}
                <div className="flex items-center gap-3 pt-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-cyan-500/10">
                    <FileText size={16} className="text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-200">Questões Dissertativas</h3>
                    <p className="text-[10px] text-slate-500">Escreva sua resposta e envie para correção por IA</p>
                  </div>
                </div>

                {essayQuestions.map((eq, idx) => {
                  const answer = essayAnswers[eq.id] || '';
                  const feedback = essayFeedbacks[eq.id];
                  const isLoading = essayLoading[eq.id] || false;
                  const hasSubmitted = !!feedback;
                  const charCount = answer.length;
                  const minChars = 20;

                  return (
                    <motion.div
                      key={eq.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + idx * 0.1 }}
                      className="jarvis-card p-6 space-y-4"
                    >
                      {/* Question header */}
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                          Dissertativa {idx + 1}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {eq.topic} • {eq.macroarea}
                        </span>
                      </div>

                      {/* Question statement */}
                      <div className="space-y-2">
                        {eq.statement.includes('CONTEXTO') && (
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-cyan-400/60 mb-1">
                              Contexto
                            </p>
                            <p className="text-sm leading-relaxed text-slate-400 italic whitespace-pre-line">
                              {eq.statement.split('COMANDO')[0]?.replace('CONTEXTO', '').trim()}
                            </p>
                          </div>
                        )}
                        {eq.statement.includes('COMANDO') ? (
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-cyan-400/60 mb-1">
                              Comando
                            </p>
                            <p className="text-sm leading-relaxed text-slate-200 font-medium whitespace-pre-line">
                              {eq.statement.split('COMANDO')[1]?.trim()}
                            </p>
                          </div>
                        ) : (
                          <p className="text-sm leading-relaxed text-slate-200 whitespace-pre-line">
                            {eq.statement}
                          </p>
                        )}
                      </div>

                      {/* Textarea for answer */}
                      {!hasSubmitted && (
                        <div className="space-y-2">
                          <textarea
                            value={answer}
                            onChange={(e) =>
                              setEssayAnswers((prev) => ({
                                ...prev,
                                [eq.id]: e.target.value,
                              }))
                            }
                            placeholder="Escreva sua resposta aqui... (mínimo 20 caracteres)"
                            rows={6}
                            className="w-full bg-[#0a0e17] border border-cyan-500/20 rounded-xl text-sm text-white placeholder-slate-600 p-4 resize-y focus:outline-none focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                          />
                          <div className="flex items-center justify-between">
                            <span className={`text-[10px] font-mono ${
                              charCount >= minChars ? 'text-slate-500' : 'text-red-400/70'
                            }`}>
                              {charCount} / mín. {minChars} caracteres
                            </span>
                            <motion.button
                              onClick={() => handleEssaySubmit(eq)}
                              disabled={isLoading || charCount < minChars}
                              whileHover={!isLoading && charCount >= minChars ? { scale: 1.03 } : {}}
                              whileTap={!isLoading && charCount >= minChars ? { scale: 0.97 } : {}}
                              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                                isLoading || charCount < minChars
                                  ? 'bg-[#1e293b] border border-[#1e293b] text-slate-600 cursor-not-allowed'
                                  : 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400 hover:from-cyan-500/30 hover:to-blue-500/30'
                              }`}
                            >
                              {isLoading ? (
                                <>
                                  <Loader2 size={14} className="animate-spin" />
                                  Corrigindo...
                                </>
                              ) : (
                                <>
                                  <Send size={14} />
                                  Enviar para Correção
                                </>
                              )}
                            </motion.button>
                          </div>
                        </div>
                      )}

                      {/* Loading overlay */}
                      <AnimatePresence>
                        {isLoading && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center py-6 gap-3"
                          >
                            <div className="relative">
                              <div className="w-16 h-16 rounded-full border-2 border-cyan-500/20 flex items-center justify-center">
                                <Loader2 size={28} className="animate-spin text-cyan-400" />
                              </div>
                            </div>
                            <p className="text-xs text-slate-400">Analisando sua resposta com IA...</p>
                            <p className="text-[10px] text-slate-600">Isso pode levar alguns segundos</p>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Feedback display */}
                      <AnimatePresence>
                        {hasSubmitted && feedback && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4"
                          >
                            {/* Score card */}
                            <div className={`flex items-center gap-4 p-4 rounded-xl border ${getScoreBg(feedback.score)}`}>
                              <div className="text-center">
                                <div className={`text-4xl font-bold font-mono ${getScoreColor(feedback.score)}`}>
                                  {feedback.score.toFixed(1)}
                                </div>
                                <p className="text-[10px] text-slate-500 mt-1">de 10.0</p>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-mono text-cyan-400/60 uppercase tracking-wider mb-1">
                                  Feedback da IA
                                </p>
                                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                                  {feedback.feedback}
                                </p>
                              </div>
                            </div>

                            {/* Strengths & Weaknesses side by side */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {/* Strengths */}
                              {feedback.strengths.length > 0 && (
                                <div className="jarvis-card p-4 border-l-2 border-l-emerald-500">
                                  <p className="text-xs font-mono uppercase tracking-wider text-emerald-400/70 mb-2 flex items-center gap-1.5">
                                    <CheckSquare size={12} /> Pontos Fortes
                                  </p>
                                  <ul className="space-y-1.5">
                                    {feedback.strengths.map((s, i) => (
                                      <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                                        <CheckCircle size={12} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                                        <span>{s}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* Weaknesses */}
                              {feedback.weaknesses.length > 0 && (
                                <div className="jarvis-card p-4 border-l-2 border-l-red-500">
                                  <p className="text-xs font-mono uppercase tracking-wider text-red-400/70 mb-2 flex items-center gap-1.5">
                                    <XSquare size={12} /> Pontos a Melhorar
                                  </p>
                                  <ul className="space-y-1.5">
                                    {feedback.weaknesses.map((w, i) => (
                                      <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                                        <XCircle size={12} className="text-red-500 flex-shrink-0 mt-0.5" />
                                        <span>{w}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>

                            {/* Suggestions */}
                            {feedback.suggestions && (
                              <div className="jarvis-card p-4 border-l-2 border-l-cyan-500">
                                <p className="text-xs font-mono uppercase tracking-wider text-cyan-400/70 mb-2 flex items-center gap-1.5">
                                  <Lightbulb size={12} /> Sugestões
                                </p>
                                <p className="text-sm text-slate-300 leading-relaxed">
                                  {feedback.suggestions}
                                </p>
                              </div>
                            )}

                            {/* Your answer summary */}
                            <div className="jarvis-card p-4">
                              <p className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-2">
                                Sua Resposta
                              </p>
                              <p className="text-xs text-slate-400 leading-relaxed whitespace-pre-line max-h-40 overflow-y-auto custom-scrollbar">
                                {answer}
                              </p>
                            </div>

                            {/* Retry button */}
                            <button
                              onClick={() => {
                                setEssayFeedbacks((prev) => {
                                  const next = { ...prev };
                                  delete next[eq.id];
                                  return next;
                                });
                              }}
                              className="text-xs text-cyan-400/50 hover:text-cyan-400 flex items-center gap-1.5 transition-colors"
                            >
                              <RotateCcw size={12} /> Reescrever resposta
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <motion.button
                onClick={() => {
                  resetQuiz();
                  setSelectedMode(null);
                  setEssayQuestions([]);
                  setEssayAnswers({});
                  setEssayFeedbacks({});
                  setEssayLoading({});
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-3 rounded-xl bg-[#1e293b] border border-[#1e293b] text-slate-300 font-medium text-sm hover:border-slate-600 transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw size={16} /> Novo Simulado
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // QUIZ SCREEN
  if (!currentQuestion) return null;
  const userAnswer = quizAnswers[currentQuestion.id];
  const isAnswered = !!userAnswer;
  const isCorrect = userAnswer === currentQuestion.correctAnswer;
  const isMarked = markedForReview.has(currentQuestion.id);

  return (
    <div className="flex flex-col h-full">
      {/* Header with progress and timer */}
      <div className="p-4 border-b border-[#1e293b] bg-[#0d1321]/50 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 font-mono">
              Questão {currentQuestionIndex + 1} de {quizQuestions.length}
            </span>
            {selectedMode && (
              <span
                className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                style={{
                  backgroundColor: '#00f0ff' + '15',
                  color: '#00f0ff',
                  border: `1px solid ${'#00f0ff'}30`,
                }}
              >
                {currentTypeConfig?.label}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {/* Timer */}
            {timeRemaining !== null && (
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1e293b] border ${
                timeRemaining <= 300 ? 'border-red-500/50' : timeRemaining <= 600 ? 'border-yellow-500/30' : 'border-cyan-500/20'
              }`}>
                <Clock size={14} className={getTimerColor()} />
                <span className={`text-xs font-mono font-bold ${getTimerColor()}`}>
                  {formatTimerDisplay(timeRemaining)}
                </span>
                {timeRemaining <= 300 && (
                  <AlertTriangle size={12} className="text-red-400" />
                )}
              </div>
            )}
            {/* Status badges */}
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-500 border border-slate-700">
              {currentQuestion.macroarea}
            </span>
            <span className="text-xs px-2 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              {currentQuestion.difficulty}
            </span>
          </div>
        </div>
        <div className="w-full h-1.5 bg-[#1e293b] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
            animate={{
              width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%`,
            }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 overflow-y-auto p-6">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="max-w-2xl mx-auto space-y-6"
        >
          {/* Question topic & element */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
              <span>{currentQuestion.topic}</span>
              <span>•</span>
              <span className="text-cyan-500/70">{currentQuestion.element}</span>
            </div>
            <button
              onClick={() => toggleMarkForReview(currentQuestion.id)}
              className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg transition-all ${
                isMarked
                  ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                  : 'text-slate-500 hover:text-yellow-400 border border-transparent hover:border-yellow-500/10'
              }`}
            >
              <BookmarkCheck size={12} />
              {isMarked ? 'Marcada' : 'Marcar'}
            </button>
          </div>

          {/* ENADE-style question display */}
          <div className="jarvis-card p-6">
            {/* CONTEXTO section */}
            {currentQuestion.statement.includes('CONTEXTO') && (
              <div className="mb-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-cyan-400/60 mb-2">
                  Contexto
                </p>
                <p className="text-sm leading-relaxed text-slate-400 italic">
                  {currentQuestion.statement.split('COMANDO')[0]?.replace('CONTEXTO', '').trim()}
                </p>
              </div>
            )}

            {/* COMANDO section */}
            {currentQuestion.statement.includes('COMANDO') ? (
              <p className="text-sm leading-relaxed text-slate-200 font-medium whitespace-pre-line">
                {currentQuestion.statement.split('COMANDO')[1]?.trim()}
              </p>
            ) : (
              <p className="text-sm leading-relaxed text-slate-200 whitespace-pre-line">
                {currentQuestion.statement}
              </p>
            )}
          </div>

          {/* Alternatives with letter badges */}
          <div className="space-y-2">
            {currentQuestion.alternatives.map((alt) => {
              const isSelected = userAnswer === alt.letter;
              const isCorrectOption = alt.letter === currentQuestion.correctAnswer;
              let borderClass = 'border-[#1e293b] hover:border-cyan-500/30 hover:bg-cyan-500/5';
              if (isAnswered) {
                if (isCorrectOption) {
                  borderClass = 'border-emerald-500/40 bg-emerald-500/5';
                } else if (isSelected && !isCorrectOption) {
                  borderClass = 'border-red-500/40 bg-red-500/5';
                } else {
                  borderClass = 'border-[#1e293b] opacity-50';
                }
              } else if (isSelected) {
                borderClass = 'border-cyan-500/40 bg-cyan-500/5';
              }

              return (
                <motion.button
                  key={alt.letter}
                  onClick={() => handleAnswer(alt.letter)}
                  disabled={isAnswered}
                  whileHover={!isAnswered ? { scale: 1.01 } : {}}
                  whileTap={!isAnswered ? { scale: 0.99 } : {}}
                  className={`w-full flex items-start gap-3 p-4 rounded-xl border text-left transition-all ${borderClass}`}
                >
                  <span
                    className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                      isAnswered && isCorrectOption
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : isAnswered && isSelected && !isCorrectOption
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-[#1e293b] text-slate-400'
                    }`}
                  >
                    {alt.letter}
                  </span>
                  <span className="text-sm text-slate-300 pt-0.5">{alt.text}</span>
                  {isAnswered && isCorrectOption && (
                    <CheckCircle size={16} className="flex-shrink-0 text-emerald-500 ml-auto mt-0.5" />
                  )}
                  {isAnswered && isSelected && !isCorrectOption && (
                    <XCircle size={16} className="flex-shrink-0 text-red-500 ml-auto mt-0.5" />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Explanation */}
          <AnimatePresence>
            {isAnswered && showExplanation === currentQuestion.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="jarvis-card p-4 border-l-2 border-l-cyan-500"
              >
                <p className="text-xs font-mono text-cyan-400 mb-2 uppercase tracking-wider">
                  Explicação
                </p>
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                  {currentQuestion.explanation}
                </p>
                <button
                  onClick={() => askEnadIA(currentQuestion)}
                  className="text-xs text-cyan-400/60 hover:text-cyan-400 mt-3 flex items-center gap-1 transition-colors"
                >
                  Perguntar mais detalhes à EnadIA <ChevronRight size={12} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Navigation */}
      <div className="p-4 border-t border-[#1e293b] bg-[#0d1321]/50 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <div className="flex gap-1 flex-wrap max-w-[60%]">
            {quizQuestions.map((q, idx) => {
              const isAnsweredQ = !!quizAnswers[q.id];
              const isCorrectQ = quizAnswers[q.id] === q.correctAnswer;
              const isMarkedQ = markedForReview.has(q.id);
              return (
                <button
                  key={idx}
                  onClick={() => {
                    goToQuestion(idx);
                    setShowExplanation(null);
                    setQuestionStartTime(Date.now());
                  }}
                  className={`w-3 h-3 rounded-full transition-all relative ${
                    idx === currentQuestionIndex
                      ? 'bg-cyan-400 ring-2 ring-cyan-400/30'
                      : isMarkedQ && !isAnsweredQ
                        ? 'bg-yellow-500'
                        : isAnsweredQ
                          ? isCorrectQ
                            ? 'bg-emerald-500/60'
                            : 'bg-red-500/60'
                          : 'bg-[#1e293b]'
                  }`}
                  title={`Q${idx + 1}${isMarkedQ ? ' (marcada)' : ''}`}
                />
              );
            })}
          </div>
          <div className="flex items-center gap-2">
            {/* Status indicators */}
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mr-2">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" /> {answeredCount}/{quizQuestions.length}
              </span>
              {markedCount > 0 && (
                <span className="flex items-center gap-1 text-yellow-500">
                  <BookmarkCheck size={10} /> {markedCount}
                </span>
              )}
            </div>
            {isAnswered && (
              <motion.button
                onClick={handleNext}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium hover:bg-cyan-500/20 transition-all"
              >
                {currentQuestionIndex >= quizQuestions.length - 1 ? 'Finalizar' : 'Próxima'}
                <ArrowRight size={16} />
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
