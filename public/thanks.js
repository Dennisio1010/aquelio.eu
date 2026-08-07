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
      wallonie: "Dossier PFAS — Wallonie & Bruxelles",
      vlaanderen: "Dossier PFAS — Flandre",
      deutschland: "Dossier PFAS — Allemagne",
    },
    nl: {
      wallonie: "PFAS-dossier — Wallonië & Brussel",
      vlaanderen: "PFAS-dossier — Vlaanderen",
      deutschland: "PFAS-dossier — Duitsland",
    },
    de: {
      wallonie: "PFAS-Dossier — Wallonie & Brüssel",
      vlaanderen: "PFAS-Dossier — Flandern",
      deutschland: "PFAS-Dossier — Deutschland",
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

  if (link) {
    link.addEventListener("click", () => {
      dl.push({ event: "dossier_download", locale: LOCALE, dossier: key });
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
