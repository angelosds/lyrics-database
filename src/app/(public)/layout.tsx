import Link from "next/link";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-zinc-800 px-6 py-4">
        <nav className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight hover:text-zinc-300 transition-colors"
          >
            Letras da Banda
          </Link>
          <Link
            href="/admin"
            className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            Área Admin
          </Link>
        </nav>
      </header>
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-10">
        {children}
      </main>
      <footer className="border-t border-zinc-800 px-6 py-4 text-center text-sm text-zinc-500">
        Letras da Banda
      </footer>
    </div>
  );
}
