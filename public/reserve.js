/* Aquelio — page de test Phase 0.
   Inscription gratuite à la liste d'attente + événements dataLayer neutres
   pour GTM (aucune conversion codée en dur ici : GTM décide quoi en faire).
   La gestion du consentement (bannière) vit dans cmp.js, chargé dans le head. */

(() => {
  const $ = id => document.getElementById(id);
  const LANG = document.documentElement.lang || "fr";

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ page_language: LANG });

  /* ── Textes dynamiques par langue ─────────────────────────────── */
  const STRINGS = {
    fr: {
      sending: "Envoi…",
      success: "Inscrit·e ! Tu recevras des nouvelles avant le lancement.",
      genericError: "Une erreur est survenue, réessaie.",
      offline: "Serveur injoignable. Lancez le serveur (node server.js) puis réessayez.",
      submit: "S'inscrire",
    },
    nl: {
      sending: "Verzenden…",
      success: "Ingeschreven! Je ontvangt nieuws vóór de lancering.",
      genericError: "Er is een fout opgetreden, probeer opnieuw.",
      offline: "Server niet bereikbaar. Start de server (node server.js) en probeer opnieuw.",
      submit: "Inschrijven",
    },
    de: {
      sending: "Wird gesendet…",
      success: "Angemeldet! Du erhältst Neuigkeiten vor dem Start.",
      genericError: "Ein Fehler ist aufgetreten, versuche es erneut.",
      offline: "Server nicht erreichbar. Starte den Server (node server.js) und versuche es erneut.",
      submit: "Anmelden",
    },
  };
  const t = STRINGS[LANG] || STRINGS.fr;

  /* ── Profondeur de scroll (une fois chacun par chargement) ───── */
  let sent50 = false, sent90 = false;
  window.addEventListener("scroll", () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    if (total <= 0) return;
    const pct = (window.scrollY / total) * 100;
    if (!sent50 && pct >= 50) {
      sent50 = true;
      window.dataLayer.push({ event: "scroll_50" });
    }
    if (!sent90 && pct >= 90) {
      sent90 = true;
      window.dataLayer.push({ event: "scroll_90" });
    }
  }, { passive: true });

  /* ── Clics CTA (nav + footer, vers #reserver) ─────────────────── */
  document.querySelectorAll("[data-cta]").forEach(el => {
    el.addEventListener("click", () => {
      window.dataLayer.push({ event: "cta_click", cta_label: el.dataset.cta });
    });
  });

  /* ── Liste d'attente ───────────────────────────────────────────── */
  const waitlistForm = $("waitlistForm");
  const waitlistNote = $("waitlistNote");
  const emailInput = waitlistForm.querySelector("input[type=email]");

  let formOpened = false;
  emailInput.addEventListener("focus", () => {
    if (formOpened) return;
    formOpened = true;
    window.dataLayer.push({ event: "form_open" });
  });

  waitlistForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = new FormData(waitlistForm).get("email");
    const btn = waitlistForm.querySelector("button");
    btn.disabled = true;
    btn.textContent = t.sending;
    waitlistNote.textContent = "";
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, lang: LANG }),
      });
      const data = await res.json();
      if (res.ok) {
        waitlistNote.textContent = t.success;
        waitlistForm.reset();
        window.dataLayer.push({ event: "form_submit_success" });
      } else {
        waitlistNote.textContent = data.error || t.genericError;
      }
    } catch {
      waitlistNote.textContent = t.offline;
    }
    btn.disabled = false;
    btn.textContent = t.submit;
  });
})();
