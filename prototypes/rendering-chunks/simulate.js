#!/usr/bin/env node
/**
 * Prototype: rendering-chunks
 *
 * Simulates the chunk-based rendering loop from rendering.ts in Node.js,
 * validating:
 *   1. All items are processed exactly once
 *   2. Progress callback reaches 100%
 *   3. Each chunk takes < 500 ms
 *   4. The assertNodeLimit check blocks over-limit inputs
 *
 * Run: node prototypes/rendering-chunks/simulate.js
 */

'use strict';

const CHUNK_SIZE = 50;
const MAX_RENDER_NODES = 100;

// ── Mirrors rendering.ts ──────────────────────────────────────────────────────

function assertNodeLimit(count) {
  if (count > MAX_RENDER_NODES) {
    throw new Error(
      `O componente contém ${count} elementos, acima do limite de ` +
        `${MAX_RENDER_NODES}. Use o modo Lightweight ou selecione um componente menor.`
    );
  }
}

function renderInChunks(items, renderFn, onProgress) {
  return new Promise((resolve) => {
    let index = 0;
    const total = items.length;

    function processChunk() {
      const end = Math.min(index + CHUNK_SIZE, total);
      for (; index < end; index++) {
        renderFn(items[index]);
      }
      const percent = Math.round((index / total) * 100);
      onProgress?.(percent);

      if (index < total) {
        setImmediate(processChunk);
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

// ── Scenarios ─────────────────────────────────────────────────────────────────

const SCENARIOS = [
  { count: 10, label: '10 elements' },
  { count: 50, label: '50 elements (1 chunk)' },
  { count: 100, label: '100 elements (2 chunks, limit)' },
];

async function runScenario(scenario) {
  const items = Array.from({ length: scenario.count }, (_, i) => ({ id: i }));
  const processed = [];
  const progressHistory = [];
  const chunkTimings = [];

  let chunkStart = performance.now();
  let lastProgress = 0;

  const start = performance.now();

  await renderInChunks(
    items,
    (item) => {
      processed.push(item.id);
    },
    (percent) => {
      const chunkMs = performance.now() - chunkStart;
      chunkTimings.push(chunkMs);
      chunkStart = performance.now();
      progressHistory.push(percent);
      lastProgress = percent;
    }
  );

  const totalMs = performance.now() - start;

  const allProcessed = processed.length === scenario.count;
  const reachedHundred = lastProgress === 100;
  const maxChunk = Math.max(...chunkTimings);
  const chunkOk = maxChunk < 500;

  return {
    label: scenario.label,
    count: scenario.count,
    totalMs: totalMs.toFixed(2),
    chunkCount: chunkTimings.length,
    maxChunkMs: maxChunk.toFixed(2),
    allProcessed,
    reachedHundred,
    chunkOk,
    ok: allProcessed && reachedHundred && chunkOk,
  };
}

async function main() {
  console.log('=== rendering-chunks simulation ===\n');

  let allPassed = true;

  for (const scenario of SCENARIOS) {
    const result = await runScenario(scenario);

    const icon = result.ok ? '✅' : '❌';
    console.log(`${icon} ${result.label}`);
    console.log(`   Total time   : ${result.totalMs} ms`);
    console.log(`   Chunks       : ${result.chunkCount} × ${CHUNK_SIZE}`);
    console.log(`   Max chunk    : ${result.maxChunkMs} ms  ${result.chunkOk ? '✅' : '❌ >500ms'}`);
    console.log(`   All processed: ${result.allProcessed ? '✅' : '❌'} (${result.count} items)`);
    console.log(`   Progress 100%: ${result.reachedHundred ? '✅' : '❌'}`);
    console.log();

    if (!result.ok) allPassed = false;
  }

  // Also test that assertNodeLimit blocks over-limit inputs
  console.log('Testing assertNodeLimit:');
  try {
    assertNodeLimit(100);
    console.log('  ✅ 100 elements: allowed');
  } catch {
    console.log('  ❌ 100 elements: should be allowed');
    allPassed = false;
  }

  try {
    assertNodeLimit(101);
    console.log('  ❌ 101 elements: should have been blocked');
    allPassed = false;
  } catch (err) {
    console.log(`  ✅ 101 elements: blocked — "${err.message.slice(0, 60)}..."`);
  }

  console.log();

  if (allPassed) {
    console.log('✅ All chunk rendering validations passed.');
  } else {
    console.error('❌ Some validations failed!');
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
