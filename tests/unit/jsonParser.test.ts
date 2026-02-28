import { describe, it, expect } from 'vitest';
import { validateCaptureData, parseJSON } from '../../src/plugin/src/parser/jsonParser';

const validCapture = {
  id: 'capture_123',
  version: '1.0' as const,
  timestamp: '2026-02-28T12:00:00.000Z',
  url: 'https://example.com',
  viewport: { width: 1440, height: 900 },
  element: {
    id: 'btn',
    tagName: 'button',
    styles: { color: 'red' },
    pseudo: { before: {}, after: {} },
    children: [],
    boundingBox: { x: 0, y: 0, width: 100, height: 40 },
  },
};

describe('validateCaptureData', () => {
  it('returns true for valid data', () => {
    expect(validateCaptureData(validCapture)).toBe(true);
  });

  it('returns true for svg element with valid svgContent', () => {
    const svgCapture = {
      ...validCapture,
      element: {
        ...validCapture.element,
        tagName: 'svg',
        svgContent: '<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0h10v10H0z"/></svg>',
      },
    };
    expect(validateCaptureData(svgCapture)).toBe(true);
  });

  it('returns false when svgContent is not a string', () => {
    const invalidSvg = {
      ...validCapture,
      element: {
        ...validCapture.element,
        tagName: 'svg',
        svgContent: 123,
      },
    };
    expect(validateCaptureData(invalidSvg)).toBe(false);
  });

  it('returns false when svgContent exists on non-svg element', () => {
    const invalidTag = {
      ...validCapture,
      element: {
        ...validCapture.element,
        tagName: 'div',
        svgContent: '<svg></svg>',
      },
    };
    expect(validateCaptureData(invalidTag)).toBe(false);
  });

  it('returns false for null', () => {
    expect(validateCaptureData(null)).toBe(false);
  });

  it('returns false for wrong version', () => {
    expect(validateCaptureData({ ...validCapture, version: '2.0' })).toBe(false);
  });

  it('returns false when timestamp is missing', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { timestamp: _ts, ...rest } = validCapture;
    expect(validateCaptureData(rest)).toBe(false);
  });

  it('returns false when element is missing', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { element: _el, ...rest } = validCapture;
    expect(validateCaptureData(rest)).toBe(false);
  });
});

describe('parseJSON', () => {
  it('parses valid JSON string', () => {
    const result = parseJSON(JSON.stringify(validCapture));
    expect(result.version).toBe('1.0');
    expect(result.url).toBe('https://example.com');
  });

  it('throws for invalid JSON string', () => {
    expect(() => parseJSON('not-json')).toThrow('JSON inválido: não foi possível fazer o parse.');
  });

  it('throws for JSON that fails schema validation', () => {
    const bad = JSON.stringify({ version: '2.0', timestamp: '2026', url: 'x', viewport: {}, element: {} });
    expect(() => parseJSON(bad)).toThrow('JSON inválido: campos obrigatórios ausentes');
  });
});
