import { PageHeader } from '@fj';
import { DocSection } from '../../docs/DocSection';
import { CodeBlock } from '../../docs/CodeBlock';
import { usePageTitle } from '../../lib/usePageTitle';

const IMPORT_SNIPPET = `import { Button, Card, Stack, Text, useToast } from '@fj';

export function PublishBar() {
  return (
    <Card>
      <Stack direction="row" gap={12} align="center" justify="space-between">
        <Text variant="h4">Ready when you are.</Text>
        <Button>Publish quietly</Button>
      </Stack>
    </Card>
  );
}`;

const ACCENT_SNIPPET = `// Per-instance accent — named ramps or any CSS color
<Button accent="sun">Sunny action</Button>
<Button accent="bloom">Lilac action</Button>
<Tag accent="var(--info-500)">Custom</Tag>`;

const TOKENS_SNIPPET = `/* Build custom pieces from the same tokens the library uses */
.note {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  box-shadow: var(--shadow-xs);
  transition: box-shadow var(--dur-base) var(--ease-out);
}`;

export function UsagePage() {
  usePageTitle('Usage');
  return (
    <article>
      <PageHeader
        eyebrow="Get started"
        title="Usage"
        description="Import from the barrel, lean on tokens, and let the system carry the tone."
      />

      <DocSection id="import" title="Importing components">
        <CodeBlock code={IMPORT_SNIPPET} lang="tsx" />
      </DocSection>

      <DocSection id="accent" title="Per-instance accents">
        <div className="doc-prose">
          <p>
            Interactive components accept an <code>accent</code> prop — <code>"coral"</code>{' '}
            (default), <code>"sun"</code>, <code>"bloom"</code>, or any CSS color. Use it as
            punctuation, not decoration: the primary path stays coral.
          </p>
        </div>
        <CodeBlock code={ACCENT_SNIPPET} lang="tsx" />
      </DocSection>

      <DocSection id="tokens" title="Building with tokens">
        <div className="doc-prose">
          <p>
            Anything custom should read from the same custom properties the library uses — never
            hard-code a hex value or a magic duration. That is what keeps new surfaces on-brand
            under any retheme.
          </p>
        </div>
        <CodeBlock code={TOKENS_SNIPPET} lang="css" />
      </DocSection>

      <DocSection id="motion" title="Animation etiquette">
        <ul className="doc-list">
          <li>UI transitions use the animation tokens: instant/fast for controls, base for surfaces.</li>
          <li>Decorative animation comes only from the animation family — one flagship per view.</li>
          <li>Reduced motion is handled globally; JS-driven animations also check matchMedia.</li>
          <li>Never animate layout — transform and opacity only.</li>
        </ul>
      </DocSection>
    </article>
  );
}
