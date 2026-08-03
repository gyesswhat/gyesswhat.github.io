interface MainScreenProps {
  /** Called when the visitor chooses to follow the rabbit into the About tab. */
  onFollow: () => void;
}

export default function MainScreen({ onFollow }: MainScreenProps) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="flex h-full w-full flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="bg-[var(--bg)] px-2 text-sm tracking-[0.15em] text-[var(--gray-400)]">
          LOOKING FOR
        </p>
        <h1 className="bg-[var(--bg)] px-2 text-4xl font-semibold text-[var(--fg)] sm:text-5xl">
          Gyeore Kim?
        </h1>

        <button
          type="button"
          onClick={onFollow}
          className="group mt-6 flex items-center gap-2 bg-[var(--bg)] px-2 text-lg tracking-wide transition-colors duration-300"
          style={{ color: "var(--accent)" }}
        >
          <span className="border-b border-current pb-0.5 transition-colors duration-300 group-hover:text-[var(--accent-hover)]">
            follow the white rabbit
          </span>
          <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </button>
      </div>
    </div>
  );
}
