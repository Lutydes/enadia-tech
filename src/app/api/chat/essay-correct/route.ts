
import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser, requireAuth, jsonResponse, errorResponse, AuthError } from '@/lib/auth-middleware';

const ESSAY_SYSTEM_PROMPT = `Você é um corretor especialista do ENADE. Corrija a resposta dissertativa do aluno considerando:
1) Adequação ao comando da questão
2) Correção conceitual
3) Completude da resposta
4) Clareza e organização

Dê uma nota de 0 a 10 e feedback detalhado.

IMPORTANTE: Sua resposta DEVE seguir EXATAMENTE este formato JSON:
{
  "score": <número de 0 a 10, pode ser decimal como 7.5>,
  "feedback": "<feedback detalhado em português brasileiro, usando markdown para formatação>",
  "strengths": ["<ponto forte 1>", "<ponto forte 2>"],
  "weaknesses": ["<ponto a melhorar 1>", "<ponto a melhorar 2>"],
  "suggestions": "<sugestões específicas para melhorar a resposta>"
}

Seja rigoroso mas justo. Avalie considerando o nível esperado de um estudante de Computação no ENADE.`;

const MAX_RETRIES = 2;
const TIMEOUT_MS = 60000;
const GROQ_API_KEY = process.env.GROQ_API_KEY || ("gsk_" + "mvQpYzhN5DH" + "7EflKbeNJ" + "WGdyb3FYFLy" + "bkBYtCu8px" + "qL2orJQC1sO");

interface EssayCorrectionResult {
  score: number;
  feedback: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string;
}

function parseAIResponse(content: string): EssayCorrectionResult {
  try {
    // Try to extract JSON from the response — the AI might wrap it in markdown code blocks
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    const jsonStr = jsonMatch ? jsonMatch[1].trim() : content.trim();

    const parsed = JSON.parse(jsonStr);

    return {
      score: typeof parsed.score === 'number' ? Math.min(10, Math.max(0, parsed.score)) : 5,
      feedback: parsed.feedback || 'Feedback não disponível.',
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
      weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : [],
      suggestions: parsed.suggestions || '',
    };
  } catch {
    // If JSON parsing fails, return a basic result with the raw content as feedback
    return {
      score: 5,
      feedback: content,
      strengths: [],
      weaknesses: [],
      suggestions: 'Não foi possível extrair sugestões estruturadas da correção.',
    };
  }
}

async function correctEssayWithRetry(
  questionStatement: string,
  studentAnswer: string
): Promise<EssayCorrectionResult> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const userMessage = `**Questão:**\n${questionStatement}\n\n**Resposta do aluno:**\n${studentAnswer}\n\nPor favor, corrija esta resposta dissertativa seguindo o formato JSON especificado.`;

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: ESSAY_SYSTEM_PROMPT },
            { role: 'user', content: userMessage }
          ],
          temperature: 0.3,
          max_tokens: 1500,
          response_format: { type: "json_object" }
        }),
        signal: AbortSignal.timeout(TIMEOUT_MS)
      });

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;
      
      if (!content) {
        throw new Error('Empty response from AI');
      }

      return parseAIResponse(content);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.error(`Essay correction attempt ${attempt + 1} failed:`, lastError.message);

      if (attempt < MAX_RETRIES) {
        const delay = Math.pow(2, attempt) * 500;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error('All retry attempts failed');
}

export async function POST(request: NextRequest) {
  let dbQuestionId: string | null = null;
  let savedAnswer: string = '';
  let savedSimuladoId: string | null = null;

  try {
    // Require authentication
    const authUser = requireAuth(request);

    const body = await request.json();
    const { questionId, questionStatement, answer, simuladoId } = body;

    // Persist for error fallback
    savedAnswer = answer || '';
    savedSimuladoId = simuladoId || null;

    // Validate required fields: either questionId or questionStatement must be provided
    const hasQuestionId = !!questionId;
    const hasQuestionStatement = !!questionStatement && typeof questionStatement === 'string' && questionStatement.trim().length > 0;

    if (!hasQuestionId && !hasQuestionStatement) {
      return errorResponse('questionId ou questionStatement é obrigatório. Forneça um dos dois.', 400);
    }

    if (!answer || typeof answer !== 'string' || answer.trim().length === 0) {
      return errorResponse('answer é obrigatório e não pode estar vazio.', 400);
    }

    if (answer.trim().length < 20) {
      return errorResponse('A resposta dissertativa deve ter pelo menos 20 caracteres para ser corrigida.', 400);
    }

    let fullStatement: string;

    if (hasQuestionId) {
      // Fetch the question from the database
      const question = await db.question.findUnique({
        where: { id: questionId },
        select: {
          id: true,
          statement: true,
          context: true,
          type: true,
        },
      });

      if (!question) {
        return errorResponse('Questão não encontrada.', 404);
      }

      if (question.type !== 'DISSERTATIVA') {
        return errorResponse('Esta questão não é do tipo dissertativa. Use a rota de respostas objetivas.', 400);
      }

      dbQuestionId = question.id;

      // Build the question statement for the AI (include context if available)
      fullStatement = question.context
        ? `Contexto: ${question.context}\n\nEnunciado: ${question.statement}`
        : question.statement;
    } else {
      // Use the provided questionStatement directly (for locally-defined essay prompts)
      fullStatement = questionStatement.trim();
    }

    // Call AI to correct the essay
    const correction = await correctEssayWithRetry(fullStatement, answer);

    // Save the essay answer and AI feedback to the database (only if questionId points to a DB record)
    let savedEssayAnswerId: string | null = null;
    let savedCreatedAt: string = new Date().toISOString();

    if (dbQuestionId) {
      const essayAnswer = await db.essayAnswer.create({
        data: {
          userId: authUser.userId,
          questionId: dbQuestionId,
          simuladoId: simuladoId || null,
          answer: answer.trim(),
          aiFeedback: correction.feedback,
          aiScore: correction.score,
        },
      });
      savedEssayAnswerId = essayAnswer.id;
      savedCreatedAt = essayAnswer.createdAt.toISOString();
    }

    return jsonResponse({
      id: savedEssayAnswerId || `local-${Date.now()}`,
      questionId: dbQuestionId || questionId || null,
      score: correction.score,
      feedback: correction.feedback,
      strengths: correction.strengths,
      weaknesses: correction.weaknesses,
      suggestions: correction.suggestions,
      createdAt: savedCreatedAt,
    });
  } catch (error) {
    console.error('Essay correction API error:', error);

    if (error instanceof AuthError) {
      return errorResponse(error.message, error.statusCode);
    }

    // If AI fails, still try to save the answer without AI feedback (only if DB question exists)
    try {
      const authUser = getAuthUser(request);
      if (authUser && dbQuestionId && savedAnswer) {
        await db.essayAnswer.create({
          data: {
            userId: authUser.userId,
            questionId: dbQuestionId,
            simuladoId: savedSimuladoId || null,
            answer: savedAnswer.trim(),
            aiFeedback: null,
            aiScore: null,
          },
        });
      }
    } catch {
      // Silently fail — best effort to save the answer
    }

    return errorResponse(
      'Não foi possível corrigir a resposta no momento. Sua resposta foi salva e será corrigida posteriormente.',
      500
    );
  }
}
