// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { sanitizeElement } from '../../src/extension/src/utils/domPurify';

vi.mock('dompurify', () => ({
  default: { sanitize: (html: string) => html },
}));

/** Sensitive data patterns that must never appear in sanitized output. */
const SENSITIVE_PATTERNS = [
  { name: 'JWT token', attr: 'data-token', value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxx' },
  { name: 'API key', attr: 'data-key', value: 'sk-proj-abc123def456' },
  { name: 'password', attr: 'data-password', value: 'superSecret123!' },
  { name: 'CPF', attr: 'data-cpf', value: '123.456.789-00' },
  { name: 'credit card', attr: 'data-card', value: '4111 1111 1111 1111' },
  { name: 'auth token', attr: 'data-auth', value: 'Bearer abc123' },
  { name: 'secret', attr: 'data-secret', value: 'mysecretvalue' },
];

describe('Data exfiltration prevention', () => {
  it.each(SENSITIVE_PATTERNS)(
    'removes $name from element attributes',
    ({ attr, value }) => {
      const el = document.createElement('div');
      el.setAttribute(attr, value);
      el.textContent = 'safe content';

      const result = sanitizeElement(el);

      expect(result).not.toContain(value);
      expect(result).not.toContain(attr);
    }
  );

  it('removes sensitive attributes from nested children', () => {
    const parent = document.createElement('div');
    const child = document.createElement('span');
    child.setAttribute('data-token', 'secret-child-token');
    child.textContent = 'child text';
    parent.appendChild(child);

    const result = sanitizeElement(parent);
    expect(result).not.toContain('secret-child-token');
    expect(result).not.toContain('data-token');
  });

  it('preserves non-sensitive data attributes', () => {
    const el = document.createElement('div');
    el.setAttribute('data-id', '42');
    el.setAttribute('data-component', 'button');

    const result = sanitizeElement(el);
    expect(result).toContain('data-id');
    expect(result).toContain('data-component');
  });
});
