import { describe, it, expect } from 'vitest';
import { transformSync } from '@babel/core';
import plugin from '../index';

const executeTransformed = (code: string) => {
  const result = transformSync(code, { plugins: [plugin] });
  return eval(result?.code || 'null');
};

describe('exec', () => {
  it('should give output that is functionally equivalent to input', () => {
    expect(executeTransformed('[1, 2, 3].find(v => v === 1)')).toBe(1);
    expect(executeTransformed('[1, 2, 3].find(v => v === 0)')).toBe(undefined);
    expect(executeTransformed('const a = [1, 2, 3]; a.find(v => v === 1)')).toBe(1);
    expect(executeTransformed("({ find: _ => 'a' }).find(v => v === 0)")).toBe('a');
  });
});
