/* =====================================================
   main.js — Scroll reveal, skill bars, form, footer year
   ===================================================== */

/* ---------- 1. Scroll Reveal ---------- */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

/* ---------- 2. Skill Bar Animation ---------- */
const barObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.skill-bar__fill').forEach((fill) => {
          fill.classList.add('animated');
        });
        barObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);

document.querySelectorAll('.skill-card').forEach((card) => barObserver.observe(card));

/* ---------- 3. Contact Form ---------- */
const form     = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // TODO: ส่งข้อมูลจริงผ่าน EmailJS / Formspree หรือ backend ของตัวเอง
    formNote.textContent = '✅ ส่งข้อความเรียบร้อยแล้วครับ! จะรีบติดต่อกลับนะครับ';
    formNote.style.color = '#2A6EF0';
    form.reset();

    setTimeout(() => { formNote.textContent = ''; }, 5000);
  });
}

/* ---------- 4. Footer Year ---------- */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
