/** Bounding box of a captured element. */
export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Captured element data including styles, children, and pseudo-elements. */
export interface CaptureElement {
  id: string;
  tagName: string;
  styles: Record<string, string>;
  pseudo: { before: Record<string, string>; after: Record<string, string> };
  children: CaptureElement[];
  boundingBox: BoundingBox;
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

/** Recursively builds the element tree. */
function buildElementTree(element: Element): CaptureElement {
  const rect = element.getBoundingClientRect();
  return {
    id: element.id || '',
    tagName: element.tagName.toLowerCase(),
    styles: captureStyles(element),
    pseudo: {
      before: capturePseudoStyles(element, '::before'),
      after: capturePseudoStyles(element, '::after'),
    },
    children: Array.from(element.children).map(buildElementTree),
    boundingBox: {
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
    },
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
 *
 * @param data - The capture data to export.
 * @returns A formatted JSON string.
 */
export function exportAsJSON(data: CaptureData): string {
  return JSON.stringify(data, null, 2);
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
