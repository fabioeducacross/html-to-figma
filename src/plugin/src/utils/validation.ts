import { validateCaptureData } from '../parser/jsonParser';
import type { CaptureData } from '../../../extension/src/utils/exportJson';

/**
 * Validates a CaptureData object for use in the Figma plugin.
 * Returns an array of validation error messages (empty if valid).
 *
 * @param data - The data to validate.
 * @returns An array of error messages.
 */
export function getValidationErrors(data: unknown): string[] {
  const errors: string[] = [];

  if (typeof data !== 'object' || data === null) {
    errors.push('O JSON deve ser um objeto.');
    return errors;
  }

  const d = data as Record<string, unknown>;

  if (d['version'] !== '1.0') errors.push('Campo "version" deve ser "1.0".');
  if (typeof d['timestamp'] !== 'string') errors.push('Campo "timestamp" deve ser uma string.');
  if (typeof d['url'] !== 'string') errors.push('Campo "url" deve ser uma string.');
  if (typeof d['viewport'] !== 'object' || d['viewport'] === null)
    errors.push('Campo "viewport" deve ser um objeto.');
  if (typeof d['element'] !== 'object' || d['element'] === null)
    errors.push('Campo "element" deve ser um objeto.');

  return errors;
}

/**
 * Validates a CaptureData object.
 *
 * @param data - The data to validate.
 * @returns True if valid.
 * @throws Error with a descriptive message if invalid.
 */
export function validateImportData(data: unknown): asserts data is CaptureData {
  const errors = getValidationErrors(data);
  if (errors.length > 0) {
    throw new Error(`Dados de importação inválidos:\n${errors.join('\n')}`);
  }
  if (!validateCaptureData(data)) {
    throw new Error('Dados de importação inválidos: schema não corresponde.');
  }
}
