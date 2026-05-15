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
    <button onClick={handleShare} className="btn" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
        <path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/>
      </svg>
      Compartilhar link
    </button>
  );
}
