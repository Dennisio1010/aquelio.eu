/* Aquelio — formulaire « dossier PFAS ».
   Deux champs (code postal + email), répété trois fois sur la page.
   Le code postal est la donnée utile : il indique où se concentre la demande.

   Événements dataLayer (tous porteurs de `locale`) :
     form_view    — un formulaire visible à 50 % dans le viewport
     form_start   — premier champ rempli
     form_submit  — soumission acceptée par le serveur
     form_error   — échec (validation locale ou refus serveur)

   Un seul form_view et un seul form_start par chargement : les trois
   formulaires sont la même offre, les compter trois fois fausserait le
   dénominateur du taux de conversion. */

(() => {
  const LOCALE = (document.documentElement.lang || "fr").slice(0, 2);
  const COUNTRY = (document.body.dataset.country || "BE").toUpperCase();

  const dl = (window.dataLayer = window.dataLayer || []);

  const forms = [...document.querySelectorAll("[data-dossier-form]")];
  if (!forms.length) return;

  /* ── Validation du code postal, par pays ─────────────────────────
     BE : 4 chiffres, jamais de zéro initial (1000–9992).
     DE : 5 chiffres, zéro initial fréquent (01067 Dresde). */
  const POSTAL = {
    BE: /^[1-9]\d{3}$/,
    DE: /^\d{5}$/,
  }[COUNTRY] || /^\d{4,5}$/;

  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const STRINGS = {
    fr: {
      postalInvalid: "Code postal belge invalide (4 chiffres).",
      emailInvalid: "Adresse email invalide.",
      sending: "Envoi…",
      submit: "Recevoir mon dossier",
      offline: "Connexion impossible. Réessayez dans un instant.",
      genericError: "Une erreur est survenue. Réessayez.",
    },
    nl: {
      postalInvalid: "Ongeldige Belgische postcode (4 cijfers).",
      emailInvalid: "Ongeldig e-mailadres.",
      sending: "Verzenden…",
      submit: "Mijn dossier ontvangen",
      offline: "Geen verbinding. Probeer het zo opnieuw.",
      genericError: "Er ging iets mis. Probeer opnieuw.",
    },
    de: {
      postalInvalid: "Ungültige deutsche Postleitzahl (5 Ziffern).",
      emailInvalid: "Ungültige E-Mail-Adresse.",
      sending: "Wird gesendet…",
      submit: "Mein Dossier erhalten",
      offline: "Keine Verbindung. Bitte gleich noch einmal versuchen.",
      genericError: "Etwas ist schiefgelaufen. Bitte erneut versuchen.",
    },
  };
  const t = STRINGS[LOCALE] || STRINGS.fr;

  const THANKS = {
    fr: "/merci.html",
    nl: "/nl/bedankt.html",
    de: "/de/danke.html",
  };

  /* ── form_view : premier formulaire visible à moitié ───────────── */
  let viewSent = false;
  const io = new IntersectionObserver((entries) => {
    if (viewSent) return;
    for (const entry of entries) {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
        viewSent = true;
        dl.push({ event: "form_view", locale: LOCALE });
        io.disconnect();
        return;
      }
    }
  }, { threshold: 0.5 });
  forms.forEach((form) => io.observe(form));

  /* ── form_start : premier caractère saisi, où que ce soit ──────── */
  let startSent = false;

  function markStart(form) {
    if (startSent) return;
    startSent = true;
    dl.push({
      event: "form_start",
      locale: LOCALE,
      form_location: form.dataset.formLocation || "inconnu",
    });
  }

  function fail(form, field, message, reason) {
    const status = form.querySelector(".df-status");
    if (status) status.textContent = message;
    if (field) {
      field.setAttribute("aria-invalid", "true");
      field.focus();
    }
    dl.push({
      event: "form_error",
      locale: LOCALE,
      form_location: form.dataset.formLocation || "inconnu",
      error_reason: reason,
    });
  }

  forms.forEach((form) => {
    const postalInput = form.querySelector("[name=postalCode]");
    const emailInput = form.querySelector("[name=email]");
    const status = form.querySelector(".df-status");
    const button = form.querySelector("button[type=submit]");

    form.addEventListener("input", (e) => {
      if (e.target.value.trim()) markStart(form);
      e.target.removeAttribute("aria-invalid");
      if (status) status.textContent = "";
    });

    // Le champ code postal n'accepte que des chiffres — on nettoie à la volée
    // plutôt que de rejeter après coup.
    postalInput.addEventListener("input", () => {
      const cleaned = postalInput.value.replace(/\D/g, "");
      if (cleaned !== postalInput.value) postalInput.value = cleaned;
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const postalCode = postalInput.value.trim();
      const email = emailInput.value.trim();

      if (!POSTAL.test(postalCode)) {
        return fail(form, postalInput, t.postalInvalid, "postal_code");
      }
      if (!EMAIL.test(email)) {
        return fail(form, emailInput, t.emailInvalid, "email");
      }

      button.disabled = true;
      button.textContent = t.sending;
      if (status) status.textContent = "";

      try {
        const res = await fetch("/api/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, postalCode, locale: LOCALE, country: COUNTRY }),
        });
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          button.disabled = false;
          button.textContent = t.submit;
          return fail(form, null, data.error || t.genericError, "server");
        }

        // Le code postal voyage en sessionStorage, jamais en paramètre d'URL :
        // la page de remerciement en a besoin pour choisir le bon dossier.
        try {
          sessionStorage.setItem("aquelio_cp", postalCode);
        } catch { /* navigation privée : le dossier régional par défaut suffit */ }

        let done = false;
        const go = () => {
          if (done) return;
          done = true;
          window.location.href = THANKS[LOCALE] || THANKS.fr;
        };

        dl.push({
          event: "form_submit",
          locale: LOCALE,
          form_location: form.dataset.formLocation || "inconnu",
          eventCallback: go,
          eventTimeout: 1200,
        });
        // Filet : si GTM est bloqué ou absent, eventCallback ne se déclenche pas.
        setTimeout(go, 1200);
      } catch {
        button.disabled = false;
        button.textContent = t.submit;
        fail(form, null, t.offline, "network");
      }
    });
  });
})();
