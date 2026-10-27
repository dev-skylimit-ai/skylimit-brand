// The guard that makes a shared token system safe: a change made here lands in
// products nobody is looking at while making it. Every theme declares which
// pairs must stay readable; a token edit that breaks one fails the release.
//
// WCAG 2.x contrast. Body text needs 4.5:1, an accent used for links, focus
// rings and button fills needs 3:1.

import { themes, resolve } from "./build.mjs";

function luminance(color) {
  let rgb;
  if (color.startsWith("#")) {
    const n = parseInt(color.slice(1), 16);
    rgb = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  } else {
    const m = /^rgba?\(([^)]+)\)$/.exec(color);
    if (!m) throw new Error(`can't measure "${color}"`);
    const [r, g, b, a = 1] = m[1].split(",").map(Number);
    if (a !== 1) throw new Error(`"${color}" is translucent; contrast depends on what is behind it`);
    rgb = [r, g, b];
  }
  const [r, g, b] = rgb.map((c) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function ratio(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

let failed = 0;
for (const theme of themes) {
  for (const pair of theme.contrast ?? []) {
    const block = theme.blocks[pair.block ?? 0];
    const value = (name) => {
      const v = block.vars[name] ?? theme.blocks[0].vars[name];
      if (!v) throw new Error(`${theme.id}: ${name} is not defined`);
      return resolve(v, `${theme.id} ${name}`).literal;
    };
    const r = ratio(value(pair.fg), value(pair.bg));
    const ok = r >= pair.min;
    if (!ok) failed++;
    const where = `${theme.id} ${block.selector}${block.media ? ` @${block.media}` : ""}`;
    console.log(`${ok ? "ok  " : "FAIL"} ${r.toFixed(2)}:1 (min ${pair.min}) ${pair.fg} on ${pair.bg} — ${where}`);
  }
}

if (failed) {
  console.error(`\n${failed} pair(s) below their minimum. Pick a different step, or give the theme its own.`);
  process.exit(1);
}
