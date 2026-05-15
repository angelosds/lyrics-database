"use client";

import { type Song } from "@/db/schema";

type Props = {
  song?: Song;
  action: (formData: FormData) => Promise<void>;
  isNew?: boolean;
};

export function SongForm({ song, action, isNew }: Props) {
  return (
    <form action={action} style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 720 }}>
      <div className="field">
        <label>Título</label>
        <input className="input" type="text" name="title" required defaultValue={song?.title} placeholder="Ex.: Bondade de Deus" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 14 }}>
        <div className="field">
          <label>Intérprete</label>
          <input className="input" type="text" name="interprete" defaultValue={song?.interprete ?? ""} placeholder="Ex.: Banda Ibero" />
        </div>
        <div className="field">
          <label>Ano</label>
          <input className="input" type="number" name="year" defaultValue={song?.year ?? ""} placeholder="2025" min="1900" max="2100" />
        </div>
        <div className="field">
          <label>Tonalidade</label>
          <input className="input mono" type="text" name="key" defaultValue={song?.key ?? ""} placeholder="G" />
        </div>
      </div>

      <div className="field" style={{ maxWidth: 220 }}>
        <label>BPM</label>
        <input className="input mono" type="number" name="bpm" defaultValue={song?.bpm ?? ""} placeholder="72" min="40" max="300" />
      </div>

      <div className="field">
        <label>Letra</label>
        <textarea
          className="textarea mono"
          name="lyrics"
          required
          defaultValue={song?.lyrics}
          rows={20}
          placeholder={"Verso 1\nLinha 2\n\nRefrão\nLinha 2"}
        />
        <div className="help">
          Separe as estrofes com uma linha em branco. Linhas que começam com <span className="mono">[</span> são tratadas como rótulos de seção.
        </div>
      </div>

      <div className="field">
        <label>Notas internas</label>
        <textarea
          className="textarea"
          name="notes"
          defaultValue={song?.notes ?? ""}
          rows={3}
          placeholder="Observações para a equipe (não publicado)"
        />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6, flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button type="submit" className="btn btn-primary">Salvar</button>
          <a href="/admin/musicas" className="btn-link">Cancelar</a>
        </div>
        {!isNew && (
          <span style={{ fontSize: 12, color: "var(--fg-faint)" }}>
            Slug: <span className="mono">{song?.slug}</span>
          </span>
        )}
      </div>
    </form>
  );
}
