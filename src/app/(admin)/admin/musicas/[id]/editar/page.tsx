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
    <div className="container" style={{ padding: "40px var(--pad-x) 56px" }}>
      <Link
        href="/admin/musicas"
        style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--fg-muted)", fontSize: 13, marginBottom: 18, textDecoration: "none" }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5m6-7-7 7 7 7"/>
        </svg>
        Voltar para músicas
      </Link>
      <h1 className="title" style={{ marginBottom: 4 }}>Editar música</h1>
      <p className="small muted" style={{ marginBottom: 32 }}>{song.title}{song.interprete ? ` · ${song.interprete}` : ""}</p>
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
