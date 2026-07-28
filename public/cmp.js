/* Aquelio — CMP (gestion du consentement), implémentation maison.
   Chargé tôt dans le <head>, avant GTM, conformément à la séquence :
   1) Consent Mode par défaut  2) CMP (ce fichier)  3) GTM.

   À remplacer par un fournisseur tiers (Cookiebot, Didomi, Axeptio...) si
   besoin — l'identifiant est déjà exposé en data-attribute sur la balise
   <script> pour faciliter ce remplacement plus tard. */

(() => {
  const CMP_ID = document.currentScript?.dataset.cmpId || "CMP_ID_A_DEFINIR";
  const KEY = "aquelio-consent";

  function grant() {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(["consent", "update", {
      ad_storage: "granted",
      analytics_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
    }]);
  }

  // Un visiteur déjà consentant lors d'une visite précédente : on redonne
  // le consentement dès que possible, sans attendre le chargement du DOM.
  if (localStorage.getItem(KEY) === "accepted") {
    grant();
  }

  document.addEventListener("DOMContentLoaded", () => {
    const banner = document.getElementById("cookieBanner");
    const acceptBtn = document.getElementById("cookieAccept");
    if (!banner || !acceptBtn) return;

    if (localStorage.getItem(KEY) !== "accepted") {
      banner.hidden = false;
    }

    acceptBtn.addEventListener("click", () => {
      localStorage.setItem(KEY, "accepted");
      grant();
      banner.hidden = true;
    });
  });

  window.__cmpId = CMP_ID; // exposé pour debug/vérification, sans usage fonctionnel
})();
