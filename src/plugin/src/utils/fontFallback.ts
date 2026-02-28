/**
 * Font fallback map: web font names → Figma-available font equivalents.
 * Falls back to 'Inter' for unknown fonts.
 */
export const FONT_FALLBACK_MAP: Record<string, string> = {
  // System fonts
  'system-ui': 'Inter',
  '-apple-system': 'Inter',
  'BlinkMacSystemFont': 'Inter',
  'Segoe UI': 'Segoe UI',
  'Helvetica Neue': 'Helvetica Neue',
  'Arial': 'Arial',
  'Helvetica': 'Helvetica',
  'sans-serif': 'Inter',
  'serif': 'Georgia',
  'monospace': 'Roboto Mono',

  // Common Google Fonts
  'Roboto': 'Roboto',
  'Open Sans': 'Open Sans',
  'Lato': 'Lato',
  'Montserrat': 'Montserrat',
  'Oswald': 'Oswald',
  'Source Sans Pro': 'Source Sans Pro',
  'Raleway': 'Raleway',
  'PT Sans': 'PT Sans',
  'Nunito': 'Nunito',
  'Poppins': 'Poppins',

  // Common serif
  'Georgia': 'Georgia',
  'Times New Roman': 'Times New Roman',
  'Merriweather': 'Merriweather',

  // Monospace
  'Courier New': 'Courier New',
  'Roboto Mono': 'Roboto Mono',
  'Source Code Pro': 'Source Code Pro',
  'Fira Code': 'Fira Code',
};

/**
 * Resolves a CSS font-family stack to the first available Figma font name.
 * Falls back to 'Inter' if no match is found.
 *
 * @param fontFamily - The CSS font-family value (comma-separated list).
 * @returns The resolved Figma font name and whether a substitution was made.
 */
export function resolveFontName(fontFamily: string): { name: string; substituted: boolean } {
  const fonts = fontFamily
    .split(',')
    .map((f) => f.trim().replace(/^['"]|['"]$/g, ''));

  for (const font of fonts) {
    const resolved = FONT_FALLBACK_MAP[font];
    if (resolved) {
      const substituted = resolved !== font;
      return { name: resolved, substituted };
    }
  }

  return { name: 'Inter', substituted: true };
}
