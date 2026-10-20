import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import experienceJson from "../../content/experience.json";
import type { ExperienceByYear, ExperienceItem } from "../../content/types";

const experience = experienceJson as ExperienceByYear;

const YEARS = ["2022", "2023", "2024", "2025", "2026"];

// one long strip: year label, then a small dot per entry; cards alternate above/below the line
const nodes = YEARS.flatMap((year) => [
  { kind: "year" as const, key: year, year },
  ...(experience[year] ?? []).map((item, i) => ({
    kind: "item" as const,
    key: `${year}-${i}`,
    item,
  })),
]);

interface ExperienceTabProps {
  onOpenProject: (slug: string) => void;
}

export default function ExperienceTab({ onOpenProject }: ExperienceTabProps) {
  // hover previews a card; click pins it so it survives mouse-out (and works on touch)
  const [pinned, setPinned] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const active = hovered ?? pinned;

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPinned(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  let itemIndex = 0;

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-10">
      <p className="text-xs tracking-[0.15em] text-[var(--gray-400)]">WHERE I'VE BEEN</p>

      <div className="scrollbar-none w-full overflow-x-auto">
        <div className="relative mx-auto flex h-80 w-max items-center px-32">
          {/* line runs from the first year to the rabbit's feet (strip has px-32) */}
          <div className="absolute left-[8.75rem] right-32 top-1/2 h-px -translate-y-1/2 bg-[var(--gray-200)]" />

          {nodes.map((node) => {
            if (node.kind === "year") {
              return (
                <span
                  key={node.key}
                  className="relative z-10 bg-[var(--bg)] px-3 text-sm font-medium tracking-[0.05em] text-[var(--gray-400)]"
                >
                  {node.year}
                </span>
              );
            }

            const above = itemIndex++ % 2 === 0;
            const isActive = active === node.key;
            return (
              <div
                key={node.key}
                role="button"
                tabIndex={0}
                aria-label={node.item.title}
                onMouseEnter={() => setHovered(node.key)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => setPinned(pinned === node.key ? null : node.key)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setPinned(pinned === node.key ? null : node.key);
                  }
                }}
                className="relative flex h-full w-10 cursor-pointer items-center justify-center outline-none"
              >
                {/* tick on the line; swells into a dot when active */}
                <span
                  className="relative z-10 rounded-full transition-all duration-200"
                  style={{
                    width: isActive ? 8 : 1,
                    height: isActive ? 8 : 10,
                    background: isActive ? "var(--fg)" : "var(--gray-300)",
                  }}
                />
                <AnimatePresence>
                  {isActive && (
                    <Card item={node.item} above={above} onOpenProject={onOpenProject} />
                  )}
                </AnimatePresence>
              </div>
            );
          })}

          {/* still running */}
          {/* the rabbit standing at the end of the line */}
          <svg
            aria-label="present"
            viewBox="0 0 100 100"
            className="relative z-10 ml-2 h-5 w-5 -translate-y-1.5 -scale-x-100 text-[var(--gray-300)]"
            fill="currentColor"
          >
            <path d="M71.0468 71.2549H74.2952V61.3937H77.5437V54.7808H74.2952V51.5324H71.0468V48.284H64.434V45.0356H51.4403V48.284H38.2146V45.0356H44.8274V41.7872H51.4403V38.5387H54.6887V31.9259H44.8274V35.1743H38.2146V38.4227H34.9662V41.6711H31.7178V38.4227H34.9662V35.1743H38.2146V28.5615H41.463V18.7002H34.8502V21.9486H31.6018V28.5615H28.3533V38.4227H21.7405V41.6711H18.4921V44.9196H15.2437V54.7808H18.4921V58.0292H25.1049V64.6421H28.3533V67.8905H31.6018V71.1389H28.3533V74.3874H21.7405V81.0002H31.6018V77.7518H38.2146V74.5034H41.463V71.2549H51.3243V74.5034H61.1856V77.7518H51.3243V74.5034H41.463V77.7518H38.2146V81.0002H71.0468V77.7518H74.2952V74.5034H71.0468V71.2549ZM25.1049 44.9196H28.3533V48.168H25.1049V44.9196ZM28.3533 54.7808H34.9662V51.5324H38.2146V54.7808H34.9662V58.0292H28.3533V54.7808ZM48.0759 68.0065V64.7581H51.3243V61.5097H54.5727V58.2613H64.434V61.5097H67.6824V64.7581H64.434V61.5097H54.5727V64.7581H51.3243V68.0065H48.0759ZM80.9081 64.6421H84.1565V71.2549H80.9081V74.5034H74.2952V71.2549H77.5437V61.3937H80.7921V64.6421H80.9081Z" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Card({
  item,
  above,
  onOpenProject,
}: {
  item: ExperienceItem;
  above: boolean;
  onOpenProject: (slug: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: above ? 6 : -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: above ? 6 : -6 }}
      transition={{ duration: 0.2, ease: [0.65, 0, 0.35, 1] }}
      className={`absolute left-1/2 z-20 flex w-56 -translate-x-1/2 flex-col items-center ${
        above ? "bottom-1/2 mb-2" : "top-1/2 mt-2"
      }`}
    >
      {!above && <div className="h-4 w-px bg-[var(--gray-200)]" />}
      <div className="flex w-full flex-col gap-1 bg-[var(--bg)] px-3 py-2 text-center">
        {item.project ? (
          <button
            type="button"
            onClick={() => onOpenProject(item.project!)}
            className="self-center text-sm font-medium text-[var(--fg)] underline decoration-[var(--gray-300)] underline-offset-4 transition-colors hover:decoration-[var(--fg)]"
          >
            {item.title} →
          </button>
        ) : (
          <span className="text-sm font-medium text-[var(--fg)]">{item.title}</span>
        )}
        <span className="text-xs leading-relaxed text-[var(--gray-500)]">{item.description}</span>
      </div>
      {above && <div className="h-4 w-px bg-[var(--gray-200)]" />}
    </motion.div>
  );
}
