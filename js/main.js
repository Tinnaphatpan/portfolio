/* =====================================================
   main.js — Sidebar, Reveal on Scroll, Contact Form
   ===================================================== */

/* ---------- 1. Mobile sidebar toggle ---------- */
const sidebar       = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');

if (sidebarToggle) {
  sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });
}

document.querySelectorAll('.sidebar__link').forEach((link) => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 900) sidebar.classList.remove('open');
  });
});

document.addEventListener('click', (e) => {
  if (window.innerWidth <= 900 &&
      sidebar.classList.contains('open') &&
      !sidebar.contains(e.target) &&
      e.target !== sidebarToggle) {
    sidebar.classList.remove('open');
  }
});

/* ---------- 2. Active sidebar link on scroll ---------- */
const sections  = document.querySelectorAll('.content-section[id]');
const sideLinks = document.querySelectorAll('.sidebar__link[data-section]');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        sideLinks.forEach((link) => {
          link.classList.toggle('active', link.dataset.section === entry.target.id);
        });
      }
    });
  },
  { threshold: 0.35 }
);
sections.forEach((s) => sectionObserver.observe(s));

/* ---------- 3. Reveal on scroll ---------- */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08 }
);
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

/* ---------- 4. Contact form ---------- */
const form     = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    formNote.textContent = 'sent successfully!';
    form.reset();
    setTimeout(() => { formNote.textContent = ''; }, 5000);
  });
}

/* ---------- 5. Footer year ---------- */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
