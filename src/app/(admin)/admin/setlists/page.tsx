import { db } from "@/db";
import { setlists, setlistSongs } from "@/db/schema";
import { eq, count } from "drizzle-orm";
import { deleteSetlist } from "@/lib/actions/setlists";
import Link from "next/link";

export default async function AdminSetlistsPage() {
  const allSetlists = await db
    .select()
    .from(setlists)
    .orderBy(setlists.eventDate);

  const counts = await db
    .select({ setlistId: setlistSongs.setlistId, total: count() })
    .from(setlistSongs)
    .groupBy(setlistSongs.setlistId);

  const countMap = Object.fromEntries(counts.map((c) => [c.setlistId, c.total]));

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Setlists</h1>
        <Link
          href="/admin/setlists/novo"
          className="bg-zinc-100 hover:bg-white text-zinc-900 font-semibold rounded-lg px-4 py-2 text-sm transition-colors"
        >
          + Novo Setlist
        </Link>
      </div>

      {allSetlists.length === 0 ? (
        <p className="text-zinc-500 text-sm">Nenhum setlist criado.</p>
      ) : (
        <div className="space-y-2">
          {allSetlists.map((setlist) => (
            <div
              key={setlist.id}
              className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-lg px-5 py-4"
            >
              <div>
                <p className="font-medium">{setlist.name}</p>
                <div className="flex flex-wrap gap-2 mt-0.5 text-sm text-zinc-400">
                  {setlist.eventDate && (
                    <span>
                      {new Date(setlist.eventDate + "T12:00:00").toLocaleDateString("pt-BR")}
                    </span>
                  )}
                  {setlist.venue && <span>{setlist.venue}</span>}
                  <span>{countMap[setlist.id] ?? 0} músicas</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {setlist.publicSlug && (
                  <Link
                    href={`/setlists/${setlist.publicSlug}`}
                    className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    Ver público
                  </Link>
                )}
                <Link
                  href={`/admin/setlists/${setlist.id}/editar`}
                  className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  Editar
                </Link>
                <form
                  action={async () => {
                    "use server";
                    await deleteSetlist(setlist.id);
                  }}
                >
                  <button
                    type="submit"
                    className="text-xs text-zinc-500 hover:text-red-400 transition-colors"
                    onClick={undefined}
                  >
                    Excluir
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
