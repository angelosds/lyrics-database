import { db } from "@/db";
import { songs } from "@/db/schema";
import { archiveSong, restoreSong } from "@/lib/actions/songs";
import Link from "next/link";

export default async function AdminSongsPage() {
  const allSongs = await db.select().from(songs).orderBy(songs.title);
  const active = allSongs.filter((s) => !s.archived);
  const archived = allSongs.filter((s) => s.archived);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Músicas</h1>
        <Link
          href="/admin/musicas/nova"
          className="bg-zinc-100 hover:bg-white text-zinc-900 font-semibold rounded-lg px-4 py-2 text-sm transition-colors"
        >
          + Nova Música
        </Link>
      </div>

      <div className="space-y-2 mb-10">
        {active.length === 0 && (
          <p className="text-zinc-500 text-sm">Nenhuma música ativa.</p>
        )}
        {active.map((song) => (
          <div
            key={song.id}
            className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-lg px-5 py-4"
          >
            <div>
              <p className="font-medium">{song.title}</p>
              {(song.album || song.year) && (
                <p className="text-sm text-zinc-400 mt-0.5">
                  {[song.album, song.year].filter(Boolean).join(" · ")}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              {song.key && (
                <span className="font-mono text-xs text-zinc-500">{song.key}</span>
              )}
              <Link
                href={`/musicas/${song.slug}`}
                className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                Ver
              </Link>
              <Link
                href={`/admin/musicas/${song.id}/editar`}
                className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                Editar
              </Link>
              <form
                action={async () => {
                  "use server";
                  await archiveSong(song.id);
                }}
              >
                <button
                  type="submit"
                  className="text-xs text-zinc-500 hover:text-red-400 transition-colors"
                >
                  Arquivar
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>

      {archived.length > 0 && (
        <div>
          <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-3">
            Arquivadas
          </h2>
          <div className="space-y-2">
            {archived.map((song) => (
              <div
                key={song.id}
                className="flex items-center justify-between bg-zinc-900/50 border border-zinc-800/50 rounded-lg px-5 py-4 opacity-60"
              >
                <p className="font-medium text-zinc-400">{song.title}</p>
                <div className="flex items-center gap-3">
                  <Link
                    href={`/admin/musicas/${song.id}/editar`}
                    className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    Editar
                  </Link>
                  <form
                    action={async () => {
                      "use server";
                      await restoreSong(song.id);
                    }}
                  >
                    <button
                      type="submit"
                      className="text-xs text-zinc-500 hover:text-green-400 transition-colors"
                    >
                      Restaurar
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
