import React from "react";

/**
 * Free Joy — Table
 * Simple data table. columns: [{ key, header, align, width, render }]; rows: object[].
 * Optional row hover and a quiet zebra option.
 */
export function Table({ columns = [], rows = [], zebra = false, hover = true, dense = false, style }) {
  const pad = dense ? "10px 14px" : "14px 18px";
  return (
    <div style={{ width: "100%", overflow: "auto", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", background: "var(--surface)", ...style }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-text)" }}>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} style={{
                textAlign: c.align || "left", padding: pad, width: c.width,
                fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)", textTransform: "uppercase", letterSpacing: "0.04em",
                color: "var(--text-subtle)", borderBottom: "1px solid var(--border)", whiteSpace: "nowrap", background: "var(--surface-2)",
              }}>{c.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr
              key={ri}
              style={{ background: zebra && ri % 2 ? "var(--surface-2)" : "transparent", transition: "background var(--dur-fast) var(--ease-out)" }}
              onMouseEnter={(e) => hover && (e.currentTarget.style.background = "var(--surface-hover)")}
              onMouseLeave={(e) => hover && (e.currentTarget.style.background = zebra && ri % 2 ? "var(--surface-2)" : "transparent")}
            >
              {columns.map((c) => (
                <td key={c.key} style={{
                  textAlign: c.align || "left", padding: pad,
                  fontSize: "var(--text-sm)", color: "var(--text)",
                  borderBottom: ri < rows.length - 1 ? "1px solid var(--border)" : "none",
                }}>
                  {c.render ? c.render(row[c.key], row) : row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
