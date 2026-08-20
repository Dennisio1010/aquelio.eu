/* Aquelio — CMP (gestion du consentement), implémentation maison.
   Chargé tôt dans le <head>, avant GTM, conformément à la séquence :
   1) Consent Mode par défaut  2) CMP (ce fichier)  3) GTM.

   À remplacer par un fournisseur tiers (Cookiebot, Didomi, Axeptio...) si
   besoin — l'identifiant est déjà exposé en data-attribute sur la balise
   <script> pour faciliter ce remplacement plus tard. */

(() => {
  const CMP_ID = document.currentScript?.dataset.cmpId || "CMP_ID_A_DEFINIR";
  const KEY = "aquelio-consent";
  const PIXEL_ID = "1711732010095663";

  // Événements Meta demandés avant le chargement du pixel (cas d'un visiteur
  // qui arrive sur la page de remerciement et accepte les cookies dans la
  // foulée) : mis en file d'attente ici, rejoués au chargement.
  const pending = [];
  let pixelLoaded = false;

  // Le Meta Pixel n'a pas d'équivalent au Consent Mode de Google (pas de
  // mode "bloqué par défaut" intégré) : on ne le charge donc que depuis ici,
  // jamais directement dans le <head> des pages, pour qu'il ne se déclenche
  // qu'après consentement effectif.
  function loadMetaPixel() {
    if (pixelLoaded) return;
    pixelLoaded = true;

    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', PIXEL_ID);
    window.fbq('track', 'PageView');

    while (pending.length) {
      const [name, params, onSent] = pending.shift();
      window.fbq('track', name, params);
      onSent?.();
    }
  }

  /* Événements métier envoyés à Meta depuis le reste du site — aujourd'hui
     le Lead de la page de remerciement (voir thanks.js). Toujours sûr à
     appeler : sans consentement, l'appel est mis en file d'attente et
     abandonné avec la page.

     `onSent` n'est appelé qu'à l'envoi réel, jamais à la mise en file :
     l'appelant peut ainsi ne marquer l'événement comme transmis que
     lorsqu'il l'est vraiment, et le retenter à la visite suivante sinon. */
  window.aquelioPixel = (name, params, onSent) => {
    if (pixelLoaded) {
      window.fbq('track', name, params);
      onSent?.();
    } else {
      pending.push([name, params, onSent]);
    }
  };

  // Le stockage local peut être indisponible (navigation privée stricte,
  // cookies bloqués) : sans ce filet, l'exception couperait toute la CMP,
  // donc la bannière elle-même.
  function stored() {
    try {
      return localStorage.getItem(KEY);
    } catch {
      return null;
    }
  }

  function grant() {
    // Le shim gtag() est défini par le snippet Consent Mode chargé juste avant
    // celui-ci — on le réutilise, on n'en redéfinit pas un second.
    if (typeof window.gtag === "function") {
      window.gtag('consent', 'update', {
        'ad_storage': 'granted',
        'analytics_storage': 'granted',
        'ad_user_data': 'granted',
        'ad_personalization': 'granted',
      });
    }
    loadMetaPixel();
  }

  // Un visiteur déjà consentant lors d'une visite précédente : on redonne
  // le consentement dès que possible, sans attendre le chargement du DOM.
  if (stored() === "accepted") {
    grant();
  }

  document.addEventListener("DOMContentLoaded", () => {
    const banner = document.getElementById("cookieBanner");
    const acceptBtn = document.getElementById("cookieAccept");
    if (!banner || !acceptBtn) return;

    if (stored() !== "accepted") {
      banner.hidden = false;
    }

    acceptBtn.addEventListener("click", () => {
      try {
        localStorage.setItem(KEY, "accepted");
      } catch { /* le consentement vaudra alors pour cette visite seulement */ }
      grant();
      banner.hidden = true;
    });
  });

  window.__cmpId = CMP_ID; // exposé pour debug/vérification, sans usage fonctionnel
})();
