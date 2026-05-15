import { db } from "@/db";
import { setlists, setlistSongs, songs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ShareButton } from "@/components/share-button";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [setlist] = await db.select().from(setlists).where(eq(setlists.publicSlug, slug)).limit(1);
  if (!setlist) return {};
  return { title: `${setlist.name} — Repositório de Letras · Ibero` };
}

export default async function PublicSetlistPage({ params }: Props) {
  const { slug } = await params;

  const [setlist] = await db.select().from(setlists).where(eq(setlists.publicSlug, slug)).limit(1);
  if (!setlist) notFound();

  const items = await db
    .select({ setlistSong: setlistSongs, song: songs })
    .from(setlistSongs)
    .innerJoin(songs, eq(setlistSongs.songId, songs.id))
    .where(eq(setlistSongs.setlistId, setlist.id))
    .orderBy(setlistSongs.position);

  return (
    <div className="container" style={{ padding: "40px var(--pad-x) 56px" }}>
      <Link
        href="/"
        style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--fg-muted)", fontSize: 13, marginBottom: 28, textDecoration: "none" }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5m6-7-7 7 7 7"/>
        </svg>
        Todos os setlists
      </Link>

      <div style={{ marginBottom: 32 }}>
        <div className="micro" style={{ marginBottom: 10 }}>Setlist</div>
        <h1 className="display" style={{ marginBottom: 14 }}>{setlist.name}</h1>
        <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap", color: "var(--fg-muted)", fontSize: 13.5 }}>
          {setlist.eventDate && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
              </svg>
              {new Date(setlist.eventDate + "T12:00:00").toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" })}
            </span>
          )}
          {setlist.venue && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s-8-7-8-13a8 8 0 0 1 16 0c0 6-8 13-8 13Z"/><circle cx="12" cy="9" r="3"/>
              </svg>
              {setlist.venue}
            </span>
          )}
        </div>
      </div>

      <ol style={{ listStyle: "none", padding: 0, margin: 0, borderTop: "1px solid var(--border)" }}>
        {items.map(({ setlistSong, song }, index) => (
          <li key={setlistSong.id} className="setlist-row">
            <span className="num">{String(index + 1).padStart(2, "0")}</span>
            <div style={{ minWidth: 0 }}>
              <Link href={`/musicas/${song.slug}`} className="song-title-link" style={{ display: "inline-block" }}>
                {song.title}
              </Link>
              <div className="small muted" style={{ marginTop: 4 }}>
                {[song.interprete, song.bpm ? `${song.bpm} bpm` : null].filter(Boolean).join(" · ")}
              </div>
              {setlistSong.notes && <div className="note">{setlistSong.notes}</div>}
            </div>
            {song.key && <span className="badge badge-key">{song.key}</span>}
          </li>
        ))}
      </ol>

      {items.length === 0 && (
        <p style={{ textAlign: "center", color: "var(--fg-faint)", padding: "48px 0" }}>Setlist vazio.</p>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 32, flexWrap: "wrap", gap: 12 }}>
        <ShareButton />
        <button className="btn btn-ghost" style={{ display: "inline-flex", alignItems: "center", gap: 8 }} onClick={undefined}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>
          </svg>
          Imprimir
        </button>
      </div>
    </div>
  );
}
