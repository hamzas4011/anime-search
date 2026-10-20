import Anthropic from '@anthropic-ai/sdk';

export const claude = new Anthropic();

export type ClaudeRecommendation = {
  title: string;
  reason: string;
};

export type ClaudeAnswer = {
  answer: string;
  recommendations: ClaudeRecommendation[];
};

const SYSTEM_PROMPT =
  'You are an anime expert for the AnimeExplorer website. Your only job is recommending anime. ' +
  'Keep answers short and friendly. ' +
  'Put 3 titles in "recommendations" unless the user asks for a different number (at most 5), ' +
  'each with one sentence on why it fits. ' +
  'Use the official English title when the anime has one, otherwise the official romaji title. ' +
  '"answer" is a short intro of at most 1-2 sentences; do not repeat the titles there. ' +
  'If the message is not a request for anime recommendations, leave "recommendations" empty and use "answer" ' +
  'for one short, friendly line suggesting they describe what kind of anime they want to watch.';

const ANSWER_SCHEMA = {
  type: 'object',
  properties: {
    answer: { type: 'string' },
    recommendations: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          reason: { type: 'string' },
        },
        required: ['title', 'reason'],
        additionalProperties: false,
      },
    },
  },
  required: ['answer', 'recommendations'],
  additionalProperties: false,
};

const REFUSAL_ANSWER: ClaudeAnswer = {
  answer: "Sorry, I can't help with that one. Try asking about a different anime!",
  recommendations: [],
};

export async function askClaude(question: string): Promise<ClaudeAnswer> {
  const response = await claude.beta.messages.create({
    model: 'claude-opus-5-5',
    max_tokens: 4000,
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    output_config: {
      effort: 'low',
      format: { type: 'json_schema', schema: ANSWER_SCHEMA },
    },
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: question }],
  });

  if (response.stop_reason === 'refusal') {
    return REFUSAL_ANSWER;
  }
  if (response.stop_reason === 'max_tokens') {
    throw new Error('Claude answer was cut off (max_tokens)');
  }

  const text = response.content
    .filter((block) => block.type === 'text')
    .map((block) => block.text)
    .join('');

  return JSON.parse(text) as ClaudeAnswer;
}
