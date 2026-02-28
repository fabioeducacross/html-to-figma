import type { CaptureElement } from '../../../extension/src/utils/exportJson';
import { isSvgElement } from '../parser/styleMapper';

/** Maximum number of nodes the plugin will render (performance guard). */
export const MAX_RENDER_NODES = 100;

const CHUNK_SIZE = 50;

export interface SvgImporter<TNode> {
  importSvgAsync(svgMarkup: string): Promise<TNode>;
}

export interface SvgImportResult<TNode> {
  node: TNode | null;
  error?: string;
}

function getSvgValidationError(svgMarkup: string): string | null {
  const normalized = svgMarkup.trim();
  if (!normalized) return 'SVG inline ausente ou vazio.';
  if (!/^<svg[\s>]/i.test(normalized)) {
    return 'SVG inline inválido: conteúdo não inicia com <svg>.';
  }

  const lower = normalized.toLowerCase();
  if (lower.includes('<script') || /on[a-z]+\s*=/.test(lower) || lower.includes('javascript:')) {
    return 'SVG inline inválido: conteúdo potencialmente inseguro.';
  }

  return null;
}

/**
 * Attempts to import inline SVG markup into Figma as a vector-like node.
 * Returns a structured error instead of throwing, so caller can include it in reports.
 */
export async function tryImportInlineSvg<TNode>(
  element: Pick<CaptureElement, 'tagName' | 'svgContent'>,
  importer: SvgImporter<TNode>
): Promise<SvgImportResult<TNode>> {
  if (!isSvgElement(element.tagName)) {
    return { node: null };
  }

  if (element.svgContent === undefined) {
    return { node: null, error: 'SVG inline ausente para elemento <svg>.' };
  }

  const validationError = getSvgValidationError(element.svgContent);
  if (validationError !== null) {
    return { node: null, error: validationError };
  }

  const svgMarkup = element.svgContent.trim();
  try {
    const node = await importer.importSvgAsync(svgMarkup);
    return { node };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'erro desconhecido ao chamar importSvgAsync';
    return { node: null, error: `Falha ao importar SVG inline: ${message}` };
  }
}

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

/**
 * Enforces the node limit. Throws if the item count exceeds MAX_RENDER_NODES.
 *
 * @param count - The number of nodes to be rendered.
 * @throws Error if count exceeds MAX_RENDER_NODES.
 */
export function assertNodeLimit(count: number): void {
  if (count > MAX_RENDER_NODES) {
    throw new Error(
      `O componente contém ${count} elementos, acima do limite de ` +
        `${MAX_RENDER_NODES}. Use o modo Lightweight ou selecione um componente menor.`
    );
  }
}
