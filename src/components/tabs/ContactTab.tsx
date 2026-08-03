import contact from "../../content/contact.json";
import type { ContactInfo } from "../../content/types";

const info = contact as ContactInfo;

interface ContactRow {
  label: string;
  value: string;
  href?: string;
}

const CONTACT_ROWS: ContactRow[] = [
  { label: "EMAIL", value: info.email || "[ email address ]" },
  { label: "PHONE", value: info.phone || "[ phone number ]" },
  {
    label: "INSTAGRAM",
    value: `@${info.instagram}`,
    href: `https://instagram.com/${info.instagram}`,
  },
  {
    label: "BLOG",
    value: info.blog.replace(/^https?:\/\//, ""),
    href: info.blog,
  },
  {
    label: "GITHUB",
    value: `github.com/${info.github}`,
    href: `https://github.com/${info.github}`,
  },
];

// half of the fixed gap reserved around dead-center, where the rabbit comes to rest —
// anchoring both blocks by distance-from-center (not flex auto-centering) keeps that
// gap exactly on the viewport's true middle no matter how tall either block renders
const HALF_GAP = 80;

export default function ContactTab() {
  return (
    <div className="relative h-full w-full px-6 text-center">
      <div
        className="absolute left-1/2 flex w-full max-w-md -translate-x-1/2 flex-col items-center gap-3"
        style={{ bottom: `calc(50% + ${HALF_GAP}px)` }}
      >
        <p className="bg-[var(--bg)] px-2 text-xs tracking-[0.15em] text-[var(--gray-400)]">
          YOU FINALLY FOUND THE RABBIT
        </p>
        <h1 className="bg-[var(--bg)] px-2 text-4xl font-semibold text-[var(--fg)] sm:text-5xl">
          Let's Talk.
        </h1>
      </div>

      <div
        className="absolute left-1/2 flex w-full max-w-xs -translate-x-1/2 flex-col gap-3 bg-[var(--bg)] px-4 py-4 text-left text-sm"
        style={{ top: `calc(50% + ${HALF_GAP}px)` }}
      >
        {CONTACT_ROWS.map((row) => (
          <div
            key={row.label}
            className="flex items-baseline justify-between gap-6 border-b border-[var(--gray-100)] pb-2"
          >
            <span className="text-[10px] tracking-[0.15em] text-[var(--gray-300)]">
              {row.label}
            </span>
            {row.href ? (
              <a
                href={row.href}
                target="_blank"
                rel="noreferrer"
                className="text-[var(--fg)] underline decoration-[var(--gray-300)] underline-offset-4"
              >
                {row.value}
              </a>
            ) : (
              <span className="text-[var(--fg)]">{row.value}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
