import { db } from "@/db";
import { songs, setlistSongs, setlists } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ShareButton } from "@/components/share-button";
import { youtubeEmbedUrl } from "@/lib/utils";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [song] = await db.select().from(songs).where(eq(songs.slug, slug)).limit(1);
  if (!song) return {};
  return {
    title: `${song.title} — Repositório de Letras · Ibero`,
    description: song.lyrics.slice(0, 160),
  };
}

export default async function SongPage({ params }: Props) {
  const { slug } = await params;
  const [song] = await db.select().from(songs).where(eq(songs.slug, slug)).limit(1);

  if (!song || song.archived) notFound();

  const [metrics] = await db
    .select({
      count: sql<number>`cast(count(*) as int)`,
      lastDate: sql<string | null>`max(${setlists.eventDate})`,
    })
    .from(setlistSongs)
    .innerJoin(setlists, eq(setlistSongs.setlistId, setlists.id))
    .where(eq(setlistSongs.songId, song.id));

  return (
    <article className="container" style={{ padding: "40px var(--pad-x) 56px" }}>
      <Link
        href="/"
        style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--fg-muted)", fontSize: 13, marginBottom: 28, textDecoration: "none" }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5m6-7-7 7 7 7"/>
        </svg>
        Todas as músicas
      </Link>

      <h1 className="display" style={{ marginBottom: 14 }}>{song.title}</h1>

      <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", marginBottom: 36, color: "var(--fg-muted)", fontSize: 13.5 }}>
        {song.interprete && <span>{song.interprete}</span>}
        {song.interprete && song.year && <span style={{ color: "var(--fg-faint)" }}>·</span>}
        {song.year && <span>{song.year}</span>}
        {song.key && (
          <>
            <span style={{ color: "var(--fg-faint)" }}>·</span>
            <span className="badge badge-key">{song.key}</span>
          </>
        )}
        {song.bpm && <span className="badge badge-bpm">{song.bpm}</span>}
      </div>

      {song.youtubeUrl && youtubeEmbedUrl(song.youtubeUrl) && (
        <div style={{ marginBottom: 36, borderRadius: 8, overflow: "hidden", aspectRatio: "16/9" }}>
          <iframe
            src={youtubeEmbedUrl(song.youtubeUrl)!}
            title={song.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ width: "100%", height: "100%", border: "none", display: "block" }}
          />
        </div>
      )}

      <div className="lyrics-block">{song.lyrics}</div>

      {(song.themes?.length || song.biblicalRefs?.length) ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 24 }}>
          {song.themes && song.themes.length > 0 && (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {song.themes.map((t) => (
                <span key={t} className="badge-theme">{t}</span>
              ))}
            </div>
          )}
          {song.biblicalRefs && song.biblicalRefs.length > 0 && (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {song.biblicalRefs.map((r) => (
                <span key={r} className="badge-theme" style={{ fontFamily: "var(--font-mono)", fontSize: 11 }}>{r}</span>
              ))}
            </div>
          )}
        </div>
      ) : null}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 32, flexWrap: "wrap", gap: 16 }}>
        <ShareButton />
        <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
          {metrics && metrics.count > 0 ? (
            <span className="small">
              {metrics.count}× em setlist
              {metrics.lastDate && (
                <> · último em{" "}
                  {new Date(metrics.lastDate + "T12:00:00").toLocaleDateString("pt-BR", { day: "numeric", month: "short", year: "numeric" })}
                </>
              )}
            </span>
          ) : null}
          {song.updatedAt && (
            <span className="small">
              Atualizado em{" "}
              {new Date(song.updatedAt).toLocaleDateString("pt-BR", { day: "numeric", month: "short", year: "numeric" })}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
