/* =====================================================
   main.js — Sidebar, Reveal on Scroll, Contact Form
   =====================================================
   [EN] Main JavaScript file for portfolio site.
        Handles: navbar toggle, active-link tracking,
        scroll reveal, contact form, language switch,
        project image gallery, footer year, smooth scroll.
   [TH] ไฟล์ JavaScript หลักของ Portfolio
        จัดการ: เมนูบนมือถือ, ไฮไลต์ลิงก์ตาม section ที่กำลังดู,
        animation เมื่อ scroll, ฟอร์มติดต่อ, เปลี่ยนภาษา,
        gallery รูปโปรเจค, ปีใน footer, smooth scroll
   ===================================================== */

/* ---------- 1. Mobile menu toggle ----------
   [EN] Toggle the hamburger menu open/close on mobile.
        When any nav link inside the menu is clicked,
        the menu automatically closes.
   [TH] เปิด/ปิด hamburger menu บนหน้าจอมือถือ
        ถ้ากดลิงก์ใน menu จะปิด menu อัตโนมัติ
*/
const hamburgerBtn = document.getElementById('hamburgerBtn');
const mobileMenu   = document.getElementById('mobileMenu');

if (hamburgerBtn && mobileMenu) {
  // [EN] Click hamburger → toggle 'open' class on menu, 'active' class on button
  // [TH] กด hamburger → toggle class 'open' บน menu และ 'active' บนปุ่ม
  hamburgerBtn.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburgerBtn.classList.toggle('active', isOpen);
  });
}

// [EN] Close mobile menu automatically when a nav link is clicked
// [TH] ปิด mobile menu ทันทีเมื่อกดลิงก์ใน menu
document.querySelectorAll('.topnav__mobile-link').forEach((link) => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburgerBtn.classList.remove('active');
  });
});

/* ---------- 2. Active nav link on scroll ----------
   [EN] Use IntersectionObserver to watch which section is currently
        visible in the viewport. Highlight the matching nav link.
        threshold: 0.35 means at least 35% of the section must be visible.
   [TH] ใช้ IntersectionObserver ตรวจจับว่า section ไหนกำลังแสดงอยู่บนหน้าจอ
        แล้วไฮไลต์ลิงก์ใน navbar ที่ตรงกัน
        threshold 0.35 = ต้องเห็น section อย่างน้อย 35% จึงจะนับว่า active
*/
const sections  = document.querySelectorAll('.content-section[id]');
const navLinks  = document.querySelectorAll('.topnav__link[data-section], .topnav__mobile-link[data-section]');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // [EN] Add 'active' class only to the link whose data-section matches the visible section id
        // [TH] ไฮไลต์เฉพาะลิงก์ที่ data-section ตรงกับ id ของ section ที่กำลังแสดงอยู่
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.dataset.section === entry.target.id);
        });
      }
    });
  },
  { threshold: 0.35 }
);
// [EN] Observe every section with an id
// [TH] เริ่ม observe ทุก section ที่มี id
sections.forEach((s) => sectionObserver.observe(s));

/* ---------- 3. Reveal on scroll ----------
   [EN] Animate elements into view when they enter the viewport.
        Elements start hidden (via CSS: opacity 0, translateY/X).
        Once 8% of the element is visible, add 'revealed' class
        to trigger the CSS transition, then stop observing it.
   [TH] Animation ที่ทำให้ element ค่อยๆ โผล่ขึ้นมาเมื่อ scroll ถึง
        ตอนแรก element จะซ่อนอยู่ (CSS: opacity 0, เลื่อนออก)
        พอเห็น element 8% บน viewport จะเพิ่ม class 'revealed'
        เพื่อ trigger CSS transition แล้วหยุด observe (เพื่อ performance)
*/
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // [EN] Trigger reveal animation
        // [TH] เริ่ม animation reveal
        entry.target.classList.add('revealed');
        // [EN] Stop observing after revealing — no need to re-trigger
        // [TH] หยุด observe หลัง reveal แล้ว เพื่อไม่ให้ทำงานซ้ำ
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08 }
);
// [EN] Observe all elements with reveal animation classes
// [TH] เริ่ม observe ทุก element ที่ต้องการ reveal animation
document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach((el) => revealObserver.observe(el));

/* ---------- 4. Contact form ----------
   [EN] Handle contact form submission (frontend-only).
        No backend — just shows a success message, then resets the form.
        Real email sending would require a backend service.
   [TH] จัดการการ submit ฟอร์มติดต่อ (ฝั่ง frontend เท่านั้น)
        ไม่มี backend — แค่แสดง success message แล้ว reset ฟอร์ม
        การส่ง email จริงต้องมี backend
*/
const form     = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');
if (form) {
  form.addEventListener('submit', (e) => {
    // [EN] Prevent default form submission (page reload)
    // [TH] ป้องกัน browser โหลดหน้าใหม่เมื่อ submit ฟอร์ม
    e.preventDefault();
    // [EN] Show success message in the current language
    // [TH] แสดงข้อความสำเร็จตามภาษาที่เลือกอยู่
    formNote.textContent = currentLang === 'th' ? 'ส่งสำเร็จแล้ว ✓' : 'Sent successfully! ✓';
    form.reset();
    // [EN] Clear the success message after 5 seconds
    // [TH] ลบข้อความสำเร็จออกหลัง 5 วินาที
    setTimeout(() => { formNote.textContent = ''; }, 5000);
  });
}

/* ---------- 5. Language toggle ----------
   [EN] Switch the UI language between Thai (TH) and English (EN).
        Uses data-i18n attributes on HTML elements to identify
        which text to replace. The translations object holds
        all strings for both languages.
   [TH] สลับภาษา UI ระหว่างไทย (TH) กับอังกฤษ (EN)
        ใช้ attribute data-i18n บน HTML element เพื่อระบุ key ของข้อความ
        แล้วดึงข้อความจาก object translations
*/
const langBtn = document.getElementById('langBtn');
let currentLang = 'th'; // [EN] Default language = Thai | [TH] ภาษาเริ่มต้น = ไทย

// [EN] All translatable text strings for both languages
// [TH] ข้อความทั้งหมดที่ต้องแปล สำหรับทั้งสองภาษา
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
    restaurantDesc:'ระบบร้านอาหารสั่งตามออเดอร์ มี menu management, order tracking และ QR code สำหรับสั่งอาหารที่โต๊ะ พัฒนาด้วย Next.js + PostgreSQL',
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
    restaurantDesc:'A made-to-order restaurant system with menu management, order tracking, and QR code for table ordering. Built with Next.js and PostgreSQL.',
    contactTitle: 'Contact',
    contactIntro: 'Got something to say? Feel free to reach out! 👋',
    formName:     'Name',
    formEmail:    'Email',
    formMessage:  'Message',
  },
};

/**
 * [EN] Apply a language to the entire page.
 *      Finds all elements with data-i18n attribute,
 *      looks up the key in the translations object,
 *      and sets the innerHTML of each element.
 * [TH] เปลี่ยนภาษาทั้งหน้า
 *      หา element ที่มี attribute data-i18n
 *      ดึงข้อความจาก translations object ตาม key
 *      แล้วใส่ใน innerHTML ของ element นั้น
 *
 * @param {string} lang - 'th' or 'en'
 */
function applyLang(lang) {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    if (translations[lang][key] !== undefined) {
      // [EN] Use innerHTML to support HTML tags like <strong> in translation strings
      // [TH] ใช้ innerHTML เพื่อรองรับ HTML tag เช่น <strong> ในข้อความแปล
      el.innerHTML = translations[lang][key];
    }
  });
  // [EN] Toggle button label: show opposite language
  // [TH] เปลี่ยน label ปุ่มให้แสดงภาษาตรงข้าม
  langBtn.textContent = lang === 'th' ? 'EN' : 'TH';
  // [EN] Update the HTML lang attribute for accessibility / SEO
  // [TH] อัปเดต lang attribute ของ <html> เพื่อ accessibility และ SEO
  document.documentElement.lang = lang;
}

if (langBtn) {
  // [EN] Toggle language and re-apply translations on each click
  // [TH] สลับภาษาและ apply ข้อความใหม่ทุกครั้งที่กด
  langBtn.addEventListener('click', () => {
    currentLang = currentLang === 'th' ? 'en' : 'th';
    applyLang(currentLang);
  });
}

/* ---------- 6. Project image gallery ----------
   [EN] Auto-advancing image gallery for project showcase sections.
        Each gallery has: an image track, navigation dots, prev/next buttons.
        Auto-advances every 4 seconds. Pauses on mouse hover.
   [TH] Gallery รูปภาพที่เลื่อนอัตโนมัติสำหรับแสดงโปรเจค
        แต่ละ gallery มี: image track, navigation dots, ปุ่ม prev/next
        เลื่อนอัตโนมัติทุก 4 วินาที หยุดเมื่อ hover
*/
const galleries = {}; // [EN] Store state for each gallery by id | [TH] เก็บ state ของแต่ละ gallery แยกตาม id

/**
 * [EN] Initialize a gallery by its id.
 *      Reads images and dots from the DOM,
 *      saves state to the galleries object,
 *      and starts auto-advance timer.
 * [TH] เริ่มต้น gallery ตาม id ที่กำหนด
 *      อ่านรูปภาพและ dots จาก DOM
 *      บันทึก state ลงใน galleries object
 *      และเริ่ม timer เลื่อนอัตโนมัติ
 *
 * @param {string} id - gallery id, e.g. 'jobportal' or 'restaurant'
 */
function initGallery(id) {
  const track = document.getElementById('track-' + id);
  if (!track) return; // [EN] Gallery not found, skip | [TH] ถ้าไม่มี gallery นี้ใน DOM ให้ข้ามไป

  const images = Array.from(track.querySelectorAll('img'));
  const dots   = Array.from(document.querySelectorAll('#dots-' + id + ' .gallery-dot'));

  // [EN] Save gallery state: current index, total count, image/dot elements
  // [TH] บันทึก state ของ gallery: index ปัจจุบัน, จำนวนรูป, รายการ element รูปและ dots
  galleries[id] = { index: 0, count: images.length, images, dots };

  const wrapper = track.closest('.project-showcase__gallery');

  const startTimer = () => {
    // [EN] Auto-advance to next image every 4 seconds
    // [TH] เลื่อนไปรูปถัดไปอัตโนมัติทุก 4 วินาที
    galleries[id].timer = setInterval(() => galleryNext(id), 4000);
  };

  // [EN] Pause auto-advance on hover, resume when mouse leaves
  // [TH] หยุด auto-advance เมื่อ hover เข้า และกลับมาวิ่งเมื่อ hover ออก
  wrapper.addEventListener('mouseenter', () => clearInterval(galleries[id].timer));
  wrapper.addEventListener('mouseleave', startTimer);

  startTimer(); // [EN] Start the timer immediately | [TH] เริ่ม timer ทันที
}

/**
 * [EN] Go to a specific image index in the gallery.
 *      Handles wrap-around (after last → back to first, before first → go to last).
 *      Updates 'active' class on images and dots.
 * [TH] ไปยังรูปภาพตาม index ที่กำหนด
 *      รองรับการวนรอบ (หลังรูปสุดท้าย → กลับไปรูปแรก, ก่อนรูปแรก → ไปรูปสุดท้าย)
 *      อัปเดต class 'active' บนรูปและ dots
 *
 * @param {string} id    - gallery id
 * @param {number} index - target image index (can be negative or over count)
 */
function galleryGo(id, index) {
  const g = galleries[id];
  if (!g) return;

  // [EN] Remove 'active' from current image and dot
  // [TH] ลบ class 'active' จากรูปและ dot ปัจจุบัน
  g.images[g.index].classList.remove('active');
  if (g.dots[g.index]) g.dots[g.index].classList.remove('active');

  // [EN] Calculate new index with wrap-around using modulo
  // [TH] คำนวณ index ใหม่ พร้อมรองรับการวนรอบด้วย modulo
  g.index = ((index % g.count) + g.count) % g.count;

  // [EN] Add 'active' to new image and dot
  // [TH] เพิ่ม class 'active' ให้รูปและ dot ใหม่
  g.images[g.index].classList.add('active');
  if (g.dots[g.index]) g.dots[g.index].classList.add('active');
}

/**
 * [EN] Advance gallery to next image (called by timer and next-button)
 * [TH] เลื่อนไปรูปถัดไป (ถูกเรียกจาก timer และปุ่ม next)
 */
function galleryNext(id) { galleryGo(id, galleries[id].index + 1); }

/**
 * [EN] Go back to previous image (called by prev-button)
 * [TH] ย้อนกลับไปรูปก่อนหน้า (ถูกเรียกจากปุ่ม prev)
 */
function galleryPrev(id) { galleryGo(id, galleries[id].index - 1); }

// [EN] Initialize galleries for each project
// [TH] เริ่มต้น gallery สำหรับแต่ละโปรเจค
initGallery('jobportal');
initGallery('restaurant');

/* ---------- 7. Footer year ----------
   [EN] Automatically show the current year in the footer copyright notice.
        No need to manually update it every year.
   [TH] แสดงปีปัจจุบันใน footer อัตโนมัติ
        ไม่ต้องอัปเดตด้วยมือทุกปี
*/
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ---------- 8. Smooth scroll offset for fixed topnav ----------
   [EN] Override default anchor link behavior to smooth-scroll
        with a 80px offset (to account for the fixed navbar height).
        Without offset, the section heading would be hidden behind the navbar.
   [TH] Override การเลื่อนหน้า anchor link ให้ scroll อย่าง smooth
        และชดเชย 80px สำหรับความสูงของ navbar ที่ fixed อยู่บนหน้าจอ
        ถ้าไม่ชดเชย หัวข้อ section จะถูกบัง navbar
*/
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault(); // [EN] Stop default jump | [TH] ป้องกัน browser กระโดดไปเลย
    const offset = 80; // [EN] Height of fixed navbar in pixels | [TH] ความสูงของ navbar
    window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
  });
});
