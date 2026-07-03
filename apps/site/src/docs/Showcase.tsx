import { useMemo, useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { Tabs } from '@fj';
import type { ComponentDoc, ControlValue } from '../registry/types';
import { defaultValues, jsxSnippet } from '../registry/snippet';
import { CodeBlock } from './CodeBlock';
import { ControlPanel } from './ControlPanel';

const TAB_ITEMS = [
  { id: 'preview', label: 'Preview' },
  { id: 'code', label: 'Code' },
];

/** Live preview + code tabs + the customize panel for one component. */
export function Showcase({ doc }: { doc: ComponentDoc }) {
  const initial = useMemo(() => defaultValues(doc.controls), [doc]);
  const [values, setValues] = useState(initial);
  const [tab, setTab] = useState('preview');
  const [replayKey, setReplayKey] = useState(0);

  const dirty = doc.controls.some((control) => values[control.prop] !== control.defaultValue);
  const element = doc.code ? doc.code(values) : jsxSnippet(doc.name, doc.controls, values);
  const code = `${doc.importLine}\n\n${element}`;

  const setValue = (prop: string, value: ControlValue) =>
    setValues((prev) => ({ ...prev, [prop]: value }));

  return (
    <section className="showcase" aria-label={`${doc.name} showcase`}>
      <div className="showcase-main">
        <div className="showcase-bar">
          <Tabs items={TAB_ITEMS} value={tab} onChange={setTab} />
          <div className="showcase-actions">
            {doc.replayable && tab === 'preview' && (
              <button
                type="button"
                className="showcase-reset"
                onClick={() => setReplayKey((key) => key + 1)}
              >
                <Play size={13} aria-hidden />
                Replay
              </button>
            )}
            {dirty && (
              <button type="button" className="showcase-reset" onClick={() => setValues(initial)}>
                <RotateCcw size={13} aria-hidden />
                Reset
              </button>
            )}
          </div>
        </div>
        {tab === 'preview' ? (
          <div className="showcase-stage" key={replayKey}>
            {doc.render(values)}
          </div>
        ) : (
          <CodeBlock code={code} maxHeight={420} />
        )}
      </div>
      {doc.controls.length > 0 && (
        <aside className="showcase-side" aria-label="Customize">
          <span className="fj-eyebrow">Customize</span>
          <ControlPanel controls={doc.controls} values={values} onChange={setValue} />
        </aside>
      )}
    </section>
  );
}
