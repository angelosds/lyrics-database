import slugifyLib from "slugify";

export function slugify(text: string): string {
  return slugifyLib(text, { lower: true, strict: true, locale: "pt" });
}

export function formatLyrics(lyrics: string): string[][] {
  return lyrics.split(/\n\n+/).map((stanza) => stanza.split("\n"));
}

export function youtubeEmbedUrl(url: string): string | null {
  try {
    const p = new URL(url);
    let id: string | null = null;
    if (p.hostname === "youtu.be") {
      id = p.pathname.slice(1).split("?")[0];
    } else if (p.hostname.includes("youtube.com")) {
      id = p.searchParams.get("v");
      if (!id && p.pathname.startsWith("/embed/")) id = p.pathname.slice(7).split("?")[0];
      if (!id && p.pathname.startsWith("/shorts/")) id = p.pathname.slice(8).split("?")[0];
    }
    return id ? `https://www.youtube.com/embed/${id}` : null;
  } catch {
    return null;
  }
}
