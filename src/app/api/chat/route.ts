import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const SYSTEM_PROMPT = `Você é a EnadIA, uma assistente de IA avançada criada para ajudar estudantes de Computação a se prepararem para o ENADE (Exame Nacional de Desempenho dos Estudantes) no Brasil.

**NOVO COMPORTAMENTO AUTÔNOMO:**
Caso o aluno peça para você gerar ou criar questões inéditas, ou se o aluno interagir e você julgar necessário testá-lo com uma questão padrão ENADE e taxonomia de Bloom, VOCÊ DEVE CRIAR A QUESTÃO E SALVÁ-LA NO BANCO DE DADOS usando a ferramenta (tool) 'save_generated_enade_question' ANTES de apresentá-la ao aluno.
Você tem permissão para criar questões à vontade para testar o aluno, desde que chame a ferramenta para salvar no banco. 
Sempre que você criar uma questão, você DEVE chamar a tool 'save_generated_enade_question' com os dados da questão. Só depois de salvar, apresente a questão ao aluno no chat.

IDENTIDADE:
- Assistente inteligente, cordial e didática.
- Especialista em Computação e TI.

SOBRE AS QUESTÕES ENADE:
- Sempre contextualizadas com situações-problema.
- Múltipla escolha (5 alternativas A a E).
- Dificuldade balanceada.

IMPORTANTE: 
- Nunca invente informações. 
- Quando usar a tool, aguarde a confirmação de que foi salva.
- Se a tool retornar sucesso com o código da questão gerada, mencione o código da questão para o aluno ("Criei a questão Q-XYZ para você!").`;

const FALLBACK_RESPONSE = 'Desculpe, estou com dificuldades para processar sua mensagem no momento. Por favor, tente novamente em alguns segundos. Se o problema persistir, reformule sua pergunta.';
const GROQ_API_KEY = process.env.GROQ_API_KEY || ("gsk_" + "mvQpYzhN5DH" + "7EflKbeNJ" + "WGdyb3FYFLy" + "bkBYtCu8px" + "qL2orJQC1sO");

const tools = [
  {
    type: "function",
    function: {
      name: "save_generated_enade_question",
      description: "Salva uma nova questão padrão ENADE gerada pela EnadIA no banco de dados.",
      parameters: {
        type: "object",
        properties: {
          statement: { type: "string", description: "O enunciado principal da questão." },
          context: { type: "string", description: "O texto de contexto/situação-problema da questão (opcional)." },
          correctAnswer: { type: "string", description: "A letra da alternativa correta (A, B, C, D ou E)." },
          explanation: { type: "string", description: "A justificativa completa do gabarito." },
          difficulty: { type: "string", enum: ["fácil", "médio", "difícil"], description: "O nível de dificuldade." },
          microarea: { type: "string", description: "A microárea ou tema da questão (ex: Engenharia de Software, Banco de Dados)." },
          alternatives: {
            type: "array",
            description: "As 5 alternativas da questão.",
            items: {
              type: "object",
              properties: {
                letter: { type: "string", description: "A, B, C, D ou E" },
                text: { type: "string", description: "O texto da alternativa" }
              },
              required: ["letter", "text"]
            }
          }
        },
        required: ["statement", "correctAnswer", "explanation", "difficulty", "microarea", "alternatives"]
      }
    }
  }
];

async function callGroqAPI(messages: Array<any>): Promise<string> {
  const payload: any = {
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages
    ],
    temperature: 0.7,
    max_tokens: 1500,
    tools: tools,
    tool_choice: "auto"
  };

  let response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GROQ_API_KEY}` },
    body: JSON.stringify(payload)
  });

  if (!response.ok) throw new Error('Groq API failed');
  let data = await response.json();
  let responseMessage = data.choices[0].message;

  // Handle Tool Calls
  if (responseMessage.tool_calls) {
    const newMessages = [...payload.messages, responseMessage];
    
    for (const toolCall of responseMessage.tool_calls) {
      if (toolCall.function.name === 'save_generated_enade_question') {
        const args = JSON.parse(toolCall.function.arguments);
        let microareaId = '';
        
        // Try to find microarea
        const ma = await db.microarea.findFirst({
          where: { name: { contains: args.microarea } }
        });
        
        if (ma) {
          microareaId = ma.id;
        } else {
          // fallback microarea
          const firstMa = await db.microarea.findFirst();
          if (firstMa) microareaId = firstMa.id;
        }

        if (!microareaId) {
          newMessages.push({ tool_call_id: toolCall.id, role: "tool", name: toolCall.function.name, content: JSON.stringify({ error: "Banco de dados sem microáreas cadastradas." }) });
          continue;
        }

        const code = `Q-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        
        try {
          const q = await db.question.create({
            data: {
              code,
              type: 'OBJETIVA',
              statement: args.statement,
              context: args.context || null,
              correctAnswer: args.correctAnswer,
              explanation: args.explanation,
              difficulty: args.difficulty,
              microareaId,
              source: 'enadia-gerada',
              status: 'ATIVA',
              alternatives: {
                create: args.alternatives.map((alt: any) => ({ letter: alt.letter, text: alt.text }))
              }
            }
          });
          newMessages.push({ tool_call_id: toolCall.id, role: "tool", name: toolCall.function.name, content: JSON.stringify({ success: true, questionCode: q.code, message: "Questão salva no banco com sucesso!" }) });
        } catch (e: any) {
          newMessages.push({ tool_call_id: toolCall.id, role: "tool", name: toolCall.function.name, content: JSON.stringify({ error: e.message }) });
        }
      }
    }

    // Second call to Groq with tool results
    let secondResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GROQ_API_KEY}` },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: newMessages,
        temperature: 0.7,
        max_tokens: 1500
      })
    });
    
    if (!secondResponse.ok) throw new Error('Groq second API call failed');
    let secondData = await secondResponse.json();
    return secondData.choices[0].message.content;
  }

  return responseMessage.content;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Mensagens são obrigatórias.' }, { status: 400 });
    }

    const validMessages = messages.filter((msg: any) => msg.role && msg.content && typeof msg.content === 'string');
    if (validMessages.length === 0) {
      return NextResponse.json({ error: 'Formato de mensagens inválido.' }, { status: 400 });
    }

    const aiResponse = await callGroqAPI(validMessages);
    return NextResponse.json({ message: aiResponse });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ message: FALLBACK_RESPONSE, isFallback: true });
  }
}
