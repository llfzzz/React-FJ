import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

export interface ImplSelectOption<T extends string> {
  value: T;
  label: string;
  /** Small format glyph (mono abbreviation or logomark) shown before the label. */
  badge: ReactNode;
}

interface ImplSelectProps<T extends string> {
  /** Axis name ("Language" / "Style") — prefixes the accessible name. */
  label: string;
  options: readonly ImplSelectOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

/**
 * The implementation bar's compact dropdown select: a pill trigger showing the
 * current choice, opening a listbox where the active option carries a coral
 * dot. Follows the button-plus-listbox pattern — arrows move, Enter/Space
 * picks, Escape closes and restores focus, outside pointer-down dismisses.
 */
export function ImplSelect<T extends string>({ label, options, value, onChange }: ImplSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<(HTMLLIElement | null)[]>([]);
  const listId = useId();
  const selected = options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const index = options.findIndex((option) => option.value === value);
    optionRefs.current[Math.max(0, index)]?.focus();
  }, [open, options, value]);

  const close = (refocus: boolean) => {
    setOpen(false);
    if (refocus) triggerRef.current?.focus();
  };

  const pick = (next: T) => {
    if (next !== value) onChange(next);
    close(true);
  };

  const onTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      setOpen(true);
    }
  };

  const onListKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    const index = optionRefs.current.findIndex((el) => el === document.activeElement);
    if (event.key === 'Escape') {
      event.preventDefault();
      close(true);
    } else if (event.key === 'Tab') {
      setOpen(false);
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const delta = event.key === 'ArrowDown' ? 1 : -1;
      const next = (index + delta + options.length) % options.length;
      optionRefs.current[next]?.focus();
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      optionRefs.current[event.key === 'Home' ? 0 : options.length - 1]?.focus();
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (index >= 0) pick(options[index].value);
    }
  };

  return (
    <div className="impl-select" ref={rootRef}>
      <button
        ref={triggerRef}
        type="button"
        className="impl-select-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-label={`${label}: ${selected.label}`}
        onClick={() => setOpen((prev) => !prev)}
        onKeyDown={onTriggerKeyDown}
      >
        <span className="impl-select-badge" aria-hidden="true">
          {selected.badge}
        </span>
        {selected.label}
        <ChevronDown className="impl-select-chevron" size={14} strokeWidth={2} aria-hidden="true" />
      </button>
      {open && (
        <ul className="impl-select-menu" role="listbox" id={listId} aria-label={label} onKeyDown={onListKeyDown}>
          {options.map((option, index) => (
            <li
              key={option.value}
              ref={(el) => {
                optionRefs.current[index] = el;
              }}
              role="option"
              aria-selected={option.value === value}
              tabIndex={-1}
              className="impl-select-option"
              onClick={() => pick(option.value)}
            >
              <span className="impl-select-badge" aria-hidden="true">
                {option.badge}
              </span>
              {option.label}
              {option.value === value && <span className="impl-select-dot" aria-hidden="true" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
