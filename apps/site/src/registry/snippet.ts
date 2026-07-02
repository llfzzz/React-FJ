import type { ControlDef, ControlValues } from './types';

function serializeProp(name: string, value: string | number | boolean): string | null {
  if (typeof value === 'boolean') return value ? name : `${name}={false}`;
  if (typeof value === 'number') return `${name}={${value}}`;
  return `${name}="${value}"`;
}

/**
 * Builds a copy-ready JSX snippet from the current playground values,
 * omitting props that still sit at their control default.
 */
export function jsxSnippet(component: string, controls: ControlDef[], values: ControlValues): string {
  const attrs: string[] = [];
  let children: string | undefined;

  for (const control of controls) {
    const value = values[control.prop] ?? control.defaultValue;
    if (control.prop === 'children') {
      children = String(value);
      continue;
    }
    if (value === control.defaultValue) continue;
    const serialized = serializeProp(control.prop, value);
    if (serialized) attrs.push(serialized);
  }

  const attrText = attrs.length ? ` ${attrs.join(' ')}` : '';
  return children !== undefined
    ? `<${component}${attrText}>${children}</${component}>`
    : `<${component}${attrText} />`;
}

/** Initial values for a control set. */
export function defaultValues(controls: ControlDef[]): ControlValues {
  const out: ControlValues = {};
  for (const control of controls) out[control.prop] = control.defaultValue;
  return out;
}
