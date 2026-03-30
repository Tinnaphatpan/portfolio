# CLAUDE.md — Portfolio

> อ่านไฟล์นี้ทุกครั้งก่อนเริ่มงาน

---

## โครงสร้างโปรเจค

```
portfolio/
├── index.html          # หน้าเดียว — Single Page (SPA-style scroll)
├── css/
│   ├── style.css       # Core styles, CSS variables, layout, components
│   └── animations.css  # Reveal / skill bar / transition animations
├── js/
│   ├── main.js         # Navbar scroll, reveal observer, gallery, form, footer year
│   └── three-effects.js # Three.js: Particle Stars + Floating Geometry (icosahedron)
└── assets/
    ├── myphoto.jpg     # รูปโปรไฟล์
    ├── iconporfolio.png
    ├── มหาลัย.png
    ├── สาขา.jpg
    └── projects/
        ├── job-portal/              # ภาพ Made-to-Order Restaurant (ใส่ผิด folder — อย่าสับสน)
        │   ├── home.png, menu.png, cart.png, order-mobile.png
        │   ├── register.png, mobile.png, profile.png
        └── made-to-order-restaurant/ # ภาพ Job Portal (ใส่ผิด folder — อย่าสับสน)
            ├── home.png, login.png, job-search.png
            ├── job-detail.png, edit-profile.png
```

> **Pure HTML/CSS/JS** — ไม่มี framework, ไม่มี build step เปิด index.html ในเบราว์เซอร์ได้เลย
> **Three.js** — โหลดผ่าน CDN (r128) ต้องการ internet

---

## Production URL

| Service | URL |
|---|---|
| Portfolio | https://portfolio-six-livid-10.vercel.app |
| GitHub | https://github.com/Tinnaphatpan/portfolio |

---

## เจ้าของ Portfolio

| ข้อมูล | รายละเอียด |
|---|---|
| ชื่อ | ทิณภัทร ปั้นคง (แบงค์) |
| มหาวิทยาลัย | KMUTNB — Computer Science |
| สาย | Full-Stack Developer & AI Engineer |
| GitHub | tinnaphatpan-svg |
| Instagram | @zankky_yaky |
| Facebook | tinnaphat.pankong |
| Email | Tinnaphatpan@gmail.com |

---

## Sections (ตามลำดับใน index.html)

| Section | ID | หน้าที่ |
|---|---|---|
| Navbar | `#navbar` | Fixed top, scroll shrink, mobile toggle, active link highlight |
| Hero | `#home` | รูปโปรไฟล์ + ชื่อ + code card + tech badges + social links |
| Stats Strip | — | Projects / Technologies / Years Coding / Coffee |
| About | `#about` | bio + interest tags + detail items |
| Skills | `#skills` | skill cards + animated progress bars |
| Projects | `#projects` | project cards (3 cards) |
| Contact | `#contact` | contact links + contact form (frontend-only) |
| Footer | — | Logo + nav links + social links + copyright |

---

## Design System (CSS Variables)

| Variable | ค่า | ใช้ที่ |
|---|---|---|
| `--color-bg` | `#F9F8F5` | พื้นหลังหลัก (ครีมอ่อน) |
| `--color-surface` | `#FFFFFF` | Card / surface |
| `--color-text` | `#1A1A1A` | ข้อความหลัก |
| `--color-muted` | `#6B6B6B` | ข้อความรอง |
| `--color-accent` | `#2A6EF0` | สีหลัก (น้ำเงิน) |
| `--color-accent-2` | `#E8F0FE` | Accent light / badge bg |
| `--color-dark` | `#0F1117` | Dark section (footer, code card) |
| `--color-dark-2` | `#1A1D27` | Dark surface |
| `--font-display` | DM Serif Display | หัวข้อหลัก |
| `--font-body` | DM Sans | ข้อความทั่วไป |
| `--font-mono` | Fira Code / Consolas | code card |

---

## Dependencies (CDN — ไม่มี node_modules)

- **Google Fonts**: DM Serif Display + DM Sans
- **Font Awesome 6.5.1**: ทุก icon ในเว็บ
- **Devicon v2.15.1**: tech stack icons
- **Three.js r128**: Particle Stars + Floating Geometry

---

## Animation System

### animations.css
- `.reveal` → invisible ตอนแรก, visible เมื่อ scroll เข้า viewport (ผ่าน IntersectionObserver)
- `.reveal--delay-1/2/3/4` → delay 0.1s, 0.2s, 0.3s, 0.4s ตามลำดับ
- `.revealed` → class ที่ JS เพิ่มให้เมื่อ element เข้า viewport

### Three.js (three-effects.js)
- **Particle Stars** (`#stars-canvas`) — 1800 จุดดาว fixed background, เคลื่อนตาม mouse
- **Floating Icosahedron** (`#hero-canvas`) — 3D wireframe หมุนอยู่หลัง code card ใน about section, orbit ring, mouse tilt

---

## JavaScript (main.js)

1. **Navbar** — mobile menu toggle
2. **Active nav link** — IntersectionObserver highlight ลิงก์ตาม section
3. **Scroll Reveal** — IntersectionObserver เพิ่ม `.revealed` ให้ `.reveal` elements
4. **Contact Form** — frontend-only, แสดง success message
5. **Language toggle** — TH/EN สลับ i18n
6. **Project Gallery** — `initGallery(id)`, `galleryGo/Next/Prev` + auto-advance 4s + pause on hover
7. **Footer Year** — `new Date().getFullYear()`

---

## สิ่งที่ต้องระวัง

- **ไม่มี backend** — contact form แสดง success message เท่านั้น ไม่ส่ง email จริง
- **รูปโปรไฟล์** — `assets/myphoto.jpg` ถ้าโหลดไม่ได้จะแสดง fallback icon แทน
- **CDN ทั้งหมด** — Font Awesome, Three.js, Devicon ต้องการ internet
- **ห้ามใช้ framework** — เป็น pure HTML/CSS/JS เท่านั้น ห้าม import React/Vue/etc.
- **CSS Variables** — แก้สีทุกจุดผ่าน `:root` ใน style.css เท่านั้น อย่า hardcode สี
- **Project images ใส่ผิด folder** — ภาพ Job Portal จริงๆ อยู่ใน `assets/projects/made-to-order-restaurant/` และภาพ Restaurant อยู่ใน `assets/projects/job-portal/` (อย่าย้าย ใช้งานถูกต้องแล้ว)

---

## สไตล์การทำงาน

- **ทำให้เลย** — ถ้างานชัดเจนไม่ต้องถาม
- **ห้ามเพิ่ม dependency** — ใช้ CDN เดิมที่มีอยู่แล้วเท่านั้น
- **Responsive** — ทุกอย่างต้องใช้งานได้บน mobile
- **CSS Variables** — ใช้ตัวแปรที่กำหนดไว้เสมอ อย่า hardcode
