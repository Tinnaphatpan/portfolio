# 🗂️ Portfolio Website

เว็บไซต์แนะนำตัวเองแบบ Minimal & Clean พร้อม Social Links, Skills, และ Contact Form

---

## 📁 โครงสร้างโปรเจค

```
portfolio/
├── index.html          ← โครงสร้างหลัก (HTML ทั้งหมด)
├── css/
│   ├── style.css       ← สไตล์หลัก (layout, สี, component)
│   └── animations.css  ← scroll reveal & keyframes
├── js/
│   └── main.js         ← logic (reveal, skill bars, form, footer year)
├── assets/
│   └── profile.jpg     ← ใส่รูปโปรไฟล์ของตัวเองที่นี่
└── README.md           ← ไฟล์นี้
```

---

## ✏️ สิ่งที่ต้องแก้ไข

### 1. รูปโปรไฟล์
วางรูปภาพของคุณใน `assets/` และตั้งชื่อว่า `profile.jpg`  
หรือแก้ `src` ใน `index.html` บรรทัดนี้:
```html
<img src="assets/profile.jpg" alt="Profile Photo" class="hero__photo" ... />
```

### 2. ชื่อ & คำแนะนำตัว
ใน `index.html` ค้นหา `Your Name` แล้วแทนที่ด้วยชื่อจริง  
แก้ข้อความ About Me ในส่วน `<section class="about">`

### 3. Social Links
ค้นหา comment `SOCIAL LINKS` ใน `index.html` แล้วแก้ `href`:
```html
<a href="https://github.com/YOUR_USERNAME" ...>
<a href="https://instagram.com/YOUR_USERNAME" ...>
<a href="https://facebook.com/YOUR_USERNAME" ...>
```
> ⚠️ มี social links 2 จุด (Hero section + Contact section) แก้ให้ครบทั้งสองที่

### 4. Email
แก้ `href="mailto:your@email.com"` ในส่วน Contact

### 5. Skills & Level
แก้ `--level: XX%` ในแต่ละ `.skill-card` ตามระดับที่ต้องการ  
เพิ่ม / ลบ skill card ได้เลย โดย copy block นี้:
```html
<div class="skill-card reveal">
  <div class="skill-card__icon"><i class="fa-brands fa-ICON_NAME"></i></div>
  <h3>Skill Name</h3>
  <div class="skill-bar"><div class="skill-bar__fill" style="--level: 70%"></div></div>
</div>
```

---

## 📬 Contact Form

ปัจจุบัน form แสดงข้อความตอบกลับชั่วคราว  
เพื่อส่งอีเมลจริง ให้เชื่อมกับ:
- **Formspree** → https://formspree.io (ฟรี, ง่าย)
- **EmailJS**   → https://www.emailjs.com

---

## 🎨 ปรับ Theme

แก้ CSS Variables ใน `css/style.css` บรรทัดแรก:
```css
:root {
  --color-bg:     #F9F8F5;   /* สีพื้นหลัง */
  --color-accent: #2A6EF0;   /* สีหลัก accent */
  /* ... */
}
```

---

## 🚀 วิธีใช้งาน

เปิด `index.html` ในเบราว์เซอร์ได้เลย ไม่ต้องติดตั้งอะไรเพิ่ม  
หรือ deploy บน **GitHub Pages**, **Netlify**, หรือ **Vercel** ได้ฟรี
