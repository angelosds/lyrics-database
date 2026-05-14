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
  const [setlist] = await db
    .select()
    .from(setlists)
    .where(eq(setlists.publicSlug, slug))
    .limit(1);
  if (!setlist) return {};
  return { title: `${setlist.name} — Letras da Banda` };
}

export default async function PublicSetlistPage({ params }: Props) {
  const { slug } = await params;

  const [setlist] = await db
    .select()
    .from(setlists)
    .where(eq(setlists.publicSlug, slug))
    .limit(1);

  if (!setlist) notFound();

  const items = await db
    .select({ setlistSong: setlistSongs, song: songs })
    .from(setlistSongs)
    .innerJoin(songs, eq(setlistSongs.songId, songs.id))
    .where(eq(setlistSongs.setlistId, setlist.id))
    .orderBy(setlistSongs.position);

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/"
          className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors mb-4 inline-block"
        >
          ← Início
        </Link>
        <h1 className="text-3xl font-bold">{setlist.name}</h1>
        <div className="flex flex-wrap gap-3 mt-2 text-sm text-zinc-400">
          {setlist.eventDate && (
            <span>
              {new Date(setlist.eventDate + "T12:00:00").toLocaleDateString("pt-BR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          )}
          {setlist.venue && <span>{setlist.venue}</span>}
        </div>
      </div>

      <div className="space-y-2 mb-8">
        {items.map(({ setlistSong, song }, index) => (
          <div
            key={setlistSong.id}
            className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 rounded-lg px-5 py-4"
          >
            <span className="text-2xl font-bold text-zinc-600 w-8 text-center tabular-nums">
              {index + 1}
            </span>
            <div className="flex-1">
              <Link
                href={`/musicas/${song.slug}`}
                className="font-semibold hover:text-zinc-300 transition-colors"
              >
                {song.title}
              </Link>
              {setlistSong.notes && (
                <p className="text-sm text-zinc-500 mt-0.5">{setlistSong.notes}</p>
              )}
            </div>
            {song.key && (
              <span className="font-mono text-xs bg-zinc-800 border border-zinc-700 rounded px-2 py-0.5 text-zinc-400">
                {song.key}
              </span>
            )}
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <p className="text-center text-zinc-500 py-12">Setlist vazio.</p>
      )}

      <ShareButton />
    </div>
  );
}
