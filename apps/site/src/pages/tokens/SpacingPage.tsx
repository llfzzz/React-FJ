import { PageHeader } from '@fj';
import { DocSection } from '../../docs/DocSection';
import { usePageTitle } from '../../lib/usePageTitle';
import { TokenName } from './tokenHelpers';

const SPACE = [
  { name: '--space-1', px: 4 },
  { name: '--space-2', px: 8 },
  { name: '--space-3', px: 12 },
  { name: '--space-4', px: 16 },
  { name: '--space-5', px: 24 },
  { name: '--space-6', px: 32 },
  { name: '--space-7', px: 48 },
  { name: '--space-8', px: 64 },
  { name: '--space-9', px: 96 },
  { name: '--space-10', px: 128 },
];

const RADII = [
  { name: '--radius-xs', px: '4px' },
  { name: '--radius-sm', px: '8px' },
  { name: '--radius-md', px: '12px' },
  { name: '--radius-lg', px: '18px' },
  { name: '--radius-xl', px: '28px' },
  { name: '--radius-pill', px: '999px' },
];

const SHADOWS = ['--shadow-xs', '--shadow-sm', '--shadow-md', '--shadow-lg'];

const Z_LAYERS = [
  ['--z-sticky', '40', 'sticky chrome'],
  ['--z-fab', '50', 'Fab / BackToTop'],
  ['--z-tooltip', '60', 'tooltips'],
  ['--z-modal', '90', 'dialogs'],
  ['--z-popover', '120', 'menus & pickers (above modals)'],
  ['--z-context', '130', 'context menus'],
  ['--z-drawer', '150', 'drawers'],
  ['--z-toast', '200', 'toasts'],
  ['--z-fullscreen', '210', 'full-screen dialogs'],
  ['--z-command', '220', '⌘K palette'],
  ['--z-tour', '230', 'product tours'],
  ['--z-lightbox', '240', 'lightbox'],
];

export function SpacingPage() {
  usePageTitle('Spacing tokens');
  return (
    <article>
      <PageHeader
        eyebrow="Design tokens"
        title="Spacing, radius, elevation"
        description="A 4px scale that leans generous, restrained radii, soft warm shadows, and a tokenized z-order."
      />
      <DocSection id="space" title="Spacing scale">
        <div className="space-rows">
          {SPACE.map((step) => (
            <div className="space-row" key={step.name}>
              <div className="type-scale-meta">
                <TokenName name={step.name} />
                <span className="token-note">{step.px}px</span>
              </div>
              <span className="space-bar" style={{ width: `var(${step.name})` }} aria-hidden />
            </div>
          ))}
        </div>
      </DocSection>
      <DocSection id="radius" title="Radius — pills for interaction, 12–18px for surfaces">
        <div className="radius-grid">
          {RADII.map((radius) => (
            <div className="radius-cell" key={radius.name}>
              <span className="radius-box" style={{ borderRadius: `var(${radius.name})` }} aria-hidden />
              <TokenName name={radius.name} />
              <span className="token-note">{radius.px}</span>
            </div>
          ))}
        </div>
      </DocSection>
      <DocSection id="shadow" title="Shadows — soft, warm, minimal">
        <div className="shadow-grid">
          {SHADOWS.map((shadow) => (
            <div className="shadow-cell" key={shadow} style={{ boxShadow: `var(${shadow})` }}>
              <TokenName name={shadow} />
            </div>
          ))}
        </div>
      </DocSection>
      <DocSection id="z" title="Z-layers — always tokens, never literals">
        <div className="props-table-wrap">
          <table className="props-table">
            <thead>
              <tr>
                <th scope="col">Token</th>
                <th scope="col">Value</th>
                <th scope="col">Used by</th>
              </tr>
            </thead>
            <tbody>
              {Z_LAYERS.map(([name, value, usage]) => (
                <tr key={name}>
                  <td>
                    <code className="props-name">{name}</code>
                  </td>
                  <td>
                    <code className="props-type">{value}</code>
                  </td>
                  <td>{usage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DocSection>
      <DocSection id="misc" title="Layout constants">
        <ul className="doc-list">
          <li>
            <code>--container</code> 1180px · <code>--container-sm</code> 720px — page columns.
          </li>
          <li>
            <code>--tap-target</code> 44px — minimum touch hit area.
          </li>
          <li>
            <code>--opacity-disabled</code> 0.45 — the one disabled look, everywhere.
          </li>
          <li>
            <code>--icon-xs/sm/md/lg</code> 14 / 16 / 18 / 22px — Lucide at 2px stroke.
          </li>
        </ul>
      </DocSection>
    </article>
  );
}
