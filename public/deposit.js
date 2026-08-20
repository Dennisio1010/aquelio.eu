/* Aquelio — dépôt de réservation (20 €).
   Partagé entre les pages d'accueil (accès direct, sans passer par le
   dossier gratuit) et les pages de remerciement (proposé en plus, une
   fois le dossier obtenu). En plus du dossier gratuit, jamais à sa
   place : ce n'est pas une vente, juste une réservation remboursable
   pour qui veut aller plus loin. Reste silencieux (pas d'erreur
   technique affichée) si Stripe n'est pas encore configuré côté
   serveur. */

(() => {
  const depositBtn = document.getElementById("depositBtn");
  if (!depositBtn) return;

  const LOCALE = (document.documentElement.lang || "fr").slice(0, 2);
  const dl = (window.dataLayer = window.dataLayer || []);
  const depositStatus = document.getElementById("depositStatus");

  const STRINGS = {
    fr: {
      unavailable: "Réservation indisponible pour le moment. Réessayez plus tard.",
      offline: "Connexion impossible. Réessayez dans un instant.",
    },
    nl: {
      unavailable: "Reserveren is momenteel niet beschikbaar. Probeer het later opnieuw.",
      offline: "Geen verbinding. Probeer het zo opnieuw.",
    },
    de: {
      unavailable: "Reservierung derzeit nicht verfügbar. Bitte später erneut versuchen.",
      offline: "Keine Verbindung. Bitte gleich noch einmal versuchen.",
    },
  };
  const t = STRINGS[LOCALE] || STRINGS.fr;

  depositBtn.addEventListener("click", async () => {
    depositBtn.disabled = true;
    if (depositStatus) depositStatus.textContent = "";

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale: LOCALE }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.url) {
        depositBtn.disabled = false;
        if (depositStatus) depositStatus.textContent = data.message || t.unavailable;
        return;
      }

      dl.push({ event: "deposit_checkout_start", locale: LOCALE });
      window.location.href = data.url;
    } catch {
      depositBtn.disabled = false;
      if (depositStatus) depositStatus.textContent = t.offline;
    }
  });
})();
