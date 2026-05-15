import { db } from "@/db";
import { songs } from "@/db/schema";
import { archiveSong, restoreSong } from "@/lib/actions/songs";
import Link from "next/link";

export default async function AdminSongsPage() {
  const allSongs = await db.select().from(songs).orderBy(songs.title);
  const active = allSongs.filter((s) => !s.archived);
  const archived = allSongs.filter((s) => s.archived);

  return (
    <div className="container-wide" style={{ padding: "40px var(--pad-x) 56px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 className="title">Músicas</h1>
          <div className="small muted" style={{ marginTop: 4 }}>{active.length} ativas · {archived.length} arquivadas</div>
        </div>
        <Link href="/admin/musicas/nova" className="btn btn-primary">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          Nova Música
        </Link>
      </div>

      <div className="micro" style={{ marginBottom: 10 }}>Ativas</div>
      <div className="card" style={{ overflow: "hidden", marginBottom: 0 }}>
        {active.length === 0 && (
          <div style={{ padding: "24px 18px", color: "var(--fg-faint)", fontSize: 14 }}>Nenhuma música ativa.</div>
        )}
        {active.map((song, i) => (
          <div
            key={song.id}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto auto",
              alignItems: "center",
              gap: 14,
              padding: "14px 18px",
              borderBottom: i < active.length - 1 ? "1px solid var(--border)" : "none",
            }}
          >
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 14.5, fontWeight: 500 }}>{song.title}</div>
              <div className="small muted" style={{ marginTop: 2 }}>{[song.interprete, song.year].filter(Boolean).join(" · ")}</div>
              {song.themes && song.themes.length > 0 && (
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 5 }}>
                  {song.themes.map((t) => <span key={t} className="badge-theme">{t}</span>)}
                </div>
              )}
            </div>
            {song.key && <span className="badge badge-key">{song.key}</span>}
            <div style={{ display: "flex", gap: 0 }}>
              <Link href={`/musicas/${song.slug}`} className="btn btn-ghost btn-sm">Ver</Link>
              <Link href={`/admin/musicas/${song.id}/editar`} className="btn btn-ghost btn-sm">Editar</Link>
              <form action={async () => { "use server"; await archiveSong(song.id); }}>
                <button type="submit" className="btn btn-ghost btn-sm" style={{ color: "var(--fg-muted)" }}>Arquivar</button>
              </form>
            </div>
          </div>
        ))}
      </div>

      {archived.length > 0 && (
        <div className="archived-section">
          <div className="micro" style={{ marginBottom: 10 }}>Arquivadas</div>
          <div className="card" style={{ overflow: "hidden", background: "transparent", borderStyle: "dashed" }}>
            {archived.map((song, i) => (
              <div
                key={song.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto auto",
                  alignItems: "center",
                  gap: 14,
                  padding: "14px 18px",
                  borderBottom: i < archived.length - 1 ? "1px dashed var(--border)" : "none",
                  opacity: 0.72,
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 400 }}>{song.title}</div>
                  <div className="small faint" style={{ marginTop: 2 }}>{[song.interprete, song.year].filter(Boolean).join(" · ")}</div>
                </div>
                {song.key && <span className="badge badge-key">{song.key}</span>}
                <form action={async () => { "use server"; await restoreSong(song.id); }}>
                  <button type="submit" className="btn btn-ghost btn-sm" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>
                    </svg>
                    Restaurar
                  </button>
                </form>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
