"use client";

import { useState } from "react";
import Link from "next/link";

type SetlistEvent = {
  id: string;
  name: string;
  eventDate: string;
  publicSlug: string | null;
  venue: string | null;
};

const DAY_NAMES = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

export function SetlistCalendar({ setlists, todayStr }: { setlists: SetlistEvent[]; todayStr: string }) {
  const today = new Date(todayStr + "T12:00:00");
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const byDate = new Map<string, SetlistEvent[]>();
  for (const sl of setlists) {
    if (!sl.eventDate) continue;
    if (!byDate.has(sl.eventDate)) byDate.set(sl.eventDate, []);
    byDate.get(sl.eventDate)!.push(sl);
  }

  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = (firstDay.getDay() + 6) % 7; // Monday-first

  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const prevMonth = () => {
    if (month === 0) { setYear((y) => y - 1); setMonth(11); }
    else setMonth((m) => m - 1);
    setSelectedDate(null);
  };
  const nextMonth = () => {
    if (month === 11) { setYear((y) => y + 1); setMonth(0); }
    else setMonth((m) => m + 1);
    setSelectedDate(null);
  };

  const monthLabel = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(new Date(year, month, 1));
  const selectedEvents = selectedDate ? byDate.get(selectedDate) : undefined;

  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <button onClick={prevMonth} className="btn btn-ghost btn-sm" style={{ padding: "0 10px" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        <span style={{ fontSize: 14, fontWeight: 500, textTransform: "capitalize" }}>{monthLabel}</span>
        <button onClick={nextMonth} className="btn btn-ghost btn-sm" style={{ padding: "0 10px" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginBottom: 4 }}>
        {DAY_NAMES.map((d) => (
          <div key={d} style={{ textAlign: "center", fontSize: 11, color: "var(--fg-faint)", fontWeight: 500, paddingBottom: 6 }}>
            {d}
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const events = byDate.get(dateStr);
          const isToday = dateStr === todayStr;
          const isSelected = dateStr === selectedDate;

          return (
            <button
              key={i}
              onClick={() => events ? setSelectedDate(isSelected ? null : dateStr) : undefined}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: 40,
                borderRadius: 6,
                border: isSelected
                  ? "1px solid var(--fg)"
                  : isToday
                    ? "1px solid var(--border-strong)"
                    : "1px solid transparent",
                background: isSelected ? "var(--fg)" : "transparent",
                color: isSelected ? "var(--bg)" : "var(--fg)",
                cursor: events ? "pointer" : "default",
                fontFamily: "inherit",
                fontSize: 13,
                gap: 3,
              }}
            >
              {day}
              {events && (
                <span style={{
                  width: 4, height: 4,
                  borderRadius: "50%",
                  background: isSelected ? "rgba(255,255,255,0.7)" : "var(--fg)",
                  flexShrink: 0,
                }} />
              )}
            </button>
          );
        })}
      </div>

      {selectedDate && selectedEvents && (
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
          <div className="small muted" style={{ marginBottom: 10, textTransform: "capitalize" }}>
            {new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "numeric", month: "long" }).format(
              new Date(selectedDate + "T12:00:00")
            )}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {selectedEvents.map((sl) => (
              <div key={sl.id}>
                {sl.publicSlug ? (
                  <Link href={`/setlists/${sl.publicSlug}`} style={{ fontWeight: 500, fontSize: 14, color: "var(--fg)", textDecoration: "underline", textUnderlineOffset: 3 }}>
                    {sl.name}
                  </Link>
                ) : (
                  <span style={{ fontWeight: 500, fontSize: 14, color: "var(--fg-muted)" }}>{sl.name}</span>
                )}
                {sl.venue && <div className="small muted" style={{ marginTop: 2 }}>{sl.venue}</div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
