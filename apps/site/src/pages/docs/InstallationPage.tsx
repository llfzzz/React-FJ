import { PageHeader } from '@fj';
import { DocSection } from '../../docs/DocSection';
import { CodeBlock } from '../../docs/CodeBlock';
import { usePageTitle } from '../../lib/usePageTitle';
import tailwindTheme from '../../registry/impl/sources/_tailwind-theme.txt?raw';

const FONTS_SNIPPET = `pnpm add @fontsource-variable/bricolage-grotesque \\
  @fontsource-variable/hanken-grotesk \\
  @fontsource-variable/jetbrains-mono`;

const ALIAS_SNIPPET = `// vite.config.ts
import { defineConfig } from 'vite';
import path from 'node:path';

export default defineConfig({
  resolve: {
    alias: [
      { find: /^@fj$/, replacement: path.resolve(__dirname, 'packages/fj-ui/index.ts') },
      { find: /^@fj\\//, replacement: path.resolve(__dirname, 'packages/fj-ui') + '/' },
    ],
    dedupe: ['react', 'react-dom'],
  },
});`;

const ENTRY_SNIPPET = `// main.tsx — fonts first, then FJ styles, then your overrides
import '@fontsource-variable/bricolage-grotesque/index.css';
import '@fontsource-variable/hanken-grotesk/index.css';
import '@fontsource-variable/jetbrains-mono/index.css';
import '@fj/styles.css';
import './styles/app.css';`;

const FONT_TOKENS_SNIPPET = `/* app.css — map the variable-font family names onto FJ tokens */
:root {
  --font-display: 'Bricolage Grotesque Variable', ui-sans-serif, system-ui, sans-serif;
  --font-text: 'Hanken Grotesk Variable', ui-sans-serif, system-ui, sans-serif;
  --font-mono: 'JetBrains Mono Variable', ui-monospace, 'SF Mono', monospace;
}`;

const TSCONFIG_SNIPPET = `// tsconfig.json — resolve @fj types (the library ships .jsx + .d.ts)
{
  "compilerOptions": {
    "paths": {
      "@fj": ["./packages/fj-ui/index.ts"],
      "@fj/*": ["./packages/fj-ui/*"]
    }
  },
  "include": ["src", "packages/fj-ui"]
}`;

export function InstallationPage() {
  usePageTitle('Installation');
  return (
    <article>
      <PageHeader
        eyebrow="Get started"
        title="Installation"
        description="FJ ships as source — a folder of components and tokens your app aliases as @fj."
      />

      <DocSection id="copy" title="1. Add the library">
        <div className="doc-prose">
          <p>
            Place the <code>fj-ui</code> package in your workspace (this site keeps it at{' '}
            <code>packages/fj-ui</code>). It contains <code>styles.css</code>, the token files, the
            component families, and brand assets. Treat it as a synced mirror: brand changes happen
            in override CSS, never by editing the sources.
          </p>
        </div>
      </DocSection>

      <DocSection id="fonts" title="2. Install the fonts">
        <div className="doc-prose">
          <p>The three families are self-hosted through Fontsource — no CDN at runtime.</p>
        </div>
        <CodeBlock code={FONTS_SNIPPET} lang="bash" />
      </DocSection>

      <DocSection id="alias" title="3. Alias @fj">
        <CodeBlock code={ALIAS_SNIPPET} lang="ts" />
        <CodeBlock code={TSCONFIG_SNIPPET} lang="jsonc" />
      </DocSection>

      <DocSection id="entry" title="4. Load styles in your entry">
        <CodeBlock code={ENTRY_SNIPPET} lang="ts" />
        <CodeBlock code={FONT_TOKENS_SNIPPET} lang="css" />
      </DocSection>

      <DocSection id="tailwind" title="Using FJ with Tailwind">
        <div className="doc-prose">
          <p>
            Every component’s <strong>Implementation</strong> section offers a Tailwind version. Those
            examples reference FJ tokens directly with arbitrary values (e.g.{' '}
            <code>bg-[var(--accent)]</code>), so they stay token- and theme-correct with no extra
            setup. If you’d rather write the shorter <code>bg-accent</code> / <code>rounded-lg</code>{' '}
            forms, add the optional <code>@theme</code> mapping below to your main CSS.
          </p>
        </div>
        <CodeBlock code={tailwindTheme} lang="css" maxHeight={420} />
      </DocSection>
    </article>
  );
}
