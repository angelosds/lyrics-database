import { PublicNav } from "@/components/public-nav";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="topbar">
        <a className="wordmark" href="/">ibero</a>
        <PublicNav />
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
