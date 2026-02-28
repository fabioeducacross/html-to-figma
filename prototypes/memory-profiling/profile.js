#!/usr/bin/env node
/**
 * Prototype: memory-profiling
 *
 * Estimates the heap memory consumed when holding CaptureData objects of
 * varying sizes in memory, validating that processing stays well under the
 * 100 MB target (and the 2 MB JSON limit keeps payloads manageable).
 *
 * Run: node prototypes/memory-profiling/profile.js
 */

'use strict';

const SCENARIOS = [
  { label: '10 elements (typical small component)', count: 10 },
  { label: '50 elements (medium component)', count: 50 },
  { label: '100 elements (limit)', count: 100 },
  { label: '200 elements (over-limit test)', count: 200 },
];

const MAX_HEAP_MB = 100; // target: stay below 100 MB heap increase
const MAX_JSON_BYTES = 2 * 1024 * 1024; // 2 MB

/** Generates a realistic CaptureElement with many computed styles */
function makeElement(index) {
  const styles = {};
  // Real computed style objects have ~300 properties; we use 50 for estimation
  for (let i = 0; i < 50; i++) {
    styles[`css-property-${i}`] = `value-${index}-${i}`;
  }
  return {
    id: `el-${index}`,
    tagName: ['div', 'span', 'section', 'p', 'button'][index % 5],
    styles,
    pseudo: { before: {}, after: {} },
    children: [],
    boundingBox: { x: index * 10, y: index * 5, width: 200, height: 80 },
  };
}

/** Generates a full CaptureData object */
function makeCaptureData(elementCount) {
  const root = makeElement(0);
  root.children = Array.from({ length: elementCount - 1 }, (_, i) => makeElement(i + 1));
  return {
    id: `capture_profile_${elementCount}`,
    version: '1.0',
    timestamp: new Date().toISOString(),
    url: 'https://example.com/profile-test',
    viewport: { width: 1440, height: 900 },
    element: root,
  };
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

// ── Run profiling ─────────────────────────────────────────────────────────────

console.log('=== memory-profiling report ===\n');

let allPassed = true;

for (const scenario of SCENARIOS) {
  // Force GC if available
  if (global.gc) global.gc();

  const before = process.memoryUsage();
  const data = makeCaptureData(scenario.count);
  const json = JSON.stringify(data);
  const after = process.memoryUsage();

  const heapDelta = after.heapUsed - before.heapUsed;
  const jsonBytes = Buffer.byteLength(json, 'utf8');

  const heapOk = heapDelta < MAX_HEAP_MB * 1024 * 1024;
  // Always check JSON size — over-limit scenarios should still produce manageable JSON
  const jsonOk = jsonBytes <= MAX_JSON_BYTES;

  console.log(`Scenario: ${scenario.label}`);
  console.log(`  Elements  : ${scenario.count}`);
  console.log(`  JSON size : ${formatBytes(jsonBytes)}  ${jsonOk ? '✅' : '⚠️ '} (limit: 2 MB)`);
  console.log(`  Heap delta: ${formatBytes(Math.abs(heapDelta))}  ${heapOk ? '✅' : '❌'} (limit: ${MAX_HEAP_MB} MB)`);
  console.log(`  Heap total: ${formatBytes(after.heapUsed)}`);
  console.log();

  if (!heapOk) allPassed = false;
}

if (allPassed) {
  console.log('✅ All memory usage within acceptable bounds.');
} else {
  console.error('❌ Some scenarios exceeded memory limits!');
  process.exit(1);
}

console.log(
  '\nNote: This measures Node.js heap deltas as a proxy for memory usage.\n' +
    'Full memory profiling (detecting leaks, tracking GC cycles) requires\n' +
    'Chrome DevTools Memory tab or Node.js --inspect + heap snapshots.'
);
