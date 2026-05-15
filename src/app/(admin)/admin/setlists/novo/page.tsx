import { createSetlist } from "@/lib/actions/setlists";
import Link from "next/link";

export default function NewSetlistPage() {
  return (
    <div className="container" style={{ padding: "40px var(--pad-x) 56px" }}>
      <Link
        href="/admin/setlists"
        style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--fg-muted)", fontSize: 13, marginBottom: 18, textDecoration: "none" }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5m6-7-7 7 7 7"/>
        </svg>
        Voltar para setlists
      </Link>
      <h1 className="title" style={{ marginBottom: 4 }}>Novo Setlist</h1>
      <p className="small muted" style={{ marginBottom: 32 }}>Crie um setlist para um show ou evento.</p>

      <form action={createSetlist} style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 560 }}>
        <div className="field">
          <label>Nome do show / evento</label>
          <input className="input" type="text" name="name" required placeholder="Ex.: Culto Domingo Manhã" />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div className="field">
            <label>Data</label>
            <input className="input" type="date" name="eventDate" />
          </div>
          <div className="field">
            <label>Local</label>
            <input className="input" type="text" name="venue" placeholder="Ex.: Auditório Principal" />
          </div>
        </div>

        <label style={{ display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13.5 }}>
          <input
            type="checkbox"
            name="isPublic"
            style={{ width: 16, height: 16, accentColor: "var(--fg)" }}
          />
          Público — qualquer pessoa com o link pode visualizar
        </label>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 6 }}>
          <button type="submit" className="btn btn-primary">Criar e adicionar músicas</button>
          <a href="/admin/setlists" className="btn-link">Cancelar</a>
        </div>
      </form>
    </div>
  );
}
