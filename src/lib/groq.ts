// =============================================================================
// Groq chat completion client (OpenAI-compatible API, free tier)
// Requires GROQ_API_KEY to be set in the environment. Get one at https://console.groq.com/keys
// =============================================================================

export interface GroqMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const GROQ_MODEL = 'openai/gpt-oss-120b';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export class GroqNotConfiguredError extends Error {
  constructor() {
    super('GROQ_API_KEY não está configurada.');
    this.name = 'GroqNotConfiguredError';
  }
}

export async function groqChatCompletion(
  messages: GroqMessage[],
  options?: { temperature?: number; maxTokens?: number }
): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new GroqNotConfiguredError();
  }

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 1500,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '');
    throw new Error(`Groq API respondeu ${response.status}: ${errorBody}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('Groq API retornou uma resposta vazia.');
  }
  return content;
}
