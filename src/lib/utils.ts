import slugifyLib from "slugify";

export function slugify(text: string): string {
  return slugifyLib(text, { lower: true, strict: true, locale: "pt" });
}

export function formatLyrics(lyrics: string): string[][] {
  return lyrics.split(/\n\n+/).map((stanza) => stanza.split("\n"));
}
