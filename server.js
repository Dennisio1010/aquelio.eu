// AQUELIO. — serveur minimal pour la page de test Phase 0.
// Deux rôles actifs : servir le site statique et capter les emails de la
// liste d'attente (fichier local, pas de base de données à ce stade).
// La route Stripe reste en place, prête à être réactivée plus tard, mais
// n'est plus appelée depuis l'interface (plus de paiement à ce stade).

import express from "express";
import Stripe from "stripe";
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

const DATA_DIR = path.join(__dirname, "data");
const EMAILS_FILE = path.join(DATA_DIR, "emails.jsonl");
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const INVALID_EMAIL_MSG = {
  fr: "Adresse email invalide.",
  nl: "Ongeldig e-mailadres.",
  de: "Ungültige E-Mail-Adresse.",
};

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

// Capture d'email — liste d'attente, friction minimale.
app.post("/api/subscribe", (req, res) => {
  const email = String(req.body?.email || "").trim().toLowerCase();
  const lang = INVALID_EMAIL_MSG[req.body?.lang] ? req.body.lang : "fr";
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ error: INVALID_EMAIL_MSG[lang] });
  }
  const line = JSON.stringify({ email, at: new Date().toISOString() }) + "\n";
  fs.appendFile(EMAILS_FILE, line, (err) => {
    if (err) {
      console.error("Erreur écriture email :", err.message);
      return res.status(500).json({ error: "Impossible d'enregistrer l'email." });
    }
    res.json({ ok: true });
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
});
