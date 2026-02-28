#!/usr/bin/env node
/**
 * Prototype: figma-api-performance
 *
 * Simulates the cost of processing CaptureElement trees of varying sizes,
 * validating that:
 *   - 100 elements can be processed in < 5 s on a modern machine
 *   - chunk-based processing (50 per batch) keeps each chunk < 500 ms
 *
 * Run: node prototypes/figma-api-performance/benchmark.js
 */

'use strict';

const CHUNK_SIZE = 50;
const SCENARIOS = [10, 50, 100];

/** Simulates the CSS→Figma mapping work per node (color parse, layout map, etc.) */
function simulateNodeProcessing(element) {
  // Parse a hex color (mirrors parseColor logic)
  const hex = '#0075ca';
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  // Simulate font resolution
  const fontFamilyMap = {
    'system-ui': 'Inter',
    Roboto: 'Roboto',
    Arial: 'Arial',
  };
  const resolved = fontFamilyMap[element.fontFamily] ?? 'Inter';

  // Simulate bbox processing
  const bbox = element.boundingBox;
  const area = bbox.width * bbox.height;

  // Return a minimal "figma node" object
  return { r, g, b, font: resolved, area, tag: element.tagName };
}

/** Creates a flat array of synthetic capture elements */
function generateElements(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: `el-${i}`,
    tagName: i % 3 === 0 ? 'div' : i % 3 === 1 ? 'span' : 'p',
    fontFamily: ['system-ui', 'Roboto', 'Arial'][i % 3],
    styles: { 'background-color': `#${(i * 1234).toString(16).padStart(6, '0').slice(0, 6)}` },
    boundingBox: { x: i * 2, y: i * 3, width: 100 + i, height: 50 + i },
  }));
}

/** Processes elements in chunks, returning timing data */
function processInChunks(elements) {
  return new Promise((resolve) => {
    const results = [];
    let idx = 0;
    const chunkTimes = [];

    function processChunk() {
      const start = performance.now();
      const end = Math.min(idx + CHUNK_SIZE, elements.length);
      for (; idx < end; idx++) {
        results.push(simulateNodeProcessing(elements[idx]));
      }
      chunkTimes.push(performance.now() - start);

      if (idx < elements.length) {
        setImmediate(processChunk);
      } else {
        resolve({ results, chunkTimes });
      }
    }

    if (elements.length === 0) {
      resolve({ results, chunkTimes });
    } else {
      processChunk();
    }
  });
}

async function main() {
  console.log('=== figma-api-performance benchmark ===\n');

  for (const count of SCENARIOS) {
    const elements = generateElements(count);
    const wallStart = performance.now();
    const { chunkTimes } = await processInChunks(elements);
    const wallEnd = performance.now();

    const totalMs = (wallEnd - wallStart).toFixed(2);
    const maxChunkMs = Math.max(...chunkTimes).toFixed(2);
    const avgChunkMs = (chunkTimes.reduce((s, t) => s + t, 0) / chunkTimes.length).toFixed(2);

    const statusTotal = wallEnd - wallStart < 5000 ? '✅' : '❌';
    const statusChunk = Math.max(...chunkTimes) < 500 ? '✅' : '❌';

    console.log(`Scenario: ${count} elements`);
    console.log(`  Total time  : ${totalMs} ms  ${statusTotal} (limit: 5000 ms)`);
    console.log(`  Chunks      : ${chunkTimes.length} × ${CHUNK_SIZE}`);
    console.log(`  Max chunk   : ${maxChunkMs} ms  ${statusChunk} (limit: 500 ms)`);
    console.log(`  Avg chunk   : ${avgChunkMs} ms`);
    console.log();
  }

  console.log('=== benchmark complete ===');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
