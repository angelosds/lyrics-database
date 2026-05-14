import { createSetlist } from "@/lib/actions/setlists";
import Link from "next/link";

export default function NewSetlistPage() {
  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/setlists"
          className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors mb-4 inline-block"
        >
          ← Setlists
        </Link>
        <h1 className="text-2xl font-bold">Novo Setlist</h1>
      </div>

      <form action={createSetlist} className="space-y-5 max-w-lg">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">
            Nome do show / evento *
          </label>
          <input
            type="text"
            name="name"
            required
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-500"
            placeholder="ex: Show de Verão 2025"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">
              Data
            </label>
            <input
              type="date"
              name="eventDate"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">
              Local
            </label>
            <input
              type="text"
              name="venue"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-500"
              placeholder="ex: Teatro Municipal"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="isPublic"
            id="isPublic"
            className="w-4 h-4 rounded border-zinc-600 bg-zinc-900 accent-white"
          />
          <label htmlFor="isPublic" className="text-sm text-zinc-300">
            Tornar setlist público (acessível por link)
          </label>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="bg-zinc-100 hover:bg-white text-zinc-900 font-semibold rounded-lg px-5 py-2.5 text-sm transition-colors"
          >
            Criar e adicionar músicas
          </button>
          <a
            href="/admin/setlists"
            className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors py-2.5 px-2"
          >
            Cancelar
          </a>
        </div>
      </form>
    </div>
  );
}
