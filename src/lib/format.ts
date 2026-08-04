export function formatPeriod(period: { start: string; end: string | null }) {
  return `${period.start} — ${period.end ?? "Present"}`;
}
