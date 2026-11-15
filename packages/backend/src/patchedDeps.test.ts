/*
 * Guards the local yarn patches for advisories that have no fixed release
 * (see osv-scanner.toml): deepmerge GHSA-gcqx-w48m-w2h4 and elliptic
 * GHSA-848j-6mx2-7j84. If a dependency bump drops a patch, these fail.
 */
import { createHash } from 'node:crypto';

/* eslint-disable @backstage/no-undeclared-imports */
const deepmerge = require('deepmerge');
const { ec: EC } = require('elliptic');
/* eslint-enable @backstage/no-undeclared-imports */

describe('patched dependencies', () => {
  it('deepmerge never sets the prototype from an own __proto__ key', () => {
    const evil = JSON.parse('{"__proto__":{"polluted":true},"a":1}');
    expect(deepmerge(1, evil).polluted).toBeUndefined();
    expect(deepmerge(evil, { b: 2 }).polluted).toBeUndefined();
    expect(deepmerge(1, evil)).toEqual({ a: 1 });
    expect(deepmerge({ a: { b: 1 } }, { a: { c: 2 } })).toEqual({
      a: { b: 1, c: 2 },
    });
  });

  it('elliptic truncates k by the generated length (RFC 6979)', () => {
    const ec = new EC('p521');
    const key = ec.keyFromPrivate('ab'.repeat(65), 'hex');
    const truncate = ec._truncateToN;
    const seen: Array<[any, any]> = [];
    ec._truncateToN = function wrapped(this: any, m: any, only: any, bl: any) {
      const out = truncate.call(this, m, only, bl);
      if (only) seen.push([m.clone(), out]);
      return out;
    };
    // Sign until at least one k has a leading zero byte (about 1 in 256).
    let leading = 0;
    for (let i = 0; i < 2000 && leading === 0; i++) {
      seen.length = 0;
      const msg = createHash('sha512').update(`m${i}`).digest('hex');
      const sig = key.sign(msg);
      expect(key.verify(msg, sig)).toBe(true);
      for (const [input, out] of seen) {
        if (input.byteLength() < 66) leading++;
        expect(out.eq(input.ushrn(66 * 8 - 521))).toBe(true);
      }
    }
    expect(leading).toBeGreaterThan(0);
  });
});
