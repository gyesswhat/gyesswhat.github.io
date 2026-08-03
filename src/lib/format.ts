export function formatPeriod(period: { start: string; end: string | null }) {
  return `${period.start} — ${period.end ?? "Present"}`;
}

export function splitParagraphs(markdown: string) {
  return markdown
    .trim()
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}
