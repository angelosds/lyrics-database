import { db } from "@/db";
import { setlists, setlistSongs } from "@/db/schema";
import { eq, count } from "drizzle-orm";
import { deleteSetlist } from "@/lib/actions/setlists";
import Link from "next/link";

export default async function AdminSetlistsPage() {
  const allSetlists = await db.select().from(setlists).orderBy(setlists.eventDate);
  const counts = await db.select({ setlistId: setlistSongs.setlistId, total: count() }).from(setlistSongs).groupBy(setlistSongs.setlistId);
  const countMap = Object.fromEntries(counts.map((c) => [c.setlistId, c.total]));

  return (
    <div className="container-wide" style={{ padding: "40px var(--pad-x) 56px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 className="title">Setlists</h1>
          <div className="small muted" style={{ marginTop: 4 }}>{allSetlists.length} setlist{allSetlists.length !== 1 ? "s" : ""}</div>
        </div>
        <Link href="/admin/setlists/novo" className="btn btn-primary">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          Novo Setlist
        </Link>
      </div>

      {allSetlists.length === 0 ? (
        <div className="card" style={{ padding: "24px 18px", color: "var(--fg-faint)", fontSize: 14 }}>
          Nenhum setlist criado.
        </div>
      ) : (
        <div className="card" style={{ overflow: "hidden" }}>
          {allSetlists.map((setlist, i) => (
            <div
              key={setlist.id}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto",
                alignItems: "center",
                gap: 14,
                padding: "14px 18px",
                borderBottom: i < allSetlists.length - 1 ? "1px solid var(--border)" : "none",
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 14.5, fontWeight: 500 }}>{setlist.name}</div>
                <div className="small muted" style={{ marginTop: 2, display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {setlist.eventDate && (
                    <span>{new Date(setlist.eventDate + "T12:00:00").toLocaleDateString("pt-BR")}</span>
                  )}
                  {setlist.venue && <span>{setlist.venue}</span>}
                  <span>{countMap[setlist.id] ?? 0} músicas</span>
                  {setlist.publicSlug && (
                    <span style={{ color: "var(--fg-faint)" }}>· público</span>
                  )}
                </div>
              </div>
              <div style={{ display: "flex", gap: 0, flexShrink: 0 }}>
                {setlist.publicSlug && (
                  <Link href={`/setlists/${setlist.publicSlug}`} className="btn btn-ghost btn-sm">Ver</Link>
                )}
                <Link href={`/admin/setlists/${setlist.id}/editar`} className="btn btn-ghost btn-sm">Editar</Link>
                <form action={async () => { "use server"; await deleteSetlist(setlist.id); }}>
                  <button type="submit" className="btn btn-ghost btn-sm" style={{ color: "var(--fg-muted)" }}>Excluir</button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
