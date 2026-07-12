// Type-checks every authored TSX implementation port (sources/*.tsx-css.txt,
// sources/*.tsx-tailwind.txt) so the TypeScript variants users copy actually
// compile under the site's strictness. Each port is staged as a real .tsx
// module in a scratch dir (with a .d.css.ts shim for its stylesheet import),
// then one `tsc --noEmit` run covers them all.
//
// Run with: pnpm check:impl (part of the content-migration loop; not wired
// into `pnpm typecheck`, which covers the site itself).

import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const sourcesDir = join(root, "apps/site/src/registry/impl/sources");
const scratch = join(root, "apps/site/node_modules/.tmp/impl-port-check");

/** "tilt-card" → "TiltCard" (mirrors the display file name of a port). */
function pascal(id) {
  return id.replace(/(^|-)([a-z0-9])/g, (_, __, ch) => ch.toUpperCase());
}

rmSync(scratch, { recursive: true, force: true });
mkdirSync(scratch, { recursive: true });

let staged = 0;
for (const file of readdirSync(sourcesDir)) {
  const match = file.match(/^(.+)\.tsx-(css|tailwind)\.txt$/);
  if (!match) continue;
  const [, id, styling] = match;
  const name = pascal(id);
  const dir = join(scratch, `${id}-${styling}`);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, `${name}.tsx`), readFileSync(join(sourcesDir, file), "utf8"));
  if (styling === "css") {
    // Satisfies the port's `import "./<Name>.css"` under allowArbitraryExtensions.
    writeFileSync(join(dir, `${name}.d.css.ts`), "export {};\n");
  }
  staged++;
}

if (staged === 0) {
  console.log("No TSX ports found — nothing to check.");
  process.exit(0);
}

const tsconfig = {
  compilerOptions: {
    target: "ES2022",
    lib: ["ES2022", "DOM", "DOM.Iterable"],
    module: "ESNext",
    moduleResolution: "bundler",
    jsx: "react-jsx",
    strict: true,
    noUnusedLocals: true,
    noUnusedParameters: true,
    noFallthroughCasesInSwitch: true,
    verbatimModuleSyntax: true,
    skipLibCheck: true,
    isolatedModules: true,
    moduleDetection: "force",
    allowArbitraryExtensions: true,
    noEmit: true,
    paths: {
      react: [join(root, "apps/site/node_modules/@types/react/index.d.ts")],
      "react/jsx-runtime": [join(root, "apps/site/node_modules/@types/react/jsx-runtime.d.ts")],
    },
  },
  include: ["**/*.tsx", "**/*.ts"],
};
writeFileSync(join(scratch, "tsconfig.json"), JSON.stringify(tsconfig, null, 2));

const tsc = join(root, "node_modules/typescript/bin/tsc");
const result = spawnSync(process.execPath, [tsc, "-p", scratch, "--pretty"], {
  stdio: "inherit",
});

if (result.status === 0) {
  console.log(`✓ ${staged} TSX port(s) type-check clean.`);
}
process.exit(result.status ?? 1);
