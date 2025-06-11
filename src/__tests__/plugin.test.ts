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
      output: '(function (o, a0) {\n  return Array.isArray(o) ? o.filter(a0)[0] : o.find(a0);\n})(a, (v) => v === 1);',
    },
    {
      code: "a['find'](v => v === 1);",
      output: '(function (o, a0) {\n  return Array.isArray(o) ? o.filter(a0)[0] : o.find(a0);\n})(a, (v) => v === 1);',
    },
    {
      code: "'a'.find(v => v === 1);",
      output:
        "(function (o, a0) {\n  return Array.isArray(o) ? o.filter(a0)[0] : o.find(a0);\n})('a', (v) => v === 1);",
    },
    {
      code: "'a'['find'](v => v === 1);",
      output:
        "(function (o, a0) {\n  return Array.isArray(o) ? o.filter(a0)[0] : o.find(a0);\n})('a', (v) => v === 1);",
    },
    {
      code: 'a.find();',
      output: '(function (o) {\n  return Array.isArray(o) ? o.filter()[0] : o.find();\n})(a);',
    },
    {
      code: 'a.find(v => v === 1, t);',
      output:
        '(function (o, a0, a1) {\n  return Array.isArray(o) ? o.filter(a0, a1)[0] : o.find(a0, a1);\n})(a, (v) => v === 1, t);',
    },
    {
      code: 'a.find(v => v === 1, t, x, y, z);',
      output:
        '(function (o, a0, a1, a2, a3, a4) {\n  return Array.isArray(o) ? o.filter(a0, a1, a2, a3, a4)[0] : o.find(a0, a1, a2, a3, a4);\n})(a, (v) => v === 1, t, x, y, z);',
    },
    {
      code: 'a.find(...b, ...c);',
      output:
        '(function (o, ...a) {\n  return Array.isArray(o) ? o.filter(...a)[0] : o.find(...a);\n})(a, ...b, ...c);',
    },
    {
      code: 'class a extends b {\n  constructor() {\n    super.find((v) => v === 1);\n  }\n}',
      output:
        'class a extends b {\n  constructor() {\n    ((o, a0) => {\n      return Array.isArray(this) ? super.filter(a0)[0] : super.find(a0);\n    })(undefined, (v) => v === 1);\n  }\n}',
    },
    {
      code: 'a.b.find((v) => v === 1);',
      output:
        '(function (o, a0) {\n  return Array.isArray(o) ? o.filter(a0)[0] : o.find(a0);\n})(a.b, (v) => v === 1);',
    },
    {
      code: 'a?.b.find((v) => v === 1);',
      output:
        '(function (o, a0) {\n  return Array.isArray(o) ? o?.filter(a0)[0] : o?.find(a0);\n})(a?.b, (v) => v === 1);',
    },
    {
      code: 'a.b?.find((v) => v === 1);',
      output:
        '(function (o, a0) {\n  return Array.isArray(o) ? o?.filter(a0)[0] : o?.find(a0);\n})(a.b, (v) => v === 1);',
    },
    {
      code: 'a.b.find?.((v) => v === 1);',
      output:
        '(function (o, a0) {\n  return Array.isArray(o) ? o.filter?.(a0)[0] : o.find?.(a0);\n})(a.b, (v) => v === 1);',
    },
    {
      code: 'a?.b.find?.((v) => v === 1);',
      output:
        '(function (o, a0) {\n  return Array.isArray(o) ? o?.filter?.(a0)[0] : o?.find?.(a0);\n})(a?.b, (v) => v === 1);',
    },
    {
      code: 'a.b?.find?.((v) => v === 1);',
      output:
        '(function (o, a0) {\n  return Array.isArray(o) ? o?.filter?.(a0)[0] : o?.find?.(a0);\n})(a.b, (v) => v === 1);',
    },
    {
      code: '[]?.find((v) => v === 1);',
      output: '[]?.filter((v) => v === 1)[0];',
    },
    {
      code: 'a().find(b());',
      output: '(function (o, a0) {\n  return Array.isArray(o) ? o.filter(a0)[0] : o.find(a0);\n})(a(), b());',
    },
  ],
});
