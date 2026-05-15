"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

type Theme = { name: string; count: number };

export function ThemeCloud({ themes, selected }: { themes: Theme[]; selected: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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
  );
}
