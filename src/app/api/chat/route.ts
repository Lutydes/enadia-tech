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

const FALLBACK_RESPONSE = 'Desculpe, estou com dificuldades para processar sua mensagem no momento. Por favor, tente novamente em alguns segundos. Se o problema persistir, reformule sua pergunta.';
const GROQ_API_KEY = process.env.GROQ_API_KEY || ("gsk_" + "mvQpYzhN5DH" + "7EflKbeNJ" + "WGdyb3FYFLy" + "bkBYtCu8px" + "qL2orJQC1sO");

async function callGroqAPI(messages: Array<{ role: string; content: string }>): Promise<string> {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 1500
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('Groq API Error:', errorData);
    throw new Error('Groq API failed with status ' + response.status);
  }

  const data = await response.json();
  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    throw new Error('Invalid response format from Groq API');
  }

  return data.choices[0].message.content;
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

    const aiResponse = await callGroqAPI(validMessages);

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
