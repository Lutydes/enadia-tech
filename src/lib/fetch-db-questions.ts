import { EnadeQuestionFull, registerDbQuestions } from './enade-full-bank';

interface ApiAlternative {
  letter: string;
  text: string;
}

interface ApiQuestion {
  id: string;
  statement: string;
  correctAnswer: string;
  explanation: string | null;
  difficulty: string;
  source: string;
  microarea: { name: string; macroarea: string } | null;
  element: { name: string } | null;
  alternatives: ApiAlternative[];
}

function toFullQuestion(q: ApiQuestion): EnadeQuestionFull | null {
  if (!q.microarea || !q.alternatives?.length) return null;
  return {
    id: q.id,
    topic: q.microarea.name,
    macroarea: q.microarea.macroarea,
    element: q.element?.name || '',
    difficulty: (q.difficulty as EnadeQuestionFull['difficulty']) || 'médio',
    statement: q.statement,
    alternatives: q.alternatives.map((a) => ({ letter: a.letter, text: a.text })),
    correctAnswer: q.correctAnswer,
    explanation: q.explanation || '',
    source: 'elaborada',
  };
}

/** Fetches all active DB-backed questions and merges them into the shared question bank. */
export async function loadDbQuestionsIntoBank(token: string): Promise<void> {
  try {
    const res = await fetch('/api/questions?status=ATIVA&limit=2000', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return;
    const data = await res.json();
    const questions: ApiQuestion[] = data.questions || [];
    const mapped = questions
      .map(toFullQuestion)
      .filter((q): q is EnadeQuestionFull => q !== null);
    registerDbQuestions(mapped);
  } catch {
    // Best effort — if this fails, the static bank still works on its own.
  }
}
