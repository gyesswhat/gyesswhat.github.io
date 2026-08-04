import about from "../../content/about.json";
import bioMd from "../../content/about.md?raw";
import Markdown from "../Markdown";

export default function AboutTab() {
  return (
    <div className="flex h-full w-full items-center justify-center px-6">
      <div className="flex max-w-md flex-col items-center gap-5 text-center">
        <div className="group relative h-28 w-28 overflow-hidden rounded-full border border-[var(--gray-200)]">
          <img
            src={about.photo}
            alt={about.oneLiner}
            className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
          />
        </div>

        <p className="bg-[var(--bg)] px-3 text-lg font-medium text-[var(--fg)]">
          {about.oneLiner}
        </p>

        <Markdown className="flex flex-col gap-3 bg-[var(--bg)] px-3 text-sm leading-relaxed text-[var(--gray-500)]">
          {bioMd.trim()}
        </Markdown>
      </div>
    </div>
  );
}
