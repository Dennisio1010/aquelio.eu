/* Aquelio — page de test Phase 0.
   Deux façons de réserver : la liste d'attente (friction quasi nulle) et le
   virement bancaire (friction réelle, force du signal d'achat) — le paiement
   par carte reviendra une fois Stripe activé. */

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

  /* ── Bannière cookies (RGPD) + Consent Mode Google Ads ──── */
  const banner = $("cookieBanner");
  const KEY = "source-cookie-consent";

  function grantConsent() {
    if (typeof gtag === "function") {
      gtag('consent', 'update', {
        'ad_storage': 'granted',
        'ad_user_data': 'granted',
        'ad_personalization': 'granted',
        'analytics_storage': 'granted'
      });
    }
  }

  if (localStorage.getItem(KEY) === "accepted") {
    // Chaque chargement de page repart en "refusé" par défaut (Consent Mode) —
    // on redonne le consentement si le visiteur avait déjà accepté avant.
    grantConsent();
  } else {
    banner.hidden = false;
  }

  $("cookieAccept").addEventListener("click", () => {
    localStorage.setItem(KEY, "accepted");
    grantConsent();
    banner.hidden = true;
  });
})();
