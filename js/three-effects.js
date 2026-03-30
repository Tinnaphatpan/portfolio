/* =====================================================
   three-effects.js — Particle Stars + Floating Geometry
   ===================================================== */

/* ===== 1. PARTICLE STARS (full-page background) ===== */
(function initStars() {
  const canvas = document.getElementById('stars-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene    = new THREE.Scene();
  const camera   = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

  /* Particles */
  const COUNT = 1800;
  const pos   = new Float32Array(COUNT * 3);
  const sizes = new Float32Array(COUNT);
  for (let i = 0; i < COUNT; i++) {
    pos[i * 3]     = (Math.random() - 0.5) * 28;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 28;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    sizes[i]       = Math.random() * 0.5 + 0.3;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

  const mat = new THREE.PointsMaterial({
    size: 0.018,
    color: 0xaac4ff,
    transparent: true,
    opacity: 0.65,
    sizeAttenuation: true,
  });

  const stars = new THREE.Points(geo, mat);
  scene.add(stars);

  /* Mouse parallax */
  let targetX = 0, targetY = 0, curX = 0, curY = 0;
  document.addEventListener('mousemove', (e) => {
    targetX = (e.clientX / window.innerWidth  - 0.5) * 0.6;
    targetY = (e.clientY / window.innerHeight - 0.5) * 0.6;
  });

  /* Resize */
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  /* Animate */
  let t = 0;
  function tick() {
    requestAnimationFrame(tick);
    t += 0.0003;
    curX += (targetX - curX) * 0.04;
    curY += (targetY - curY) * 0.04;
    stars.rotation.y = t + curX;
    stars.rotation.x = curY * 0.5;
    renderer.render(scene, camera);
  }
  tick();
})();

/* ===== 2. FLOATING GEOMETRY (hero section) ===== */
(function initHeroShape() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const W = canvas.parentElement.clientWidth  || 320;
  const H = canvas.parentElement.clientHeight || 320;

  const scene    = new THREE.Scene();
  const camera   = new THREE.PerspectiveCamera(50, W / H, 0.1, 100);
  camera.position.z = 4.5;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  /* Outer wireframe icosahedron */
  const outerGeo = new THREE.IcosahedronGeometry(1.6, 1);
  const outerMat = new THREE.MeshBasicMaterial({
    color: 0x6366f1,
    wireframe: true,
    transparent: true,
    opacity: 0.35,
  });
  const outer = new THREE.Mesh(outerGeo, outerMat);
  scene.add(outer);

  /* Inner solid icosahedron (glow core) */
  const innerGeo = new THREE.IcosahedronGeometry(1.1, 0);
  const innerMat = new THREE.MeshBasicMaterial({
    color: 0x3b82f6,
    transparent: true,
    opacity: 0.07,
  });
  const inner = new THREE.Mesh(innerGeo, innerMat);
  scene.add(inner);

  /* Orbit ring */
  const ringGeo = new THREE.TorusGeometry(2.1, 0.012, 8, 80);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0xa5b4fc,
    transparent: true,
    opacity: 0.2,
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 3;
  scene.add(ring);

  /* Mouse subtle tilt */
  let mx = 0, my = 0;
  document.addEventListener('mousemove', (e) => {
    mx = (e.clientX / window.innerWidth  - 0.5) * 0.8;
    my = (e.clientY / window.innerHeight - 0.5) * 0.8;
  });

  /* Resize */
  new ResizeObserver(() => {
    const nw = canvas.parentElement.clientWidth;
    const nh = canvas.parentElement.clientHeight;
    if (!nw || !nh) return;
    camera.aspect = nw / nh;
    camera.updateProjectionMatrix();
    renderer.setSize(nw, nh);
  }).observe(canvas.parentElement);

  /* Animate */
  let t = 0, cx = 0, cy = 0;
  function tick() {
    requestAnimationFrame(tick);
    t  += 0.007;
    cx += (mx - cx) * 0.05;
    cy += (my - cy) * 0.05;

    outer.rotation.x = t * 0.4  + cy * 0.3;
    outer.rotation.y = t * 0.55 + cx * 0.3;
    inner.rotation.x = -t * 0.25;
    inner.rotation.y =  t * 0.35;
    ring.rotation.z  =  t * 0.2;

    /* float up/down */
    outer.position.y = Math.sin(t * 0.8) * 0.12;
    inner.position.y = Math.sin(t * 0.8) * 0.12;

    renderer.render(scene, camera);
  }
  tick();
})();
