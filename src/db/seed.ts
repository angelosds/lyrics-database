import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();
import { db } from "./index";
import { songs, users, setlists, setlistSongs } from "./schema";
import bcrypt from "bcryptjs";
import { slugify } from "../lib/utils";

async function seed() {
  console.log("🌱 Iniciando seed...");

  // Usuário admin
  const passwordHash = await bcrypt.hash("admin123", 12);
  await db
    .insert(users)
    .values({
      email: "admin@banda.com",
      passwordHash,
      name: "Administrador",
    })
    .onConflictDoNothing();

  // Músicas de exemplo
  const songData = [
    {
      title: "Exemplo de Música",
      lyrics: `Primeiro verso da música
Segunda linha do verso
Terceira linha do verso

Refrão aqui
Refrão aqui
Refrão aqui

Segundo verso da música
Segunda linha do verso
Terceira linha do verso

Refrão aqui
Refrão aqui
Refrão aqui`,
      album: "Primeiro Álbum",
      year: 2020,
      key: "C",
      bpm: 120,
    },
    {
      title: "Canção de Verão",
      lyrics: `Sol brilhando lá fora
Vento soprando devagar
A vida é uma canção
Que a gente vai cantar

Verão, verão
Tempo de alegria
Verão, verão
Toda a banda em harmonia

Noite chegando mansinha
Estrelas a brilhar
Fogueira na praia
Todos a cantar

Verão, verão
Tempo de alegria
Verão, verão
Toda a banda em harmonia`,
      album: "Primeiro Álbum",
      year: 2020,
      key: "G",
      bpm: 140,
    },
    {
      title: "Balada da Saudade",
      lyrics: `Longe de casa
Longe de você
Saudade que aperta
E não vai me deixar

Voltar, voltar
Quero tanto voltar
Ao seu sorriso
Ao seu olhar

Dias passando
Noites sem fim
Só a saudade
Aqui dentro de mim

Voltar, voltar
Quero tanto voltar
Ao seu sorriso
Ao seu olhar`,
      album: "Segundo Álbum",
      year: 2022,
      key: "Am",
      bpm: 75,
    },
  ];

  const insertedSongs = await db
    .insert(songs)
    .values(
      songData.map((s) => ({
        ...s,
        slug: slugify(s.title),
      }))
    )
    .onConflictDoNothing()
    .returning();

  console.log(`✅ ${insertedSongs.length} músicas inseridas`);

  // Setlist de exemplo
  if (insertedSongs.length > 0) {
    const [setlist] = await db
      .insert(setlists)
      .values({
        name: "Show de Lançamento",
        eventDate: "2024-12-31",
        venue: "Teatro Municipal",
        publicSlug: "show-lancamento-2024",
      })
      .onConflictDoNothing()
      .returning();

    if (setlist) {
      await db.insert(setlistSongs).values(
        insertedSongs.slice(0, 2).map((song, i) => ({
          setlistId: setlist.id,
          songId: song.id,
          position: i + 1,
        }))
      );
      console.log("✅ Setlist de exemplo criado");
    }
  }

  console.log("✅ Seed concluído!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Erro no seed:", err);
  process.exit(1);
});
