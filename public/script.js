/* Aquelio — comportement de page.
   1. Vidéo d'ambiance du premier écran (desktop uniquement).
   2. Anatomie pilotée au scroll : la vidéo est avancée image par image selon
      la progression dans la section .scrub, avec interpolation pour lisser
      les seeks du décodeur. On n'anime pas un clip, on scrube une timeline.
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

  /* ══ 2. Anatomie pilotée au scroll ══════════════════════════════ */
  const video = document.getElementById("scrubVideo");
  const section = document.querySelector(".scrub");
  if (!video || !section) return;

  const bar = document.getElementById("progressBar");
  const stages = [...document.querySelectorAll(".stage")];

  video.src = mobile ? video.dataset.srcMobile : video.dataset.srcDesktop;

  if (reduced) {
    video.controls = true;
    video.loop = true;
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

  /* La vidéo se termine sur un plan fixe : on scrube 0→duration sur les
     premiers 85 % du scroll, puis on tient la dernière image. */
  const VIDEO_SPAN = 0.85;

  let progress = 0;
  let targetTime = 0;
  let currentTime = 0;
  let duration = 0;

  let mode = "play";       // "play" | "scrub"
  let userPaused = false;

  const toggle = document.getElementById("videoToggle");
  const toggleIcon = document.getElementById("videoToggleIcon");

  function showToggle(on) {
    if (toggle) toggle.classList.toggle("is-visible", on);
  }

  function enterPlay() {
    if (userPaused || mode === "play") return;
    mode = "play";
    video.loop = true;
    video.play().catch(() => {});
    showToggle(true);
  }

  function enterScrub() {
    if (mode === "scrub") return;
    mode = "scrub";
    video.loop = false;
    video.pause();
    currentTime = video.currentTime;
    showToggle(false);
  }

  if (toggle) {
    toggle.addEventListener("click", () => {
      userPaused = !userPaused;
      if (userPaused) {
        video.pause();
        toggleIcon.textContent = "▶";
        toggle.setAttribute("aria-label", toggle.dataset.labelPlay || "Lire l'animation");
      } else {
        toggleIcon.textContent = "❚❚";
        toggle.setAttribute("aria-label", toggle.dataset.labelPause || "Mettre l'animation en pause");
        if (mode === "play") video.play().catch(() => {});
      }
    });
  }

  video.addEventListener("loadedmetadata", () => { duration = video.duration; });
  if (video.readyState >= 1) duration = video.duration;

  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  function readScroll() {
    const rect = section.getBoundingClientRect();
    const total = section.offsetHeight - window.innerHeight;
    progress = clamp(-rect.top / total, 0, 1);

    if (progress > 0.012) enterScrub();
    else enterPlay();

    if (duration) {
      targetTime = clamp(progress / VIDEO_SPAN, 0, 1) * (duration - 0.05);
    }

    if (bar) bar.style.height = `${(progress * 100).toFixed(1)}%`;

    for (const stage of stages) {
      const def = STAGE_BOUNDS.find((s) => s.name === stage.dataset.stage);
      if (!def) continue;
      stage.classList.toggle("is-on", progress >= def.from && progress < def.to);
    }
  }

  function tick() {
    if (mode === "scrub") {
      const diff = targetTime - currentTime;
      if (Math.abs(diff) > 0.004) {
        currentTime += diff * 0.14;
        if (video.readyState >= 2) {
          try { video.currentTime = currentTime; } catch { /* seek en cours */ }
        }
      }
    }
    requestAnimationFrame(tick);
  }

  window.addEventListener("scroll", readScroll, { passive: true });
  window.addEventListener("resize", readScroll);

  video.loop = true;
  video.play().then(() => showToggle(true)).catch(() => {
    mode = "scrub";
  });

  readScroll();
  requestAnimationFrame(tick);
})();
