import { Input, SegmentedControl, Switch } from '@fj';
import type { ControlDef, ControlValue, ControlValues } from '../registry/types';

interface ControlPanelProps {
  controls: ControlDef[];
  values: ControlValues;
  onChange: (prop: string, value: ControlValue) => void;
}

/** Chip group for enums with too many options for a segmented control. */
function ChipGroup({
  options,
  value,
  onSelect,
}: {
  options: readonly string[];
  value: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="control-chips" role="group">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          className="control-chip"
          aria-pressed={option === value}
          onClick={() => onSelect(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export function ControlPanel({ controls, values, onChange }: ControlPanelProps) {
  return (
    <div className="control-panel">
      {controls.map((control) => {
        const label = control.label ?? control.prop;
        const value = values[control.prop] ?? control.defaultValue;
        if (control.type === 'boolean') {
          return (
            <div className="control-row control-row-inline" key={control.prop}>
              <span className="control-label" id={`control-${control.prop}`}>
                {label}
              </span>
              <Switch
                checked={Boolean(value)}
                onChange={(next) => onChange(control.prop, next)}
                aria-labelledby={`control-${control.prop}`}
              />
            </div>
          );
        }
        if (control.type === 'select') {
          return (
            <div className="control-row" key={control.prop}>
              <span className="control-label">{label}</span>
              {control.options.length <= 3 ? (
                <SegmentedControl
                  size="sm"
                  full
                  options={control.options.map((option) => ({ value: option, label: option }))}
                  value={String(value)}
                  onChange={(next) => onChange(control.prop, next)}
                />
              ) : (
                <ChipGroup
                  options={control.options}
                  value={String(value)}
                  onSelect={(next) => onChange(control.prop, next)}
                />
              )}
            </div>
          );
        }
        if (control.type === 'number') {
          return (
            <div className="control-row" key={control.prop}>
              <Input
                label={label}
                size="sm"
                type="number"
                value={String(value)}
                min={control.min}
                max={control.max}
                step={control.step}
                onChange={(event) => {
                  const next = Number(event.currentTarget.value);
                  if (!Number.isNaN(next)) onChange(control.prop, next);
                }}
              />
            </div>
          );
        }
        return (
          <div className="control-row" key={control.prop}>
            <Input
              label={label}
              size="sm"
              value={String(value)}
              placeholder={control.placeholder}
              onChange={(event) => onChange(control.prop, event.currentTarget.value)}
            />
          </div>
        );
      })}
    </div>
  );
}
