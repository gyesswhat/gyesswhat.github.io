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
    <div className="relative flex h-full w-full items-center justify-center px-6">
      <div className="flex h-[75%] w-full max-w-lg flex-col bg-[var(--bg)] px-2 py-2">
        <p className="pb-3 text-xs tracking-[0.15em] text-[var(--gray-400)]">
          WHAT I'M BUILDING
        </p>

        <div className="flex items-center gap-4 pb-4 text-xs tracking-[0.15em]">
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

        <div className="scrollbar-none flex min-h-0 flex-1 flex-col overflow-y-auto">
          {items.length === 0 && (
            <p className="py-10 text-center text-sm text-[var(--gray-400)]">
              [ nothing here yet ]
            </p>
          )}
          {items.map((item, i) => (
            <button
              key={item.slug}
              type="button"
              onClick={() => setSelectedSlug(item.slug)}
              className="group flex w-full items-baseline gap-5 border-b border-[var(--gray-100)] py-5 text-left transition-colors duration-200 hover:bg-[var(--gray-50)]"
            >
              <span className="w-7 shrink-0 font-[Montserrat] text-xs tabular-nums text-[var(--gray-300)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <h3 className="text-xl font-semibold leading-tight text-[var(--fg)]">
                  {item.title}
                </h3>
                <p className="truncate text-sm text-[var(--gray-400)]">{item.tagline}</p>
              </div>
              <span className="shrink-0 text-xs tabular-nums text-[var(--gray-300)]">
                {formatYears(item.period)}
              </span>
            </button>
          ))}
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
            className="absolute inset-0 flex items-center justify-center bg-black/10 px-6"
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
