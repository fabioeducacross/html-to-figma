import type { CaptureData } from '../../extension/src/utils/exportJson';

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function validateElementShape(element: unknown): boolean {
  if (!isObject(element)) return false;

  const tagName = element['tagName'];
  if (typeof tagName !== 'string') return false;

  const children = element['children'];
  if (!Array.isArray(children)) return false;
  if (!children.every(validateElementShape)) return false;

  const svgContent = element['svgContent'];
  if (svgContent !== undefined) {
    if (typeof svgContent !== 'string') return false;
    if (tagName.toLowerCase() !== 'svg') return false;
  }

  return true;
}

/** Validates whether the provided value is a valid CaptureData object. */
export function validateCaptureData(data: unknown): data is CaptureData {
  if (!isObject(data)) return false;
  const d = data;
  if (d['version'] !== '1.0') return false;
  if (typeof d['timestamp'] !== 'string') return false;
  if (typeof d['url'] !== 'string') return false;
  if (!isObject(d['viewport'])) return false;
  if (!validateElementShape(d['element'])) return false;
  return true;
}

/**
 * Parses a raw JSON string into a CaptureData object with validation.
 *
 * @param json - The raw JSON string to parse.
 * @returns The parsed and validated CaptureData.
 * @throws Error if the JSON is invalid or does not match the expected schema.
 */
export function parseJSON(json: string): CaptureData {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new Error('JSON inválido: não foi possível fazer o parse.');
  }
  if (!validateCaptureData(parsed)) {
    throw new Error(
      'JSON inválido: campos obrigatórios ausentes ou com tipos incorretos. ' +
        'Certifique-se que o JSON contém: version, timestamp, url, viewport e element.'
    );
  }
  return parsed;
}
