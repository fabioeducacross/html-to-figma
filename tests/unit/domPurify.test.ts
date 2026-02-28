// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sanitizeHTML, sanitizeElement } from '../../src/extension/src/utils/domPurify';

// Mock DOMPurify so tests run in Node environment
vi.mock('dompurify', () => ({
  default: {
    sanitize: (html: string, _opts?: unknown) => html,
  },
}));

describe('sanitizeHTML', () => {
  it('returns the sanitized HTML string', () => {
    const result = sanitizeHTML('<p>Hello</p>');
    expect(result).toBe('<p>Hello</p>');
  });
});

describe('sanitizeElement', () => {
  beforeEach(() => {
    // Set up a minimal DOM element
    document.body.innerHTML = '';
  });

  it('removes sensitive data-token attributes', () => {
    const el = document.createElement('div');
    el.setAttribute('data-token', 'secret-jwt');
    el.textContent = 'test';

    const result = sanitizeElement(el);
    expect(result).not.toContain('data-token');
  });

  it('removes sensitive data-key attributes', () => {
    const el = document.createElement('div');
    el.setAttribute('data-key', 'api-key-123');
    const result = sanitizeElement(el);
    expect(result).not.toContain('data-key');
  });

  it('removes sensitive data-password attributes', () => {
    const el = document.createElement('div');
    el.setAttribute('data-password', 'hunter2');
    const result = sanitizeElement(el);
    expect(result).not.toContain('data-password');
  });

  it('removes sensitive data-cpf attributes', () => {
    const el = document.createElement('div');
    el.setAttribute('data-cpf', '123.456.789-00');
    const result = sanitizeElement(el);
    expect(result).not.toContain('data-cpf');
  });

  it('preserves non-sensitive data attributes', () => {
    const el = document.createElement('div');
    el.setAttribute('data-id', '42');
    el.setAttribute('data-testid', 'my-component');
    const result = sanitizeElement(el);
    expect(result).toContain('data-id');
    expect(result).toContain('data-testid');
  });
});
