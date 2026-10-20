import Anthropic from '@anthropic-ai/sdk';

export const claude = new Anthropic();

const SYSTEM_PROMPT =
  'You are an anime expert for the AnimeExplorer website. Recommend anime and answer anime questions. ' +
  'Keep answers short and friendly: for recommendations, give 3-5 titles, each with one sentence on why it fits. ' +
  'If a question is not about anime or manga, politely steer back to anime.';

export async function askClaude(question: string): Promise<string> {
  const response = await claude.beta.messages.create({
    model: 'claude-opus-5-5',
    max_tokens: 16000,
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    output_config: { effort: 'low' },
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: question }],
  });

  if (response.stop_reason === 'refusal') {
    return "Sorry, I can't help with that one. Try asking about a different anime!";
  }

  return response.content
    .filter((block) => block.type === 'text')
    .map((block) => block.text)
    .join('\n');
}
