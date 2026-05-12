import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { EnadeQuestionFull, getRandomFullQuestions } from '@/lib/enade-full-bank';
// Keep backward-compatible type alias
export type EnadeQuestion = EnadeQuestionFull;

export type ViewType = 'chat' | 'simulado' | 'revisao' | 'dashboard' | 'dicas' | 'ranking';

export type UserRole = 'MASTER' | 'PROFESSOR' | 'ALUNO';
export type PanelType = 'student' | 'master' | 'professor';

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  ra?: string;
  curso?: string;
  periodo?: number;
  modalidade?: string;
  disciplina?: string;
}

interface AppState {
  // Auth state
  user: UserData | null;
  token: string | null;
  isLoading: boolean;
  currentPanel: PanelType;

  // View navigation
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Quiz state
  quizQuestions: EnadeQuestionFull[];
  currentQuestionIndex: number;
  quizAnswers: Record<string, string>;
  quizCompleted: boolean;
  quizStartTime: number | null;
  quizEndTime: number | null;
  selectedTopic: string;
  selectedDifficulty: string;
  selectedCount: number;

  // Stats
  totalAnswered: number;
  totalCorrect: number;
  topicStats: Record<string, { answered: number; correct: number }>;
  quizHistory: Array<{
    id: string;
    date: string;
    score: number;
    total: number;
    topic: string;
    time: number;
  }>;

  // Chat
  chatPreFilledQuestion: string | null;
  setChatPreFilledQuestion: (question: string | null) => void;

  // Auth methods
  login: (user: UserData, token: string) => void;
  logout: () => void;
  setPanel: (panel: PanelType) => void;
  restoreSession: () => Promise<void>;

  // Methods for quiz
  startQuiz: (topic?: string, difficulty?: string, count?: number) => void;
  answerQuestion: (questionId: string, answer: string) => void;
  nextQuestion: () => void;
  finishQuiz: () => void;
  resetQuiz: () => void;
  goToQuestion: (index: number) => void;

  // Methods for stats
  updateStats: (question: EnadeQuestionFull, isCorrect: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Auth state
      user: null,
      token: null,
      isLoading: true,
      currentPanel: 'student',

      // View navigation
      currentView: 'chat',
      setCurrentView: (view) => set({ currentView: view }),
      sidebarOpen: true,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      // Quiz state
      quizQuestions: [],
      currentQuestionIndex: 0,
      quizAnswers: {},
      quizCompleted: false,
      quizStartTime: null,
      quizEndTime: null,
      selectedTopic: 'Todos',
      selectedDifficulty: 'Todos',
      selectedCount: 10,

      // Stats
      totalAnswered: 0,
      totalCorrect: 0,
      topicStats: {},
      quizHistory: [],

      // Chat
      chatPreFilledQuestion: null,
      setChatPreFilledQuestion: (question) => set({ chatPreFilledQuestion: question }),

      // Auth methods
      login: (user, token) => {
        set({ user, token, isLoading: false });
        if (typeof window !== 'undefined') {
          localStorage.setItem('enadia-token', token);
        }
      },
      logout: () => {
        set({ user: null, token: null, isLoading: false, currentPanel: 'student' });
        if (typeof window !== 'undefined') {
          localStorage.removeItem('enadia-token');
        }
      },
      setPanel: (panel) => set({ currentPanel: panel }),
      restoreSession: async () => {
        if (typeof window === 'undefined') {
          set({ isLoading: false });
          return;
        }
        const token = localStorage.getItem('enadia-token');
        if (token) {
          try {
            const res = await fetch('/api/auth/me', {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
              const data = await res.json();
              const user = data.user || data; // API returns { user: {...} }
              // Auto-set panel based on role
              // By default, everyone starts in student panel, and can use the sidebar button to access master/professor panels
              const panel = 'student';
              set({ user, token, isLoading: false, currentPanel: panel });
            } else {
              // Token invalid or expired — clear it
              localStorage.removeItem('enadia-token');
              set({ user: null, token: null, isLoading: false, currentPanel: 'student' });
            }
          } catch {
            localStorage.removeItem('enadia-token');
            set({ user: null, token: null, isLoading: false, currentPanel: 'student' });
          }
        } else {
          set({ isLoading: false, currentPanel: 'student' });
        }
      },

      // Methods for quiz
      startQuiz: (topic, difficulty, count) => {
        const questions = getRandomFullQuestions(
          count || get().selectedCount,
          topic || get().selectedTopic,
          difficulty || get().selectedDifficulty
        );
        set({
          quizQuestions: questions,
          currentQuestionIndex: 0,
          quizAnswers: {},
          quizCompleted: false,
          quizStartTime: Date.now(),
          quizEndTime: null,
          selectedTopic: topic || get().selectedTopic,
          selectedDifficulty: difficulty || get().selectedDifficulty,
          selectedCount: count || get().selectedCount,
        });
      },

      answerQuestion: (questionId, answer) => {
        set((state) => ({
          quizAnswers: { ...state.quizAnswers, [questionId]: answer },
        }));
      },

      nextQuestion: () => {
        set((state) => {
          const nextIndex = state.currentQuestionIndex + 1;
          if (nextIndex >= state.quizQuestions.length) {
            return { currentQuestionIndex: nextIndex };
          }
          return { currentQuestionIndex: nextIndex };
        });
      },

      finishQuiz: () => {
        const state = get();
        const endTime = Date.now();

        let correct = 0;
        state.quizQuestions.forEach((q) => {
          const answer = state.quizAnswers[q.id];
          const isCorrect = answer === q.correctAnswer;
          if (isCorrect) correct++;
          state.updateStats(q, isCorrect);
        });

        const timeTaken = endTime - (state.quizStartTime || endTime);

        const newHistoryEntry = {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          score: correct,
          total: state.quizQuestions.length,
          topic: state.selectedTopic,
          time: timeTaken,
        };

        set({
          quizCompleted: true,
          quizEndTime: endTime,
          quizHistory: [newHistoryEntry, ...state.quizHistory],
        });
      },

      resetQuiz: () => {
        set({
          quizQuestions: [],
          currentQuestionIndex: 0,
          quizAnswers: {},
          quizCompleted: false,
          quizStartTime: null,
          quizEndTime: null,
        });
      },

      goToQuestion: (index) => {
        set({ currentQuestionIndex: index });
      },

      // Methods for stats
      updateStats: (question, isCorrect) => {
        set((state) => {
          const topic = question.topic;
          const currentTopicStats = state.topicStats[topic] || { answered: 0, correct: 0 };

          return {
            totalAnswered: state.totalAnswered + 1,
            totalCorrect: state.totalCorrect + (isCorrect ? 1 : 0),
            topicStats: {
              ...state.topicStats,
              [topic]: {
                answered: currentTopicStats.answered + 1,
                correct: currentTopicStats.correct + (isCorrect ? 1 : 0),
              },
            },
          };
        });
      },
    }),
    {
      name: 'jarvis-enade-store',
      partialize: (state) => ({
        totalAnswered: state.totalAnswered,
        totalCorrect: state.totalCorrect,
        topicStats: state.topicStats,
        quizHistory: state.quizHistory,
        currentView: state.currentView,
        // currentPanel is NOT persisted — it's derived from user.role on session restore
      }),
    }
  )
);
