import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { askClaude, type ClaudeRecommendation } from '../../lib/claude';
import { getAnimeDetails } from '../../lib/anilist';

const MAX_QUESTION_LENGTH = 500;
const MAX_RECOMMENDATIONS = 5;

type Recommendation = ClaudeRecommendation & {
  image: string | null;
  score: number | null;
  episodes: number | null;
  url: string | null;
};

async function addAnimeDetails(recommendations: ClaudeRecommendation[]): Promise<Recommendation[]> {
  return Promise.all(
    recommendations.slice(0, MAX_RECOMMENDATIONS).map(async (rec) => {
      const details = await getAnimeDetails(rec.title);
      return {
        title: rec.title,
        reason: rec.reason,
        image: details?.image ?? null,
        score: details?.score ?? null,
        episodes: details?.episodes ?? null,
        url: details?.url ?? null,
      };
    })
  );
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const question = typeof body?.question === 'string' ? body.question.trim() : '';

  if (!question) {
    return NextResponse.json({ error: 'Please type a question' }, { status: 400 });
  }
  if (question.length > MAX_QUESTION_LENGTH) {
    return NextResponse.json({ error: `Questions can be at most ${MAX_QUESTION_LENGTH} characters` }, { status: 400 });
  }

  try {
    const { answer, recommendations } = await askClaude(question);
    return NextResponse.json(
      { answer, recommendations: await addAnimeDetails(recommendations) },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      console.error('Claude API Error: invalid or missing ANTHROPIC_API_KEY');
    } else if (error instanceof Anthropic.RateLimitError) {
      console.error('Claude API Error: rate limited');
      return NextResponse.json({ error: 'Too many requests, try again in a moment' }, { status: 429 });
    } else {
      console.error('Claude API Error:', error);
    }
    return NextResponse.json({ error: 'Failed to get an answer from AI' }, { status: 502 });
  }
}
