// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { sanitizeHTML } from '../../src/extension/src/utils/domPurify';

// No DOMPurify mock — these tests use real DOMPurify in the jsdom environment
// to verify that our sanitizeHTML wrapper correctly neutralizes XSS payloads.

const XSS_PAYLOADS = [
  '<img src=x onerror="alert(1)">',
  '<svg onload="alert(1)">',
  '<script>alert(1)</script>',
  '<iframe src="javascript:alert(1)"></iframe>',
  '<a href="javascript:alert(1)">click</a>',
  '<div onclick="alert(1)">click</div>',
  '<form onsubmit="alert(1)">',
  '<input onload="alert(1)">',
  '<body onload="alert(1)">',
  '<video onerror="alert(1)"><source></video>',
  '<audio onerror="alert(1)">',
  '<details open ontoggle="alert(1)">',
  '<marquee onstart="alert(1)">',
  '<select onfocus="alert(1)">',
  '<textarea onfocus="alert(1)">',
  // Encoded variants
  '&#60;script&#62;alert(1)&#60;/script&#62;',
  // Style-based
  '<div style="background:url(javascript:alert(1))">',
];

describe('XSS sanitization', () => {
  it.each(XSS_PAYLOADS)('neutralizes payload: %s', (payload) => {
    const result = sanitizeHTML(payload);
    // After sanitization, no event handler attributes should remain
    expect(result).not.toMatch(/\bon[a-z]+\s*=/i);
    // No script tags should remain
    expect(result).not.toMatch(/<script/i);
    // No javascript: URLs should remain
    expect(result).not.toMatch(/javascript\s*:/i);
  });
});
