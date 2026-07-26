/* Aquelio — anatomie pilotée au scroll.
   La vidéo (rendu concept, 10 s) est avancée image par image selon la
   progression de défilement dans la section .scrub, avec interpolation
   pour lisser les seeks du décodeur. Même principe que les pages produit
   à la Apple : on n'anime pas un clip, on scrube une timeline. */

(() => {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const video = document.getElementById("scrubVideo");
  const section = document.querySelector(".scrub");
  const bar = document.getElementById("progressBar");
  const stages = [...document.querySelectorAll(".stage")];

  const mobile = window.matchMedia("(max-width: 720px)").matches;
  video.src = mobile ? video.dataset.srcMobile : video.dataset.srcDesktop;

  if (reduced) {
    video.controls = true;
    video.loop = true;
    stages.forEach(s => s.classList.add("is-on"));
    return;
  }

  /* Bornes des étapes, en fraction de progression du scroll.
     0→0.10 héro · 0.10→0.34 problème · 0.34→0.58 solution · 0.58→1 nomenclature */
  const STAGE_BOUNDS = [
    { name: "hero",  from: 0.00, to: 0.10 },
    { name: "turn",  from: 0.12, to: 0.34 },
    { name: "open",  from: 0.36, to: 0.58 },
    { name: "parts", from: 0.62, to: 1.01 },
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

  function showToggle(on) {
    toggle.classList.toggle("is-visible", on);
  }

  toggle.addEventListener("click", () => {
    userPaused = !userPaused;
    if (userPaused) {
      video.pause();
      toggleIcon.textContent = "▶";
      toggle.setAttribute("aria-label", "Lire l'animation");
    } else {
      toggleIcon.textContent = "❚❚";
      toggle.setAttribute("aria-label", "Mettre l'animation en pause");
      if (mode === "play") video.play().catch(() => {});
    }
  });

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
      const def = STAGE_BOUNDS.find(s => s.name === stage.dataset.stage);
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
