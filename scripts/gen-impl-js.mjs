// Generates the JavaScript implementation ports for the docs' language ×
// styling code switcher by stripping TypeScript types from the authored TSX
// sources while preserving JSX, comments, and formatting (ts-blank-space).
//
// Inputs (authored, committed):
//   apps/site/src/registry/impl/sources/<id>.tsx-css.txt       → generated/<id>.jsx-css.txt
//   apps/site/src/registry/impl/sources/<id>.tsx-tailwind.txt  → generated/<id>.jsx-tailwind.txt
//   packages/fj-effects/components/<Name>.tsx (styling-neutral only)
//                                                              → generated/<id>.js.txt
//
// Output dir: apps/site/src/registry/impl/generated (committed). Files the
// current run doesn't produce are deleted, so the directory never carries
// stale ports. Run with: pnpm gen:impl
//
// Styling-neutral fj-ui components (e.g. CountUp) need no generation — their
// JavaScript variant is the actual synced .jsx file, loaded directly.

import { readdirSync, readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { blankSourceFile } from "ts-blank-space";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const sourcesDir = join(root, "apps/site/src/registry/impl/sources");
const effectsDir = join(root, "packages/fj-effects/components");
const outDir = join(root, "apps/site/src/registry/impl/generated");

/**
 * fj-effects components whose visuals are computed in JavaScript: they have
 * no styling axis (no .tsx-css/.tsx-tailwind ports), so their JavaScript
 * variant is a type-stripped port of the real .tsx source. Keep in sync with
 * the registry entries that pass `stylingNeutral` to impl().
 */
const STYLING_NEUTRAL_EFFECTS = [
  "RotatingText",
  "Magnetic",
  "TiltCard",
  "Sparkles",
  "ConfettiBurst",
  "FadeSwitch",
  "Ripple",
  "ScrambleText",
  "Typewriter",
];

/** "GradientText.tsx" → "gradient-text" (matches registry ids). */
function kebab(name) {
  return name.replace(/\.tsx$/, "").replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

/**
 * Strip TypeScript syntax from a TSX source, keeping JSX, comments, and
 * formatting. ts-blank-space replaces type positions with whitespace; the
 * cleanup pass tightens the blanks so the port reads hand-written:
 *  - lines the strip touched lose runs of 2+ spaces before closers/openers
 *    and keep a single space before `=`,
 *  - whitespace-only lines empty out, 3+ blank lines collapse to one,
 *  - a `react` import kept only for its types is dropped.
 */
function stripTypes(source, fileName) {
  const sourceFile = ts.createSourceFile(fileName, source, ts.ScriptTarget.ESNext, false, ts.ScriptKind.TSX);
  const errors = [];
  let out = blankSourceFile(sourceFile, (node) => errors.push(node));
  if (errors.length > 0) {
    const { line } = sourceFile.getLineAndCharacterOfPosition(errors[0].getStart(sourceFile));
    throw new Error(`${fileName}: unsupported TS syntax at line ${line + 1}`);
  }

  const originalLines = source.split("\n");
  out = out
    .split("\n")
    .map((line, i) => {
      if (line === originalLines[i]) return line;
      return line
        .replace(/[ \t]+$/, "")
        .replace(/(\S)[ \t]{2,}(?=[)\]},;.(])/g, "$1")
        .replace(/(\S)[ \t]{2,}(?=[={])/g, "$1 ");
    })
    .map((line) => (/^[ \t]+$/.test(line) ? "" : line))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/^\n+/, "")
    .trimEnd();

  // The header comment names the language of the port.
  out = out.replace(/^(\/\/[^\n]*)TypeScript/, "$1JavaScript");

  // Drop a react import that only served type positions.
  const importRe = /^import \* as React from ["']react["'];?\n/m;
  const importMatch = out.match(importRe);
  if (importMatch && !out.replace(importMatch[0], "").match(/\bReact\b/)) {
    out = out.replace(importRe, "");
    out = out.replace(/\n{3,}/g, "\n\n");
  }

  return out + "\n";
}

function main() {
  mkdirSync(outDir, { recursive: true });
  const produced = new Set();
  let count = 0;

  // Authored TSX ports → JSX ports.
  for (const file of readdirSync(sourcesDir)) {
    const match = file.match(/^(.+)\.tsx-(css|tailwind)\.txt$/);
    if (!match) continue;
    const [, id, styling] = match;
    const source = readFileSync(join(sourcesDir, file), "utf8");
    const outName = `${id}.jsx-${styling}.txt`;
    writeFileSync(join(outDir, outName), stripTypes(source, file), "utf8");
    produced.add(outName);
    count++;
  }

  // Styling-neutral fj-effects → plain JS variants of the real sources.
  for (const name of STYLING_NEUTRAL_EFFECTS) {
    const path = join(effectsDir, `${name}.tsx`);
    if (!existsSync(path)) {
      throw new Error(`Styling-neutral effect missing: ${path}`);
    }
    const source = readFileSync(path, "utf8");
    const outName = `${kebab(name)}.js.txt`;
    writeFileSync(join(outDir, outName), stripTypes(source, `${name}.tsx`), "utf8");
    produced.add(outName);
    count++;
  }

  // Remove stale ports from earlier runs.
  let removed = 0;
  for (const file of readdirSync(outDir)) {
    if (file.endsWith(".txt") && !produced.has(file)) {
      rmSync(join(outDir, file));
      removed++;
    }
  }

  console.log(`Generated ${count} JavaScript port(s) → ${outDir}${removed ? ` (removed ${removed} stale)` : ""}`);
}

main();
