"use client";

export function ShareButton() {
  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ url });
    } else {
      await navigator.clipboard.writeText(url);
      alert("Link copiado!");
    }
  };

  return (
    <button
      onClick={handleShare}
      className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors border border-zinc-700 rounded px-3 py-1.5"
    >
      Compartilhar link
    </button>
  );
}
