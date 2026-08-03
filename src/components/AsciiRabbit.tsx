import { useEffect, useState } from "react";
import rabbitFrames from "../animation/rabbitFrames";
import { fitTextToContainer } from "../animation/fitTextToContainer";

const RUNNER_WIDTH = 200; // px — size of the ascii art box (small, so it reads as a dot-pattern)
const CHAR_RATIO = 0.66;
const WALK_FPS = 14;
const CROSS_DURATION_MS = 5000; // time to cross the viewport left -> right
const LAST_FRAME = rabbitFrames.length - 1;

interface AsciiRabbitProps {
  /** When true, the rabbit eases to a stop at center, frozen on the last frame — the "caught up" pose. */
  stopped?: boolean;
}

export default function AsciiRabbit({ stopped = false }: AsciiRabbitProps) {
  const [frameIndex, setFrameIndex] = useState(0);
  const [fontSize, setFontSize] = useState(0);
  const [x, setX] = useState(-RUNNER_WIDTH);

  useEffect(() => {
    const size = fitTextToContainer(rabbitFrames[0], "monospace", RUNNER_WIDTH);
    setFontSize(size * CHAR_RATIO);
  }, []);

  // walk-cycle: loops forward through the frame set (0..7, 0..7, ...) while running
  useEffect(() => {
    if (stopped) {
      setFrameIndex(LAST_FRAME);
      return;
    }

    let raf: number;
    let last = performance.now();
    let i = 0;
    const interval = 1000 / WALK_FPS;

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (now - last < interval) return;
      last = now;
      i = (i + 1) % rabbitFrames.length;
      setFrameIndex(i);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [stopped]);

  // left -> right traversal across the viewport, looping back to the start while running
  useEffect(() => {
    if (stopped) {
      setX(window.innerWidth / 2 - RUNNER_WIDTH / 2);
      return;
    }

    let raf: number;
    let start: number | null = null;

    const run = (now: number) => {
      raf = requestAnimationFrame(run);
      if (start === null) start = now;

      const elapsed = (now - start) % CROSS_DURATION_MS;
      const progress = elapsed / CROSS_DURATION_MS;
      const travel = window.innerWidth + RUNNER_WIDTH * 2;
      setX(-RUNNER_WIDTH + progress * travel);
    };
    raf = requestAnimationFrame(run);
    return () => cancelAnimationFrame(raf);
  }, [stopped]);

  return (
    <pre
      aria-hidden="true"
      style={{
        position: "absolute",
        top: "50%",
        left: 0,
        width: RUNNER_WIDTH,
        transform: `translate(${x}px, -50%) scaleX(1.06)`,
        transition: stopped ? "transform 500ms cubic-bezier(0.22, 1, 0.36, 1)" : "none",
        fontSize: fontSize || 1,
        lineHeight: `${fontSize || 1}px`,
        fontFamily: "monospace",
        color: "var(--gray-800)",
        margin: 0,
        opacity: fontSize ? 1 : 0,
        pointerEvents: "none",
        whiteSpace: "pre",
        userSelect: "none",
      }}
    >
      {rabbitFrames[frameIndex]}
    </pre>
  );
}
