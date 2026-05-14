import { db } from "@/db";
import { setlists, setlistSongs, songs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { updateSetlist } from "@/lib/actions/setlists";
import { SetlistEditor } from "@/components/setlist-editor";
import Link from "next/link";

type Props = { params: Promise<{ id: string }> };

export default async function EditSetlistPage({ params }: Props) {
  const { id } = await params;

  const [setlist] = await db
    .select()
    .from(setlists)
    .where(eq(setlists.id, id))
    .limit(1);

  if (!setlist) notFound();

  const allSongs = await db
    .select()
    .from(songs)
    .where(eq(songs.archived, false))
    .orderBy(songs.title);

  const currentItems = await db
    .select({ setlistSong: setlistSongs, song: songs })
    .from(setlistSongs)
    .innerJoin(songs, eq(setlistSongs.songId, songs.id))
    .where(eq(setlistSongs.setlistId, id))
    .orderBy(setlistSongs.position);

  const selectedSongs = currentItems.map((i) => i.song);

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/setlists"
          className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors mb-4 inline-block"
        >
          ← Setlists
        </Link>
        <h1 className="text-2xl font-bold mb-6">{setlist.name}</h1>

        <form action={async (fd) => { "use server"; await updateSetlist(id, fd); }} className="space-y-4 max-w-lg mb-8">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Nome</label>
              <input
                type="text"
                name="name"
                required
                defaultValue={setlist.name}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Local</label>
              <input
                type="text"
                name="venue"
                defaultValue={setlist.venue ?? ""}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-500"
              />
            </div>
          </div>
          <div className="flex items-end gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Data</label>
              <input
                type="date"
                name="eventDate"
                defaultValue={setlist.eventDate ?? ""}
                className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-500"
              />
            </div>
            <div className="flex items-center gap-2 pb-2.5">
              <input
                type="checkbox"
                name="isPublic"
                id="isPublic"
                defaultChecked={!!setlist.publicSlug}
                className="w-4 h-4 accent-white"
              />
              <label htmlFor="isPublic" className="text-sm text-zinc-300">Público</label>
            </div>
            <button
              type="submit"
              className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm transition-colors mb-0"
            >
              Salvar detalhes
            </button>
          </div>
          {setlist.publicSlug && (
            <p className="text-xs text-zinc-500">
              Link público:{" "}
              <Link
                href={`/setlists/${setlist.publicSlug}`}
                className="text-zinc-400 hover:text-zinc-200 underline"
              >
                /setlists/{setlist.publicSlug}
              </Link>
            </p>
          )}
        </form>
      </div>

      <SetlistEditor
        setlistId={id}
        allSongs={allSongs}
        initialSelected={selectedSongs}
      />
    </div>
  );
}
