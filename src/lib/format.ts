export function formatPeriod(period: { start: string; end: string | null }) {
  return `${period.start} — ${period.end ?? "Present"}`;
}

/** list view: "2026", or "2025 – 2026" when it spans years (ongoing shows start year only) */
export function formatYears(period: { start: string; end: string | null }) {
  const start = period.start.slice(0, 4);
  const end = period.end?.slice(0, 4);
  return end && end !== start ? `${start} – ${end}` : start;
}
