import { db } from "@/db";
import { songs, setlists } from "@/db/schema";
import { eq, count } from "drizzle-orm";
import Link from "next/link";

export default async function AdminDashboard() {
  const [{ total: totalSongs }] = await db.select({ total: count() }).from(songs).where(eq(songs.archived, false));
  const [{ total: archivedSongs }] = await db.select({ total: count() }).from(songs).where(eq(songs.archived, true));
  const [{ total: totalSetlists }] = await db.select({ total: count() }).from(setlists);

  return (
    <div className="container-wide" style={{ padding: "40px var(--pad-x) 56px" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 className="display" style={{ marginBottom: 6, fontSize: 36 }}>Bem-vindo.</h1>
        <p className="subtitle">Visão geral do repositório.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 36 }}>
        <div className="stat">
          <div className="stat-num">{totalSongs}</div>
          <div className="stat-lbl">músicas ativas</div>
        </div>
        <div className="stat">
          <div className="stat-num">{totalSetlists}</div>
          <div className="stat-lbl">setlists</div>
        </div>
        <div className="stat">
          <div className="stat-num">{archivedSongs}</div>
          <div className="stat-lbl">arquivadas</div>
        </div>
      </div>

      <div className="micro" style={{ marginBottom: 12 }}>Ações rápidas</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        <Link href="/admin/musicas/nova" className="action-card">
          <span className="action-ico">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14"/>
            </svg>
          </span>
          <span className="action-label">Nova Música</span>
          <span className="action-sub">Adicionar letra ao repositório</span>
        </Link>
        <Link href="/admin/setlists/novo" className="action-card">
          <span className="action-ico">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14"/>
            </svg>
          </span>
          <span className="action-label">Novo Setlist</span>
          <span className="action-sub">Montar repertório de show</span>
        </Link>
        <Link href="/admin/musicas" className="action-card">
          <span className="action-ico">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
            </svg>
          </span>
          <span className="action-label">Gerenciar Músicas</span>
          <span className="action-sub">Editar, arquivar, restaurar</span>
        </Link>
        <Link href="/admin/setlists" className="action-card">
          <span className="action-ico">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 6h13M8 12h13M8 18h13"/><circle cx="3.5" cy="6" r=".8"/><circle cx="3.5" cy="12" r=".8"/><circle cx="3.5" cy="18" r=".8"/>
            </svg>
          </span>
          <span className="action-label">Gerenciar Setlists</span>
          <span className="action-sub">Reordenar, publicar links</span>
        </Link>
      </div>
    </div>
  );
}
