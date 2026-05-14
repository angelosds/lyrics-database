"use client";

import { type Song } from "@/db/schema";

type Props = {
  song?: Song;
  action: (formData: FormData) => Promise<void>;
};

export function SongForm({ song, action }: Props) {
  return (
    <form action={action} className="space-y-5 max-w-2xl">
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1.5">
          Título *
        </label>
        <input
          type="text"
          name="title"
          required
          defaultValue={song?.title}
          className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-500"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">
            Álbum
          </label>
          <input
            type="text"
            name="album"
            defaultValue={song?.album ?? ""}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">
            Ano
          </label>
          <input
            type="number"
            name="year"
            defaultValue={song?.year ?? ""}
            min="1900"
            max="2100"
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">
            Tom
          </label>
          <input
            type="text"
            name="key"
            defaultValue={song?.key ?? ""}
            placeholder="ex: Am, G, C#"
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-500 font-mono"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1.5">
          BPM
        </label>
        <input
          type="number"
          name="bpm"
          defaultValue={song?.bpm ?? ""}
          min="40"
          max="300"
          className="w-40 bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1.5">
          Letra *
        </label>
        <textarea
          name="lyrics"
          required
          defaultValue={song?.lyrics}
          rows={20}
          className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-zinc-500 font-mono leading-relaxed resize-y"
          placeholder={"Verso 1\nLinha 2\nLinha 3\n\nRefrão\nLinha 2\nLinha 3"}
        />
        <p className="text-xs text-zinc-500 mt-1">
          Separe as estrofes com uma linha em branco.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1.5">
          Notas internas
        </label>
        <textarea
          name="notes"
          defaultValue={song?.notes ?? ""}
          rows={3}
          className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-zinc-500 resize-y"
          placeholder="Observações para uso interno (não aparecem no site)"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="bg-zinc-100 hover:bg-white text-zinc-900 font-semibold rounded-lg px-5 py-2.5 text-sm transition-colors"
        >
          Salvar
        </button>
        <a
          href="/admin/musicas"
          className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors py-2.5 px-2"
        >
          Cancelar
        </a>
      </div>
    </form>
  );
}
