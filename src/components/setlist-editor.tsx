"use client";

import { useState } from "react";
import { type Song } from "@/db/schema";
import { updateSetlistSongs } from "@/lib/actions/setlists";

type SongMetric = { count: number; lastDate: string | null };

type Props = {
  setlistId: string;
  allSongs: Song[];
  initialSelected: Song[];
  metrics: Record<string, SongMetric>;
};

export function SetlistEditor({ setlistId, allSongs, initialSelected, metrics }: Props) {
  const [selected, setSelected] = useState<Song[]>(initialSelected);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [themeFilter, setThemeFilter] = useState("");

  const available = allSongs.filter((s) => !selected.some((sel) => sel.id === s.id));

  const filteredAvailable = themeFilter.trim()
    ? available.filter(
        (s) =>
          s.themes?.some((t) => t.toLowerCase().includes(themeFilter.toLowerCase())) ||
          s.title.toLowerCase().includes(themeFilter.toLowerCase())
      )
    : available;

  const addSong = (song: Song) => { setSelected((p) => [...p, song]); setSaved(false); };
  const removeSong = (id: string) => { setSelected((p) => p.filter((s) => s.id !== id)); setSaved(false); };

  const moveUp = (index: number) => {
    if (index === 0) return;
    setSelected((p) => { const n = [...p]; [n[index - 1], n[index]] = [n[index], n[index - 1]]; return n; });
    setSaved(false);
  };
  const moveDown = (index: number) => {
    setSelected((p) => {
      if (index === p.length - 1) return p;
      const n = [...p]; [n[index], n[index + 1]] = [n[index + 1], n[index]]; return n;
    });
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    await updateSetlistSongs(setlistId, selected.map((s) => s.id));
    setSaving(false);
    setSaved(true);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 18 }}>
      {/* Left: current setlist */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", borderBottom: "1px solid var(--border)" }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500 }}>Setlist atual</div>
            <div className="small muted">{selected.length} músicas</div>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn btn-primary btn-sm"
            style={{ opacity: saving ? 0.6 : 1 }}
          >
            {saving ? "Salvando…" : saved ? "✓ Salvo" : "Salvar"}
          </button>
        </div>

        {selected.length === 0 ? (
          <div style={{ padding: "32px 18px", textAlign: "center", color: "var(--fg-faint)", fontSize: 13.5 }}>
            Adicione músicas da lista ao lado
          </div>
        ) : (
          selected.map((song, i) => (
            <div
              key={song.id}
              style={{
                display: "grid",
                gridTemplateColumns: "32px 1fr auto auto",
                alignItems: "center",
                gap: 10,
                padding: "12px 18px",
                borderBottom: i < selected.length - 1 ? "1px solid var(--border)" : "none",
              }}
            >
              <span className="mono" style={{ fontSize: 13, color: "var(--fg-faint)" }}>{String(i + 1).padStart(2, "0")}</span>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{song.title}</div>
                {song.key && <div className="small muted mono" style={{ marginTop: 1 }}>{song.key}</div>}
              </div>
              {song.key && <span className="badge badge-key">{song.key}</span>}
              <div style={{ display: "flex", gap: 2 }}>
                <button onClick={() => moveUp(i)} disabled={i === 0} className="icon-btn" title="Subir">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
                </button>
                <button onClick={() => moveDown(i)} disabled={i === selected.length - 1} className="icon-btn" title="Descer">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </button>
                <button onClick={() => removeSong(song.id)} className="icon-btn" title="Remover">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Right: available songs */}
      <div className="card" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 10 }}>Adicionar música</div>
          <input
            className="input"
            type="search"
            placeholder="Filtrar por tema ou título…"
            value={themeFilter}
            onChange={(e) => setThemeFilter(e.target.value)}
            style={{ fontSize: 13, height: 32 }}
          />
        </div>
        <div style={{ maxHeight: 480, overflowY: "auto" }}>
          {filteredAvailable.length === 0 ? (
            <div style={{ padding: "24px 18px", color: "var(--fg-faint)", fontSize: 13.5, textAlign: "center" }}>
              {available.length === 0
                ? "Todas as músicas já estão no setlist."
                : "Nenhuma música corresponde ao filtro."}
            </div>
          ) : (
            filteredAvailable.map((song, i) => {
              const m = metrics[song.id];
              return (
                <div
                  key={song.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto auto",
                    alignItems: "center",
                    gap: 10,
                    padding: "12px 18px",
                    borderBottom: i < filteredAvailable.length - 1 ? "1px solid var(--border)" : "none",
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{song.title}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 3, flexWrap: "wrap" }}>
                      {m && m.count > 0 ? (
                        <span style={{ fontSize: 11.5, color: "var(--fg-faint)" }}>
                          {m.count}× em setlist
                          {m.lastDate && (
                            <> · último: {new Date(m.lastDate + "T12:00:00").toLocaleDateString("pt-BR", { day: "numeric", month: "short" })}</>
                          )}
                        </span>
                      ) : (
                        <span style={{ fontSize: 11.5, color: "var(--fg-faint)" }}>Nunca em setlist</span>
                      )}
                    </div>
                    {song.themes && song.themes.length > 0 && (
                      <div style={{ display: "flex", gap: 3, flexWrap: "wrap", marginTop: 4 }}>
                        {song.themes.map((t) => (
                          <span key={t} className="badge-theme">{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  {song.key && <span className="badge badge-key">{song.key}</span>}
                  <button onClick={() => addSong(song)} className="icon-btn" title="Adicionar">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
