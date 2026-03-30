/* =====================================================
   main.js — Sidebar, Reveal on Scroll, Contact Form
   ===================================================== */

/* ---------- 1. Mobile menu toggle ---------- */
const hamburgerBtn = document.getElementById('hamburgerBtn');
const mobileMenu   = document.getElementById('mobileMenu');

if (hamburgerBtn && mobileMenu) {
  hamburgerBtn.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburgerBtn.classList.toggle('active', isOpen);
  });
}

document.querySelectorAll('.topnav__mobile-link').forEach((link) => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburgerBtn.classList.remove('active');
  });
});

/* ---------- 2. Active nav link on scroll ---------- */
const sections  = document.querySelectorAll('.content-section[id]');
const navLinks  = document.querySelectorAll('.topnav__link[data-section], .topnav__mobile-link[data-section]');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
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
document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach((el) => revealObserver.observe(el));

/* ---------- 4. Contact form ---------- */
const form     = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    formNote.textContent = currentLang === 'th' ? 'ส่งสำเร็จแล้ว ✓' : 'Sent successfully! ✓';
    form.reset();
    setTimeout(() => { formNote.textContent = ''; }, 5000);
  });
}

/* ---------- 5. Language toggle ---------- */
const langBtn = document.getElementById('langBtn');
let currentLang = 'th';

const translations = {
  th: {
    educationTitle: 'การศึกษา',
    eduUniversity:  'มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ',
    eduMajor:       'คณิตศาสตร์กับวิทยาการคอมพิวเตอร์ (MC)',
    eduYear:        'ชั้นปีที่ 3 &nbsp;·&nbsp; 2022 – ปัจจุบัน',
    aboutName:    'ทิณภัทร ปั้นคง',
    aboutRole:    'Full-Stack Developer',
    aboutDesc:    'สวัสดีครับ ผมแบงค์ นักพัฒนาซอฟต์แวร์ที่ชอบสร้างสิ่งใหม่ๆ ศึกษาอยู่ที่ <strong>KMUTNB</strong> สาขาวิทยาการคอมพิวเตอร์ มีความสนใจด้าน Full-Stack Web Development และ AI Engineering',
    skillsTitle:  'My Skills',
    projectsTitle:'My Projects',
    jobPortalDesc:'แพลตฟอร์มหางานครบวงจร รองรับผู้หางาน นายจ้าง และ Admin พร้อม JWT auth, RBAC, avatar upload และ real-time job search',
    restaurantDesc:'ระบบร้านอาหารสั่งตามออเดอร์ มี menu management, order tracking และ QR code สำหรับสั่งอาหารที่โต๊ะ พัฒนาด้วย Next.js + Prisma + PostgreSQL',
    contactTitle: 'ติดต่อ',
    contactIntro: 'มีอะไรอยากคุยด้วย ทักมาได้เลยครับ 👋',
    formName:     'ชื่อ',
    formEmail:    'อีเมล',
    formMessage:  'ข้อความ',
  },
  en: {
    educationTitle: 'Education',
    eduUniversity:  "King Mongkut's University of Technology North Bangkok",
    eduMajor:       'Mathematics with Computer Science (MC)',
    eduYear:        'Year 3 &nbsp;·&nbsp; 2022 – Present',
    aboutName:    'Tinnaphat Pankong',
    aboutRole:    'Full-Stack Developer',
    aboutDesc:    "Hi! I'm Bank, a software developer who loves building new things. Studying at <strong>KMUTNB</strong>, Computer Science. Passionate about Full-Stack Web Development and AI Engineering.",
    skillsTitle:  'My Skills',
    projectsTitle:'My Projects',
    jobPortalDesc:'A comprehensive job portal supporting job seekers, employers, and admins with JWT auth, RBAC, avatar upload, and real-time job search.',
    restaurantDesc:'A made-to-order restaurant system with menu management, order tracking, and QR code for table ordering. Built with Next.js, Prisma, and PostgreSQL.',
    contactTitle: 'Contact',
    contactIntro: 'Got something to say? Feel free to reach out! 👋',
    formName:     'Name',
    formEmail:    'Email',
    formMessage:  'Message',
  },
};

function applyLang(lang) {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    if (translations[lang][key] !== undefined) {
      el.innerHTML = translations[lang][key];
    }
  });
  langBtn.textContent = lang === 'th' ? 'EN' : 'TH';
  document.documentElement.lang = lang;
}

if (langBtn) {
  langBtn.addEventListener('click', () => {
    currentLang = currentLang === 'th' ? 'en' : 'th';
    applyLang(currentLang);
  });
}

/* ---------- 6. Project image gallery ---------- */
const galleries = {};

function initGallery(id) {
  const track = document.getElementById('track-' + id);
  if (!track) return;
  const images = Array.from(track.querySelectorAll('img'));
  const dots   = Array.from(document.querySelectorAll('#dots-' + id + ' .gallery-dot'));
  galleries[id] = { index: 0, count: images.length, images, dots };

  const wrapper = track.closest('.project-showcase__gallery');
  const startTimer = () => {
    galleries[id].timer = setInterval(() => galleryNext(id), 4000);
  };
  wrapper.addEventListener('mouseenter', () => clearInterval(galleries[id].timer));
  wrapper.addEventListener('mouseleave', startTimer);
  startTimer();
}

function galleryGo(id, index) {
  const g = galleries[id];
  if (!g) return;
  g.images[g.index].classList.remove('active');
  if (g.dots[g.index]) g.dots[g.index].classList.remove('active');
  g.index = ((index % g.count) + g.count) % g.count;
  g.images[g.index].classList.add('active');
  if (g.dots[g.index]) g.dots[g.index].classList.add('active');
}

function galleryNext(id) { galleryGo(id, galleries[id].index + 1); }
function galleryPrev(id) { galleryGo(id, galleries[id].index - 1); }

initGallery('jobportal');
initGallery('restaurant');

/* ---------- 8. Footer year ---------- */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ---------- 8. Smooth scroll offset for fixed topnav ---------- */
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
  });
});
