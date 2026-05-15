"use client";

import { useState } from "react";
import { type Song } from "@/db/schema";
import { updateSetlistSongs } from "@/lib/actions/setlists";

type Props = {
  setlistId: string;
  allSongs: Song[];
  initialSelected: Song[];
};

export function SetlistEditor({ setlistId, allSongs, initialSelected }: Props) {
  const [selected, setSelected] = useState<Song[]>(initialSelected);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const available = allSongs.filter((s) => !selected.some((sel) => sel.id === s.id));

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
          <div style={{ fontSize: 14, fontWeight: 500 }}>Adicionar música</div>
        </div>
        <div style={{ maxHeight: 440, overflowY: "auto" }}>
          {available.length === 0 ? (
            <div style={{ padding: "24px 18px", color: "var(--fg-faint)", fontSize: 13.5, textAlign: "center" }}>
              Todas as músicas já estão no setlist.
            </div>
          ) : (
            available.map((song, i) => (
              <div
                key={song.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto auto",
                  alignItems: "center",
                  gap: 10,
                  padding: "12px 18px",
                  borderBottom: i < available.length - 1 ? "1px solid var(--border)" : "none",
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{song.title}</div>
                  <div className="small muted" style={{ marginTop: 1 }}>{[song.album, song.year].filter(Boolean).join(" · ")}</div>
                </div>
                {song.key && <span className="badge badge-key">{song.key}</span>}
                <button onClick={() => addSong(song)} className="icon-btn" title="Adicionar">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
