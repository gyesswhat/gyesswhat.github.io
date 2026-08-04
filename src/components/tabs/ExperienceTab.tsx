import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import experienceJson from "../../content/experience.json";
import type { ExperienceByYear } from "../../content/types";

const experience = experienceJson as ExperienceByYear;

const YEARS = ["2022", "2023", "2024", "2025", "2026"];

export default function ExperienceTab() {
  const [selectedYear, setSelectedYear] = useState<string | null>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedYear(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const items = selectedYear ? experience[selectedYear] ?? [] : [];

  return (
    <div className="flex h-full w-full items-center justify-center px-6">
      <motion.div
        layout
        className="flex w-full max-w-3xl flex-col items-center gap-8 sm:gap-12"
      >
        <p className="bg-[var(--bg)] px-2 text-xs tracking-[0.15em] text-[var(--gray-400)]">
          WHERE I'VE BEEN
        </p>

        <div className="relative flex w-full items-center justify-between">
          <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-[var(--gray-200)]" />

          {YEARS.map((year) => {
            const hasEntries = (experience[year] ?? []).length > 0;
            const isSelected = selectedYear === year;
            return (
              <button
                key={year}
                type="button"
                onClick={() => setSelectedYear(isSelected ? null : year)}
                className="relative flex flex-col items-center gap-2 bg-[var(--bg)] px-1.5 sm:px-3"
              >
                <span
                  className="h-2 w-2 rounded-full transition-colors duration-200"
                  style={{
                    background: isSelected
                      ? "var(--fg)"
                      : hasEntries
                        ? "var(--gray-400)"
                        : "var(--gray-200)",
                  }}
                />
                <span
                  className="text-sm font-medium tracking-[0.05em] transition-colors duration-200"
                  style={{ color: isSelected ? "var(--fg)" : "var(--gray-300)" }}
                >
                  {year}
                </span>
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {selectedYear && (
            <motion.div
              key={selectedYear}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.65, 0, 0.35, 1] }}
              className="w-full max-w-md overflow-hidden"
            >
              <div className="flex flex-col gap-4 border-t border-[var(--gray-100)] pt-6">
                {items.length > 0 ? (
                  items.map((item, i) => (
                    <div key={i} className="flex flex-col gap-1 text-center">
                      <span className="text-sm font-medium text-[var(--fg)]">
                        {item.title}
                      </span>
                      <span className="text-sm text-[var(--gray-500)]">
                        {item.description}
                      </span>
                    </div>
                  ))
                ) : (
                  <span className="text-center text-sm text-[var(--gray-400)]">
                    [ nothing logged yet ]
                  </span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
