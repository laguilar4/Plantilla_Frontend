import { describe, expect, it } from 'vitest';
import { cn } from './cn';

describe('cn', () => {
  it('joins truthy class names', () => {
    const showB = false;
    expect(cn('a', showB && 'b', 'c')).toBe('a c');
  });

  it('resolves conflicting tailwind classes, keeping the last one', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4');
  });
});
