import { db } from "@/db";
import { setlists, setlistSongs } from "@/db/schema";
import { count, isNotNull } from "drizzle-orm";
import Link from "next/link";
import type { Metadata } from "next";
import { SetlistCalendar } from "@/components/setlist-calendar";

export const metadata: Metadata = {
  title: "Setlists — Repositório de Letras · Ibero",
  description: "Setlists de shows e eventos da banda.",
};

export const dynamic = "force-dynamic";

export default async function SetlistsPage() {
  const todayStr = new Date().toISOString().slice(0, 10);

  const allPublic = await db
    .select()
    .from(setlists)
    .where(isNotNull(setlists.publicSlug))
    .orderBy(setlists.eventDate);

  const upcoming = allPublic.filter((s) => !s.eventDate || s.eventDate >= todayStr);
  const withDate = allPublic.filter((s) => !!s.eventDate);

  const songCounts = await db
    .select({ setlistId: setlistSongs.setlistId, total: count() })
    .from(setlistSongs)
    .groupBy(setlistSongs.setlistId);
  const countMap = Object.fromEntries(songCounts.map((c) => [c.setlistId, c.total]));

  return (
    <div className="container" style={{ padding: "52px var(--pad-x) 60px" }}>
      <div style={{ marginBottom: 36 }}>
        <h1 className="display" style={{ marginBottom: 8 }}>Setlists</h1>
        <p className="subtitle">Shows e eventos com repertório completo.</p>
      </div>

      {/* Upcoming setlists */}
      <div style={{ marginBottom: 48 }}>
        <div className="micro" style={{ marginBottom: 14 }}>Próximos shows</div>
        {upcoming.length === 0 ? (
          <div style={{ padding: "32px 20px", textAlign: "center", color: "var(--fg-faint)", fontSize: 14, border: "1px dashed var(--border)", borderRadius: 8 }}>
            Nenhum show agendado
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {upcoming.map((setlist) => {
              const total = countMap[setlist.id] ?? 0;
              const date = setlist.eventDate
                ? new Date(setlist.eventDate + "T12:00:00").toLocaleDateString("pt-BR", {
                    day: "numeric", month: "long", year: "numeric",
                  })
                : null;

              return (
                <Link key={setlist.id} href={`/setlists/${setlist.publicSlug}`} className="song-card">
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

      {/* Calendar */}
      {withDate.length > 0 && (
        <div>
          <div className="micro" style={{ marginBottom: 14 }}>Histórico</div>
          <SetlistCalendar
            todayStr={todayStr}
            setlists={withDate.map((s) => ({
              id: s.id,
              name: s.name,
              eventDate: s.eventDate!,
              publicSlug: s.publicSlug,
              venue: s.venue,
            }))}
          />
        </div>
      )}
    </div>
  );
}
