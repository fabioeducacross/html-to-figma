#!/usr/bin/env node
/**
 * Prototype: cors-testing
 *
 * Simulates the CORS detection logic from imageHandler.ts across a set of
 * representative URLs (same-origin, cross-origin, data URIs, empty).
 *
 * Full CORS testing against real websites requires a browser instance.
 * This script validates the classification logic in isolation.
 *
 * Run: node prototypes/cors-testing/simulate.js
 */

'use strict';

// ── Mirrors imageHandler.ts logic ─────────────────────────────────────────────

const PAGE_ORIGIN = 'https://example.com'; // simulated page origin

function isSameOrigin(src) {
  try {
    const url = new URL(src, PAGE_ORIGIN);
    return url.origin === new URL(PAGE_ORIGIN).origin;
  } catch {
    return false;
  }
}

function isDataURI(src) {
  return src.startsWith('data:');
}

function classifyImage(src) {
  if (!src) return { status: 'MISSING', warning: 'Image has no src.' };
  if (isDataURI(src)) return { status: 'OK', warning: null };
  if (isSameOrigin(src)) return { status: 'OK', warning: null };
  return {
    status: 'CORS_ISSUE',
    warning: 'Cross-origin image — may not load in Figma without CORS headers.',
  };
}

// ── Test cases ────────────────────────────────────────────────────────────────

const TEST_CASES = [
  // Same-origin — should be OK
  { src: 'https://example.com/images/logo.png', expected: 'OK' },
  { src: 'https://example.com/assets/bg.jpg', expected: 'OK' },
  // Cross-origin — should be CORS_ISSUE
  { src: 'https://cdn.example.net/logo.png', expected: 'CORS_ISSUE' },
  { src: 'https://images.unsplash.com/photo-123.jpg', expected: 'CORS_ISSUE' },
  { src: 'https://static.cloudflareimages.com/img.jpg', expected: 'CORS_ISSUE' },
  { src: 'https://lh3.googleusercontent.com/abc123', expected: 'CORS_ISSUE' },
  { src: 'https://i.imgur.com/xyz.jpg', expected: 'CORS_ISSUE' },
  { src: 'https://media.giphy.com/media/abc/giphy.gif', expected: 'CORS_ISSUE' },
  { src: 'https://pbs.twimg.com/media/photo.jpg', expected: 'CORS_ISSUE' },
  // Data URIs — always OK
  { src: 'data:image/png;base64,iVBORw0KGgo=', expected: 'OK' },
  { src: 'data:image/svg+xml,%3Csvg%3E%3C/svg%3E', expected: 'OK' },
  // Missing / empty
  { src: '', expected: 'MISSING' },
  { src: null, expected: 'MISSING' },
];

// ── Run simulation ────────────────────────────────────────────────────────────

console.log('=== cors-testing simulation ===');
console.log(`Page origin: ${PAGE_ORIGIN}\n`);

let passed = 0;
let failed = 0;

for (const tc of TEST_CASES) {
  const result = classifyImage(tc.src ?? '');
  const ok = result.status === tc.expected;
  const icon = ok ? '✅' : '❌';
  const src = tc.src ? tc.src.slice(0, 60) : '(empty)';

  console.log(`  ${icon} ${result.status.padEnd(12)} ${src}`);
  if (!ok) {
    console.log(`     Expected: ${tc.expected}, Got: ${result.status}`);
  }
  if (result.warning) {
    console.log(`     ⚠ ${result.warning}`);
  }

  if (ok) passed++;
  else failed++;
}

const corsCount = TEST_CASES.filter((t) => t.expected === 'CORS_ISSUE').length;
console.log(`\n${passed}/${TEST_CASES.length} cases correct (${corsCount} CORS issues correctly detected)`);

if (failed > 0) {
  console.error(`\n❌ ${failed} case(s) failed!`);
  process.exit(1);
} else {
  console.log('\n✅ CORS classification logic validated.');
  console.log(
    '\nNote: Full CORS testing against real websites (checking actual HTTP headers)\n' +
      'requires a browser environment. This script validates the detection logic only.'
  );
}
