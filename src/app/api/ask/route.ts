import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { askClaude, type ClaudeRecommendation } from '../../lib/claude';
import { getAnimeDetails } from '../../lib/anilist';
import { getKitsuDetails } from '../../lib/kitsu';
import { searchAnimeDetails } from '../../lib/jikan';

const MAX_QUESTION_LENGTH = 200;
const MAX_RECOMMENDATIONS = 5;
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60_000;

// Simple per-IP limit, kept in memory per server instance
const recentRequests = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (recentRequests.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (timestamps.length >= RATE_LIMIT) {
    recentRequests.set(ip, timestamps);
    return true;
  }
  timestamps.push(now);
  recentRequests.set(ip, timestamps);
  if (recentRequests.size > 1000) {
    for (const [key, times] of recentRequests) {
      if (times.every((t) => now - t >= RATE_WINDOW_MS)) recentRequests.delete(key);
    }
  }
  return false;
}

type Recommendation = ClaudeRecommendation & {
  image: string | null;
  score: number | null;
  episodes: number | null;
  url: string | null;
};

async function addAnimeDetails(recommendations: ClaudeRecommendation[]): Promise<Recommendation[]> {
  return Promise.all(
    recommendations.slice(0, MAX_RECOMMENDATIONS).map(async (rec) => {
      const details =
        (await getAnimeDetails(rec.title)) ??
        (await getKitsuDetails(rec.title)) ??
        (await searchAnimeDetails(rec.title));
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
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Too many requests, try again in a minute' }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const question = typeof body?.question === 'string' ? body.question.trim() : '';

  if (!question) {
    return NextResponse.json({ error: 'Please type a question' }, { status: 400 });
  }
  if (question.length > MAX_QUESTION_LENGTH) {
    return NextResponse.json({ error: `Keep it short — max ${MAX_QUESTION_LENGTH} characters.` }, { status: 400 });
  }

  try {
    const { answer, recommendations, requestedCount, minEpisodes, maxEpisodes } = await askClaude(question);
    const detailed = await addAnimeDetails(recommendations);

    // The AI can misremember episode counts, so check its picks against the real ones
    const fitsLimit = (rec: Recommendation) =>
      rec.episodes === null ||
      ((minEpisodes === null || rec.episodes >= minEpisodes) &&
        (maxEpisodes === null || rec.episodes <= maxEpisodes));
    const count = Math.min(Math.max(requestedCount, 1), MAX_RECOMMENDATIONS);
    const picks = detailed.filter(fitsLimit).slice(0, count);
    return NextResponse.json(
      {
        answer:
          detailed.length > 0 && picks.length === 0
            ? "I couldn't find picks that fit that episode count. Try a slightly different limit!"
            : answer,
        recommendations: picks,
      },
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
