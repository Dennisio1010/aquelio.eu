// AQUELIO. — serveur minimal pour la page de test Phase 0.
// Deux rôles actifs : servir le site statique et capter les emails de la
// liste d'attente (fichier local, pas de base de données à ce stade).
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

// Dépôt de réservation remboursable — pas encore le produit final,
// juste un signal d'intention d'achat mesurable.
const DEPOSIT = {
  name: "Dépôt de réservation — Filtre à eau Aquelio",
  unitAmount: 2000, // 20,00 € en centimes
  currency: "eur",
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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const INVALID_EMAIL_MSG = {
  fr: "Adresse email invalide.",
  nl: "Ongeldig e-mailadres.",
  de: "Ungültige E-Mail-Adresse.",
};

const MISSING_FIELDS_MSG = {
  fr: "Merci de renseigner prénom, nom, ville et téléphone.",
  nl: "Vul alsjeblieft voornaam, achternaam, stad en telefoonnummer in.",
  de: "Bitte gib Vorname, Nachname, Stadt und Telefonnummer an.",
};

const CONFIRMATION_EMAIL = {
  fr: {
    subject: "Bienvenue sur la liste d'attente Aquelio",
    text:
`Merci de ton inscription à la liste d'attente Aquelio !

Tu seras informé·e en priorité de l'avancement du produit et de la date de lancement.

Aquelio est un filtre à eau anti-PFAS actuellement en développement — aucune vente ferme n'est effectuée avant validation par un laboratoire indépendant.

Tu peux te désinscrire à tout moment en répondant à cet email.

— L'équipe Aquelio`,
  },
  nl: {
    subject: "Welkom op de Aquelio-wachtlijst",
    text:
`Bedankt voor je inschrijving op de Aquelio-wachtlijst!

Je wordt als eerste op de hoogte gehouden van de voortgang van het product en de lanceringsdatum.

Aquelio is een anti-PFAS waterfilter die momenteel in ontwikkeling is — er vindt geen definitieve verkoop plaats vóór validatie door een onafhankelijk laboratorium.

Je kunt je op elk moment uitschrijven door op deze e-mail te antwoorden.

— Het Aquelio-team`,
  },
  de: {
    subject: "Willkommen auf der Aquelio-Warteliste",
    text:
`Danke für deine Anmeldung zur Aquelio-Warteliste!

Du wirst als Erste·r über den Fortschritt des Produkts und den Starttermin informiert.

Aquelio ist ein Anti-PFAS-Wasserfilter, der sich aktuell in Entwicklung befindet — ein endgültiger Verkauf erfolgt erst nach Validierung durch ein unabhängiges Labor.

Du kannst dich jederzeit abmelden, indem du auf diese E-Mail antwortest.

— Das Aquelio-Team`,
  },
};

async function sendConfirmationEmail(email, lang) {
  if (!resend) return;
  const content = CONFIRMATION_EMAIL[lang] || CONFIRMATION_EMAIL.fr;
  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to: email,
      subject: content.subject,
      text: content.text,
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

// Capture d'inscription — liste d'attente (identité + contact complets).
app.post("/api/subscribe", (req, res) => {
  const email = String(req.body?.email || "").trim().toLowerCase();
  const lang = INVALID_EMAIL_MSG[req.body?.lang] ? req.body.lang : "fr";
  const firstName = String(req.body?.firstName || "").trim();
  const lastName = String(req.body?.lastName || "").trim();
  const city = String(req.body?.city || "").trim();
  const phone = String(req.body?.phone || "").trim();

  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ error: INVALID_EMAIL_MSG[lang] });
  }
  if (!firstName || !lastName || !city || !phone) {
    return res.status(400).json({ error: MISSING_FIELDS_MSG[lang] });
  }

  const line = JSON.stringify({
    firstName, lastName, email, city, phone,
    at: new Date().toISOString(),
  }) + "\n";
  fs.appendFile(EMAILS_FILE, line, (err) => {
    if (err) {
      console.error("Erreur écriture email :", err.message);
      return res.status(500).json({ error: "Impossible d'enregistrer l'email." });
    }
    res.json({ ok: true });
    sendConfirmationEmail(email, lang);
  });
});

// Crée une session Stripe Checkout pour le dépôt remboursable (qty 1 fixe).
app.post("/api/checkout", async (_req, res) => {
  try {
    if (!stripe) {
      return res.status(503).json({
        error: "demo",
        message: "Paiement non configuré : ajoutez STRIPE_SECRET_KEY dans .env pour activer l'encaissement.",
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{
        quantity: 1,
        price_data: {
          currency: DEPOSIT.currency,
          unit_amount: DEPOSIT.unitAmount,
          product_data: { name: DEPOSIT.name },
        },
      }],
      customer_email: undefined, // Stripe Checkout demande l'email lui-même
      billing_address_collection: "auto",
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Erreur checkout :", err.message);
    res.status(500).json({ error: "Impossible de créer la session de paiement." });
  }
});

app.listen(PORT, () => {
  console.log(`Aquelio — page de test sur http://localhost:${PORT}`);
  console.log(stripe ? "Paiement Stripe : activé." : "Paiement Stripe : mode démo (aucune clé).");
  console.log(resend ? "Email de confirmation (Resend) : activé." : "Email de confirmation (Resend) : mode démo (aucune clé).");
});
