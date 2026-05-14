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

  const available = allSongs.filter(
    (s) => !selected.some((sel) => sel.id === s.id)
  );

  const addSong = (song: Song) => {
    setSelected((prev) => [...prev, song]);
    setSaved(false);
  };

  const removeSong = (id: string) => {
    setSelected((prev) => prev.filter((s) => s.id !== id));
    setSaved(false);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    setSelected((prev) => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
    setSaved(false);
  };

  const moveDown = (index: number) => {
    setSelected((prev) => {
      if (index === prev.length - 1) return prev;
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    await updateSetlistSongs(
      setlistId,
      selected.map((s) => s.id)
    );
    setSaving(false);
    setSaved(true);
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Setlist atual */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-sm text-zinc-400 uppercase tracking-wider">
            Setlist ({selected.length} músicas)
          </h2>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-zinc-100 hover:bg-white disabled:opacity-50 text-zinc-900 font-semibold rounded-lg px-4 py-1.5 text-sm transition-colors"
          >
            {saving ? "Salvando..." : saved ? "✓ Salvo" : "Salvar"}
          </button>
        </div>

        {selected.length === 0 ? (
          <div className="bg-zinc-900 border border-dashed border-zinc-700 rounded-lg p-8 text-center text-sm text-zinc-500">
            Adicione músicas da lista ao lado
          </div>
        ) : (
          <div className="space-y-1">
            {selected.map((song, index) => (
              <div
                key={song.id}
                className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3"
              >
                <span className="text-zinc-600 font-mono text-sm w-5 text-right shrink-0">
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{song.title}</p>
                  {song.key && (
                    <p className="text-xs text-zinc-500 font-mono">{song.key}</p>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    className="p-1 text-zinc-500 hover:text-zinc-200 disabled:opacity-20 transition-colors"
                    title="Mover para cima"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveDown(index)}
                    disabled={index === selected.length - 1}
                    className="p-1 text-zinc-500 hover:text-zinc-200 disabled:opacity-20 transition-colors"
                    title="Mover para baixo"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => removeSong(song.id)}
                    className="p-1 text-zinc-600 hover:text-red-400 transition-colors ml-1"
                    title="Remover"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Músicas disponíveis */}
      <div>
        <h2 className="font-semibold text-sm text-zinc-400 uppercase tracking-wider mb-3">
          Adicionar músicas
        </h2>
        <div className="space-y-1 max-h-[600px] overflow-y-auto">
          {available.length === 0 && (
            <p className="text-sm text-zinc-500 py-4 text-center">
              Todas as músicas já estão no setlist.
            </p>
          )}
          {available.map((song) => (
            <button
              key={song.id}
              onClick={() => addSong(song)}
              className="w-full flex items-center justify-between bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-lg px-4 py-3 text-left transition-all"
            >
              <div>
                <p className="text-sm font-medium">{song.title}</p>
                {(song.album || song.key) && (
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {[song.album, song.key].filter(Boolean).join(" · ")}
                  </p>
                )}
              </div>
              <span className="text-zinc-500 text-lg ml-2">+</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
