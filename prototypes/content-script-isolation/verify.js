#!/usr/bin/env node
/**
 * Prototype: content-script-isolation
 *
 * Verifies statically that the extension manifest declares the content script
 * in ISOLATED world and that the CSP in extension_pages prevents inline
 * script execution.
 *
 * This is a static analysis tool — full runtime isolation validation requires
 * a real Chrome instance (see docs/SECURITY_MODEL.md §3.3).
 *
 * Run: node prototypes/content-script-isolation/verify.js
 */

'use strict';

const fs = require('fs');
const path = require('path');

const MANIFEST_PATH = path.resolve(__dirname, '../../src/extension/manifest.json');

// ── Load manifest ─────────────────────────────────────────────────────────────

let manifest;
try {
  manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
} catch (err) {
  console.error(`❌ Could not read manifest.json: ${err.message}`);
  process.exit(1);
}

// ── Checks ────────────────────────────────────────────────────────────────────

const checks = [];

function check(name, value, expected, description) {
  const ok = value === expected;
  checks.push({ name, ok, actual: value, expected, description });
}

function checkContains(name, value, needle, description) {
  const ok = typeof value === 'string' && value.includes(needle);
  checks.push({ name, ok, actual: value, expected: `contains "${needle}"`, description });
}

function checkAbsent(name, arr, description) {
  const ok = !Array.isArray(arr) || arr.length === 0;
  checks.push({ name, ok, actual: arr, expected: 'empty or absent', description });
}

// MV3
check(
  'manifest_version',
  manifest.manifest_version,
  3,
  'Must use Manifest V3 (MV3) for Isolated World support'
);

// Content script world
const cs = manifest.content_scripts?.[0];
check(
  'content_script.world',
  cs?.world,
  'ISOLATED',
  'Content script must declare world: ISOLATED to run in Isolated World'
);

// CSP script-src
const csp = manifest.content_security_policy?.extension_pages ?? '';
checkContains(
  'csp.script-src-self',
  csp,
  "script-src 'self'",
  "CSP must restrict scripts to 'self' only"
);
checkContains(
  'csp.object-src-none',
  csp,
  "object-src 'none'",
  "CSP must set object-src 'none' to prevent plugin/flash injection"
);
checkContains(
  'csp.base-uri-none',
  csp,
  "base-uri 'none'",
  "CSP must set base-uri 'none' to prevent base tag injection"
);

// No host_permissions (no external URL access)
checkAbsent(
  'host_permissions.empty',
  manifest.host_permissions,
  'host_permissions must be empty — extension must not request access to external URLs'
);

// No web_accessible_resources with broad matches
const war = manifest.web_accessible_resources ?? [];
const broadMatches = war.flatMap((r) => r.matches ?? []).filter((m) => m === '<all_urls>' || m.startsWith('http'));
check(
  'web_accessible_resources.no_broad_matches',
  broadMatches.length,
  0,
  'web_accessible_resources must not expose resources to all URLs'
);

// Background is a module service worker (MV3)
check(
  'background.type_module',
  manifest.background?.type,
  'module',
  'Background service worker must use type: module for tree-shaking and strict mode'
);

// ── Report ────────────────────────────────────────────────────────────────────

console.log('=== content-script-isolation verification ===\n');

let passed = 0;
let failed = 0;

for (const c of checks) {
  const icon = c.ok ? '✅' : '❌';
  console.log(`  ${icon} ${c.name}`);
  console.log(`     ${c.description}`);
  if (!c.ok) {
    console.log(`     actual: ${JSON.stringify(c.actual)}  expected: ${c.expected}`);
  }
  console.log();
  if (c.ok) passed++;
  else failed++;
}

console.log(`${passed}/${checks.length} checks passed`);

if (failed > 0) {
  console.error(`\n❌ ${failed} check(s) failed — manifest is not correctly configured for isolation!`);
  process.exit(1);
} else {
  console.log('\n✅ Manifest is correctly configured for content script isolation.');
  console.log(
    '\nNote: Full runtime isolation validation (e.g. proving page JS cannot access\n' +
      'extension globals) requires a real Chrome instance with DevTools.\n' +
      'See docs/SECURITY_MODEL.md §3.3 for manual verification steps.'
  );
}
