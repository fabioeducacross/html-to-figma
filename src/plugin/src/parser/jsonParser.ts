import type { CaptureData } from '../../extension/src/utils/exportJson';

/** Validates whether the provided value is a valid CaptureData object. */
export function validateCaptureData(data: unknown): data is CaptureData {
  if (typeof data !== 'object' || data === null) return false;
  const d = data as Record<string, unknown>;
  if (d['version'] !== '1.0') return false;
  if (typeof d['timestamp'] !== 'string') return false;
  if (typeof d['url'] !== 'string') return false;
  if (typeof d['viewport'] !== 'object' || d['viewport'] === null) return false;
  if (typeof d['element'] !== 'object' || d['element'] === null) return false;
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
