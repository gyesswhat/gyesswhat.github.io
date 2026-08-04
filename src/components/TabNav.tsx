export const TABS = ["Main", "About", "Experience", "Projects", "Contact"] as const;

interface TabNavProps {
  current: number;
  onSelect: (index: number) => void;
}

export default function TabNav({ current, onSelect }: TabNavProps) {
  return (
    <nav className="pointer-events-auto absolute left-1/2 top-4 z-10 flex w-full max-w-full -translate-x-1/2 flex-wrap items-center justify-center gap-x-3 gap-y-2 px-4 text-[10px] tracking-[0.1em] sm:top-6 sm:gap-x-6 sm:text-xs sm:tracking-[0.15em]">
      <div className="flex items-center gap-2 text-[var(--fg)]">
        <img src="/logo.svg" alt="" className="h-4 w-4" />
        <span>Gyeore Kim</span>
      </div>

      <span className="hidden text-[var(--gray-200)] sm:inline">/</span>

      <div className="flex items-center gap-3 sm:gap-4">
        {TABS.slice(1).map((label, i) => {
          const index = i + 1;
          const active = current === index;
          return (
            <button
              key={label}
              type="button"
              onClick={() => onSelect(index)}
              className="transition-colors duration-300"
              style={{
                color: active ? "var(--fg)" : "var(--gray-300)",
              }}
            >
              {label.toUpperCase()}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
