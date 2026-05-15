"use server";

import { db } from "@/db";
import { songs } from "@/db/schema";
import { slugify } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createSong(formData: FormData) {
  const title = formData.get("title") as string;
  const lyrics = formData.get("lyrics") as string;
  const interprete = formData.get("interprete") as string | null;
  const year = formData.get("year") ? Number(formData.get("year")) : null;
  const key = formData.get("key") as string | null;
  const bpm = formData.get("bpm") ? Number(formData.get("bpm")) : null;
  const notes = formData.get("notes") as string | null;

  const slug = slugify(title);

  await db.insert(songs).values({
    title,
    slug,
    lyrics,
    interprete: interprete || null,
    year: year || null,
    key: key || null,
    bpm: bpm || null,
    notes: notes || null,
  });

  revalidatePath("/");
  revalidatePath("/admin/musicas");
  redirect("/admin/musicas");
}

export async function updateSong(id: string, formData: FormData) {
  const title = formData.get("title") as string;
  const lyrics = formData.get("lyrics") as string;
  const interprete = formData.get("interprete") as string | null;
  const year = formData.get("year") ? Number(formData.get("year")) : null;
  const key = formData.get("key") as string | null;
  const bpm = formData.get("bpm") ? Number(formData.get("bpm")) : null;
  const notes = formData.get("notes") as string | null;

  const [existing] = await db.select().from(songs).where(eq(songs.id, id)).limit(1);
  if (!existing) throw new Error("Música não encontrada");

  const slug = title !== existing.title ? slugify(title) : existing.slug;

  await db
    .update(songs)
    .set({
      title,
      slug,
      lyrics,
      interprete: interprete || null,
      year: year || null,
      key: key || null,
      bpm: bpm || null,
      notes: notes || null,
      updatedAt: new Date(),
    })
    .where(eq(songs.id, id));

  revalidatePath("/");
  revalidatePath(`/musicas/${slug}`);
  revalidatePath("/admin/musicas");
  redirect("/admin/musicas");
}

export async function archiveSong(id: string) {
  await db.update(songs).set({ archived: true, updatedAt: new Date() }).where(eq(songs.id, id));
  revalidatePath("/");
  revalidatePath("/admin/musicas");
}

export async function restoreSong(id: string) {
  await db.update(songs).set({ archived: false, updatedAt: new Date() }).where(eq(songs.id, id));
  revalidatePath("/");
  revalidatePath("/admin/musicas");
}
