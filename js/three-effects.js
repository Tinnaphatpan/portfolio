/* =====================================================
   three-effects.js — Particle Stars + Floating Geometry
   =====================================================
   [EN] Creates two Three.js 3D effects for the portfolio:
        1. Particle Stars — full-page animated starfield background
        2. Floating Icosahedron — 3D spinning shape in the about/hero section
        Both effects respond to mouse movement for interactivity.
   [TH] สร้าง 3D effect ด้วย Three.js สองอย่างสำหรับ portfolio:
        1. Particle Stars — พื้นหลังท้องฟ้าดาวที่เคลื่อนไหวตลอดทั้งหน้า
        2. Floating Icosahedron — รูป 3D หมุนอยู่ใน section about/hero
        ทั้งสองตอบสนองต่อการเคลื่อนเมาส์
   ===================================================== */

/* ===== 1. PARTICLE STARS (full-page background) =====
   [EN] Creates 1,800 star particles spread across the full viewport.
        Stars slowly rotate and move with the mouse (parallax effect).
        Rendered on a transparent canvas layered behind page content.
   [TH] สร้างอนุภาค "ดาว" 1,800 จุดกระจายทั่ว viewport
        ดาวหมุนช้าๆ และเคลื่อนตามเมาส์ (parallax effect)
        render บน canvas โปร่งใส วางอยู่หลัง content ทั้งหน้า
*/
(function initStars() {
  const canvas = document.getElementById('stars-canvas');
  // [EN] Exit if canvas doesn't exist or Three.js library isn't loaded
  // [TH] ออกจากฟังก์ชันถ้าไม่มี canvas หรือ Three.js ยังโหลดไม่ขึ้น
  if (!canvas || typeof THREE === 'undefined') return;

  // [EN] Set up Three.js scene, camera, and renderer
  // [TH] ตั้งค่า scene, camera, และ renderer ของ Three.js
  const scene    = new THREE.Scene();
  // [EN] PerspectiveCamera(fov, aspectRatio, near, far)
  //      fov=75 degrees wide, aspect matches window, near/far = render range
  // [TH] PerspectiveCamera(มุมมองแนวตั้ง, อัตราส่วนหน้าจอ, ระยะใกล้สุด, ระยะไกลสุด)
  const camera   = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5; // [EN] Move camera 5 units back to see the scene | [TH] ถอย camera ออกมา 5 หน่วยเพื่อมองเห็น scene

  // [EN] WebGLRenderer with alpha:true = transparent background (no black fill)
  // [TH] WebGLRenderer ที่ alpha:true = พื้นหลังโปร่งใส (ไม่ดำทึบ)
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
  renderer.setSize(window.innerWidth, window.innerHeight);
  // [EN] Limit pixel ratio to 1.5 to avoid over-rendering on high-DPI screens
  // [TH] จำกัด pixel ratio ไว้ที่ 1.5 เพื่อป้องกัน render มากเกินจำเป็นบน high-DPI
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

  /* --- Create star particles ---
     [EN] Generate 1,800 random positions in 3D space using a Float32Array.
          Each star has x, y, z coordinates. Spread over a 28×28×20 unit cube.
     [TH] สร้างตำแหน่งสุ่ม 1,800 จุดใน 3D โดยใช้ Float32Array
          แต่ละดาวมีพิกัด x, y, z กระจายในพื้นที่ขนาด 28×28×20 หน่วย
  */
  const COUNT = 1800;
  const pos   = new Float32Array(COUNT * 3); // [EN] 3 values per particle (x,y,z) | [TH] 3 ค่าต่อ particle (x,y,z)
  const sizes = new Float32Array(COUNT);
  for (let i = 0; i < COUNT; i++) {
    // [EN] Random position: (Math.random()-0.5) gives range -0.5 to +0.5, multiply to spread
    // [TH] ตำแหน่งสุ่ม: (Math.random()-0.5) ได้ช่วง -0.5 ถึง +0.5 แล้วคูณเพื่อขยายพื้นที่
    pos[i * 3]     = (Math.random() - 0.5) * 28;  // x
    pos[i * 3 + 1] = (Math.random() - 0.5) * 28;  // y
    pos[i * 3 + 2] = (Math.random() - 0.5) * 20;  // z
    sizes[i]       = Math.random() * 0.5 + 0.3;   // [EN] Random size 0.3–0.8 | [TH] ขนาดสุ่ม 0.3–0.8
  }

  // [EN] BufferGeometry + BufferAttribute = efficient way to pass raw data to GPU
  // [TH] BufferGeometry + BufferAttribute = วิธีที่มีประสิทธิภาพในการส่งข้อมูลไปยัง GPU
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); // [EN] 3 = xyz per vertex | [TH] 3 = xyz ต่อ vertex

  // [EN] PointsMaterial renders each vertex as a point/dot
  // [TH] PointsMaterial render แต่ละ vertex เป็นจุด
  const mat = new THREE.PointsMaterial({
    size: 0.018,           // [EN] Point size in world units | [TH] ขนาดจุดในหน่วย world
    color: 0xaac4ff,       // [EN] Light blue-ish color | [TH] สีฟ้าอ่อน
    transparent: true,
    opacity: 0.65,         // [EN] Slightly transparent stars | [TH] ดาวโปร่งแสงเล็กน้อย
    sizeAttenuation: true, // [EN] Stars appear smaller when further away | [TH] ดาวที่ไกลกว่าจะดูเล็กกว่า
  });

  const stars = new THREE.Points(geo, mat); // [EN] Points = render geometry as dots | [TH] Points = render geometry เป็นจุด
  scene.add(stars);

  /* --- Mouse parallax ---
     [EN] Track mouse position normalized to -0.5..0.5 range.
          targetX/Y are updated on mousemove, curX/Y lerp toward them
          in the animation loop for smooth movement.
     [TH] ติดตามตำแหน่งเมาส์ normalize เป็นช่วง -0.5..0.5
          targetX/Y อัปเดตเมื่อเมาส์ขยับ, curX/Y ค่อยๆ เข้าหา target
          ใน animation loop เพื่อการเคลื่อนที่ที่ smooth
  */
  let targetX = 0, targetY = 0, curX = 0, curY = 0;
  document.addEventListener('mousemove', (e) => {
    targetX = (e.clientX / window.innerWidth  - 0.5) * 0.6;
    targetY = (e.clientY / window.innerHeight - 0.5) * 0.6;
  });

  /* --- Handle window resize ---
     [EN] Update camera aspect ratio and renderer size when window is resized
     [TH] อัปเดต aspect ratio ของ camera และขนาด renderer เมื่อ resize หน้าต่าง
  */
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix(); // [EN] Must call after changing camera properties | [TH] ต้องเรียกหลังเปลี่ยน property ของ camera
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  /* --- Animation loop ---
     [EN] requestAnimationFrame creates a smooth ~60fps loop.
          t = time counter for continuous slow rotation.
          curX/Y lerp toward targetX/Y at 4% per frame (smooth follow).
          stars.rotation follows mouse position + time offset.
     [TH] requestAnimationFrame สร้าง loop ที่ smooth ประมาณ 60fps
          t = ตัวนับเวลาสำหรับการหมุนช้าๆ ต่อเนื่อง
          curX/Y ค่อยๆ เข้าหา targetX/Y ที่ 4% ต่อ frame (smooth follow)
          rotation ของดาวตาม mouse + เวลา
  */
  let t = 0;
  function tick() {
    requestAnimationFrame(tick); // [EN] Schedule next frame | [TH] กำหนด frame ถัดไป
    t += 0.0003; // [EN] Increment time slowly for gradual rotation | [TH] เพิ่มเวลาช้าๆ เพื่อหมุนค่อยๆ

    // [EN] Linear interpolation (lerp): curX += (target - cur) * factor
    //      Creates smooth "easing" toward the target position
    // [TH] Linear interpolation (lerp): เคลื่อนค่าปัจจุบันเข้าหา target ทีละ 4%
    //      ทำให้ดาวค่อยๆ ตามเมาส์แบบ smooth
    curX += (targetX - curX) * 0.04;
    curY += (targetY - curY) * 0.04;

    stars.rotation.y = t + curX;      // [EN] Y-rotation: time + horizontal mouse | [TH] หมุนแนวนอน
    stars.rotation.x = curY * 0.5;    // [EN] X-rotation: vertical mouse (halved) | [TH] หมุนแนวตั้ง (ลดครึ่ง)
    renderer.render(scene, camera);   // [EN] Draw the scene | [TH] วาด scene
  }
  tick(); // [EN] Start the animation loop | [TH] เริ่ม animation loop
})();

/* ===== 2. FLOATING GEOMETRY (hero section) =====
   [EN] Creates a 3D floating icosahedron (20-faced polyhedron) in the
        about section. Consists of:
        - Outer wireframe icosahedron (indigo, semi-transparent)
        - Inner solid icosahedron (blue glow, very transparent)
        - Orbit ring (torus/donut shape tilted at 60°)
        All three objects rotate continuously at different speeds,
        and subtly tilt toward the mouse cursor position.
   [TH] สร้าง icosahedron 3D ลอยอยู่ใน section about
        ประกอบด้วย:
        - Outer wireframe icosahedron (สีครามเข้ม, กึ่งโปร่งใส)
        - Inner solid icosahedron (เรืองแสงสีน้ำเงิน, โปร่งใสมาก)
        - วงโคจร (Torus เอียง 60°)
        ทั้งสามหมุนต่อเนื่องด้วยความเร็วต่างกัน
        และเอียงเล็กน้อยตามตำแหน่งเมาส์
*/
(function initHeroShape() {
  const canvas = document.getElementById('hero-canvas');
  // [EN] Exit if canvas not found or Three.js not loaded
  // [TH] ออกถ้าไม่มี canvas หรือ Three.js ยังโหลดไม่ขึ้น
  if (!canvas || typeof THREE === 'undefined') return;

  // [EN] Get the parent container size to size the canvas correctly
  // [TH] ดึงขนาดของ parent container เพื่อกำหนดขนาด canvas ให้ถูกต้อง
  const W = canvas.parentElement.clientWidth  || 320;
  const H = canvas.parentElement.clientHeight || 320;

  const scene    = new THREE.Scene();
  // [EN] Narrower FOV (50°) gives less distortion for close-up shapes
  // [TH] FOV แควลง (50°) ลดการบิดเบี้ยวสำหรับวัตถุที่อยู่ใกล้
  const camera   = new THREE.PerspectiveCamera(50, W / H, 0.1, 100);
  camera.position.z = 4.5;

  // [EN] antialias:true = smoother edges (more GPU cost but better quality)
  // [TH] antialias:true = ขอบเรียบกว่า (ใช้ GPU มากขึ้นแต่คุณภาพดีกว่า)
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  /* --- Outer wireframe icosahedron ---
     [EN] IcosahedronGeometry(radius, detail)
          radius=1.6, detail=1 = subdivided once for more triangles
          wireframe=true = only draw edges, not filled faces
     [TH] IcosahedronGeometry(รัศมี, ระดับรายละเอียด)
          radius=1.6, detail=1 = แบ่ง polygon เพิ่มหนึ่งครั้ง ได้ mesh ละเอียดขึ้น
          wireframe=true = วาดเฉพาะขอบ ไม่เติมพื้นผิว
  */
  const outerGeo = new THREE.IcosahedronGeometry(1.6, 1);
  const outerMat = new THREE.MeshBasicMaterial({
    color: 0x6366f1,       // [EN] Indigo color | [TH] สีครามอมม่วง
    wireframe: true,
    transparent: true,
    opacity: 0.35,
  });
  const outer = new THREE.Mesh(outerGeo, outerMat);
  scene.add(outer);

  /* --- Inner solid icosahedron (glow core) ---
     [EN] Smaller, solid (no wireframe), very transparent → creates glow feel
     [TH] เล็กกว่า, solid (ไม่ wireframe), โปร่งใสมาก → ให้ความรู้สึกเรืองแสง
  */
  const innerGeo = new THREE.IcosahedronGeometry(1.1, 0); // [EN] detail=0 = basic 20 faces | [TH] detail=0 = 20 หน้าพื้นฐาน
  const innerMat = new THREE.MeshBasicMaterial({
    color: 0x3b82f6,       // [EN] Blue | [TH] สีน้ำเงิน
    transparent: true,
    opacity: 0.07,         // [EN] Very transparent = subtle glow | [TH] โปร่งใสมาก = เรืองแสงจางๆ
  });
  const inner = new THREE.Mesh(innerGeo, innerMat);
  scene.add(inner);

  /* --- Orbit ring ---
     [EN] TorusGeometry(outerRadius, tubeRadius, radialSegments, tubularSegments)
          Creates a donut/ring shape. Tilted 60° (PI/3) on X-axis.
     [TH] TorusGeometry(รัศมีนอก, รัศมีท่อ, จำนวน segment แนวรัศมี, จำนวน segment แนวท่อ)
          สร้างรูปวงแหวน/โดนัท เอียง 60° (PI/3) บน แกน X
  */
  const ringGeo = new THREE.TorusGeometry(2.1, 0.012, 8, 80);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0xa5b4fc,       // [EN] Light indigo | [TH] ครามอ่อน
    transparent: true,
    opacity: 0.2,
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 3; // [EN] Tilt ring 60 degrees | [TH] เอียงวงแหวน 60 องศา
  scene.add(ring);

  /* --- Mouse subtle tilt ---
     [EN] Normalized mouse position to create subtle tilt effect
     [TH] ตำแหน่งเมาส์แบบ normalize เพื่อสร้างการเอียงเล็กน้อย
  */
  let mx = 0, my = 0;
  document.addEventListener('mousemove', (e) => {
    // [EN] Normalize to -0.5..0.5, multiply by 0.8 to limit tilt amount
    // [TH] Normalize เป็น -0.5..0.5 แล้วคูณ 0.8 เพื่อจำกัดการเอียง
    mx = (e.clientX / window.innerWidth  - 0.5) * 0.8;
    my = (e.clientY / window.innerHeight - 0.5) * 0.8;
  });

  /* --- Responsive resize using ResizeObserver ---
     [EN] ResizeObserver watches the parent container size (not window).
          More accurate than window resize for contained elements.
     [TH] ResizeObserver เฝ้าดูขนาดของ parent container (ไม่ใช่ window)
          แม่นยำกว่า window resize สำหรับ element ที่อยู่ใน container
  */
  new ResizeObserver(() => {
    const nw = canvas.parentElement.clientWidth;
    const nh = canvas.parentElement.clientHeight;
    if (!nw || !nh) return;
    camera.aspect = nw / nh;
    camera.updateProjectionMatrix();
    renderer.setSize(nw, nh);
  }).observe(canvas.parentElement);

  /* --- Animation loop ---
     [EN] Each object rotates at a different speed to look organic:
          - outer: faster rotation, mouse tilt
          - inner: counter-rotation (opposite direction)
          - ring: slow rotation on Z-axis
          - outer + inner float up/down with sine wave
          cx/cy lerp toward mx/my for smooth mouse following.
     [TH] แต่ละวัตถุหมุนด้วยความเร็วต่างกันเพื่อให้ดูเป็นธรรมชาติ:
          - outer: หมุนเร็วกว่า + เอียงตามเมาส์
          - inner: หมุนสวนทาง (ทิศตรงข้าม)
          - ring: หมุนช้าๆ บนแกน Z
          - outer + inner ลอยขึ้นลงด้วย sine wave
          cx/cy ค่อยๆ เข้าหา mx/my เพื่อ smooth mouse follow
  */
  let t = 0, cx = 0, cy = 0;
  function tick() {
    requestAnimationFrame(tick);
    t  += 0.007; // [EN] Increment time (controls rotation speed) | [TH] เพิ่มเวลา (ควบคุมความเร็วหมุน)

    // [EN] Smooth lerp toward mouse position (5% per frame)
    // [TH] Lerp เข้าหาตำแหน่งเมาส์ (5% ต่อ frame)
    cx += (mx - cx) * 0.05;
    cy += (my - cy) * 0.05;

    // [EN] Rotate outer shape: combination of auto-rotation + mouse tilt
    // [TH] หมุน outer shape: ผสมการหมุนอัตโนมัติ + การเอียงตามเมาส์
    outer.rotation.x = t * 0.4  + cy * 0.3;
    outer.rotation.y = t * 0.55 + cx * 0.3;

    // [EN] Inner rotates in opposite direction for visual contrast
    // [TH] Inner หมุนสวนทางเพื่อให้มองเห็นความแตกต่าง
    inner.rotation.x = -t * 0.25;
    inner.rotation.y =  t * 0.35;

    // [EN] Ring spins slowly around Z axis
    // [TH] วงแหวนหมุนช้าๆ รอบแกน Z
    ring.rotation.z  =  t * 0.2;

    // [EN] Floating effect: Math.sin creates smooth up/down oscillation
    // [TH] การลอย: Math.sin สร้างการขึ้นลงอย่าง smooth
    outer.position.y = Math.sin(t * 0.8) * 0.12;
    inner.position.y = Math.sin(t * 0.8) * 0.12;

    renderer.render(scene, camera);
  }
  tick(); // [EN] Start the animation | [TH] เริ่ม animation
})();
