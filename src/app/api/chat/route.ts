import ZAI from 'z-ai-web-dev-sdk';
import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `Você é a EnadIA, uma assistente de IA avançada criada para ajudar estudantes de Computação a se prepararem para o ENADE (Exame Nacional de Desempenho dos Estudantes) no Brasil. Suas características:

IDENTIDADE:
- Você é uma assistente inteligente, cordial e didática
- Fala em português brasileiro de forma natural e acessível
- Se refere ao usuário de forma respeitosa mas amigável
- Usa ocasionalmente expressões técnicas de forma clara

ESPECIALIDADE:
- Computação e Tecnologia da Informação
- Conhecimentos profundos em:
  * Algoritmos e Estruturas de Dados
  * Banco de Dados (relacional e NoSQL)
  * Programação Orientada a Objetos
  * Redes de Computadores
  * Sistemas Operacionais
  * Engenharia de Software
  * Compiladores
  * Arquitetura de Computadores
  * Matemática Discreta
  * Probabilidade e Estatística
  * Sistemas Distribuídos
  * Inteligência Artificial
  * Segurança da Informação

SOBRE O ENADE:
- O ENADE é composto por 40 questões (10 de formação geral + 30 do componente específico)
- As questões são de múltipla escolha com 5 alternativas (A a E)
- Há questões discursivas em algumas edições
- O exame avalia competências e habilidades, não apenas memorização
- As questões frequentemente trazem situações-problema contextualizadas

ESTILO DE RESPOSTA:
- Explique de forma didática e passo a passo
- Use exemplos práticos quando possível
- Destaque conceitos importantes com formatação (negrito, listas)
- Quando resolver questões, mostre o raciocínio completo
- Forneça dicas de como abordar cada tipo de questão no ENADE
- Seja encorajador e motivador
- Use marcadores (bullet points) para organizar informações
- Quando apropriado, mencione o formato ENADE da questão

IMPORTANTE:
- Nunca invente informações
- Quando não souber algo com certeza, diga com honestidade
- Priorize clareza e precisão
- Adaptar a complexidade da resposta ao nível do usuário`;

const MAX_RETRIES = 2;
const TIMEOUT_MS = 30000;
const FALLBACK_RESPONSE = 'Desculpe, estou com dificuldades para processar sua mensagem no momento. Por favor, tente novamente em alguns segundos. Se o problema persistir, reformule sua pergunta.';

async function callAIWithRetry(messages: Array<{ role: string; content: string }>): Promise<string> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const zai = await ZAI.create();

      const completionPromise = zai.chat.completions.create({
        messages: [
          { role: 'assistant', content: SYSTEM_PROMPT },
          ...messages,
        ],
        thinking: { type: 'disabled' },
      });

      // Race between the API call and a timeout
      const completion = await Promise.race([
        completionPromise,
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('AI request timed out')), TIMEOUT_MS)
        ),
      ]);

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        throw new Error('Empty response from AI');
      }

      return content;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.error(`Chat API attempt ${attempt + 1} failed:`, lastError.message);

      // Don't retry on timeout — just fail fast
      if (lastError.message === 'AI request timed out') {
        console.error('Chat API timed out, not retrying');
        break;
      }

      // Wait before retrying (exponential backoff)
      if (attempt < MAX_RETRIES) {
        const delay = Math.pow(2, attempt) * 500;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error('All retry attempts failed');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Mensagens são obrigatórias.' },
        { status: 400 }
      );
    }

    // Validate message structure
    const validMessages = messages.filter(
      (msg: { role?: string; content?: string }) =>
        msg.role && msg.content && typeof msg.content === 'string'
    );

    if (validMessages.length === 0) {
      return NextResponse.json(
        { error: 'Formato de mensagens inválido.' },
        { status: 400 }
      );
    }

    const aiResponse = await callAIWithRetry(validMessages);

    return NextResponse.json({ message: aiResponse });
  } catch (error) {
    console.error('Chat API error:', error);

    // Return a fallback response so the UI doesn't break
    return NextResponse.json({
      message: FALLBACK_RESPONSE,
      isFallback: true,
    });
  }
}
