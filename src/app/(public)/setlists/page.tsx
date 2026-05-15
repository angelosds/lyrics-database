import { db } from "@/db";
import { setlists, setlistSongs } from "@/db/schema";
import { eq, count, isNotNull } from "drizzle-orm";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Setlists — Repositório de Letras · Ibero",
  description: "Setlists de shows e eventos da banda.",
};

export const dynamic = "force-dynamic";

export default async function SetlistsPage() {
  const publicSetlists = await db
    .select()
    .from(setlists)
    .where(isNotNull(setlists.publicSlug))
    .orderBy(setlists.eventDate);

  const counts = await db
    .select({ setlistId: setlistSongs.setlistId, total: count() })
    .from(setlistSongs)
    .groupBy(setlistSongs.setlistId);

  const countMap = Object.fromEntries(counts.map((c) => [c.setlistId, c.total]));

  return (
    <div className="container" style={{ padding: "52px var(--pad-x) 60px" }}>
      <div style={{ marginBottom: 36 }}>
        <h1 className="display" style={{ marginBottom: 8 }}>Setlists</h1>
        <p className="subtitle">Shows e eventos com repertório completo.</p>
      </div>

      {publicSetlists.length === 0 ? (
        <div style={{ padding: "64px 20px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <svg width="120" height="64" viewBox="0 0 120 64" fill="none" stroke="currentColor" strokeWidth="1" style={{ color: "var(--fg-faint)" }}>
            <path d="M4 18h112M4 28h112M4 38h112M4 48h112M4 8h112" strokeOpacity="0.45" />
            <path d="M60 6v52" stroke="var(--border-strong)" strokeWidth="1.2" />
            <path d="M55 22c0-4 2-6 5-6s5 2 5 6c0 3-2 5-5 5M55 38c0-3 2-5 5-5s5 2 5 5c0 4-2 6-5 6s-5-2-5-6" stroke="var(--fg-muted)" strokeWidth="1.4" />
          </svg>
          <div style={{ fontSize: 16, fontWeight: 500 }}>Nenhum setlist publicado</div>
          <div className="small" style={{ maxWidth: 320, color: "var(--fg-muted)" }}>
            Os setlists aparecerão aqui quando forem tornados públicos pela equipe.
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {publicSetlists.map((setlist) => {
            const total = countMap[setlist.id] ?? 0;
            const date = setlist.eventDate
              ? new Date(setlist.eventDate + "T12:00:00").toLocaleDateString("pt-BR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : null;

            return (
              <Link
                key={setlist.id}
                href={`/setlists/${setlist.publicSlug}`}
                className="song-card"
              >
                <div>
                  <div className="song-title">{setlist.name}</div>
                  <div className="song-meta" style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 2 }}>
                    {date && (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
                        </svg>
                        {date}
                      </span>
                    )}
                    {setlist.venue && (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 22s-8-7-8-13a8 8 0 0 1 16 0c0 6-8 13-8 13Z"/><circle cx="12" cy="9" r="3"/>
                        </svg>
                        {setlist.venue}
                      </span>
                    )}
                  </div>
                </div>
                <span className="badge" style={{ fontFamily: "var(--font-sans)", fontSize: 12 }}>
                  {total} música{total !== 1 ? "s" : ""}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
