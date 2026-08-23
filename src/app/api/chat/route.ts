import { NextRequest, NextResponse } from 'next/server';
import { groqChatCompletion } from '@/lib/groq';

// =============================================================================
// Chat API using z-ai-web-dev-sdk
// =============================================================================

const SYSTEM_PROMPT = `Você é a **EnadIA**, uma assistente de IA avançada criada para ajudar estudantes de Computação a se prepararem para o **ENADE** (Exame Nacional de Desempenho dos Estudantes) no Brasil.

## IDENTIDADE
- Assistente inteligente, cordial e didática.
- Especialista em Computação e TI.
- Responde SEMPRE em português brasileiro.

## REGRAS DE FORMATAÇÃO (OBRIGATÓRIO)
- Use markdown de forma LIMPA e CONSISTENTE.
- Para listas de alternativas, use APENAS este formato:
  **A)** Texto da alternativa
  **B)** Texto da alternativa
  **C)** Texto da alternativa
  **D)** Texto da alternativa
  **E)** Texto da alternativa
- NUNCA use "1.", "2." etc para numerar alternativas. Use SEMPRE A) B) C) D) E).
- Use \\[code\\] para blocos de código pequenos e \\\[\\[linguagem\\]\\[ para blocos de código maiores.
- Use **negrito** para termos-chave.
- Mantenha parágrafos curtos (máximo 3-4 linhas).
- NUNCA inclua tool_calls, function_calls, JSON estrutural ou tags XML na resposta.
- NUNCA misture formatos na mesma lista.

## SOBRE O ENADE
- Questões sempre contextualizadas com situações-problema
- Múltipla escolha (5 alternativas A a E)
- Dificuldade balanceada
- As 15 microareas: Lógica Proposicional, Matemática Discreta, Autômatos e Linguagens Formais, POO, Algoritmos e Estruturas de Dados, Banco de Dados, Engenharia de Software, Sistemas Operacionais, Redes, Sistemas Distribuídos, Criptografia, IA, Ciência de Dados, Ética Profissional, Legislação

## COMO AJUDAR
- Explicar conceitos de forma clara com exemplos
- Resolver questões passo a passo
- Criar questões no estilo ENADE quando pedido
- Dar dicas de estudo por tema
- Sugerir estratégias para o dia da prova

IMPORTANTE: Nunca invente informações. Se não souber, diga com honestidade.`;

const FALLBACK_RESPONSE = 'Desculpe, estou com dificuldades para processar sua mensagem no momento. Por favor, tente novamente em alguns segundos.';

// Sanitize AI response to prevent formatting issues
function sanitizeResponse(content: string): string {
  let s = content;

  // === PHASE 1: Remove tool-call / function-call artifacts ===
  s = s.replace(/<tool_call>[\s\S]*?<\/tool_call>/gi, '');
  s = s.replace(/<function_call>[\s\S]*?<\/function_call>/gi, '');
  s = s.replace(/\[TOOL_CALL\][\s\S]*?\[\/TOOL_CALL\]/gi, '');
  s = s.replace(/```json[\s\S]*?```\s*$/gm, '');
  s = s.replace(/```tool_call[\s\S]*?```/gi, '');
  s = s.replace(/```function_call[\s\S]*?```/gi, '');

  // === PHASE 2: Normalize alternative markers to **X)** format ===
  // Handle: (A), A), A., a), a., A-, (a), 1. A), 1) A), "Alternativa A:", "Opção A:"
  s = s.replace(/^\s*(?:Alternativa\s+|Opção\s+)?\(?([aA])\)?[).\-:]\s+/gm, '**A)** ');
  s = s.replace(/^\s*(?:Alternativa\s+|Opção\s+)?\(?([bB])\)?[).\-:]\s+/gm, '**B)** ');
  s = s.replace(/^\s*(?:Alternativa\s+|Opção\s+)?\(?([cC])\)?[).\-:]\s+/gm, '**C)** ');
  s = s.replace(/^\s*(?:Alternativa\s+|Opção\s+)?\(?([dD])\)?[).\-:]\s+/gm, '**D)** ');
  s = s.replace(/^\s*(?:Alternativa\s+|Opção\s+)?\(?([eE])\)?[).\-:]\s+/gm, '**E)** ');

  // Remove numeric prefixes before alternatives: "1. **A)**" → "**A)**"
  s = s.replace(/^\s*\d+[.)]\s*\*\*([A-E])\)\*\*\s/gm, '**$1)** ');

  // === PHASE 3: Fix broken bold markers ===
  // Fix "** text **" (spaces inside) → "**text**"
  s = s.replace(/\*\*\s+([^*]+?)\s+\*\*/g, '**$1**');

  // Fix unclosed bold at end of line
  s = s.replace(/^\*\*([^*\n]+)$/gm, '**$1**');

  // === PHASE 4: Clean up whitespace ===
  s = s.split('\n').map(line => line.trimEnd()).join('\n');
  s = s.replace(/\n{4,}/g, '\n\n\n');

  // === PHASE 5: Remove stray XML/HTML tags ===
  s = s.replace(/<(?!\/?(?:code|pre|strong|em|b|i|u|br|hr|h[1-6]|p|div|span|ul|ol|li|table|tr|td|th|thead|tbody|blockquote|sup|sub))\/?[a-zA-Z][^>]*>/g, '');

  // === PHASE 6: Fix empty/broken markdown elements ===
  // Remove empty code blocks
  s = s.replace(/```[a-z]*\s*\n\s*```/g, '');
  // Remove empty bold: **** → nothing
  s = s.replace(/\*{4,}/g, '');

  // === PHASE 7: Final cleanup ===
  // Remove leading/trailing whitespace from the entire response
  s = s.trim();

  return s;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Mensagens são obrigatórias.' }, { status: 400 });
    }

    const validMessages = messages.filter(
      (msg: { role?: string; content?: unknown }) =>
        msg.role && msg.content && typeof msg.content === 'string'
    );
    if (validMessages.length === 0) {
      return NextResponse.json({ error: 'Formato de mensagens inválido.' }, { status: 400 });
    }

    // Build conversation with system prompt
    const apiMessages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...validMessages.map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    ];

    // Keep last 20 messages max to avoid token limit issues
    const trimmedMessages = apiMessages.length > 21
      ? [apiMessages[0], ...apiMessages.slice(-20)]
      : apiMessages;

    const aiResponse = await groqChatCompletion(trimmedMessages, { temperature: 0.7 });

    if (!aiResponse) {
      return NextResponse.json(
        { message: FALLBACK_RESPONSE, isFallback: true }
      );
    }

    const sanitized = sanitizeResponse(aiResponse);

    return NextResponse.json({ message: sanitized });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ message: FALLBACK_RESPONSE, isFallback: true });
  }
}
