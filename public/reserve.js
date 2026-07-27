/* Aquelio — page de test Phase 0.
   Deux façons de réserver : la liste d'attente (friction quasi nulle) et le
   virement bancaire (friction réelle, force du signal d'achat) — le paiement
   par carte reviendra une fois Stripe activé. */

(() => {
  const $ = id => document.getElementById(id);

  /* ── Textes dynamiques par langue (la page peut être fr, nl ou de) ── */
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
  const t = STRINGS[document.documentElement.lang] || STRINGS.fr;

  /* ── Liste d'attente ───────────────────────── */
  const waitlistForm = $("waitlistForm");
  const waitlistNote = $("waitlistNote");

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
        body: JSON.stringify({ email, lang: document.documentElement.lang }),
      });
      const data = await res.json();
      if (res.ok) {
        waitlistNote.textContent = t.success;
        waitlistForm.reset();
      } else {
        waitlistNote.textContent = data.error || t.genericError;
      }
    } catch {
      waitlistNote.textContent = t.offline;
    }
    btn.disabled = false;
    btn.textContent = t.submit;
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
