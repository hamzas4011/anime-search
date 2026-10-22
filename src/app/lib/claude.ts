import Anthropic from '@anthropic-ai/sdk';

export const claude = new Anthropic();

export type ClaudeRecommendation = {
  title: string;
  reason: string;
};

export type ClaudeAnswer = {
  answer: string;
  recommendations: ClaudeRecommendation[];
  requestedCount: number;
  minEpisodes: number | null;
  maxEpisodes: number | null;
};

const SYSTEM_PROMPT =
  'You are an anime expert for the AnimeExplorer website. Your only job is recommending anime. ' +
  'Keep answers short and friendly. ' +
  'Put 3 titles in "recommendations" unless the user asks for a different number. ' +
  'Never give more than 5; if the user asks for more than 5, give 5 and say briefly in "answer" ' +
  'that you can pick up to 5 at a time. ' +
  'Give each title one sentence on why it fits. ' +
  'Use the official English title when the anime has one, otherwise the official romaji title. ' +
  '"answer" is a short intro of at most 1-2 sentences; do not repeat the titles there. ' +
  'If the message is just an anime title, treat it as "anime similar to <title>": use "answer" for one sentence ' +
  'about that anime, and do not include that title itself in "recommendations". ' +
  'If the user sets an episode limit, put it in "minEpisodes"/"maxEpisodes" as inclusive numbers ' +
  '(e.g. "less than 20 episodes" means maxEpisodes 19), and only recommend anime whose full episode count fits it; ' +
  'otherwise set both to null. ' +
  '"requestedCount" is how many picks the user wants (3 by default, at most 5). ' +
  'When there is an episode limit, add up to 2 backup titles after those (5 titles at most in total), ' +
  'because titles that turn out not to fit are removed; never mention backups in "answer". ' +
  'If the message is not a request for anime recommendations, leave "recommendations" empty and use "answer" ' +
  'for one short, friendly line suggesting they describe what kind of anime they want to watch.';

const ANSWER_SCHEMA = {
  type: 'object',
  properties: {
    answer: { type: 'string' },
    recommendations: {
      type: 'array',
      description: 'At most 5 recommendations; 3 by default.',
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
    requestedCount: { type: 'integer' },
    minEpisodes: { anyOf: [{ type: 'integer' }, { type: 'null' }] },
    maxEpisodes: { anyOf: [{ type: 'integer' }, { type: 'null' }] },
  },
  required: ['answer', 'recommendations', 'requestedCount', 'minEpisodes', 'maxEpisodes'],
  additionalProperties: false,
};

const REFUSAL_ANSWER: ClaudeAnswer = {
  answer: "Sorry, I can't help with that one. Try asking about a different anime!",
  recommendations: [],
  requestedCount: 0,
  minEpisodes: null,
  maxEpisodes: null,
};

export async function askClaude(question: string): Promise<ClaudeAnswer> {
  const response = await claude.beta.messages.create({
    model: 'claude-sonnet-5-5',
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
