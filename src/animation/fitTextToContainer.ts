function getPixelRatio(): number {
  const ctx = document.createElement("canvas").getContext("2d") as any;
  const dpr = window.devicePixelRatio || 1;
  const bsr =
    ctx.webkitBackingStorePixelRatio ||
    ctx.mozBackingStorePixelRatio ||
    ctx.msBackingStorePixelRatio ||
    ctx.oBackingStorePixelRatio ||
    ctx.backingStorePixelRatio ||
    1;
  return dpr / bsr;
}

function createHiDPICanvas(w: number, h: number, pixelRatio: number) {
  const canvas = document.createElement("canvas");
  canvas.width = w * pixelRatio;
  canvas.height = h * pixelRatio;
  canvas.style.width = w + "px";
  canvas.style.height = h + "px";
  const ctx = canvas.getContext("2d")!;
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  return canvas;
}

function getLongestLine(lines: string[], context: CanvasRenderingContext2D) {
  let longest = -1;
  let idx: number | undefined;

  lines.forEach((line, i) => {
    const width = context.measureText(line).width;
    if (width > longest) {
      idx = i;
      if (!line.includes("exempt-from-text-fit-calculation")) {
        longest = width;
      }
    }
  });

  return typeof idx === "number" ? lines[idx] : null;
}

/** Returns the largest font size (px) at which `text`'s longest line fits within `containerWidth`. */
export function fitTextToContainer(
  text: string,
  fontFace: string,
  containerWidth: number
): number {
  const pixelRatio = getPixelRatio();
  const canvas = createHiDPICanvas(containerWidth, 0, pixelRatio);
  const context = canvas.getContext("2d")!;
  const longestLine = getLongestLine(text.split("\n"), context);

  const fits = (candidate: string, size: number) => {
    context.font = `${size}px ${fontFace}`;
    return context.measureText(candidate).width <= canvas.width;
  };

  let fontSize = 300;
  do {
    fontSize--;
  } while (longestLine !== null && !fits(longestLine, fontSize));

  return fontSize / (pixelRatio / 1.62);
}
