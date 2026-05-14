import { db } from "@/db";
import { songs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { updateSong } from "@/lib/actions/songs";
import { SongForm } from "@/components/song-form";
import Link from "next/link";

type Props = { params: Promise<{ id: string }> };

export default async function EditSongPage({ params }: Props) {
  const { id } = await params;
  const [song] = await db.select().from(songs).where(eq(songs.id, id)).limit(1);

  if (!song) notFound();

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/musicas"
          className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors mb-4 inline-block"
        >
          ← Músicas
        </Link>
        <h1 className="text-2xl font-bold">Editar: {song.title}</h1>
      </div>
      <SongForm
        song={song}
        action={async (formData) => {
          "use server";
          await updateSong(id, formData);
        }}
      />
    </div>
  );
}
