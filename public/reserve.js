/* Aquelio — page de test Phase 0.
   Deux CTA distincts, volontairement séparés pour mesurer deux signaux :
   1) la liste d'attente (friction quasi nulle, volume)
   2) le dépôt remboursable (friction réelle, force du signal d'achat) */

(() => {
  const $ = id => document.getElementById(id);

  /* ── Liste d'attente ───────────────────────── */
  const waitlistForm = $("waitlistForm");
  const waitlistNote = $("waitlistNote");

  waitlistForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = new FormData(waitlistForm).get("email");
    const btn = waitlistForm.querySelector("button");
    btn.disabled = true;
    btn.textContent = "Envoi…";
    waitlistNote.textContent = "";
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        waitlistNote.textContent = "Inscrit·e ! Tu recevras des nouvelles avant le lancement.";
        waitlistForm.reset();
      } else {
        waitlistNote.textContent = data.error || "Une erreur est survenue, réessaie.";
      }
    } catch {
      waitlistNote.textContent = "Serveur injoignable. Lancez le serveur (node server.js) puis réessayez.";
    }
    btn.disabled = false;
    btn.textContent = "S'inscrire";
  });

  /* ── Dépôt remboursable (Stripe Checkout) ──── */
  const depositBtn = $("depositBtn");
  const depositNote = $("depositNote");

  depositBtn.addEventListener("click", async () => {
    depositBtn.disabled = true;
    depositBtn.textContent = "Redirection…";
    depositNote.textContent = "Création du paiement sécurisé…";
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
        return;
      }
      depositNote.textContent = data.message || data.error || "Le paiement n'a pas pu démarrer. Réessayez.";
    } catch {
      depositNote.textContent = "Serveur injoignable. Lancez le serveur (node server.js) puis réessayez.";
    }
    depositBtn.disabled = false;
    depositBtn.textContent = "Réserver — dépôt de 20 €";
  });

  /* ── Bannière cookies (minimal, RGPD) ──────── */
  const banner = $("cookieBanner");
  const KEY = "source-cookie-consent";
  if (!localStorage.getItem(KEY)) {
    banner.hidden = false;
  }
  $("cookieAccept").addEventListener("click", () => {
    localStorage.setItem(KEY, "accepted");
    banner.hidden = true;
  });
})();
