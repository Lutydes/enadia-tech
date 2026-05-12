// =============================================================================
// ENADE Full Question Bank - Unified Interface
// Consolidates questions from 3 batch files + original questions (~200+ questions)
// Covers all 15 microareas across 4 macroareas and 450+ ENADE elements
// =============================================================================

import { questionsBatch1 } from './questions_batch1';
import { questionsBatch2 } from './questions_batch2';
import { questionsBatch3 } from './questions_batch3';
import { enadeQuestions as originalQuestions } from './enade-questions';

// ---------------------------------------------------------------------------
// Unified interface for all questions
// ---------------------------------------------------------------------------
export interface EnadeQuestionFull {
  id: string;
  topic: string;           // Microarea name (e.g. "Lógica Proposicional")
  macroarea: string;       // Macroarea (e.g. "Fundamentos da Computação")
  element: string;         // Specific element (e.g. "Conectivos lógicos")
  difficulty: 'fácil' | 'médio' | 'difícil';
  statement: string;
  alternatives: { letter: string; text: string }[];
  correctAnswer: string;
  explanation: string;
  source: 'enade-oficial' | 'elaborada' | 'professor';
}

// ---------------------------------------------------------------------------
// Macroarea → Microarea mapping with metadata
// ---------------------------------------------------------------------------
export interface MicroareaInfo {
  name: string;
  macroarea: string;
  description: string;
  elements: string[];
}

export interface MacroareaInfo {
  name: string;
  color: string;
  description: string;
  microareas: string[];
}

export const MACROAREAS: MacroareaInfo[] = [
  {
    name: 'Fundamentos da Computação',
    color: '#3b82f6',
    description: 'Lógica, Matemática Discreta e fundamentos teóricos',
    microareas: ['Lógica Proposicional', 'Matemática Discreta'],
  },
  {
    name: 'Teoria da Computação',
    color: '#8b5cf6',
    description: 'Autômatos, linguagens formais e análise de algoritmos',
    microareas: ['Autômatos e Linguagens Formais'],
  },
  {
    name: 'Paradigmas de Programação',
    color: '#ec4899',
    description: 'Programação Orientada a Objetos e padrões de projeto',
    microareas: ['Programação Orientada a Objetos'],
  },
  {
    name: 'Algoritmos',
    color: '#f59e0b',
    description: 'Algoritmos, Estruturas de Dados e Complexidade',
    microareas: ['Algoritmos e Estruturas de Dados'],
  },
  {
    name: 'Desenvolvimento',
    color: '#10b981',
    description: 'Banco de Dados, Eng. Software, SO, Redes e Sistemas Distribuídos',
    microareas: [
      'Banco de Dados',
      'Engenharia de Software',
      'Sistemas Operacionais',
      'Redes',
      'Sistemas Distribuídos',
    ],
  },
  {
    name: 'Segurança/IA',
    color: '#ef4444',
    description: 'Criptografia, IA, Ciência de Dados, Ética e Legislação',
    microareas: [
      'Criptografia',
      'Inteligência Artificial',
      'Ciência de Dados',
      'Ética Profissional',
      'Legislação',
    ],
  },
];

// ---------------------------------------------------------------------------
// Convert original questions (old format) to unified format
// ---------------------------------------------------------------------------
function convertOriginalQuestion(q: (typeof originalQuestions)[number]): EnadeQuestionFull {
  const topicToMacroarea: Record<string, string> = {
    'Algoritmos e Estruturas de Dados': 'Algoritmos',
    'Banco de Dados': 'Desenvolvimento',
    'Programação Orientada a Objetos': 'Paradigmas de Programação',
    'Redes de Computadores': 'Desenvolvimento',
    'Sistemas Operacionais': 'Desenvolvimento',
    'Engenharia de Software': 'Desenvolvimento',
    'Arquitetura de Computadores': 'Teoria da Computação',
    'Compiladores': 'Teoria da Computação',
    'Sistemas Distribuídos': 'Desenvolvimento',
    'Inteligência Artificial': 'Segurança/IA',
    'Redes': 'Desenvolvimento',
  };

  // Normalize topic names to match batch file naming
  const topicNormalization: Record<string, string> = {
    'Redes de Computadores': 'Redes',
  };

  const normalizedTopic = topicNormalization[q.topic] || q.topic;

  return {
    id: q.id,
    topic: normalizedTopic,
    macroarea: topicToMacroarea[q.topic] || 'Desenvolvimento',
    element: q.subtopic || q.topic,
    difficulty: q.difficulty,
    statement: q.statement,
    alternatives: q.alternatives,
    correctAnswer: q.correctAnswer,
    explanation: q.explanation,
    source: 'professor',
  };
}

// ---------------------------------------------------------------------------
// Build the unified question bank
// ---------------------------------------------------------------------------

// Convert batch 1 questions (already in the right format, just add source)
const batch1Converted: EnadeQuestionFull[] = questionsBatch1.map((q) => ({
  id: q.id,
  topic: q.topic,
  macroarea: q.macroarea,
  element: q.element,
  difficulty: q.difficulty,
  statement: q.statement,
  alternatives: q.alternatives,
  correctAnswer: q.correctAnswer,
  explanation: q.explanation,
  source: 'enade-oficial' as const,
}));

// Convert batch 2 questions
const batch2Converted: EnadeQuestionFull[] = questionsBatch2.map((q) => ({
  id: q.id,
  topic: q.topic,
  macroarea: q.macroarea,
  element: q.element,
  difficulty: q.difficulty,
  statement: q.statement,
  alternatives: q.alternatives,
  correctAnswer: q.correctAnswer,
  explanation: q.explanation,
  source: 'enade-oficial' as const,
}));

// Convert batch 3 questions
const batch3Converted: EnadeQuestionFull[] = questionsBatch3.map((q) => ({
  id: q.id,
  topic: q.topic,
  macroarea: q.macroarea,
  element: q.element,
  difficulty: q.difficulty,
  statement: q.statement,
  alternatives: q.alternatives,
  correctAnswer: q.correctAnswer,
  explanation: q.explanation,
  source: 'enade-oficial' as const,
}));

// Convert original (legacy) questions
const originalConverted: EnadeQuestionFull[] = originalQuestions.map(convertOriginalQuestion);

// Combine all questions, deduplicating by id
const allQuestionsMap = new Map<string, EnadeQuestionFull>();
for (const q of [
  ...batch1Converted,
  ...batch2Converted,
  ...batch3Converted,
  ...originalConverted,
]) {
  // Prefer batch questions over original (they have more metadata)
  if (!allQuestionsMap.has(q.id)) {
    allQuestionsMap.set(q.id, q);
  }
}

export const allEnadeQuestions: EnadeQuestionFull[] = Array.from(allQuestionsMap.values());

// ---------------------------------------------------------------------------
// Helper Functions
// ---------------------------------------------------------------------------

/** Get all unique topic names (microareas) */
export const getFullTopics = (): string[] => {
  return [...new Set(allEnadeQuestions.map(q => q.topic))];
};

/** Get all unique macroarea names */
export const getMacroareas = (): string[] => {
  return [...new Set(allEnadeQuestions.map(q => q.macroarea))];
};

/** Get questions filtered by topic (microarea) */
export const getQuestionsByMicroarea = (topic: string): EnadeQuestionFull[] => {
  return allEnadeQuestions.filter(q => q.topic === topic);
};

/** Get questions filtered by element */
export const getQuestionsByElement = (element: string): EnadeQuestionFull[] => {
  return allEnadeQuestions.filter(q => q.element === element);
};

/** Get questions filtered by macroarea */
export const getQuestionsByMacroarea = (macroarea: string): EnadeQuestionFull[] => {
  return allEnadeQuestions.filter(q => q.macroarea === macroarea);
};

/** Get questions filtered by difficulty */
export const getQuestionsByDifficulty = (difficulty: 'fácil' | 'médio' | 'difícil'): EnadeQuestionFull[] => {
  return allEnadeQuestions.filter(q => q.difficulty === difficulty);
};

/** Get all unique elements for a given topic */
export const getElementsByMicroarea = (topic: string): string[] => {
  return [...new Set(allEnadeQuestions.filter(q => q.topic === topic).map(q => q.element))];
};

/** Get question count per microarea */
export const getQuestionCountByMicroarea = (): Record<string, number> => {
  const counts: Record<string, number> = {};
  for (const q of allEnadeQuestions) {
    counts[q.topic] = (counts[q.topic] || 0) + 1;
  }
  return counts;
};

/** Get question count per macroarea */
export const getQuestionCountByMacroarea = (): Record<string, number> => {
  const counts: Record<string, number> = {};
  for (const q of allEnadeQuestions) {
    counts[q.macroarea] = (counts[q.macroarea] || 0) + 1;
  }
  return counts;
};

/** Get random questions with optional topic and difficulty filters */
export const getRandomFullQuestions = (
  count: number,
  topic?: string,
  difficulty?: string
): EnadeQuestionFull[] => {
  let filtered = allEnadeQuestions;
  if (topic && topic !== 'Todos') {
    filtered = filtered.filter(q => q.topic === topic);
  }
  if (difficulty && difficulty !== 'Todos') {
    filtered = filtered.filter(q => q.difficulty === difficulty);
  }
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

/** Get microarea info with question counts */
export const getMicroareaStats = () => {
  const counts = getQuestionCountByMicroarea();
  const elements: Record<string, string[]> = {};

  for (const q of allEnadeQuestions) {
    if (!elements[q.topic]) elements[q.topic] = [];
    if (!elements[q.topic].includes(q.element)) {
      elements[q.topic].push(q.element);
    }
  }

  const stats: Array<{
    name: string;
    macroarea: string;
    questionCount: number;
    elements: string[];
  }> = [];

  for (const [name, count] of Object.entries(counts)) {
    const firstQ = allEnadeQuestions.find(q => q.topic === name);
    stats.push({
      name,
      macroarea: firstQ?.macroarea || '',
      questionCount: count,
      elements: elements[name] || [],
    });
  }

  return stats;
};
