import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import projectsJson from "../../content/projects.json";
import type { ProjectItem } from "../../content/types";
import { formatPeriod, formatYears } from "../../lib/format";
import Markdown from "../Markdown";

const projects = projectsJson as ProjectItem[];

const projectBodies = import.meta.glob<string>("../../content/projects/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

function getProjectBody(slug: string) {
  const entry = Object.entries(projectBodies).find(([path]) =>
    path.endsWith(`/${slug}.md`)
  );
  return entry ? entry[1].trim() : "";
}

const FILTERS = ["all", "engineering", "research", "experiments"] as const;
type Filter = (typeof FILTERS)[number];

interface ProjectsTabProps {
  /** project to open on mount (e.g. coming from an Experience entry) */
  initialSlug?: string | null;
}

export default function ProjectsTab({ initialSlug = null }: ProjectsTabProps) {
  const [filter, setFilter] = useState<Filter>("all");
  const [selectedSlug, setSelectedSlug] = useState<string | null>(initialSlug);

  const items = useMemo(
    () =>
      [...projects]
        .filter((item) => filter === "all" || item.category === filter)
        .sort((a, b) => a.order - b.order),
    [filter]
  );

  const selected = projects.find((item) => item.slug === selectedSlug) ?? null;

  useEffect(() => {
    if (!selected) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedSlug(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selected]);

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-10 px-6">
      <div className="flex flex-col items-center gap-3">
        <p className="text-xs tracking-[0.15em] text-[var(--gray-400)]">WHAT I'M BUILDING</p>
        <div className="flex items-center gap-4 text-xs tracking-[0.15em]">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className="transition-colors duration-300"
              style={{ color: filter === f ? "var(--fg)" : "var(--gray-300)" }}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* a hand of cards: fanned on an arc, hover lifts one out of the stack */}
      <div className="scrollbar-none h-[30rem] w-full overflow-x-auto overflow-y-hidden">
        <div className="flex h-full w-max min-w-full items-end justify-center px-10 pb-28">
          <AnimatePresence initial={true}>
          {items.length === 0 && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="flex h-72 w-52 shrink-0 flex-col justify-between border border-[var(--gray-900)] bg-[var(--gray-900)] p-5 text-[var(--gray-0)]"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--gray-400)]">
                00 · {filter}
              </span>
              <h3 className="text-2xl font-semibold leading-tight">still working on!</h3>
              <span className="text-[10px] tracking-[0.1em] text-[var(--gray-400)]">soon</span>
            </motion.div>
          )}
          {items.map((item, i) => {
            const mid = (items.length - 1) / 2;
            const d = i - mid;
            const tone = i % 3; // 0 white, 1 light gray, 2 dark
            const dark = tone === 2;
            const fling = i % 2 === 0 ? -18 : 18;
            return (
              <motion.button
                key={item.slug}
                layout
                type="button"
                onClick={() => setSelectedSlug(item.slug)}
                // "nothing but a pack of cards": they drop in from above and fly off when filtered out
                initial={{ opacity: 0, y: -360, rotate: fling }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                exit={{ opacity: 0, y: -480, rotate: fling * 2, transition: { duration: 0.35 } }}
                transition={{ type: "spring", stiffness: 260, damping: 26, delay: i * 0.04 }}
                style={
                  {
                    "--r": `${d * 3}deg`,
                    "--y": `${d * d * 3}px`,
                  } as React.CSSProperties
                }
                className={`group relative -ml-28 flex h-72 w-52 shrink-0 origin-bottom flex-col justify-between border p-5 text-left transition-[rotate,translate,box-shadow] duration-300 ease-out first:ml-0 rotate-(--r) translate-y-(--y) hover:z-50 hover:rotate-0 hover:translate-y-[calc(var(--y)-2rem)] hover:shadow-[0_24px_48px_-24px_rgba(0,0,0,0.35)] ${
                  dark
                    ? "border-[var(--gray-900)] bg-[var(--gray-900)] text-[var(--gray-0)]"
                    : tone === 1
                      ? "border-[var(--gray-200)] bg-[var(--gray-50)] text-[var(--fg)]"
                      : "border-[var(--gray-200)] bg-[var(--bg)] text-[var(--fg)]"
                }`}
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--gray-400)]">
                  {String(i + 1).padStart(2, "0")} · {item.category}
                </span>
                <div className="flex flex-col gap-2">
                  <h3 className="text-2xl font-semibold leading-tight">{item.title}</h3>
                  <p
                    className="line-clamp-3 text-xs leading-relaxed"
                    style={{ color: dark ? "var(--gray-300)" : "var(--gray-500)" }}
                  >
                    {item.tagline}
                  </p>
                </div>
                <span className="text-[10px] tracking-[0.1em] text-[var(--gray-400)]">
                  {formatYears(item.period)}
                </span>

              </motion.button>
            );
          })}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setSelectedSlug(null)}
            className="absolute inset-0 z-[60] flex items-center justify-center bg-black/10 px-6"
          >
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.3, ease: [0.65, 0, 0.35, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="flex max-h-[80%] w-full max-w-xl flex-col overflow-y-auto border border-[var(--gray-100)] bg-[var(--bg)] px-8 py-8"
            >
              <button
                type="button"
                onClick={() => setSelectedSlug(null)}
                className="self-end text-xs tracking-[0.1em] text-[var(--gray-400)] transition-colors hover:text-[var(--fg)]"
              >
                CLOSE ×
              </button>

              {/* metadata: derived directly from the project JSON */}
              <div className="mt-4 flex flex-col gap-3 border-b border-[var(--gray-100)] pb-6">
                <span className="text-[10px] uppercase tracking-[0.15em] text-[var(--gray-300)]">
                  {selected.category}
                </span>
                <h3 className="text-2xl font-semibold text-[var(--fg)]">
                  {selected.title}
                </h3>
                <p className="text-sm text-[var(--gray-500)]">{selected.tagline}</p>
                <p className="text-xs text-[var(--gray-400)]">
                  {formatPeriod(selected.period)}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {selected.role.map((r) => (
                    <span
                      key={r}
                      className="rounded-full border border-[var(--gray-200)] px-2 py-0.5 text-[10px] text-[var(--gray-500)]"
                    >
                      {r}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 text-[10px] text-[var(--gray-400)]">
                  {selected.stack.join(" · ")}
                </div>

                {selected.awards && selected.awards.length > 0 && (
                  <ul className="mt-1 flex flex-col gap-1.5">
                    {selected.awards.map((a) => (
                      <li key={a.title} className="flex items-baseline gap-2 text-xs">
                        <span className="text-[10px] text-[var(--fg)]">★</span>
                        <span className="font-medium text-[var(--fg)]">{a.title}</span>
                        <span className="text-[var(--gray-400)]">{a.by}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {(selected.links.live || selected.links.github) && (
                  <div className="flex gap-3 text-xs">
                    {selected.links.live && (
                      <a
                        href={selected.links.live}
                        target="_blank"
                        rel="noreferrer"
                        className="underline decoration-[var(--gray-300)] underline-offset-4"
                      >
                        Live
                      </a>
                    )}
                    {selected.links.github && (
                      <a
                        href={selected.links.github}
                        target="_blank"
                        rel="noreferrer"
                        className="underline decoration-[var(--gray-300)] underline-offset-4"
                      >
                        GitHub
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* body: separate flowing markdown area, distinct from the metadata block above */}
              <Markdown className="flex flex-col gap-4 pt-6 text-sm leading-relaxed text-[var(--gray-600)]">
                {getProjectBody(selected.slug)}
              </Markdown>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
