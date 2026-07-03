// Generates the "JavaScript" implementation variant for each fj-effects
// component by stripping TypeScript types from the real .tsx source while
// preserving JSX and formatting (esbuild, loader:'tsx', jsx:'preserve').
//
// Output: apps/site/src/registry/impl/generated/<id>.js.txt (committed).
// Run with: pnpm gen:impl
//
// The fj-ui components don't need this — their JS variant is the actual synced
// .jsx file, loaded directly. Only the TSX-authored fj-effects need a port.

import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { transform } from "esbuild";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const componentsDir = join(root, "packages/fj-effects/components");
const outDir = join(root, "apps/site/src/registry/impl/generated");

/** "GradientText.tsx" → "gradient-text" (matches registry ids). */
function kebab(name) {
  return name.replace(/\.tsx$/, "").replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

const header = "// Free Joy — auto-generated JavaScript variant (from the .tsx source).\n// Do not edit by hand — run `pnpm gen:impl`.\n\n";

async function main() {
  if (!existsSync(componentsDir)) {
    console.error(`No fj-effects components at ${componentsDir}`);
    process.exit(1);
  }
  mkdirSync(outDir, { recursive: true });

  const files = readdirSync(componentsDir).filter((f) => f.endsWith(".tsx"));
  let count = 0;
  for (const file of files) {
    const source = readFileSync(join(componentsDir, file), "utf8");
    const { code } = await transform(source, {
      loader: "tsx",
      jsx: "preserve",
      // Keep it readable: no minify, keep original whitespace where esbuild can.
      minify: false,
      // Strip the `import type` lines and type-only imports cleanly.
      treeShaking: false,
    });
    const id = kebab(file);
    // esbuild rewrites .tsx JSX but leaves imports; tidy the trailing blank noise.
    const out = header + code.replace(/\n{3,}/g, "\n\n").trimEnd() + "\n";
    writeFileSync(join(outDir, `${id}.js.txt`), out, "utf8");
    count++;
  }
  console.log(`Generated ${count} JS variant(s) → ${outDir}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
