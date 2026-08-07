/* Aquelio — comportement de page.
   1. Vidéo d'ambiance du premier écran (desktop uniquement).
   2. Texte piloté au scroll dans .scrub : les blocs « problème / solution /
      principe » apparaissent selon la progression, sur un fond fixe (plus
      de vidéo dans cette section — trop lourd, surtout sur mobile).
   3. Signaux de lecture génériques (profondeur de scroll, clics CTA). */

(() => {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mobile = window.matchMedia("(max-width: 720px)").matches;
  const LOCALE = (document.documentElement.lang || "fr").slice(0, 2);

  const dl = (window.dataLayer = window.dataLayer || []);
  dl.push({ page_language: LOCALE });

  /* ══ 1. Premier écran ═══════════════════════════════════════════
     Sur mobile le fond est un dégradé CSS : aucun octet de vidéo n'est
     téléchargé avant le formulaire, qui doit s'afficher immédiatement. */
  const heroVideo = document.getElementById("heroVideo");
  if (heroVideo && !mobile && !reduced) {
    heroVideo.src = heroVideo.dataset.srcDesktop;

    // On démarre la boucle plus loin dans le fichier : la section .scrub,
    // juste en dessous, reprend ce même clip depuis le début. Si le hero
    // ouvrait aussi sur les premières secondes, un visiteur qui défile tout
    // de suite verrait deux fois la même scène d'affilée.
    heroVideo.addEventListener("loadedmetadata", () => {
      if (heroVideo.duration) heroVideo.currentTime = heroVideo.duration * 0.4;
    }, { once: true });

    heroVideo.play().catch(() => { /* autoplay refusé : le dégradé reste */ });

    // Hors écran, on rend le décodeur au reste de la page.
    new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) heroVideo.play().catch(() => {});
        else heroVideo.pause();
      }
    }, { threshold: 0.05 }).observe(heroVideo);
  }

  /* ══ 3. Signaux de lecture ══════════════════════════════════════ */
  let sent50 = false, sent90 = false;
  window.addEventListener("scroll", () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    if (total <= 0) return;
    const pct = (window.scrollY / total) * 100;
    if (!sent50 && pct >= 50) {
      sent50 = true;
      dl.push({ event: "scroll_50", locale: LOCALE });
    }
    if (!sent90 && pct >= 90) {
      sent90 = true;
      dl.push({ event: "scroll_90", locale: LOCALE });
    }
  }, { passive: true });

  document.querySelectorAll("[data-cta]").forEach((el) => {
    el.addEventListener("click", () => {
      dl.push({ event: "cta_click", locale: LOCALE, cta_label: el.dataset.cta });
    });
  });

  /* ══ 2. Texte piloté au scroll ═══════════════════════════════════ */
  const section = document.querySelector(".scrub");
  if (!section) return;

  const bar = document.getElementById("progressBar");
  const stages = [...document.querySelectorAll(".stage")];

  if (reduced) {
    stages.forEach((s) => s.classList.add("is-on"));
    return;
  }

  /* Bornes des étapes, en fraction de progression du scroll.
     0→0.36 problème · 0.38→0.68 solution · 0.70→1 principe */
  const STAGE_BOUNDS = [
    { name: "turn",     from: 0.00, to: 0.36 },
    { name: "open",     from: 0.38, to: 0.68 },
    { name: "principe", from: 0.70, to: 1.01 },
  ];

  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  function readScroll() {
    const rect = section.getBoundingClientRect();
    const total = section.offsetHeight - window.innerHeight;
    const progress = clamp(-rect.top / total, 0, 1);

    if (bar) bar.style.height = `${(progress * 100).toFixed(1)}%`;

    for (const stage of stages) {
      const def = STAGE_BOUNDS.find((s) => s.name === stage.dataset.stage);
      if (!def) continue;
      stage.classList.toggle("is-on", progress >= def.from && progress < def.to);
    }
  }

  window.addEventListener("scroll", readScroll, { passive: true });
  window.addEventListener("resize", readScroll);

  readScroll();
})();
