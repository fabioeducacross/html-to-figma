// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { handleImage, scanImages, type ImageData } from '../../src/extension/src/utils/imageHandler';

/**
 * We test handleImage by constructing minimal mock HTMLImageElement objects
 * (no full DOM required) since the function only reads a few properties.
 */
function makeImg(overrides: Partial<HTMLImageElement> = {}): HTMLImageElement {
  return {
    src: '',
    currentSrc: '',
    naturalWidth: 0,
    naturalHeight: 0,
    width: 0,
    height: 0,
    ...overrides,
  } as unknown as HTMLImageElement;
}

describe('handleImage', () => {
  it('returns MISSING status when src is empty', () => {
    const result = handleImage(makeImg({ src: '', currentSrc: '' }));
    expect(result.status).toBe('MISSING');
    expect(result.warning).toBeDefined();
  });

  it('returns CORS_ISSUE for cross-origin http URL', () => {
    // window.location.origin is about:blank / undefined in test env
    const result = handleImage(
      makeImg({ src: 'https://cdn.example.com/image.jpg', currentSrc: 'https://cdn.example.com/image.jpg' })
    );
    expect(result.status).toBe('CORS_ISSUE');
    expect(result.warning).toContain('CORS');
  });

  it('returns OK for data: URI', () => {
    const dataUri = 'data:image/png;base64,iVBORw0KGgo=';
    const result = handleImage(makeImg({ src: dataUri, currentSrc: dataUri, naturalWidth: 10, naturalHeight: 10 }));
    expect(result.status).toBe('OK');
    expect(result.warning).toBeUndefined();
  });

  it('preserves width and height from naturalWidth/naturalHeight', () => {
    const result = handleImage(
      makeImg({
        src: 'https://cdn.other.com/img.png',
        currentSrc: 'https://cdn.other.com/img.png',
        naturalWidth: 300,
        naturalHeight: 200,
      })
    );
    expect(result.width).toBe(300);
    expect(result.height).toBe(200);
  });

  it('falls back to img.width/height when naturalWidth is 0', () => {
    const result = handleImage(
      makeImg({
        src: 'https://cdn.other.com/img.png',
        currentSrc: 'https://cdn.other.com/img.png',
        naturalWidth: 0,
        naturalHeight: 0,
        width: 150,
        height: 100,
      })
    );
    expect(result.width).toBe(150);
    expect(result.height).toBe(100);
  });

  it('prefers currentSrc over src', () => {
    const result = handleImage(
      makeImg({
        src: 'https://cdn.other.com/small.jpg',
        currentSrc: 'https://cdn.other.com/large.jpg',
      })
    );
    expect(result.src).toBe('https://cdn.other.com/large.jpg');
  });
});

describe('scanImages', () => {
  it('returns empty array when no img elements', () => {
    const div = document.createElement('div');
    expect(scanImages(div)).toEqual([]);
  });

  it('returns one ImageData per img element', () => {
    const div = document.createElement('div');
    const img1 = document.createElement('img');
    img1.src = 'https://cdn.a.com/a.jpg';
    const img2 = document.createElement('img');
    img2.src = 'https://cdn.b.com/b.jpg';
    div.append(img1, img2);

    const results = scanImages(div);
    expect(results).toHaveLength(2);
    results.forEach((r: ImageData) => {
      expect(['OK', 'CORS_ISSUE', 'MISSING']).toContain(r.status);
    });
  });

  it('scans deeply nested img elements', () => {
    const outer = document.createElement('div');
    const inner = document.createElement('section');
    const img = document.createElement('img');
    img.src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
    inner.appendChild(img);
    outer.appendChild(inner);

    const results = scanImages(outer);
    expect(results).toHaveLength(1);
    expect(results[0].status).toBe('OK');
  });
});
