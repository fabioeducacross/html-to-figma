/** Maximum allowed size for a capture JSON (2 MB). */
export const MAX_JSON_BYTES = 2 * 1024 * 1024;

/** Bounding box of a captured element. */
export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** ARIA/accessibility attributes captured from an element. */
export interface AccessibilityData {
  role?: string;
  label?: string;
  description?: string;
  hidden?: boolean;
}

/** Captured element data including styles, children, and pseudo-elements. */
export interface CaptureElement {
  id: string;
  tagName: string;
  styles: Record<string, string>;
  pseudo: { before: Record<string, string>; after: Record<string, string> };
  children: CaptureElement[];
  boundingBox: BoundingBox;
  /** Inline SVG source, present only when tagName === 'svg'. */
  svgContent?: string;
  /** Accessibility attributes (ARIA + role). */
  accessibility?: AccessibilityData;
}

/** Full capture data with metadata. */
export interface CaptureData {
  id: string;
  version: '1.0';
  timestamp: string;
  url: string;
  viewport: { width: number; height: number };
  element: CaptureElement;
}

/** Captures computed styles from a DOM element. */
function captureStyles(element: Element): Record<string, string> {
  const computed = window.getComputedStyle(element);
  const styles: Record<string, string> = {};
  for (const prop of Array.from(computed)) {
    styles[prop] = computed.getPropertyValue(prop);
  }
  return styles;
}

/** Captures styles for a pseudo-element. */
function capturePseudoStyles(
  element: Element,
  pseudo: '::before' | '::after'
): Record<string, string> {
  const computed = window.getComputedStyle(element, pseudo);
  const styles: Record<string, string> = {};
  for (const prop of Array.from(computed)) {
    styles[prop] = computed.getPropertyValue(prop);
  }
  return styles;
}

/** Captures ARIA and accessibility attributes from an element. */
function captureAccessibility(element: Element): AccessibilityData | undefined {
  const role = element.getAttribute('role') ?? undefined;
  const label =
    element.getAttribute('aria-label') ??
    element.getAttribute('aria-labelledby') ??
    undefined;
  const description = element.getAttribute('aria-describedby') ?? undefined;
  const hiddenAttr = element.getAttribute('aria-hidden');
  const hidden = hiddenAttr === 'true' ? true : undefined;

  if (role === undefined && label === undefined && description === undefined && hidden === undefined) {
    return undefined;
  }
  return { role, label, description, hidden };
}

/** Recursively builds the element tree. */
function buildElementTree(element: Element): CaptureElement {
  const rect = element.getBoundingClientRect();
  const isSvg = element.tagName.toLowerCase() === 'svg';
  const a11y = captureAccessibility(element);
  return {
    id: element.id || '',
    tagName: element.tagName.toLowerCase(),
    styles: captureStyles(element),
    pseudo: {
      before: capturePseudoStyles(element, '::before'),
      after: capturePseudoStyles(element, '::after'),
    },
    children: isSvg ? [] : Array.from(element.children).map(buildElementTree),
    boundingBox: {
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
    },
    // Capture full SVG markup for inline SVG elements (Fase 2 — SVG passthrough)
    ...(isSvg ? { svgContent: element.outerHTML } : {}),
    // Capture ARIA/accessibility attributes when present (Fase 2 — A11y)
    ...(a11y !== undefined ? { accessibility: a11y } : {}),
  };
}

/**
 * Generates the full capture JSON for a given DOM element.
 *
 * @param _sanitizedHTML - The sanitized HTML string (unused in tree build, kept for audit trail).
 * @param element - The live DOM element to capture.
 * @returns The complete CaptureData object.
 */
export function generateCaptureJSON(_sanitizedHTML: string, element: Element): CaptureData {
  return {
    id: `capture_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    version: '1.0',
    timestamp: new Date().toISOString(),
    url: window.location.href,
    viewport: { width: window.innerWidth, height: window.innerHeight },
    element: buildElementTree(element),
  };
}

/**
 * Exports a CaptureData object as a JSON string.
 * Throws if the serialized output exceeds MAX_JSON_BYTES (2 MB).
 *
 * @param data - The capture data to export.
 * @returns A formatted JSON string.
 * @throws Error if the JSON exceeds the size limit.
 */
export function exportAsJSON(data: CaptureData): string {
  const json = JSON.stringify(data, null, 2);
  const bytes = new TextEncoder().encode(json).length;
  if (bytes > MAX_JSON_BYTES) {
    throw new Error(
      `O JSON gerado tem ${(bytes / 1024 / 1024).toFixed(2)} MB, ` +
        `acima do limite de ${MAX_JSON_BYTES / 1024 / 1024} MB. ` +
        'Selecione um componente menor ou menos elementos.'
    );
  }
  return json;
}

/**
 * Triggers a browser download of the capture data as a .json file.
 *
 * @param data - The capture data to download.
 */
export function downloadCapture(data: CaptureData): void {
  const json = exportAsJSON(data);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `capture_${data.id}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Copies the capture data JSON to the clipboard.
 *
 * @param data - The capture data to copy.
 */
export async function copyToClipboard(data: CaptureData): Promise<void> {
  await navigator.clipboard.writeText(exportAsJSON(data));
}
