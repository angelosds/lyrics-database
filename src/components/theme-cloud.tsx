"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

type Theme = { name: string; count: number };

export function ThemeCloud({ themes, selected }: { themes: Theme[]; selected: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(selected.length > 0);

  const toggle = (theme: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const current = params.getAll("theme");
    params.delete("theme");
    if (current.includes(theme)) {
      current.filter((t) => t !== theme).forEach((t) => params.append("theme", t));
    } else {
      [...current, theme].forEach((t) => params.append("theme", t));
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  if (themes.length === 0) return null;

  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
          fontSize: 12.5,
          fontWeight: 500,
          color: open ? "var(--fg)" : "var(--fg-muted)",
          fontFamily: "inherit",
          marginBottom: open ? 10 : 0,
        }}
      >
        <svg
          width="13" height="13" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
          style={{ transition: "transform .15s", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          <path d="m6 9 6 6 6-6"/>
        </svg>
        Filtrar por tema
        {selected.length > 0 && (
          <span style={{
            fontSize: 10,
            fontFamily: "var(--font-mono)",
            padding: "1px 6px",
            borderRadius: 8,
            background: "var(--fg)",
            color: "var(--bg)",
          }}>
            {selected.length}
          </span>
        )}
      </button>

      {open && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {themes.map(({ name, count }) => {
            const on = selected.includes(name);
            return (
              <button
                key={name}
                onClick={() => toggle(name)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "5px 11px",
                  borderRadius: 20,
                  border: on ? "1px solid var(--fg)" : "1px solid var(--border)",
                  background: on ? "var(--fg)" : "var(--bg-elev)",
                  color: on ? "var(--bg)" : "var(--fg-muted)",
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "background .12s, border-color .12s, color .12s",
                  fontFamily: "inherit",
                }}
              >
                {name}
                <span style={{
                  fontSize: 10,
                  fontFamily: "var(--font-mono)",
                  padding: "1px 5px",
                  borderRadius: 8,
                  background: on ? "rgba(255,255,255,0.15)" : "var(--bg-hover)",
                  color: on ? "rgba(255,255,255,0.8)" : "var(--fg-faint)",
                }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
