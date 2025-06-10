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
    {
      code: 'a.find(v => v === 1, t);',
      output: 'Array.isArray(a) ? a.filter((v) => v === 1, t)[0] : a.find((v) => v === 1, t);',
    },
    {
      code: 'class a extends b {\n  constructor() {\n    super.find((v) => v === 1);\n  }\n}',
      output:
        'class a extends b {\n  constructor() {\n    Array.isArray(this) ? super.filter((v) => v === 1)[0] : super.find((v) => v === 1);\n  }\n}',
    },
    {
      code: 'a.b.find((v) => v === 1);',
      output: 'Array.isArray(a.b) ? a.b.filter((v) => v === 1)[0] : a.b.find((v) => v === 1);',
    },
    {
      code: 'a?.b.find((v) => v === 1);',
      output: 'Array.isArray(a?.b) ? a?.b.filter((v) => v === 1)[0] : a?.b.find((v) => v === 1);',
    },
    {
      code: 'a.b?.find((v) => v === 1);',
      output: 'Array.isArray(a.b) ? a.b?.filter((v) => v === 1)[0] : a.b?.find((v) => v === 1);',
    },
    {
      code: 'a.b.find?.((v) => v === 1);',
      output: 'Array.isArray(a.b) ? a.b.filter?.((v) => v === 1)[0] : a.b.find?.((v) => v === 1);',
    },
    {
      code: 'a?.b.find?.((v) => v === 1);',
      output: 'Array.isArray(a?.b) ? a?.b.filter?.((v) => v === 1)[0] : a?.b.find?.((v) => v === 1);',
    },
    {
      code: 'a.b?.find?.((v) => v === 1);',
      output: 'Array.isArray(a.b) ? a.b?.filter?.((v) => v === 1)[0] : a.b?.find?.((v) => v === 1);',
    },
    {
      code: '[]?.find((v) => v === 1);',
      output: '[]?.filter((v) => v === 1)[0];',
    },
  ],
});
