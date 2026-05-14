import { createSong } from "@/lib/actions/songs";
import { SongForm } from "@/components/song-form";
import Link from "next/link";

export default function NewSongPage() {
  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/musicas"
          className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors mb-4 inline-block"
        >
          ← Músicas
        </Link>
        <h1 className="text-2xl font-bold">Nova Música</h1>
      </div>
      <SongForm action={createSong} />
    </div>
  );
}
