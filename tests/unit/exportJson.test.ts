import { describe, it, expect } from 'vitest';
import { MAX_JSON_BYTES, exportAsJSON } from '../../src/extension/src/utils/exportJson';
import type { CaptureData, CaptureElement } from '../../src/extension/src/utils/exportJson';

function makeCapture(elementCount = 1): CaptureData {
  const element = {
    id: 'test',
    tagName: 'div',
    styles: { 'background-color': 'rgb(255,255,255)' },
    pseudo: { before: {}, after: {} },
    children: Array.from({ length: elementCount - 1 }, (_, i) => ({
      id: `child-${i}`,
      tagName: 'span',
      styles: {},
      pseudo: { before: {}, after: {} },
      children: [],
      boundingBox: { x: 0, y: 0, width: 10, height: 10 },
    })),
    boundingBox: { x: 0, y: 0, width: 100, height: 100 },
  };
  return {
    id: 'capture_test_001',
    version: '1.0',
    timestamp: new Date().toISOString(),
    url: 'https://example.com/',
    viewport: { width: 1440, height: 900 },
    element,
  };
}

describe('exportAsJSON', () => {
  it('returns a valid JSON string for a small capture', () => {
    const data = makeCapture(1);
    const json = exportAsJSON(data);
    expect(() => JSON.parse(json)).not.toThrow();
  });

  it('throws when JSON exceeds MAX_JSON_BYTES', () => {
    // Create a capture with a very large style object to exceed 2 MB
    const bigStyles: Record<string, string> = {};
    for (let i = 0; i < 20000; i++) {
      bigStyles[`property-${i}`] = 'a'.repeat(110);
    }
    const data: CaptureData = {
      id: 'capture_big',
      version: '1.0',
      timestamp: new Date().toISOString(),
      url: 'https://example.com/',
      viewport: { width: 1440, height: 900 },
      element: {
        id: 'big',
        tagName: 'div',
        styles: bigStyles,
        pseudo: { before: {}, after: {} },
        children: [],
        boundingBox: { x: 0, y: 0, width: 100, height: 100 },
      },
    };
    expect(() => exportAsJSON(data)).toThrow(/limite/);
  });

  it('MAX_JSON_BYTES equals 2 MB', () => {
    expect(MAX_JSON_BYTES).toBe(2 * 1024 * 1024);
  });
});

describe('CaptureElement — Fase 2 fields (SVG + Accessibility)', () => {
  it('accepts svgContent field on SVG elements', () => {
    const svgEl: CaptureElement = {
      id: 'icon',
      tagName: 'svg',
      styles: {},
      pseudo: { before: {}, after: {} },
      children: [],
      boundingBox: { x: 0, y: 0, width: 24, height: 24 },
      svgContent: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"></svg>',
    };
    const data: CaptureData = {
      id: 'c1',
      version: '1.0',
      timestamp: new Date().toISOString(),
      url: 'https://example.com/',
      viewport: { width: 1440, height: 900 },
      element: svgEl,
    };
    const parsed = JSON.parse(exportAsJSON(data));
    expect(parsed.element.svgContent).toContain('<svg');
    expect(parsed.element.tagName).toBe('svg');
  });

  it('accepts accessibility field with ARIA data', () => {
    const el: CaptureElement = {
      id: 'close',
      tagName: 'button',
      styles: {},
      pseudo: { before: {}, after: {} },
      children: [],
      boundingBox: { x: 0, y: 0, width: 32, height: 32 },
      accessibility: { role: 'button', label: 'Close dialog', hidden: false },
    };
    const data: CaptureData = {
      id: 'c2',
      version: '1.0',
      timestamp: new Date().toISOString(),
      url: 'https://example.com/',
      viewport: { width: 1440, height: 900 },
      element: el,
    };
    const parsed = JSON.parse(exportAsJSON(data));
    expect(parsed.element.accessibility.role).toBe('button');
    expect(parsed.element.accessibility.label).toBe('Close dialog');
  });
});
