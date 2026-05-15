import Link from "next/link";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="topbar">
        <a className="wordmark" href="/">ibero</a>
        <nav className="nav">
          <Link href="/" className="active">Músicas</Link>
          <Link href="/setlists">Setlists</Link>
          <Link
            href="/login"
            style={{
              color: "var(--fg)",
              borderLeft: "1px solid var(--border)",
              paddingLeft: 22,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13.5,
              fontWeight: 500,
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="11" width="16" height="11" rx="2"/>
              <path d="M8 11V7a4 4 0 0 1 8 0v4"/>
            </svg>
            Área Admin
          </Link>
        </nav>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="site-footer">
        <span>© Ibero · Repositório de Letras</span>
        <span style={{ display: "inline-flex", gap: 16 }}>
          <a href="#" style={{ color: "inherit" }}>Sobre</a>
          <a href="#" style={{ color: "inherit" }}>Contato</a>
        </span>
      </footer>
    </div>
  );
}
