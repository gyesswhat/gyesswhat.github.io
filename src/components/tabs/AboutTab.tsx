import about from "../../content/about.json";
import bioMd from "../../content/about.md?raw";

export default function AboutTab() {
  return (
    <div className="flex h-full w-full items-center justify-center px-6">
      <div className="flex max-w-md flex-col items-center gap-5 text-center">
        {/* no real photo asset yet — swap for <img src={about.photo}> once one exists */}
        <div className="flex h-28 w-28 items-center justify-center rounded-full border border-[var(--gray-200)] bg-[var(--bg)] text-[10px] tracking-[0.2em] text-[var(--gray-300)]">
          PHOTO
        </div>

        <p className="bg-[var(--bg)] px-3 text-lg font-medium text-[var(--fg)]">
          {about.oneLiner}
        </p>

        <p className="bg-[var(--bg)] px-3 text-sm leading-relaxed text-[var(--gray-500)]">
          {bioMd.trim()}
        </p>
      </div>
    </div>
  );
}
