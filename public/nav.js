/* Aquelio — menu mobile (hamburger). Le panneau réutilise directement
   .nav-links : pas de liste dupliquée, un seul jeu de liens à tenir à jour. */

(() => {
  const nav = document.getElementById("top");
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  if (!nav || !toggle || !links) return;

  function close() {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }

  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  links.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", close);
  });
})();
