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

  const [setlist] = await db.select().from(setlists).where(eq(setlists.id, id)).limit(1);
  if (!setlist) notFound();

  const allSongs = await db.select().from(songs).where(eq(songs.archived, false)).orderBy(songs.title);

  const currentItems = await db
    .select({ setlistSong: setlistSongs, song: songs })
    .from(setlistSongs)
    .innerJoin(songs, eq(setlistSongs.songId, songs.id))
    .where(eq(setlistSongs.setlistId, id))
    .orderBy(setlistSongs.position);

  const selectedSongs = currentItems.map((i) => i.song);

  return (
    <div className="container-wide" style={{ padding: "40px var(--pad-x) 56px" }}>
      <Link
        href="/admin/setlists"
        style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--fg-muted)", fontSize: 13, marginBottom: 18, textDecoration: "none" }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5m6-7-7 7 7 7"/>
        </svg>
        Voltar para setlists
      </Link>
      <h1 className="title" style={{ marginBottom: 22 }}>Editar setlist</h1>

      {/* Metadata form */}
      <div className="card" style={{ padding: 22, marginBottom: 22 }}>
        <form action={async (fd) => { "use server"; await updateSetlist(id, fd); }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1fr auto", gap: 14, alignItems: "end" }}>
            <div className="field">
              <label>Nome</label>
              <input className="input" type="text" name="name" required defaultValue={setlist.name} />
            </div>
            <div className="field">
              <label>Local</label>
              <input className="input" type="text" name="venue" defaultValue={setlist.venue ?? ""} />
            </div>
            <div className="field">
              <label>Data</label>
              <input className="input" type="date" name="eventDate" defaultValue={setlist.eventDate ?? ""} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ height: 38 }}>Salvar detalhes</button>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14, flexWrap: "wrap", gap: 12 }}>
            <label style={{ display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13.5 }}>
              <input
                type="checkbox"
                name="isPublic"
                defaultChecked={!!setlist.publicSlug}
                style={{ width: 16, height: 16, accentColor: "var(--fg)" }}
              />
              Público — qualquer pessoa com o link pode visualizar
            </label>
            {setlist.publicSlug && (
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "var(--fg-muted)" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                </svg>
                <Link
                  href={`/setlists/${setlist.publicSlug}`}
                  className="mono"
                  style={{ fontSize: 12, color: "var(--fg-muted)", textDecoration: "underline", textUnderlineOffset: 3 }}
                >
                  /setlists/{setlist.publicSlug}
                </Link>
              </div>
            )}
          </div>
        </form>
      </div>

      <SetlistEditor setlistId={id} allSongs={allSongs} initialSelected={selectedSongs} />
    </div>
  );
}
