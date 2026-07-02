import React from "react";

/**
 * Free Joy — BackToTop
 * Appears after the user scrolls past `offset`; returns to the top on click.
 * Watches the nearest scroll container (`scrollRef`) or the window by default.
 */
export function BackToTop({ offset = 400, scrollRef, label, style, ...rest }) {
  const [show, setShow] = React.useState(false);
  React.useEffect(() => {
    const el = scrollRef && scrollRef.current ? scrollRef.current : window;
    const read = () => {
      const y = el === window ? window.scrollY : el.scrollTop;
      setShow(y > offset);
    };
    read();
    el.addEventListener("scroll", read, { passive: true });
    return () => el.removeEventListener("scroll", read);
  }, [offset, scrollRef]);

  const toTop = () => {
    const el = scrollRef && scrollRef.current ? scrollRef.current : window;
    el.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={toTop}
      aria-label="Back to top"
      style={{
        position: "fixed",
        bottom: 28,
        right: 28,
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        height: 44,
        width: label ? "auto" : 44,
        padding: label ? "0 18px" : 0,
        justifyContent: "center",
        borderRadius: "var(--radius-pill)",
        border: "1px solid var(--border)",
        background: "var(--glass-bg-strong)",
        backdropFilter: "blur(var(--glass-blur)) saturate(170%)",
        WebkitBackdropFilter: "blur(var(--glass-blur)) saturate(170%)",
        color: "var(--text)",
        cursor: "pointer",
        fontFamily: "var(--font-text)",
        fontWeight: "var(--weight-semibold)",
        fontSize: "var(--text-sm)",
        boxShadow: "var(--shadow-md)",
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(12px)",
        pointerEvents: show ? "auto" : "none",
        transition: "opacity var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out)",
        zIndex: "var(--z-fab)",
        ...style,
      }}
      {...rest}
    >
      <span aria-hidden="true" style={{ fontSize: 16, lineHeight: 1 }}>↑</span>
      {label}
    </button>
  );
}
