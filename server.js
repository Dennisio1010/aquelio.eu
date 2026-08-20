// AQUELIO. — serveur minimal pour la page de test Phase 0.
// Deux rôles actifs : servir le site statique et capter les demandes de
// dossier PFAS (code postal + email, fichier local, pas de base de données
// à ce stade). Le code postal est la donnée la plus utile de la phase 0 :
// il indique où se concentre la demande réelle.
// La route Stripe reste en place, prête à être réactivée plus tard, mais
// n'est plus appelée depuis l'interface (plus de paiement à ce stade).

import express from "express";
import Stripe from "stripe";
import { Resend } from "resend";
import dotenv from "dotenv";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
const PORT = process.env.PORT || 4173;

// Dépôt de réservation remboursable, pas encore le produit final :
// un signal d'intention d'achat mesurable, pas une vente ferme.
const DEPOSIT = {
  name: "Dépôt de réservation : filtre à eau Aquelio",
  unitAmount: 2000, // 20,00 € en centimes
  currency: "eur",
};

const CHECKOUT_LOCALES = {
  fr: {
    stripeLocale: "fr",
    success: "/reservation-confirmee.html",
    cancel: "/merci.html",
  },
  nl: {
    stripeLocale: "nl",
    success: "/nl/reservering-bevestigd.html",
    cancel: "/nl/bedankt.html",
  },
  de: {
    stripeLocale: "de",
    success: "/de/reservierung-bestaetigt.html",
    cancel: "/de/danke.html",
  },
};

const stripeKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeKey ? new Stripe(stripeKey) : null;

// Email de confirmation d'inscription — désactivé (mode démo) tant que
// RESEND_API_KEY n'est pas défini. EMAIL_FROM doit appartenir à un domaine
// vérifié dans Resend (aquelio.eu) ; sinon Resend refuse ou restreint l'envoi.
const resendKey = process.env.RESEND_API_KEY;
const resend = resendKey ? new Resend(resendKey) : null;
const EMAIL_FROM = process.env.EMAIL_FROM || "Aquelio <onboarding@resend.dev>";

const DATA_DIR = path.join(__dirname, "data");
const EMAILS_FILE = path.join(DATA_DIR, "emails.jsonl");
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const SITE_URL = (process.env.SITE_URL || "https://aquelio.eu").replace(/\/$/, "");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// BE : 4 chiffres, jamais de zéro initial (1000–9992).
// DE : 5 chiffres, zéro initial fréquent (01067 Dresde).
const POSTAL_RE = {
  BE: /^[1-9]\d{3}$/,
  DE: /^\d{5}$/,
};

const INVALID_EMAIL_MSG = {
  fr: "Adresse email invalide.",
  nl: "Ongeldig e-mailadres.",
  de: "Ungültige E-Mail-Adresse.",
};

const INVALID_POSTAL_MSG = {
  fr: "Code postal invalide.",
  nl: "Ongeldige postcode.",
  de: "Ungültige Postleitzahl.",
};

// Répartition des codes postaux belges — voir public/thanks.js, qui applique
// exactement la même règle côté client pour choisir le PDF à télécharger.
function regionFor(country, postalCode, locale) {
  if (country === "DE") return "deutschland";

  const n = Number.parseInt(postalCode, 10);
  if (!Number.isFinite(n)) return locale === "nl" ? "vlaanderen" : "wallonie";
  if (n >= 1500 && n <= 3999) return "vlaanderen";
  if (n >= 8000 && n <= 9999) return "vlaanderen";
  if (n >= 1000 && n <= 7999) return "wallonie";
  return locale === "nl" ? "vlaanderen" : "wallonie";
}

// Le dossier est téléchargé sur la page de remerciement ; cet email n'est
// qu'un filet de secours (et une trace) — il ne conditionne pas la livraison.
const CONFIRMATION_EMAIL = {
  fr: {
    subject: "Votre dossier PFAS | Aquelio",
    body: (url) =>
`Merci pour votre demande.

Votre dossier PFAS est disponible ici :
${url}

Vous serez prévenu·e par email dès que le rapport du laboratoire indépendant sera publié.

Aquelio est un filtre à eau anti-PFAS en cours de développement. Aucune vente ferme n'est effectuée avant validation en laboratoire indépendant.

Vous pouvez vous désinscrire à tout moment en répondant à cet email.

L'équipe Aquelio`,
  },
  nl: {
    subject: "Jouw PFAS-dossier | Aquelio",
    body: (url) =>
`Bedankt voor je aanvraag.

Je PFAS-dossier staat hier klaar:
${url}

Je krijgt een e-mail zodra het rapport van het onafhankelijke laboratorium gepubliceerd is.

Aquelio is een anti-PFAS waterfilter in ontwikkeling. Er vindt geen definitieve verkoop plaats vóór validatie door een onafhankelijk laboratorium.

Je kunt je op elk moment uitschrijven door op deze e-mail te antwoorden.

Het Aquelio-team`,
  },
  de: {
    subject: "Ihr PFAS-Dossier | Aquelio",
    body: (url) =>
`Danke für Ihre Anfrage.

Ihr PFAS-Dossier steht hier bereit:
${url}

Sie erhalten eine E-Mail, sobald der Bericht des unabhängigen Labors veröffentlicht ist.

Aquelio ist ein Anti-PFAS-Wasserfilter in Entwicklung. Ein endgültiger Verkauf erfolgt erst nach Validierung durch ein unabhängiges Labor.

Sie können sich jederzeit abmelden, indem Sie auf diese E-Mail antworten.

Das Aquelio-Team`,
  },
};

async function sendConfirmationEmail(email, locale, region) {
  if (!resend) return;
  const content = CONFIRMATION_EMAIL[locale] || CONFIRMATION_EMAIL.fr;
  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to: email,
      subject: content.subject,
      text: content.body(`${SITE_URL}/assets/dossiers/${region}.pdf`),
    });
  } catch (err) {
    console.error("Erreur envoi email de confirmation :", err.message);
  }
}

app.use(express.json());

// Les versions NL et DE vivent dans des dossiers (/nl/, /de/) : on impose
// la barre oblique finale comme forme canonique et on redirige la forme
// sans slash vers celle-ci (jamais l'inverse), pour éviter les URLs
// dupliquées vis-à-vis des balises canonical et hreflang.
app.use((req, res, next) => {
  if (req.path === "/nl" || req.path === "/de") {
    const qs = req.url.slice(req.path.length);
    return res.redirect(301, `${req.path}/${qs}`);
  }
  next();
});

app.use(express.static(path.join(__dirname, "public")));

// Indique au front si le paiement réel est configuré (sinon : mode démo).
app.get("/api/config", (_req, res) => {
  res.json({ paymentReady: Boolean(stripe) });
});

// Demande de dossier PFAS — deux champs seulement : code postal et email.
app.post("/api/subscribe", (req, res) => {
  const email = String(req.body?.email || "").trim().toLowerCase();
  const postalCode = String(req.body?.postalCode || "").trim();
  const locale = INVALID_EMAIL_MSG[req.body?.locale] ? req.body.locale : "fr";
  const country = POSTAL_RE[String(req.body?.country || "").toUpperCase()]
    ? String(req.body.country).toUpperCase()
    : (locale === "de" ? "DE" : "BE");

  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ error: INVALID_EMAIL_MSG[locale] });
  }
  if (!POSTAL_RE[country].test(postalCode)) {
    return res.status(400).json({ error: INVALID_POSTAL_MSG[locale] });
  }

  const region = regionFor(country, postalCode, locale);

  const line = JSON.stringify({
    email, postalCode, country, region, locale,
    at: new Date().toISOString(),
  }) + "\n";

  fs.appendFile(EMAILS_FILE, line, (err) => {
    if (err) {
      console.error("Erreur écriture demande :", err.message);
      return res.status(500).json({ error: "Impossible d'enregistrer la demande." });
    }
    res.json({ ok: true, region });
    sendConfirmationEmail(email, locale, region);
  });
});

// Export CSV des demandes — c'est la donnée de la phase 0 : où se concentre
// la demande. Protégé par EXPORT_TOKEN ; sans jeton configuré, la route est
// simplement absente plutôt qu'ouverte.
app.get("/api/export.csv", (req, res) => {
  const token = process.env.EXPORT_TOKEN;
  if (!token) return res.status(404).end();
  if (req.query.token !== token) return res.status(403).end();

  let raw = "";
  try {
    raw = fs.readFileSync(EMAILS_FILE, "utf8");
  } catch {
    raw = "";
  }

  const rows = raw.split("\n").filter(Boolean).map((line) => {
    try { return JSON.parse(line); } catch { return null; }
  }).filter(Boolean);

  const escape = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const csv = ["email,postalCode,country,region,locale,at"]
    .concat(rows.map((r) =>
      [r.email, r.postalCode, r.country, r.region, r.locale, r.at].map(escape).join(",")))
    .join("\n");

  res.type("text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", 'attachment; filename="aquelio-demandes.csv"');
  res.send(csv);
});

// Crée une session Stripe Checkout pour le dépôt remboursable (qty 1 fixe).
app.post("/api/checkout", async (req, res) => {
  try {
    if (!stripe) {
      return res.status(503).json({
        error: "demo",
        message: "Paiement non configuré : ajoutez STRIPE_SECRET_KEY dans .env pour activer l'encaissement.",
      });
    }

    const locale = CHECKOUT_LOCALES[req.body?.locale] ? req.body.locale : "fr";
    const { stripeLocale, success, cancel } = CHECKOUT_LOCALES[locale];

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      locale: stripeLocale,
      line_items: [{
        quantity: 1,
        price_data: {
          currency: DEPOSIT.currency,
          unit_amount: DEPOSIT.unitAmount,
          product_data: { name: DEPOSIT.name },
        },
      }],
      success_url: `${SITE_URL}${success}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}${cancel}`,
      billing_address_collection: "auto",
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Erreur checkout :", err.message);
    res.status(500).json({ error: "Impossible de créer la session de paiement." });
  }
});

app.listen(PORT, () => {
  console.log(`Aquelio — landing pages sur http://localhost:${PORT}`);
  console.log(stripe ? "Paiement Stripe : activé." : "Paiement Stripe : mode démo (aucune clé).");
  console.log(resend ? "Email de confirmation (Resend) : activé." : "Email de confirmation (Resend) : mode démo (aucune clé).");
});
