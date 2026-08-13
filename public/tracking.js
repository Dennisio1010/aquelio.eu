/* Aquelio — Pixel Meta (Facebook / Instagram).
   Chargé sur toutes les pages, juste après la CMP.

   Google Ads passe par gtag et le Consent Mode v2 : il gère lui-même le
   refus de consentement (pings sans cookie). Meta n'a pas d'équivalent —
   le pixel ne doit donc tout simplement pas être chargé tant que le
   visiteur n'a pas accepté. C'est le rôle de ce fichier :

     - consentement déjà donné lors d'une visite précédente → chargement
       immédiat, sans attendre le DOM ;
     - consentement donné maintenant → cmp.js émet `aquelio:consent`,
       on charge à ce moment-là ;
     - pas de consentement → aucune requête vers Meta, jamais.

   Les événements demandés avant le chargement (cas d'un visiteur qui
   arrive sur la page de remerciement et accepte les cookies dans la
   foulée) sont mis en file d'attente puis rejoués. */

(() => {
  const PIXEL_ID = "1711732010095663";
  const KEY = "aquelio-consent";

  const pending = [];
  let started = false;

  function accepted() {
    try {
      return localStorage.getItem(KEY) === "accepted";
    } catch {
      return false; // navigation privée : on considère qu'il n'y a pas de consentement
    }
  }

  function load() {
    if (started) return;
    started = true;

    /* Snippet officiel Meta : crée window.fbq et sa propre file d'attente,
       puis charge fbevents.js de façon asynchrone. */
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
    document,'script','https://connect.facebook.net/en_US/fbevents.js');

    window.fbq('init', PIXEL_ID);
    window.fbq('track', 'PageView');

    while (pending.length) {
      const [name, params] = pending.shift();
      window.fbq('track', name, params);
    }
  }

  /* API utilisée par les autres scripts du site (voir thanks.js).
     Toujours sûre à appeler : sans consentement, l'événement est
     simplement abandonné avec la page. */
  window.aquelioPixel = (name, params) => {
    if (started && window.fbq) window.fbq('track', name, params);
    else pending.push([name, params]);
  };

  if (accepted()) load();
  else document.addEventListener("aquelio:consent", load, { once: true });
})();
