import { useEffect, useRef, useState } from "react";
import rabbitFrames from "../animation/rabbitFrames";

const RUNNER_WIDTH = 200; // px — target on-screen width of the ascii art box
// Rendered at a normal, stable font size and then transform-scaled down to fit
// RUNNER_WIDTH, rather than computing a sub-pixel font size directly — glyph
// advance-widths round to whole device pixels, so a ~2px font renders a
// different width per character depending on devicePixelRatio, which read as
// the rabbit stretching/squishing differently across screens/zoom in Chrome.
// A uniform scale() transform applied after layout doesn't have that problem.
const BASE_FONT_SIZE = 8;
const HORIZONTAL_STRETCH = 1.15; // widens the rabbit slightly relative to its height
const WALK_FPS = 14;
const CROSS_DURATION_MS = 5000; // time to cross the viewport left -> right
const LAST_FRAME = rabbitFrames.length - 1;

interface AsciiRabbitProps {
  /** When true, the rabbit eases to a stop at center, frozen on the last frame — the "caught up" pose. */
  stopped?: boolean;
}

export default function AsciiRabbit({ stopped = false }: AsciiRabbitProps) {
  const preRef = useRef<HTMLPreElement>(null);
  const [frameIndex, setFrameIndex] = useState(0);
  const [size, setSize] = useState<{ scale: number; height: number } | null>(null);
  const [x, setX] = useState(-RUNNER_WIDTH);

  useEffect(() => {
    const rect = preRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    const scale = RUNNER_WIDTH / rect.width;
    setSize({ scale, height: rect.height * scale });
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
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        top: "50%",
        left: 0,
        width: RUNNER_WIDTH,
        height: size?.height || 0,
        transform: `translate(${x}px, -50%)`,
        transition: stopped ? "transform 500ms cubic-bezier(0.22, 1, 0.36, 1)" : "none",
        opacity: size ? 1 : 0,
        pointerEvents: "none",
      }}
    >
      <pre
        ref={preRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          transformOrigin: "top left",
          transform: size
            ? `scale(${size.scale * HORIZONTAL_STRETCH}, ${size.scale})`
            : undefined,
          fontSize: BASE_FONT_SIZE,
          lineHeight: `${BASE_FONT_SIZE}px`,
          fontFamily: "monospace",
          color: "var(--gray-800)",
          margin: 0,
          whiteSpace: "pre",
          userSelect: "none",
        }}
      >
        {rabbitFrames[frameIndex]}
      </pre>
    </div>
  );
}
