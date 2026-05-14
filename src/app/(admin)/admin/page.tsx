import { db } from "@/db";
import { songs, setlists } from "@/db/schema";
import { eq, count } from "drizzle-orm";
import Link from "next/link";

export default async function AdminDashboard() {
  const [{ total: totalSongs }] = await db
    .select({ total: count() })
    .from(songs)
    .where(eq(songs.archived, false));

  const [{ total: totalSetlists }] = await db
    .select({ total: count() })
    .from(setlists);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <p className="text-3xl font-bold">{totalSongs}</p>
          <p className="text-sm text-zinc-400 mt-1">Músicas ativas</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <p className="text-3xl font-bold">{totalSetlists}</p>
          <p className="text-sm text-zinc-400 mt-1">Setlists</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Link
          href="/admin/musicas/nova"
          className="block bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-xl p-5 transition-all"
        >
          <h2 className="font-semibold mb-1">Nova Música</h2>
          <p className="text-sm text-zinc-400">Adicionar uma nova letra à base</p>
        </Link>
        <Link
          href="/admin/setlists/novo"
          className="block bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-xl p-5 transition-all"
        >
          <h2 className="font-semibold mb-1">Novo Setlist</h2>
          <p className="text-sm text-zinc-400">Criar setlist para um show</p>
        </Link>
        <Link
          href="/admin/musicas"
          className="block bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-xl p-5 transition-all"
        >
          <h2 className="font-semibold mb-1">Gerenciar Músicas</h2>
          <p className="text-sm text-zinc-400">Editar, arquivar e organizar</p>
        </Link>
        <Link
          href="/admin/setlists"
          className="block bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-xl p-5 transition-all"
        >
          <h2 className="font-semibold mb-1">Gerenciar Setlists</h2>
          <p className="text-sm text-zinc-400">Editar e compartilhar setlists</p>
        </Link>
      </div>
    </div>
  );
}
