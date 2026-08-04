import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";

const components: Components = {
  p: ({ children }) => <p className="leading-relaxed">{children}</p>,
  strong: ({ children }) => (
    <strong className="font-semibold text-[var(--fg)]">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  a: ({ children, href }) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-[var(--fg)] underline decoration-[var(--gray-300)] underline-offset-4"
    >
      {children}
    </a>
  ),
  h1: ({ children }) => (
    <h1 className="text-lg font-semibold text-[var(--fg)]">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-base font-semibold text-[var(--fg)]">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-sm font-semibold text-[var(--fg)]">{children}</h3>
  ),
  ul: ({ children }) => (
    <ul className="flex list-disc flex-col gap-1 pl-5">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="flex list-decimal flex-col gap-1 pl-5">{children}</ol>
  ),
  li: ({ children }) => <li>{children}</li>,
  code: ({ children }) => (
    <code className="rounded bg-[var(--gray-50)] px-1 py-0.5 text-[0.9em]">
      {children}
    </code>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-[var(--gray-200)] pl-3 text-[var(--gray-500)]">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="border-[var(--gray-100)]" />,
};

interface MarkdownProps {
  children: string;
  className?: string;
}

export default function Markdown({ children, className }: MarkdownProps) {
  return (
    <div className={className}>
      <ReactMarkdown components={components}>{children}</ReactMarkdown>
    </div>
  );
}
