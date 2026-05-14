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
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Letras</h1>
        <p className="text-zinc-400">
          {allSongs.length} música{allSongs.length !== 1 ? "s" : ""} na base
        </p>
      </div>

      <form method="get" className="mb-8">
        <div className="flex gap-2">
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Buscar por título, letra ou álbum..."
            className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-zinc-500 placeholder:text-zinc-500"
          />
          <button
            type="submit"
            className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg px-4 py-2 text-sm transition-colors"
          >
            Buscar
          </button>
          {q && (
            <Link
              href="/"
              className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg px-4 py-2 text-sm transition-colors"
            >
              Limpar
            </Link>
          )}
        </div>
      </form>

      {q && (
        <p className="text-sm text-zinc-400 mb-4">
          {filtered.length} resultado{filtered.length !== 1 ? "s" : ""} para &quot;{q}&quot;
        </p>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-zinc-500">
          <p className="text-lg">Nenhuma música encontrada.</p>
          {q && (
            <Link href="/" className="text-sm text-zinc-400 hover:text-zinc-200 mt-2 inline-block">
              Ver todas as músicas
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((song) => (
            <Link
              key={song.id}
              href={`/musicas/${song.slug}`}
              className="group block bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-lg px-5 py-4 transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold group-hover:text-white transition-colors">
                    {song.title}
                  </h2>
                  {(song.album || song.year) && (
                    <p className="text-sm text-zinc-400 mt-0.5">
                      {[song.album, song.year].filter(Boolean).join(" · ")}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm text-zinc-500">
                  {song.key && (
                    <span className="bg-zinc-800 group-hover:bg-zinc-700 border border-zinc-700 rounded px-2 py-0.5 font-mono text-xs transition-colors">
                      {song.key}
                    </span>
                  )}
                  <span className="text-zinc-600 group-hover:text-zinc-400 transition-colors">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
