import DOMPurify from 'dompurify';

/** Sensitive data attribute patterns to strip (tokens, passwords, PII). */
const SENSITIVE_ATTR_PATTERNS = [
  /^data-token/i,
  /^data-key/i,
  /^data-secret/i,
  /^data-password/i,
  /^data-cpf/i,
  /^data-card/i,
  /^data-auth/i,
];

/** Checks whether an attribute name matches a sensitive pattern. */
function isSensitiveAttr(name: string): boolean {
  return SENSITIVE_ATTR_PATTERNS.some((re) => re.test(name));
}

/**
 * Sanitizes an HTML string using DOMPurify, removing dangerous tags, event
 * handlers, and javascript: URLs (including those in style attributes).
 *
 * @param html - The raw HTML string to sanitize.
 * @returns The sanitized HTML string.
 */
export function sanitizeHTML(html: string): string {
  const sanitized = DOMPurify.sanitize(html, {
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
  });
  // Post-process: strip javascript: URLs that may remain in style attributes
  // Also strip CSS expression() — IE-only attack vector, but handled defensively
  return sanitized
    .replace(/javascript\s*:/gi, '')
    .replace(/expression\s*\(/gi, '(');
}

/**
 * Sanitizes an element and returns a safe HTML string with sensitive
 * data attributes removed.
 *
 * @param element - The DOM element to process.
 * @returns The sanitized HTML string.
 */
export function sanitizeElement(element: Element): string {
  // Clone to avoid mutating the live DOM
  const clone = element.cloneNode(true) as Element;

  // Remove sensitive data attributes from all descendants (including root)
  const all = [clone, ...Array.from(clone.querySelectorAll('*'))];
  for (const el of all) {
    for (const attr of Array.from(el.attributes)) {
      if (isSensitiveAttr(attr.name)) {
        el.removeAttribute(attr.name);
      }
    }
  }

  return sanitizeHTML(clone.outerHTML);
}
