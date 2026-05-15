import { createSong } from "@/lib/actions/songs";
import { SongForm } from "@/components/song-form";
import Link from "next/link";

export default function NewSongPage() {
  return (
    <div className="container" style={{ padding: "40px var(--pad-x) 56px" }}>
      <Link
        href="/admin/musicas"
        style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--fg-muted)", fontSize: 13, marginBottom: 18, textDecoration: "none" }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5m6-7-7 7 7 7"/>
        </svg>
        Voltar para músicas
      </Link>
      <h1 className="title" style={{ marginBottom: 4 }}>Nova música</h1>
      <p className="small muted" style={{ marginBottom: 32 }}>Adicione uma nova letra ao repositório.</p>
      <SongForm action={createSong} isNew />
    </div>
  );
}
