const CHUNK_SIZE = 50;

/**
 * Renders items in chunks of CHUNK_SIZE with a setTimeout between each chunk
 * to keep the Figma UI responsive.
 *
 * @param items - The array of items to render.
 * @param renderFn - The function called for each item.
 * @param onProgress - Optional callback invoked with current percentage (0-100).
 * @returns A promise that resolves when all items have been rendered.
 */
export function renderInChunks<T>(
  items: T[],
  renderFn: (item: T) => void,
  onProgress?: (percent: number) => void
): Promise<void> {
  return new Promise((resolve) => {
    let index = 0;
    const total = items.length;

    function processChunk(): void {
      const end = Math.min(index + CHUNK_SIZE, total);
      for (; index < end; index++) {
        renderFn(items[index]);
      }
      const percent = Math.round((index / total) * 100);
      onProgress?.(percent);

      if (index < total) {
        setTimeout(processChunk, 0);
      } else {
        resolve();
      }
    }

    if (total === 0) {
      resolve();
    } else {
      processChunk();
    }
  });
}
