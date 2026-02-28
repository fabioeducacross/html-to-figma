import { describe, it, expect } from 'vitest';
import { resolveFontName, FONT_FALLBACK_MAP } from '../../src/plugin/src/utils/fontFallback';

describe('FONT_FALLBACK_MAP', () => {
  it('contains common system fonts', () => {
    expect(FONT_FALLBACK_MAP['system-ui']).toBe('Inter');
    expect(FONT_FALLBACK_MAP['Arial']).toBe('Arial');
  });

  it('contains common Google Fonts', () => {
    expect(FONT_FALLBACK_MAP['Roboto']).toBe('Roboto');
    expect(FONT_FALLBACK_MAP['Poppins']).toBe('Poppins');
  });
});

describe('resolveFontName', () => {
  it('resolves a known font directly', () => {
    const result = resolveFontName('Roboto');
    expect(result.name).toBe('Roboto');
    expect(result.substituted).toBe(false);
  });

  it('resolves via fallback stack', () => {
    const result = resolveFontName('"Unknown Font", Arial, sans-serif');
    expect(result.name).toBe('Arial');
    expect(result.substituted).toBe(false);
  });

  it('falls back to Inter for completely unknown fonts', () => {
    const result = resolveFontName('"My Custom Font"');
    expect(result.name).toBe('Inter');
    expect(result.substituted).toBe(true);
  });

  it('strips quotes from font names', () => {
    const result = resolveFontName('"Roboto"');
    expect(result.name).toBe('Roboto');
  });

  it('maps system-ui to Inter with substitution', () => {
    const result = resolveFontName('system-ui');
    expect(result.name).toBe('Inter');
    expect(result.substituted).toBe(true);
  });
});
