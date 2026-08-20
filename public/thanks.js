/* Aquelio — pages de remerciement.
   Deux rôles : servir le bon dossier régional, et poser la seule question
   qui vaut la peine à ce stade (la sensibilité au prix).

   Le dossier est téléchargé immédiatement, pas envoyé par email : le
   visiteur obtient sa contrepartie tout de suite, et aucun mail ne peut
   finir en spam. Le code postal arrive par sessionStorage — jamais par
   l'URL, pour ne pas l'exposer dans l'historique ni les référents. */

(() => {
  const LOCALE = (document.documentElement.lang || "fr").slice(0, 2);
  const dl = (window.dataLayer = window.dataLayer || []);
  dl.push({ page_language: LOCALE });

  const BASE = "/assets/dossiers/";

  const LABELS = {
    fr: {
      wallonie: "Dossier PFAS, Wallonie & Bruxelles",
      vlaanderen: "Dossier PFAS, Flandre",
      deutschland: "Dossier PFAS, Allemagne",
    },
    nl: {
      wallonie: "PFAS-dossier, Wallonië & Brussel",
      vlaanderen: "PFAS-dossier, Vlaanderen",
      deutschland: "PFAS-dossier, Duitsland",
    },
    de: {
      wallonie: "PFAS-Dossier, Wallonie & Brüssel",
      vlaanderen: "PFAS-Dossier, Flandern",
      deutschland: "PFAS-Dossier, Deutschland",
    },
  };

  /* Répartition des codes postaux belges (4 chiffres) :
       1000–1299  Bruxelles          → dossier Wallonie
       1300–1499  Brabant wallon     → dossier Wallonie
       1500–3999  Brabant flamand,
                  Anvers, Limbourg   → dossier Flandre
       4000–7999  Wallonie           → dossier Wallonie
       8000–9999  Flandre occidentale
                  et orientale       → dossier Flandre */
  function dossierFor(locale, postalCode) {
    if (locale === "de") return "deutschland";

    const n = Number.parseInt(postalCode, 10);
    if (!Number.isFinite(n)) {
      return locale === "nl" ? "vlaanderen" : "wallonie";
    }
    if (n >= 1500 && n <= 3999) return "vlaanderen";
    if (n >= 8000 && n <= 9999) return "vlaanderen";
    if (n >= 1000 && n <= 7999) return "wallonie";
    return locale === "nl" ? "vlaanderen" : "wallonie";
  }

  let postalCode = "";
  try {
    postalCode = sessionStorage.getItem("aquelio_cp") || "";
  } catch { /* navigation privée : on servira le dossier par défaut de la locale */ }

  const key = dossierFor(LOCALE, postalCode);
  const labels = LABELS[LOCALE] || LABELS.fr;

  const link = document.getElementById("dossierLink");
  if (link) link.href = `${BASE}${key}.pdf`;

  const name = document.getElementById("dossierName");
  if (name) name.textContent = labels[key];

  dl.push({ event: "dossier_ready", locale: LOCALE, dossier: key });

  /* ── Conversion publicitaire ─────────────────────────────────────
     Arriver ici, c'est avoir laissé son code postal et son email : le
     lead est acquis. C'est donc ici, et nulle part ailleurs, que se
     déclenche la conversion — Google Ads et Meta ne savent rien du
     formulaire, seulement de la page qui le suit.

     Un rechargement de la page ne doit pas compter un second lead :
     c'est le même visiteur, la même demande. Le garde-fou tient sur la
     session, ce qui laisse passer une nouvelle demande faite plus tard
     depuis un autre onglet — cas assez rare pour ne pas s'en soucier.

     Deux comptes Google Ads pilotent le site, un par marché : la Belgique
     (pages FR et NL) et l'Allemagne (pages DE), tenus séparés pour ne pas
     mélanger budgets et données. La conversion part donc vers le compte du
     marché de la page — l'envoyer au mauvais laisserait une campagne
     aveugle et en gonflerait une autre.

     Un marché sans action de conversion créée resterait à null : ne rien
     compter vaut mieux que compter dans le mauvais compte. */
  const GOOGLE_ADS_CONVERSIONS = {
    fr: "AW-18381937595/PK3-CP6NnOEcELu3mL1E", // Belgique
    nl: "AW-18381937595/PK3-CP6NnOEcELu3mL1E", // Belgique (même compte)
    de: "AW-18245591187/e9mHCOTxouEcEJPBlvxD", // Allemagne
  };

  let alreadyCounted = false;
  try {
    alreadyCounted = sessionStorage.getItem("aquelio_lead") === "1";
    sessionStorage.setItem("aquelio_lead", "1");
  } catch { /* navigation privée : au pire, un rechargement compte deux fois */ }

  if (!alreadyCounted) {
    // gtag() existe toujours : le shim est défini dans le <head>, avant
    // même le chargement de gtag.js. Le Consent Mode fait le reste.
    const sendTo = GOOGLE_ADS_CONVERSIONS[LOCALE];
    if (sendTo && typeof window.gtag === "function") {
      window.gtag('event', 'conversion', { send_to: sendTo });
    }
    // Meta : chargé uniquement si le visiteur a accepté les cookies,
    // sinon l'appel est mis en file et abandonné avec la page.
    window.aquelioPixel?.('Lead', { content_name: key, content_category: "dossier_pfas" });
  }

  if (link) {
    link.addEventListener("click", () => {
      dl.push({ event: "dossier_download", locale: LOCALE, dossier: key });
    });
  }

  /* ── Dépôt de réservation (20 €) ───────────────────────────────
     En plus du dossier gratuit, jamais à sa place : ce n'est pas une
     vente, juste une réservation remboursable pour qui veut aller plus
     loin. Reste silencieux (pas d'erreur technique affichée) si Stripe
     n'est pas encore configuré côté serveur. */
  const DEPOSIT_STRINGS = {
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
  const dt = DEPOSIT_STRINGS[LOCALE] || DEPOSIT_STRINGS.fr;

  const depositBtn = document.getElementById("depositBtn");
  if (depositBtn) {
    const depositStatus = document.getElementById("depositStatus");

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
          if (depositStatus) depositStatus.textContent = data.message || dt.unavailable;
          return;
        }

        dl.push({ event: "deposit_checkout_start", locale: LOCALE });
        window.location.href = data.url;
      } catch {
        depositBtn.disabled = false;
        if (depositStatus) depositStatus.textContent = dt.offline;
      }
    });
  }

  /* ── Sensibilité au prix ────────────────────────────────────────
     Une seule question, quatre tranches. Cette réponse en dit plus
     long que dix sondages déclaratifs. */
  const poll = document.getElementById("pricePoll");
  if (!poll) return;

  const buttons = [...poll.querySelectorAll("button[data-band]")];
  const feedback = poll.querySelector(".price-thanks");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((b) => { b.disabled = true; });
      button.classList.add("is-picked");

      dl.push({
        event: "pricing_answer",
        locale: LOCALE,
        price_band: button.dataset.band,
      });

      if (feedback) feedback.textContent = feedback.dataset.done || "";
    });
  });
})();
