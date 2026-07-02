import React from "react";

const DRIFT = `
@keyframes fjDriftA { from { transform: translate(0, 0) scale(1); } to { transform: translate(6%, -8%) scale(1.08); } }
@keyframes fjDriftB { from { transform: translate(0, 0) scale(1.05); } to { transform: translate(-7%, 6%) scale(1); } }
@keyframes fjDriftC { from { transform: translate(0, 0) scale(1); } to { transform: translate(4%, 7%) scale(1.06); } }
`;

const VARIANTS = {
  warm: ["var(--joy-500)", "var(--sun-500)", "var(--bloom-500)"],
  cool: ["var(--bloom-500)", "var(--info-500)", "var(--joy-500)"],
  joy:  ["var(--joy-500)", "var(--joy-400)", "var(--sun-500)"],
};

/**
 * Free Joy — AmbientBackground (effect)
 * Section wrapper with 2–3 huge, slow-drifting color washes. Heroes,
 * onboarding, empty states and success screens ONLY — never dense product UI.
 * Drift freezes under reduced motion (global rule); washes stay.
 */
export function AmbientBackground({
  variant = "warm",
  animate = true,
  opacity = 0.14,
  style,
  children,
  ...rest
}) {
  const [c1, c2, c3] = VARIANTS[variant] || VARIANTS.warm;
  const blob = (color, pos, size, anim, dur) => ({
    position: "absolute",
    width: size,
    aspectRatio: "1",
    borderRadius: "50%",
    background: `radial-gradient(circle, color-mix(in srgb, ${color} ${Math.round(opacity * 100)}%, transparent), transparent 70%)`,
    animation: animate ? `${anim} ${dur}s var(--ease-in-out) infinite alternate` : "none",
    pointerEvents: "none",
    ...pos,
  });

  return (
    <div style={{ position: "relative", overflow: "hidden", background: "var(--bg)", ...style }} {...rest}>
      <style dangerouslySetInnerHTML={{ __html: DRIFT }} />
      <div aria-hidden="true" style={blob(c1, { top: "-20%", left: "-10%" }, "55%", "fjDriftA", 26)} />
      <div aria-hidden="true" style={blob(c2, { top: "-10%", right: "-15%" }, "50%", "fjDriftB", 32)} />
      <div aria-hidden="true" style={blob(c3, { bottom: "-25%", left: "25%" }, "48%", "fjDriftC", 29)} />
      <div style={{ position: "relative" }}>{children}</div>
    </div>
  );
}
