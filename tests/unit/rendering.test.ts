import { describe, it, expect, vi } from 'vitest';
import {
  renderInChunks,
  assertNodeLimit,
  MAX_RENDER_NODES,
  tryImportInlineSvg,
} from '../../src/plugin/src/utils/rendering';

// Use fake timers so setTimeout resolves instantly in tests
vi.useFakeTimers();

describe('renderInChunks', () => {
  it('calls renderFn for every item', async () => {
    const items = Array.from({ length: 10 }, (_, i) => i);
    const renderFn = vi.fn();

    const promise = renderInChunks(items, renderFn);
    await vi.runAllTimersAsync();
    await promise;

    expect(renderFn).toHaveBeenCalledTimes(10);
    items.forEach((item) => expect(renderFn).toHaveBeenCalledWith(item));
  });

  it('resolves immediately for empty array', async () => {
    const renderFn = vi.fn();
    await renderInChunks([], renderFn);
    expect(renderFn).not.toHaveBeenCalled();
  });

  it('reports 100% progress at end', async () => {
    const items = Array.from({ length: 5 }, (_, i) => i);
    const progress: number[] = [];

    const promise = renderInChunks(items, () => {}, (p) => progress.push(p));
    await vi.runAllTimersAsync();
    await promise;

    expect(progress[progress.length - 1]).toBe(100);
  });

  it('processes items in chunks of 50', async () => {
    const items = Array.from({ length: 120 }, (_, i) => i);

    const renderFn = vi.fn();

    // Track chunk boundaries via progress
    const chunks: number[] = [];
    const promise = renderInChunks(items, renderFn, (p) => chunks.push(p));
    await vi.runAllTimersAsync();
    await promise;

    // 120 items / 50 per chunk = 3 chunks
    expect(chunks.length).toBe(3);
    expect(renderFn).toHaveBeenCalledTimes(120);
  });
});

describe('assertNodeLimit', () => {
  it('does not throw for count at the limit', () => {
    expect(() => assertNodeLimit(MAX_RENDER_NODES)).not.toThrow();
  });

  it('does not throw for count below the limit', () => {
    expect(() => assertNodeLimit(1)).not.toThrow();
    expect(() => assertNodeLimit(50)).not.toThrow();
  });

  it('throws for count above MAX_RENDER_NODES', () => {
    expect(() => assertNodeLimit(MAX_RENDER_NODES + 1)).toThrow(/limite/);
  });

  it('MAX_RENDER_NODES is 100', () => {
    expect(MAX_RENDER_NODES).toBe(100);
  });
});

describe('tryImportInlineSvg', () => {
  it('imports valid inline SVG using importer', async () => {
    const importedNode = { id: 'vector-1' };
    const importer = { importSvgAsync: vi.fn().mockResolvedValue(importedNode) };

    const result = await tryImportInlineSvg(
      {
        tagName: 'svg',
        svgContent: '<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0h10v10H0z"/></svg>',
      },
      importer
    );

    expect(importer.importSvgAsync).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ node: importedNode });
  });

  it('returns null node for non-svg elements', async () => {
    const importer = { importSvgAsync: vi.fn() };
    const result = await tryImportInlineSvg(
      {
        tagName: 'div',
        svgContent: '<svg xmlns="http://www.w3.org/2000/svg"></svg>',
      },
      importer
    );

    expect(importer.importSvgAsync).not.toHaveBeenCalled();
    expect(result).toEqual({ node: null });
  });

  it('returns validation error for unsafe SVG content', async () => {
    const importer = { importSvgAsync: vi.fn() };
    const result = await tryImportInlineSvg(
      {
        tagName: 'svg',
        svgContent: '<svg onload="alert(1)"></svg>',
      },
      importer
    );

    expect(importer.importSvgAsync).not.toHaveBeenCalled();
    expect(result.node).toBeNull();
    expect(result.error).toContain('inseguro');
  });

  it('returns import error when importer throws', async () => {
    const importer = { importSvgAsync: vi.fn().mockRejectedValue(new Error('import failed')) };
    const result = await tryImportInlineSvg(
      {
        tagName: 'svg',
        svgContent: '<svg xmlns="http://www.w3.org/2000/svg"></svg>',
      },
      importer
    );

    expect(result.node).toBeNull();
    expect(result.error).toContain('import failed');
  });
});
