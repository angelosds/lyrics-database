"use server";

import { db } from "@/db";
import { setlists, setlistSongs } from "@/db/schema";
import { slugify } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createSetlist(formData: FormData) {
  const name = formData.get("name") as string;
  const eventDate = formData.get("eventDate") as string | null;
  const venue = formData.get("venue") as string | null;
  const isPublic = formData.get("isPublic") === "on";

  const publicSlug = isPublic ? slugify(name) + "-" + Date.now() : null;

  const [setlist] = await db
    .insert(setlists)
    .values({
      name,
      eventDate: eventDate || null,
      venue: venue || null,
      publicSlug,
    })
    .returning();

  revalidatePath("/admin/setlists");
  redirect(`/admin/setlists/${setlist.id}/editar`);
}

export async function updateSetlist(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const eventDate = formData.get("eventDate") as string | null;
  const venue = formData.get("venue") as string | null;
  const isPublic = formData.get("isPublic") === "on";

  const [existing] = await db.select().from(setlists).where(eq(setlists.id, id)).limit(1);
  if (!existing) throw new Error("Setlist não encontrado");

  const publicSlug = isPublic
    ? existing.publicSlug ?? slugify(name) + "-" + Date.now()
    : null;

  await db
    .update(setlists)
    .set({
      name,
      eventDate: eventDate || null,
      venue: venue || null,
      publicSlug,
      updatedAt: new Date(),
    })
    .where(eq(setlists.id, id));

  revalidatePath("/admin/setlists");
  revalidatePath(`/setlists/${publicSlug}`);
  redirect("/admin/setlists");
}

export async function deleteSetlist(id: string) {
  await db.delete(setlists).where(eq(setlists.id, id));
  revalidatePath("/admin/setlists");
}

export async function updateSetlistSongs(
  setlistId: string,
  songIds: string[]
) {
  await db.delete(setlistSongs).where(eq(setlistSongs.setlistId, setlistId));

  if (songIds.length > 0) {
    await db.insert(setlistSongs).values(
      songIds.map((songId, index) => ({
        setlistId,
        songId,
        position: index + 1,
      }))
    );
  }

  revalidatePath(`/admin/setlists/${setlistId}/editar`);
}
