import { describe, it } from 'vitest';
globalThis.describe = describe;
globalThis.it = it;
import pluginTester from 'babel-plugin-tester';
import plugin from '../index';

pluginTester({
  plugin,
  tests: [
    {
      code: '[1, 2, 3];',
    },
    {
      code: 'f();',
    },
    {
      code: '[1, 2, 3].find(v => v === 1);',
      output: '[1, 2, 3].filter((v) => v === 1)[0];',
    },
    {
      code: "[1, 2, 3]['find'](v => v === 1);",
      output: '[1, 2, 3].filter((v) => v === 1)[0];',
    },
    {
      code: 'a.find(v => v === 1);',
      output: 'Array.isArray(a) ? a.filter((v) => v === 1)[0] : a.find((v) => v === 1);',
    },
    {
      code: "a['find'](v => v === 1);",
      output: "Array.isArray(a) ? a.filter((v) => v === 1)[0] : a['find']((v) => v === 1);",
    },
    {
      code: "'a'.find(v => v === 1);",
      output: "Array.isArray('a') ? 'a'.filter((v) => v === 1)[0] : 'a'.find((v) => v === 1);",
    },
    {
      code: "'a'['find'](v => v === 1);",
      output: "Array.isArray('a') ? 'a'.filter((v) => v === 1)[0] : 'a'['find']((v) => v === 1);",
    },
  ],
});
