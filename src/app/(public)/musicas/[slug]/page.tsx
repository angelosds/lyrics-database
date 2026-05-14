import { db } from "@/db";
import { songs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { formatLyrics } from "@/lib/utils";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ShareButton } from "@/components/share-button";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [song] = await db.select().from(songs).where(eq(songs.slug, slug)).limit(1);
  if (!song) return {};
  return {
    title: `${song.title} — Letras da Banda`,
    description: song.lyrics.slice(0, 160),
  };
}

export default async function SongPage({ params }: Props) {
  const { slug } = await params;
  const [song] = await db.select().from(songs).where(eq(songs.slug, slug)).limit(1);

  if (!song || song.archived) notFound();

  const stanzas = formatLyrics(song.lyrics);

  return (
    <article>
      <div className="mb-8">
        <Link
          href="/"
          className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors mb-4 inline-block"
        >
          ← Todas as músicas
        </Link>
        <h1 className="text-3xl font-bold">{song.title}</h1>
        <div className="flex flex-wrap gap-3 mt-3 text-sm text-zinc-400">
          {song.album && <span>{song.album}</span>}
          {song.year && <span>{song.year}</span>}
          {song.key && (
            <span className="bg-zinc-800 border border-zinc-700 rounded px-2 py-0.5 font-mono text-xs text-zinc-300">
              Tom: {song.key}
            </span>
          )}
          {song.bpm && (
            <span className="bg-zinc-800 border border-zinc-700 rounded px-2 py-0.5 font-mono text-xs text-zinc-300">
              {song.bpm} BPM
            </span>
          )}
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 md:p-8 font-mono text-sm leading-relaxed space-y-6">
        {stanzas.map((stanza, i) => (
          <div key={i} className="space-y-1">
            {stanza.map((line, j) => (
              <p key={j} className={line === "" ? "h-2" : "text-zinc-200"}>
                {line || " "}
              </p>
            ))}
          </div>
        ))}
      </div>

      <div className="mt-6 flex gap-3">
        <ShareButton />
      </div>
    </article>
  );
}
