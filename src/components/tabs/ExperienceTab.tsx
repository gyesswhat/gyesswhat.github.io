import experience from "../../content/experience.json";
import type { ExperienceEntry } from "../../content/types";
import { formatPeriod } from "../../lib/format";

const timeline = experience as ExperienceEntry[];

export default function ExperienceTab() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-12 px-6">
      <p className="bg-[var(--bg)] px-2 text-xs tracking-[0.15em] text-[var(--gray-400)]">
        WHERE I'VE BEEN
      </p>

      <div className="relative flex w-full max-w-3xl items-center justify-between">
        <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-[var(--gray-200)]" />

        {timeline.map((entry) => (
          <div
            key={`${entry.org}-${entry.start}`}
            className="relative z-10 flex flex-col items-center gap-2 bg-[var(--bg)] px-3"
          >
            <span className="text-[10px] tracking-[0.1em] text-[var(--gray-400)]">
              {formatPeriod(entry)}
            </span>
            <span className="h-2 w-2 rounded-full bg-[var(--fg)]" />
            <div className="flex flex-col items-center gap-0.5 text-center">
              <span className="text-sm font-medium text-[var(--fg)]">
                {entry.role}
              </span>
              <span className="text-xs text-[var(--gray-400)]">{entry.org}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
