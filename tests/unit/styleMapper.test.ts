import { describe, it, expect } from 'vitest';
import {
  parseColor,
  parseBorderRadius,
  mapLayoutMode,
  parseSpacing,
  parseOpacity,
  isSvgElement,
  getAccessibleName,
} from '../../src/plugin/src/parser/styleMapper';

describe('parseColor', () => {
  it('parses 6-digit hex', () => {
    expect(parseColor('#ff0000')).toEqual({ r: 1, g: 0, b: 0, a: 1 });
  });

  it('parses 3-digit hex', () => {
    const result = parseColor('#f00');
    expect(result?.r).toBeCloseTo(1);
    expect(result?.g).toBe(0);
    expect(result?.b).toBe(0);
    expect(result?.a).toBe(1);
  });

  it('parses rgb()', () => {
    expect(parseColor('rgb(255, 0, 0)')).toEqual({ r: 1, g: 0, b: 0, a: 1 });
  });

  it('parses rgba()', () => {
    const result = parseColor('rgba(0, 255, 0, 0.5)');
    expect(result?.r).toBe(0);
    expect(result?.g).toBe(1);
    expect(result?.b).toBe(0);
    expect(result?.a).toBe(0.5);
  });

  it('returns null for unknown format', () => {
    expect(parseColor('transparent')).toBeNull();
    expect(parseColor('hsl(0, 100%, 50%)')).toBeNull();
  });
});

describe('parseBorderRadius', () => {
  it('parses pixel values', () => {
    expect(parseBorderRadius('8px')).toBe(8);
    expect(parseBorderRadius('0px')).toBe(0);
  });

  it('returns 0 for non-pixel values', () => {
    expect(parseBorderRadius('50%')).toBe(0);
    expect(parseBorderRadius('auto')).toBe(0);
  });
});

describe('mapLayoutMode', () => {
  it('maps flex row to HORIZONTAL', () => {
    expect(mapLayoutMode('flex', 'row')).toBe('HORIZONTAL');
  });

  it('maps flex column to VERTICAL', () => {
    expect(mapLayoutMode('flex', 'column')).toBe('VERTICAL');
  });

  it('maps inline-flex to HORIZONTAL by default', () => {
    expect(mapLayoutMode('inline-flex', 'row')).toBe('HORIZONTAL');
  });

  it('maps non-flex to NONE', () => {
    expect(mapLayoutMode('block', '')).toBe('NONE');
    expect(mapLayoutMode('grid', '')).toBe('NONE');
  });
});

describe('parseSpacing', () => {
  it('parses pixel spacing', () => {
    expect(parseSpacing('16px')).toBe(16);
    expect(parseSpacing('0px')).toBe(0);
  });

  it('returns 0 for non-pixel values', () => {
    expect(parseSpacing('normal')).toBe(0);
  });
});

describe('parseOpacity', () => {
  it('parses valid opacity', () => {
    expect(parseOpacity('0.5')).toBe(0.5);
    expect(parseOpacity('1')).toBe(1);
    expect(parseOpacity('0')).toBe(0);
  });

  it('clamps values to [0, 1]', () => {
    expect(parseOpacity('2')).toBe(1);
    expect(parseOpacity('-0.5')).toBe(0);
  });

  it('returns 1 for NaN', () => {
    expect(parseOpacity('none')).toBe(1);
  });
});

describe('isSvgElement (Fase 2 — SVG passthrough)', () => {
  it('returns true for svg tag', () => {
    expect(isSvgElement('svg')).toBe(true);
    expect(isSvgElement('SVG')).toBe(true);
  });

  it('returns false for non-svg tags', () => {
    expect(isSvgElement('div')).toBe(false);
    expect(isSvgElement('img')).toBe(false);
    expect(isSvgElement('span')).toBe(false);
  });
});

describe('getAccessibleName (Fase 2 — A11y layer names)', () => {
  it('returns aria-label when present', () => {
    expect(getAccessibleName('button', 'Close dialog')).toBe('Close dialog');
  });

  it('falls back to tagName when aria-label is absent', () => {
    expect(getAccessibleName('button')).toBe('button');
    expect(getAccessibleName('div', '')).toBe('div');
    expect(getAccessibleName('section', '   ')).toBe('section');
  });
});
