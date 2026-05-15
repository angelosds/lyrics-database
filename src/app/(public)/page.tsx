import { db } from "@/db";
import { songs } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { Suspense } from "react";
import { ThemeCloud } from "@/components/theme-cloud";

export const revalidate = 60;

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; theme?: string | string[] }>;
}) {
  const { q, theme } = await searchParams;

  const allSongs = await db
    .select()
    .from(songs)
    .where(eq(songs.archived, false))
    .orderBy(songs.title);

  // Build unique theme list with counts (from all songs, unaffected by filter)
  const themeCountMap = new Map<string, number>();
  for (const song of allSongs) {
    for (const t of song.themes ?? []) {
      themeCountMap.set(t, (themeCountMap.get(t) ?? 0) + 1);
    }
  }
  const allThemes = Array.from(themeCountMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

  const selectedThemes = theme ? (Array.isArray(theme) ? theme : [theme]) : [];

  // Apply filters (theme AND text search, both optional)
  let displayed = allSongs;
  if (selectedThemes.length > 0) {
    displayed = displayed.filter((s) =>
      s.themes?.some((t) => selectedThemes.includes(t))
    );
  }
  if (q) {
    const lower = q.toLowerCase();
    displayed = displayed.filter(
      (s) =>
        s.title.toLowerCase().includes(lower) ||
        s.lyrics.toLowerCase().includes(lower) ||
        (s.interprete?.toLowerCase().includes(lower) ?? false) ||
        (s.themes?.some((t) => t.toLowerCase().includes(lower)) ?? false) ||
        (s.biblicalRefs?.some((r) => r.toLowerCase().includes(lower)) ?? false)
    );
  }

  const isFiltered = selectedThemes.length > 0 || !!q;

  return (
    <div className="container" style={{ padding: "52px var(--pad-x) 60px" }}>
      <div style={{ marginBottom: 36 }}>
        <h1 className="display" style={{ marginBottom: 8 }}>Músicas</h1>
        <p className="subtitle">Repertório completo da banda, letras e tonalidades.</p>
      </div>

      <form method="get" style={{ marginBottom: allThemes.length > 0 ? 16 : 28 }}>
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
            placeholder="Buscar por título, intérprete, tema, referência bíblica ou trecho da letra…"
          />
          {selectedThemes.map((t) => (
            <input key={t} type="hidden" name="theme" value={t} />
          ))}
        </div>
      </form>

      {allThemes.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <Suspense>
            <ThemeCloud themes={allThemes} selected={selectedThemes} />
          </Suspense>
        </div>
      )}

      {isFiltered && (
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, color: "var(--fg-muted)", fontSize: 12.5 }}>
          <span>
            {displayed.length} música{displayed.length !== 1 ? "s" : ""}
            {selectedThemes.length > 0 && !q && <> com {selectedThemes.length > 1 ? "estes temas" : "este tema"}</>}
            {q && <> para &quot;{q}&quot;</>}
          </span>
          <Link href="/" style={{ color: "var(--fg-muted)" }}>Limpar filtros</Link>
        </div>
      )}

      {displayed.length === 0 ? (
        <div style={{ padding: "64px 20px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <svg width="120" height="64" viewBox="0 0 120 64" fill="none" stroke="currentColor" strokeWidth="1" style={{ color: "var(--fg-faint)" }}>
            <path d="M4 18h112M4 28h112M4 38h112M4 48h112M4 8h112" strokeOpacity="0.45" />
            <path d="M60 6v52" stroke="var(--border-strong)" strokeWidth="1.2" />
            <path d="M55 22c0-4 2-6 5-6s5 2 5 6c0 3-2 5-5 5M55 38c0-3 2-5 5-5s5 2 5 5c0 4-2 6-5 6s-5-2-5-6" stroke="var(--fg-muted)" strokeWidth="1.4" />
          </svg>
          {allSongs.length === 0 ? (
            <>
              <div style={{ fontSize: 16, fontWeight: 500 }}>Nenhuma música ainda</div>
              <div className="small" style={{ maxWidth: 320, color: "var(--fg-muted)" }}>
                O repertório está vazio. Acesse a{" "}
                <Link href="/login" style={{ color: "var(--fg)", textDecoration: "underline", textUnderlineOffset: 3 }}>área admin</Link>{" "}
                para adicionar as primeiras letras.
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: 16, fontWeight: 500 }}>Nenhuma música encontrada</div>
              <div className="small" style={{ maxWidth: 320, color: "var(--fg-muted)" }}>
                Tente outro termo ou remova alguns filtros.
              </div>
            </>
          )}
        </div>
      ) : (
        <>
          {!isFiltered && (
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, color: "var(--fg-muted)", fontSize: 12.5 }}>
              <span>{allSongs.length} música{allSongs.length !== 1 ? "s" : ""}</span>
              <span>Título A–Z</span>
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {displayed.map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function SongCard({ song }: { song: { id: string; slug: string; title: string; interprete: string | null; year: number | null; key: string | null; themes: string[] | null } }) {
  return (
    <Link href={`/musicas/${song.slug}`} className="song-card" style={{ gridTemplateRows: "auto auto" }}>
      <div>
        <div className="song-title">{song.title}</div>
        <div className="song-meta">{[song.interprete, song.year].filter(Boolean).join(" · ")}</div>
      </div>
      {song.key && <span className="badge badge-key">{song.key}</span>}
      {song.themes && song.themes.length > 0 && (
        <div style={{ gridColumn: "1 / -1", display: "flex", gap: 4, flexWrap: "wrap", marginTop: 4 }}>
          {song.themes.map((t) => (
            <span key={t} className="badge-theme">{t}</span>
          ))}
        </div>
      )}
    </Link>
  );
}
