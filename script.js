/* ================================================
   SPIDER-MAN PORTFOLIO — SCRIPT.JS
   Main Frontend Logic
   ================================================ */

// =============================================
// DATA STORE (localStorage-based)
// =============================================
const STORE_KEYS = {
  hero: 'spiderdev_hero',
  about: 'spiderdev_about',
  projects: 'spiderdev_projects',
  videos: 'spiderdev_videos',
  contact: 'spiderdev_contact',
  theme: 'spiderdev_theme',
  messages: 'spiderdev_messages'
};

function getData(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch { return null; }
}

function setData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Default projects
const DEFAULT_PROJECTS = [
  {
    id: '1',
    title: 'Web Slinger App',
    description: 'A real-time web application for tracking superhero activities across the city. Built with React and Node.js with live WebSocket updates.',
    image: '',
    tech: ['React', 'Node.js', 'WebSocket', 'MongoDB'],
    liveUrl: '#',
    codeUrl: '#'
  },
  {
    id: '2',
    title: 'Spider Sense Dashboard',
    description: 'An analytics dashboard with predictive AI to detect threats before they happen. Features real-time data visualization and machine learning models.',
    image: '',
    tech: ['Python', 'TensorFlow', 'D3.js', 'FastAPI'],
    liveUrl: '#',
    codeUrl: '#'
  },
  {
    id: '3',
    title: 'Daily Bugle CMS',
    description: 'A modern content management system for news outlets. Lightning-fast with SSR, image optimization, and an intuitive editor experience.',
    image: '',
    tech: ['Next.js', 'PostgreSQL', 'Prisma', 'Tailwind'],
    liveUrl: '#',
    codeUrl: '#'
  },
  {
    id: '4',
    title: 'Oscorp E-Commerce',
    description: 'Full-featured e-commerce platform with payment integration, inventory management, and a stunning animated storefront.',
    image: '',
    tech: ['Vue.js', 'Stripe', 'Firebase', 'SCSS'],
    liveUrl: '#',
    codeUrl: '#'
  },
  {
    id: '5',
    title: 'Multiverse Portal',
    description: 'An immersive 3D web experience built with Three.js. Users can explore different dimensions through an interactive portal system.',
    image: '',
    tech: ['Three.js', 'WebGL', 'GSAP', 'Blender'],
    liveUrl: '#',
    codeUrl: '#'
  },
  {
    id: '6',
    title: 'Venom Chat',
    description: 'End-to-end encrypted messaging app with real-time features, voice messages, and file sharing. Dark mode by default, naturally.',
    image: '',
    tech: ['React Native', 'Socket.io', 'Redis', 'AWS'],
    liveUrl: '#',
    codeUrl: '#'
  }
];

// Default videos
const DEFAULT_VIDEOS = [
  { id: '1', title: 'Building a 3D Portfolio with Three.js', videoId: 'dQw4w9WgXcQ', description: 'Full tutorial on creating an immersive 3D portfolio' },
  { id: '2', title: 'Spider-Man CSS Animations', videoId: 'dQw4w9WgXcQ', description: 'Learn to create web-slinging CSS animations' },
  { id: '3', title: 'React + Node Full Stack Project', videoId: 'dQw4w9WgXcQ', description: 'Complete MERN stack project from scratch' }
];

// Mobile detection helper
const isMobile = /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;

// Project emoji icons for placeholders
const PROJECT_ICONS = ['🕸️', '🕷️', '📰', '🛒', '🌀', '💬', '🚀', '⚡', '🎯', '🔮'];

// =============================================
// INITIALIZATION
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  // Loading screen — faster on mobile
  setTimeout(() => {
    document.getElementById('loadingScreen').classList.add('hidden');
  }, isMobile ? 800 : 1800);

  // Init data
  if (!getData(STORE_KEYS.projects)) setData(STORE_KEYS.projects, DEFAULT_PROJECTS);
  if (!getData(STORE_KEYS.videos)) setData(STORE_KEYS.videos, DEFAULT_VIDEOS);

  // Apply saved theme
  applyTheme();

  // Apply saved content
  applyHeroContent();
  applyAboutContent();
  applyContactContent();

  // Render dynamic content
  renderProjects();
  renderVideos();

  // Init effects — prioritize critical path
  initCinematicBackground();
  initNavScroll();
  initRevealAnimations();

  // Non-critical effects — skip cursor on mobile (no mouse)
  if (!isMobile) {
    initCursor();
  } else {
    // Hide custom cursor on mobile
    const cursor = document.getElementById('customCursor');
    if (cursor) cursor.style.display = 'none';
    document.body.style.cursor = 'auto';
  }

  // Defer skill bars animation
  if ('requestIdleCallback' in window) {
    requestIdleCallback(initSkillBars);
  } else {
    setTimeout(initSkillBars, 100);
  }
});

// =============================================
// THEME APPLICATION
// =============================================
function applyTheme() {
  const theme = getData(STORE_KEYS.theme);
  if (!theme) return;
  const root = document.documentElement;
  if (theme.red) {
    root.style.setProperty('--red-primary', theme.red);
    root.style.setProperty('--red-glow', theme.red);
  }
  if (theme.blue) {
    root.style.setProperty('--blue-primary', theme.blue);
    root.style.setProperty('--blue-glow', theme.blue);
  }
  if (theme.bgPrimary) root.style.setProperty('--bg-primary', theme.bgPrimary);
  if (theme.bgSecondary) root.style.setProperty('--bg-secondary', theme.bgSecondary);
}

// =============================================
// CONTENT APPLICATION
// =============================================
function applyHeroContent() {
  const data = getData(STORE_KEYS.hero);
  if (!data) return;
  if (data.title) document.getElementById('heroTitle').textContent = data.title;
  if (data.subtitle) document.getElementById('heroSubtitle').textContent = data.subtitle;
  if (data.tagline) document.getElementById('heroTagline').textContent = data.tagline;
}

function applyAboutContent() {
  const data = getData(STORE_KEYS.about);
  if (!data) return;
  if (data.title) document.getElementById('aboutTitle').textContent = data.title;
  if (data.bio) document.getElementById('aboutBio').textContent = data.bio;
}

function applyContactContent() {
  const data = getData(STORE_KEYS.contact);
  if (!data) return;
  if (data.text) document.getElementById('contactText').textContent = data.text;
  if (data.email) document.getElementById('contactEmail').textContent = data.email;
  if (data.phone) document.getElementById('contactPhone').textContent = data.phone;
  if (data.location) document.getElementById('contactLocation').textContent = data.location;

  // Social links
  const socials = document.getElementById('socialLinks');
  if (socials) {
    const links = socials.querySelectorAll('a');
    if (data.github && links[0]) links[0].href = data.github;
    if (data.linkedin && links[1]) links[1].href = data.linkedin;
    if (data.twitter && links[2]) links[2].href = data.twitter;
    if (data.instagram && links[3]) links[3].href = data.instagram;
    if (data.youtube && links[4]) links[4].href = data.youtube;
  }
}

// =============================================
// RENDER PROJECTS
// =============================================
function renderProjects() {
  const grid = document.getElementById('projectsGrid');
  const projects = getData(STORE_KEYS.projects) || [];
  
  if (projects.length === 0) {
    grid.innerHTML = '<p style="text-align:center; color:var(--text-muted); grid-column:1/-1; font-size:1.1rem;">No projects yet. Add some from the admin panel!</p>';
    return;
  }

  grid.innerHTML = projects.map((p, i) => `
    <div class="project-card" onmousemove="handleCardTilt(event, this)" onmouseleave="resetCardTilt(this)">
      <div class="project-image">
        ${p.image 
          ? `<img src="${p.image}" alt="${p.title}" loading="lazy">`
          : `<div class="project-placeholder">${PROJECT_ICONS[i % PROJECT_ICONS.length]}</div>`
        }
        <div class="project-overlay">
          <div class="project-tech">
            ${(p.tech || []).map(t => `<span>${t}</span>`).join('')}
          </div>
        </div>
      </div>
      <div class="project-info">
        <h3>${p.title}</h3>
        <p>${p.description}</p>
        <div class="project-links">
          ${p.liveUrl ? `<a href="${p.liveUrl}" class="project-link live" target="_blank"><i class="fas fa-external-link-alt"></i> Live</a>` : ''}
          ${p.codeUrl ? `<a href="${p.codeUrl}" class="project-link code" target="_blank"><i class="fab fa-github"></i> Code</a>` : ''}
        </div>
      </div>
    </div>
  `).join('');
}

// =============================================
// RENDER VIDEOS
// =============================================
function renderVideos() {
  const grid = document.getElementById('videosGrid');
  const videos = getData(STORE_KEYS.videos) || [];
  
  if (videos.length === 0) {
    grid.innerHTML = '<p style="text-align:center; color:var(--text-muted); grid-column:1/-1; font-size:1.1rem;">No videos yet. Add some from the admin panel!</p>';
    return;
  }

  // Use click-to-load pattern: show thumbnail, load iframe only on click
  // This prevents unwanted audio and speeds up page load dramatically
  grid.innerHTML = videos.map(v => `
    <div class="video-card">
      <div class="video-wrapper video-lazy" data-videoid="${v.videoId}" onclick="loadVideo(this)">
        <img src="https://img.youtube.com/vi/${v.videoId}/hqdefault.jpg" 
             alt="${v.title}" 
             loading="lazy"
             style="width:100%;height:100%;object-fit:cover;border-radius:var(--border-radius) var(--border-radius) 0 0;">
        <div class="video-play-btn">
          <i class="fas fa-play"></i>
        </div>
      </div>
      <div class="video-info">
        <h3>${v.title}</h3>
        <p>${v.description || ''}</p>
      </div>
    </div>
  `).join('');
}

// Load YouTube iframe only when user clicks play
function loadVideo(wrapper) {
  const videoId = wrapper.getAttribute('data-videoid');
  wrapper.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1" 
    title="Video" 
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
    allowfullscreen
    style="border:0;"></iframe>`;
  wrapper.classList.remove('video-lazy');
  wrapper.onclick = null;
}

// =============================================
// 3D CARD TILT EFFECT
// =============================================
function handleCardTilt(e, card) {
  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  const rotateY = ((x - centerX) / centerX) * 12;
  const rotateX = ((centerY - y) / centerY) * 12;

  card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
  card.style.transition = 'transform 0.1s ease';

  // Light reflection effect
  const glareX = (x / rect.width) * 100;
  const glareY = (y / rect.height) * 100;
  card.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(226, 54, 54, 0.08), var(--bg-card))`;
}

function resetCardTilt(card) {
  card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
  card.style.transition = 'transform 0.5s ease';
  card.style.background = 'var(--bg-card)';
}

// =============================================
// CUSTOM CURSOR
// =============================================
function initCursor() {
  // Skip all cursor effects on mobile — saves significant performance
  if (isMobile) return;

  const cursor = document.getElementById('customCursor');
  const trails = [];
  const TRAIL_COUNT = 5; // Reduced from 8

  // Create trail dots
  for (let i = 0; i < TRAIL_COUNT; i++) {
    const dot = document.createElement('div');
    dot.className = 'cursor-trail';
    dot.style.opacity = (1 - i / TRAIL_COUNT) * 0.5;
    dot.style.width = (6 - i * 0.5) + 'px';
    dot.style.height = (6 - i * 0.5) + 'px';
    document.body.appendChild(dot);
    trails.push({ el: dot, x: 0, y: 0 });
  }

  let mouseX = 0, mouseY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  // Web trail lines on mouse move — throttled
  let lastTrailX = 0, lastTrailY = 0;
  document.addEventListener('mousemove', (e) => {
    const dist = Math.hypot(e.clientX - lastTrailX, e.clientY - lastTrailY);
    if (dist > 80) { // Increased threshold to reduce DOM elements
      createWebLine(lastTrailX, lastTrailY, e.clientX, e.clientY);
      lastTrailX = e.clientX;
      lastTrailY = e.clientY;
    }
  });

  // Click = web shoot
  document.addEventListener('mousedown', (e) => {
    cursor.classList.add('clicking');
    createWebShoot(e.clientX, e.clientY);
    createImpactRing(e.clientX, e.clientY);
  });

  document.addEventListener('mouseup', () => {
    cursor.classList.remove('clicking');
  });

  // Smooth trail following
  function animateTrails() {
    let prevX = mouseX, prevY = mouseY;
    trails.forEach((trail, i) => {
      const speed = 0.15 - i * 0.01;
      trail.x += (prevX - trail.x) * speed;
      trail.y += (prevY - trail.y) * speed;
      trail.el.style.left = trail.x + 'px';
      trail.el.style.top = trail.y + 'px';
      prevX = trail.x;
      prevY = trail.y;
    });
    requestAnimationFrame(animateTrails);
  }
  animateTrails();
}

// Web line between two points
function createWebLine(x1, y1, x2, y2) {
  const line = document.createElement('div');
  line.className = 'web-line';
  const length = Math.hypot(x2 - x1, y2 - y1);
  const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
  line.style.left = x1 + 'px';
  line.style.top = y1 + 'px';
  line.style.width = length + 'px';
  line.style.transform = `rotate(${angle}deg)`;
  document.body.appendChild(line);
  setTimeout(() => line.remove(), 800);
}

// Web shoot animation on click
function createWebShoot(x, y) {
  const container = document.createElement('div');
  container.className = 'web-shoot';
  container.style.left = x + 'px';
  container.style.top = y + 'px';

  // Create multiple lines radiating out
  for (let i = 0; i < 8; i++) {
    const line = document.createElement('div');
    line.className = 'web-shoot-line';
    line.style.transform = `rotate(${i * 45}deg)`;
    line.style.animationDelay = `${i * 0.03}s`;
    container.appendChild(line);
  }

  document.body.appendChild(container);
  setTimeout(() => container.remove(), 600);
}

// Impact ring on click
function createImpactRing(x, y) {
  const ring = document.createElement('div');
  ring.className = 'web-shoot-impact';
  ring.style.left = x + 'px';
  ring.style.top = y + 'px';
  document.body.appendChild(ring);
  setTimeout(() => ring.remove(), 500);
}

// =============================================
// CINEMATIC BACKGROUND SYSTEM
// =============================================
function initCinematicBackground() {
  // Mobile-optimized config: fewer particles, no connections, fewer orbs
  const CINE_CONFIG = {
    parallax: {
      imageStrength: isMobile ? 12 : 30,
      rotateStrength: isMobile ? 2 : 4,
      smoothing: 0.06
    },
    particles: {
      count: isMobile ? 20 : 80,
      connectionDist: 140,
      mouseInfluenceDist: 200,
      baseSpeed: isMobile ? 0.2 : 0.3,
      drawConnections: !isMobile, // Skip O(n²) on mobile
      colors: {
        red: 'rgba(226, 54, 54,',
        blue: 'rgba(30, 144, 255,',
        white: 'rgba(255, 255, 255,',
      }
    },
    orbs: { count: isMobile ? 6 : 18 },
    webStrings: { count: isMobile ? 3 : 8 }
  };

  // Mouse state
  const cineMouse = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    targetX: window.innerWidth / 2,
    targetY: window.innerHeight / 2,
    normX: 0,
    normY: 0,
  };

  if (!isMobile) {
    document.addEventListener('mousemove', (e) => {
      cineMouse.targetX = e.clientX;
      cineMouse.targetY = e.clientY;
      cineMouse.normX = (e.clientX / window.innerWidth) * 2 - 1;
      cineMouse.normY = (e.clientY / window.innerHeight) * 2 - 1;
    });
  }

  document.addEventListener('touchmove', (e) => {
    const t = e.touches[0];
    cineMouse.targetX = t.clientX;
    cineMouse.targetY = t.clientY;
    cineMouse.normX = (t.clientX / window.innerWidth) * 2 - 1;
    cineMouse.normY = (t.clientY / window.innerHeight) * 2 - 1;
  }, { passive: true });

  // --- 3D Parallax ---
  const heroImg = document.getElementById('cineBgImg');
  let curX = 0, curY = 0;

  function updateParallax() {
    curX += (cineMouse.normX - curX) * CINE_CONFIG.parallax.smoothing;
    curY += (cineMouse.normY - curY) * CINE_CONFIG.parallax.smoothing;
    if (heroImg) {
      const mx = curX * -CINE_CONFIG.parallax.imageStrength;
      const my = curY * -(CINE_CONFIG.parallax.imageStrength * 0.6);
      const ry = curX * CINE_CONFIG.parallax.rotateStrength;
      const rx = -curY * (CINE_CONFIG.parallax.rotateStrength * 0.6);
      const sc = 1.05 + Math.abs(curX * curY) * 0.04;
      heroImg.style.transform = `translate3d(${mx}px, ${my}px, 0) rotateY(${ry}deg) rotateX(${rx}deg) scale(${sc})`;
    }
  }

  // --- Canvas Particles ---
  const canvas = document.getElementById('cineParticlesCanvas');
  const ctx = canvas ? canvas.getContext('2d') : null;
  let particles = [];

  function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = [];
    if (!canvas) return;
    for (let i = 0; i < CINE_CONFIG.particles.count; i++) {
      const cr = Math.random();
      let color;
      if (cr < 0.45) color = CINE_CONFIG.particles.colors.red;
      else if (cr < 0.85) color = CINE_CONFIG.particles.colors.blue;
      else color = CINE_CONFIG.particles.colors.white;
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * CINE_CONFIG.particles.baseSpeed,
        vy: (Math.random() - 0.5) * CINE_CONFIG.particles.baseSpeed,
        radius: isMobile ? (1 + Math.random() * 1.5) : (1 + Math.random() * 2.5),
        color: color,
        alpha: 0.3 + Math.random() * 0.5,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.01 + Math.random() * 0.03,
      });
    }
  }

  function drawParticles() {
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    cineMouse.x += (cineMouse.targetX - cineMouse.x) * 0.08;
    cineMouse.y += (cineMouse.targetY - cineMouse.y) * 0.08;

    // Draw particles — simplified on mobile (skip radialGradient glow)
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx; p.y += p.vy; p.pulse += p.pulseSpeed;
      if (p.x < -10) p.x = canvas.width + 10;
      if (p.x > canvas.width + 10) p.x = -10;
      if (p.y < -10) p.y = canvas.height + 10;
      if (p.y > canvas.height + 10) p.y = -10;
      const alpha = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse));

      if (isMobile) {
        // Simplified rendering on mobile: just draw the dot, skip glow gradient
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = p.color + alpha + ')';
        ctx.fill();
      } else {
        // Full glow rendering on desktop
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 3);
        grad.addColorStop(0, p.color + (alpha * 0.8) + ')');
        grad.addColorStop(0.5, p.color + (alpha * 0.3) + ')');
        grad.addColorStop(1, p.color + '0)');
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color + alpha + ')';
        ctx.fill();
      }
    }

    // Web connections — SKIP on mobile (O(n²) is very expensive)
    if (CINE_CONFIG.particles.drawConnections) {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CINE_CONFIG.particles.connectionDist) {
            const a = 0.12 * (1 - dist / CINE_CONFIG.particles.connectionDist);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(226, 54, 54, ${a})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
        // Mouse connection
        const mdx = particles[i].x - cineMouse.x;
        const mdy = particles[i].y - cineMouse.y;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mDist < CINE_CONFIG.particles.mouseInfluenceDist) {
          const a = 0.25 * (1 - mDist / CINE_CONFIG.particles.mouseInfluenceDist);
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(cineMouse.x, cineMouse.y);
          ctx.strokeStyle = `rgba(30, 144, 255, ${a})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
          const force = (CINE_CONFIG.particles.mouseInfluenceDist - mDist) * 0.0003;
          particles[i].vx += (mdx / mDist) * force;
          particles[i].vy += (mdy / mDist) * force;
          particles[i].vx *= 0.999;
          particles[i].vy *= 0.999;
        }
      }

      // Mouse glow (desktop only)
      const mg = ctx.createRadialGradient(cineMouse.x, cineMouse.y, 0, cineMouse.x, cineMouse.y, 80);
      mg.addColorStop(0, 'rgba(30, 144, 255, 0.08)');
      mg.addColorStop(0.5, 'rgba(226, 54, 54, 0.04)');
      mg.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.beginPath();
      ctx.arc(cineMouse.x, cineMouse.y, 80, 0, Math.PI * 2);
      ctx.fillStyle = mg;
      ctx.fill();
    }
  }

  // --- Glow Orbs ---
  function createGlowOrbs() {
    const container = document.getElementById('cineOrbsContainer');
    if (!container) return;
    for (let i = 0; i < CINE_CONFIG.orbs.count; i++) {
      const orb = document.createElement('div');
      const tr = Math.random();
      let type = tr < 0.4 ? 'red' : (tr < 0.8 ? 'blue' : 'white');
      orb.className = `cine-glow-orb ${type}`;
      const size = 4 + Math.random() * 12;
      orb.style.width = size + 'px';
      orb.style.height = size + 'px';
      orb.style.left = Math.random() * 100 + '%';
      orb.style.animationDuration = (10 + Math.random() * 15) + 's';
      orb.style.animationDelay = (Math.random() * 12) + 's';
      container.appendChild(orb);
    }
  }

  // --- Web Strings ---
  function createWebStrings() {
    const container = document.getElementById('cineOrbsContainer');
    if (!container) return;
    for (let i = 0; i < CINE_CONFIG.webStrings.count; i++) {
      const s = document.createElement('div');
      s.className = 'cine-web-string';
      s.style.left = Math.random() * 100 + '%';
      s.style.top = Math.random() * 100 + '%';
      s.style.width = (100 + Math.random() * 250) + 'px';
      s.style.transform = `rotate(${Math.random() * 360}deg)`;
      s.style.animationDelay = (Math.random() * 3) + 's';
      s.style.background = Math.random() > 0.4
        ? 'linear-gradient(90deg, transparent, rgba(226, 54, 54, 0.25), transparent)'
        : 'linear-gradient(90deg, transparent, rgba(30, 144, 255, 0.20), transparent)';
      container.appendChild(s);
    }
  }

  // --- Gyroscope (Mobile) ---
  function initGyroscope() {
    if (!window.DeviceOrientationEvent) return;
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      document.addEventListener('click', () => {
        DeviceOrientationEvent.requestPermission().then(state => {
          if (state === 'granted') window.addEventListener('deviceorientation', handleOrientation);
        }).catch(() => {});
      }, { once: true });
    } else {
      window.addEventListener('deviceorientation', handleOrientation);
    }
  }

  function handleOrientation(e) {
    if (e.gamma === null || e.beta === null) return;
    cineMouse.normX = Math.max(-1, Math.min(1, e.gamma / 30));
    cineMouse.normY = Math.max(-1, Math.min(1, (e.beta - 45) / 30));
  }

  // --- Animation Loop (throttle on mobile to ~30fps) ---
  let lastFrame = 0;
  const frameBudget = isMobile ? 33 : 0; // ~30fps on mobile, unlimited on desktop

  function cineAnimate(timestamp) {
    if (isMobile && timestamp - lastFrame < frameBudget) {
      requestAnimationFrame(cineAnimate);
      return;
    }
    lastFrame = timestamp;
    updateParallax();
    drawParticles();
    requestAnimationFrame(cineAnimate);
  }

  // --- Init ---
  resizeCanvas();
  createParticles();
  createGlowOrbs();
  createWebStrings();
  if (isMobile) initGyroscope();
  requestAnimationFrame(cineAnimate);

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      resizeCanvas();
      createParticles();
    }, 300);
  });
}

// =============================================
// NAVIGATION
// =============================================
function initNavScroll() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

function toggleNav() {
  document.getElementById('navLinks').classList.toggle('open');
  document.getElementById('navToggle').classList.toggle('active');
}

function closeNav() {
  document.getElementById('navLinks').classList.remove('open');
  document.getElementById('navToggle').classList.remove('active');
}

// =============================================
// SCROLL REVEAL ANIMATIONS
// =============================================
function initRevealAnimations() {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15 });

  reveals.forEach(el => observer.observe(el));
}

// =============================================
// SKILL BARS ANIMATION
// =============================================
function initSkillBars() {
  const fills = document.querySelectorAll('.skill-fill');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const width = fill.getAttribute('data-width');
        fill.style.width = width + '%';
      }
    });
  }, { threshold: 0.3 });

  fills.forEach(fill => observer.observe(fill));
}

// (Hero canvas and parallax now handled by initCinematicBackground)

// =============================================
// SCROLL PARALLAX EFFECT
// =============================================
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
    heroContent.style.opacity = 1 - scrolled / 800;
  }

  // Cinematic BG scroll parallax
  const cineBg = document.getElementById('cinematicBg');
  if (cineBg && scrolled < window.innerHeight) {
    cineBg.style.opacity = 1 - scrolled / (window.innerHeight * 1.2);
  }
});

// =============================================
// CONTACT FORM
// =============================================
function handleContactSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('contactName').value;
  const email = document.getElementById('contactEmailInput').value;
  const subject = document.getElementById('contactSubject').value;
  const message = document.getElementById('contactMessage').value;

  // Save to local storage
  const messages = getData(STORE_KEYS.messages) || [];
  messages.push({
    id: Date.now().toString(),
    name, email, subject, message,
    date: new Date().toISOString()
  });
  setData(STORE_KEYS.messages, messages);

  // Reset form
  document.getElementById('contactForm').reset();

  // Show thank you
  alert('🕷️ Message sent! Thank you for reaching out. I\'ll get back to you soon!');
}
