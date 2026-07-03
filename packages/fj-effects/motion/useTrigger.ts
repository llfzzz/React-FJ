import { useCallback, useEffect, useRef, useState } from "react";
import type { TriggerMode } from "./types";

export interface UseTriggerOptions {
  /** Play only once (for mount/inview). @default true */
  once?: boolean;
  /** Controlled active state for trigger="manual". */
  active?: boolean;
  /** IntersectionObserver threshold (for inview). @default 0.2 */
  threshold?: number;
  /** Disable the trigger — `active` stays false. @default false */
  disabled?: boolean;
}

export interface UseTriggerResult {
  /** Attach to the element to observe (inview) or bind pointer handlers to. */
  ref: React.RefObject<HTMLElement | null>;
  /** Whether the effect should currently play. */
  active: boolean;
  /** Spread onto the trigger element for hover/click modes. */
  bind: Pick<React.HTMLAttributes<HTMLElement>, "onMouseEnter" | "onMouseLeave" | "onClick">;
  /** Re-run the effect (powers the docs Replay button). */
  replay: () => void;
}

/**
 * Unifies the five trigger modes fj-effects support behind one hook:
 * - "mount"   → active immediately
 * - "inview"  → active when scrolled into view (IntersectionObserver)
 * - "hover"   → active while hovered
 * - "click"   → toggles active on click
 * - "manual"  → follows the controlled `active` prop
 */
export function useTrigger(mode: TriggerMode, options: UseTriggerOptions = {}): UseTriggerResult {
  const { once = true, active: controlled, threshold = 0.2, disabled = false } = options;
  const ref = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState(mode === "mount" && !disabled);
  const [nonce, setNonce] = useState(0);

  // mount: fire once whenever (re)mounted or replayed.
  useEffect(() => {
    if (disabled) {
      setActive(false);
      return;
    }
    if (mode === "mount") setActive(true);
  }, [mode, disabled, nonce]);

  // inview: observe the element.
  useEffect(() => {
    if (disabled || mode !== "inview") return;
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setActive(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(true);
            if (once) io.disconnect();
          } else if (!once) {
            setActive(false);
          }
        });
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [mode, once, threshold, disabled, nonce]);

  const bind: UseTriggerResult["bind"] = {};
  if (!disabled) {
    if (mode === "hover") {
      bind.onMouseEnter = () => setActive(true);
      bind.onMouseLeave = () => setActive(false);
    } else if (mode === "click") {
      bind.onClick = () => setActive((a) => !a);
    }
  }

  const replay = useCallback(() => {
    setActive(false);
    // Next frame: flip back on so transitions re-run from the start.
    requestAnimationFrame(() => setNonce((n) => n + 1));
  }, []);

  const resolvedActive = mode === "manual" ? Boolean(controlled) && !disabled : active;

  return { ref, active: resolvedActive, bind, replay };
}
