/** Status of an image after CORS and availability checks. */
export type ImageStatus = 'OK' | 'CORS_ISSUE' | 'MISSING';

/** Processed image data with status and optional warning. */
export interface ImageData {
  src: string;
  status: ImageStatus;
  width: number;
  height: number;
  warning?: string;
}

/**
 * Checks whether a URL is from the same origin as the current page
 * (same-origin images are always CORS-safe from a content script).
 */
function isSameOrigin(src: string): boolean {
  try {
    const url = new URL(src, window.location.href);
    return url.origin === window.location.origin;
  } catch {
    return false;
  }
}

/**
 * Returns true if the URL is a data: URI (always embeddable).
 */
function isDataURI(src: string): boolean {
  return src.startsWith('data:');
}

/**
 * Infers a potential CORS issue from the URL heuristically.
 * A definitive check would require a network request with credentials=include,
 * which is not possible synchronously. We flag cross-origin images as potential
 * issues and let the Figma plugin report actual failures.
 */
function likelyCORSIssue(src: string): boolean {
  if (!src) return true;
  if (isDataURI(src)) return false;
  if (isSameOrigin(src)) return false;
  return true;
}

/**
 * Processes an img element and returns structured image data including
 * a CORS warning when the image is cross-origin.
 *
 * @param imgElement - The HTMLImageElement to process.
 * @returns ImageData with source URL, dimensions, status, and optional warning.
 */
export function handleImage(imgElement: HTMLImageElement): ImageData {
  const src = imgElement.currentSrc || imgElement.src || '';

  if (!src) {
    return {
      src: '',
      status: 'MISSING',
      width: 0,
      height: 0,
      warning: 'Image has no src attribute.',
    };
  }

  if (likelyCORSIssue(src)) {
    return {
      src,
      status: 'CORS_ISSUE',
      width: imgElement.naturalWidth || imgElement.width || 0,
      height: imgElement.naturalHeight || imgElement.height || 0,
      warning:
        'Image may not load in Figma due to CORS restrictions. ' +
        'A placeholder will be used if the URL is inaccessible.',
    };
  }

  return {
    src,
    status: 'OK',
    width: imgElement.naturalWidth || imgElement.width || 0,
    height: imgElement.naturalHeight || imgElement.height || 0,
  };
}

/**
 * Scans all img elements inside a root element and returns image data
 * for each one, flagging CORS issues.
 *
 * @param root - The root DOM element to scan.
 * @returns Array of ImageData objects, one per img found.
 */
export function scanImages(root: Element): ImageData[] {
  const imgs = Array.from(root.querySelectorAll<HTMLImageElement>('img'));
  return imgs.map(handleImage);
}
