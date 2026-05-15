import { db } from "@/db";
import { songs } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";

export const revalidate = 60;

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const allSongs = await db
    .select()
    .from(songs)
    .where(eq(songs.archived, false))
    .orderBy(songs.title);

  const filtered = q
    ? allSongs.filter(
        (s) =>
          s.title.toLowerCase().includes(q.toLowerCase()) ||
          s.lyrics.toLowerCase().includes(q.toLowerCase()) ||
          (s.album?.toLowerCase().includes(q.toLowerCase()) ?? false)
      )
    : allSongs;

  return (
    <div className="container" style={{ padding: "52px var(--pad-x) 60px" }}>
      <div style={{ marginBottom: 36 }}>
        <h1 className="display" style={{ marginBottom: 8 }}>Músicas</h1>
        <p className="subtitle">Repertório completo da banda, letras e tonalidades.</p>
      </div>

      <form method="get" style={{ marginBottom: 28 }}>
        <div className="search">
          <span className="search-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>
            </svg>
          </span>
          <input
            className="input"
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Buscar por título, álbum ou trecho da letra…"
          />
        </div>
      </form>

      {q ? (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, color: "var(--fg-muted)", fontSize: 12.5 }}>
            <span>
              {filtered.length} resultado{filtered.length !== 1 ? "s" : ""} para &quot;{q}&quot;
            </span>
            <Link href="/" style={{ color: "var(--fg-muted)" }}>Limpar busca</Link>
          </div>
          {filtered.length === 0 ? (
            <div style={{ padding: "64px 20px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
              <svg width="120" height="64" viewBox="0 0 120 64" fill="none" stroke="currentColor" strokeWidth="1" style={{ color: "var(--fg-faint)" }}>
                <path d="M4 18h112M4 28h112M4 38h112M4 48h112M4 8h112" strokeOpacity="0.45" />
                <path d="M60 6v52" stroke="var(--border-strong)" strokeWidth="1.2" />
                <path d="M55 22c0-4 2-6 5-6s5 2 5 6c0 3-2 5-5 5M55 38c0-3 2-5 5-5s5 2 5 5c0 4-2 6-5 6s-5-2-5-6" stroke="var(--fg-muted)" strokeWidth="1.4" />
              </svg>
              <div style={{ fontSize: 16, fontWeight: 500 }}>Nenhuma música encontrada</div>
              <div className="small" style={{ maxWidth: 320, color: "var(--fg-muted)" }}>
                Não encontramos resultados para{" "}
                <span className="mono" style={{ color: "var(--fg)" }}>&quot;{q}&quot;</span>.
                Tente outro termo ou explore a lista completa.
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {filtered.map((song) => (
                <Link key={song.id} href={`/musicas/${song.slug}`} className="song-card">
                  <div>
                    <div className="song-title">{song.title}</div>
                    <div className="song-meta">{[song.album, song.year].filter(Boolean).join(" · ")}</div>
                  </div>
                  {song.key && <span className="badge badge-key">{song.key}</span>}
                </Link>
              ))}
            </div>
          )}
        </>
      ) : allSongs.length === 0 ? (
        <div style={{ padding: "64px 20px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <svg width="120" height="64" viewBox="0 0 120 64" fill="none" stroke="currentColor" strokeWidth="1" style={{ color: "var(--fg-faint)" }}>
            <path d="M4 18h112M4 28h112M4 38h112M4 48h112M4 8h112" strokeOpacity="0.45" />
            <path d="M60 6v52" stroke="var(--border-strong)" strokeWidth="1.2" />
            <path d="M55 22c0-4 2-6 5-6s5 2 5 6c0 3-2 5-5 5M55 38c0-3 2-5 5-5s5 2 5 5c0 4-2 6-5 6s-5-2-5-6" stroke="var(--fg-muted)" strokeWidth="1.4" />
          </svg>
          <div style={{ fontSize: 16, fontWeight: 500 }}>Nenhuma música ainda</div>
          <div className="small" style={{ maxWidth: 320, color: "var(--fg-muted)" }}>
            O repertório está vazio. Acesse a{" "}
            <Link href="/login" style={{ color: "var(--fg)", textDecoration: "underline", textUnderlineOffset: 3 }}>
              área admin
            </Link>{" "}
            para adicionar as primeiras letras.
          </div>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, color: "var(--fg-muted)", fontSize: 12.5 }}>
            <span>{allSongs.length} música{allSongs.length !== 1 ? "s" : ""}</span>
            <span>Título A–Z</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {allSongs.map((song) => (
              <Link key={song.id} href={`/musicas/${song.slug}`} className="song-card">
                <div>
                  <div className="song-title">{song.title}</div>
                  <div className="song-meta">{[song.album, song.year].filter(Boolean).join(" · ")}</div>
                </div>
                {song.key && <span className="badge badge-key">{song.key}</span>}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
