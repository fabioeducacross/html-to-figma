/** Parses a CSS color string (hex, rgb, rgba, hsl) to a Figma-compatible RGBA object. */
export function parseColor(
  css: string
): { r: number; g: number; b: number; a: number } | null {
  // Hex
  const hex = css.match(/^#([0-9a-f]{3,8})$/i);
  if (hex) {
    const h = hex[1];
    const expand =
      h.length === 3 || h.length === 4
        ? h
            .split('')
            .map((c) => c + c)
            .join('')
        : h;
    const r = parseInt(expand.slice(0, 2), 16) / 255;
    const g = parseInt(expand.slice(2, 4), 16) / 255;
    const b = parseInt(expand.slice(4, 6), 16) / 255;
    const a = expand.length === 8 ? parseInt(expand.slice(6, 8), 16) / 255 : 1;
    return { r, g, b, a };
  }

  // rgb / rgba
  const rgb = css.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (rgb) {
    return {
      r: parseInt(rgb[1]) / 255,
      g: parseInt(rgb[2]) / 255,
      b: parseInt(rgb[3]) / 255,
      a: rgb[4] !== undefined ? parseFloat(rgb[4]) : 1,
    };
  }

  return null;
}

/** Maps a border-radius CSS value (e.g. "8px") to a number. */
export function parseBorderRadius(value: string): number {
  const match = value.match(/^([\d.]+)px$/);
  return match ? parseFloat(match[1]) : 0;
}

/** Maps CSS display + flex-direction to Figma layoutMode. */
export function mapLayoutMode(
  display: string,
  flexDirection: string
): 'HORIZONTAL' | 'VERTICAL' | 'NONE' {
  if (display !== 'flex' && display !== 'inline-flex') return 'NONE';
  return flexDirection === 'column' ? 'VERTICAL' : 'HORIZONTAL';
}

/** Parses a CSS gap/spacing value (e.g. "16px") to a number. */
export function parseSpacing(value: string): number {
  const match = value.match(/^([\d.]+)px$/);
  return match ? parseFloat(match[1]) : 0;
}

/** Maps CSS opacity string to a 0-1 number. */
export function parseOpacity(value: string): number {
  const n = parseFloat(value);
  return isNaN(n) ? 1 : Math.min(1, Math.max(0, n));
}
