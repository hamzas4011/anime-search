export const AI_EXAMPLES = [
  "Something like Attack on Titan",
  "Short anime under 13 episodes",
  "Funny anime",
];

export function askUrl(question: string) {
  return `/ask?q=${encodeURIComponent(question)}`;
}
