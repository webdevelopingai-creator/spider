/* ================================================
   SPIDER-MAN CINEMATIC BACKGROUND — BG.JS
   Mouse Parallax | Canvas Particles | Glow Orbs
   ================================================ */

(function () {
  'use strict';

  // =============================================
  // CONFIG
  // =============================================
  const CONFIG = {
    parallax: {
      imageStrength: 30,      // px shift on mouse move
      rotateStrength: 4,      // degrees rotate on mouse
      smoothing: 0.06,        // interpolation speed (lower = smoother)
    },
    particles: {
      count: 80,              // number of canvas particles
      connectionDist: 140,    // px to draw connecting lines
      mouseInfluenceDist: 200,
      baseSpeed: 0.3,
      colors: {
        red: 'rgba(226, 54, 54,',
        blue: 'rgba(30, 144, 255,',
        white: 'rgba(255, 255, 255,',
      }
    },
    orbs: {
      count: 18,              // floating glow orbs
    },
    webStrings: {
      count: 8,               // static web string connectors
    }
  };

  // =============================================
  // MOUSE STATE
  // =============================================
  const mouse = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    targetX: window.innerWidth / 2,
    targetY: window.innerHeight / 2,
    normX: 0,  // -1 to 1
    normY: 0,
  };

  // Track mouse
  document.addEventListener('mousemove', (e) => {
    mouse.targetX = e.clientX;
    mouse.targetY = e.clientY;
    mouse.normX = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.normY = (e.clientY / window.innerHeight) * 2 - 1;
  });

  // Touch support
  document.addEventListener('touchmove', (e) => {
    const t = e.touches[0];
    mouse.targetX = t.clientX;
    mouse.targetY = t.clientY;
    mouse.normX = (t.clientX / window.innerWidth) * 2 - 1;
    mouse.normY = (t.clientY / window.innerHeight) * 2 - 1;
  }, { passive: true });

  // =============================================
  // 3D PARALLAX — Background Image
  // =============================================
  const bgImageLayer = document.getElementById('bgImage');
  const heroImg = document.getElementById('heroImg');

  let currentX = 0, currentY = 0;

  function updateParallax() {
    // Smooth interpolation
    currentX += (mouse.normX - currentX) * CONFIG.parallax.smoothing;
    currentY += (mouse.normY - currentY) * CONFIG.parallax.smoothing;

    if (heroImg) {
      const moveX = currentX * -CONFIG.parallax.imageStrength;
      const moveY = currentY * -(CONFIG.parallax.imageStrength * 0.6);
      const rotateY = currentX * CONFIG.parallax.rotateStrength;
      const rotateX = -currentY * (CONFIG.parallax.rotateStrength * 0.6);
      const scale = 1.05 + Math.abs(currentX * currentY) * 0.04;

      heroImg.style.transform = `
        translate3d(${moveX}px, ${moveY}px, 0)
        rotateY(${rotateY}deg)
        rotateX(${rotateX}deg)
        scale(${scale})
      `;
    }
  }

  // =============================================
  // CANVAS PARTICLES + WEB NETWORK
  // =============================================
  const canvas = document.getElementById('particlesCanvas');
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

    for (let i = 0; i < CONFIG.particles.count; i++) {
      const colorRand = Math.random();
      let color;
      if (colorRand < 0.45) color = CONFIG.particles.colors.red;
      else if (colorRand < 0.85) color = CONFIG.particles.colors.blue;
      else color = CONFIG.particles.colors.white;

      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * CONFIG.particles.baseSpeed,
        vy: (Math.random() - 0.5) * CONFIG.particles.baseSpeed,
        radius: 1 + Math.random() * 2.5,
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

    // Smooth mouse for canvas interactions
    mouse.x += (mouse.targetX - mouse.x) * 0.08;
    mouse.y += (mouse.targetY - mouse.y) * 0.08;

    // Update & draw particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Move
      p.x += p.vx;
      p.y += p.vy;
      p.pulse += p.pulseSpeed;

      // Wrap around edges
      if (p.x < -10) p.x = canvas.width + 10;
      if (p.x > canvas.width + 10) p.x = -10;
      if (p.y < -10) p.y = canvas.height + 10;
      if (p.y > canvas.height + 10) p.y = -10;

      // Pulsing alpha
      const alpha = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse));

      // Draw particle glow
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 3);
      gradient.addColorStop(0, p.color + (alpha * 0.8) + ')');
      gradient.addColorStop(0.5, p.color + (alpha * 0.3) + ')');
      gradient.addColorStop(1, p.color + '0)');

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Core dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color + alpha + ')';
      ctx.fill();
    }

    // Draw web connections between nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONFIG.particles.connectionDist) {
          const alpha = 0.12 * (1 - dist / CONFIG.particles.connectionDist);
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(226, 54, 54, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      // Connect to mouse
      const mouseDx = particles[i].x - mouse.x;
      const mouseDy = particles[i].y - mouse.y;
      const mouseDist = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);

      if (mouseDist < CONFIG.particles.mouseInfluenceDist) {
        const alpha = 0.25 * (1 - mouseDist / CONFIG.particles.mouseInfluenceDist);
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = `rgba(30, 144, 255, ${alpha})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // Slight repulsion from mouse
        const force = (CONFIG.particles.mouseInfluenceDist - mouseDist) * 0.0003;
        particles[i].vx += (mouseDx / mouseDist) * force;
        particles[i].vy += (mouseDy / mouseDist) * force;

        // Dampen velocity
        particles[i].vx *= 0.999;
        particles[i].vy *= 0.999;
      }
    }

    // Draw mouse glow
    const mouseGlow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 80);
    mouseGlow.addColorStop(0, 'rgba(30, 144, 255, 0.08)');
    mouseGlow.addColorStop(0.5, 'rgba(226, 54, 54, 0.04)');
    mouseGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.beginPath();
    ctx.arc(mouse.x, mouse.y, 80, 0, Math.PI * 2);
    ctx.fillStyle = mouseGlow;
    ctx.fill();
  }

  // =============================================
  // FLOATING GLOW ORBS (DOM elements)
  // =============================================
  function createGlowOrbs() {
    const container = document.getElementById('spidermanBg');
    if (!container) return;

    for (let i = 0; i < CONFIG.orbs.count; i++) {
      const orb = document.createElement('div');
      const typeRand = Math.random();
      let type;
      if (typeRand < 0.4) type = 'red';
      else if (typeRand < 0.8) type = 'blue';
      else type = 'white';

      orb.className = `glow-orb ${type}`;

      const size = 4 + Math.random() * 12;
      orb.style.width = size + 'px';
      orb.style.height = size + 'px';
      orb.style.left = Math.random() * 100 + '%';
      orb.style.animationDuration = (10 + Math.random() * 15) + 's';
      orb.style.animationDelay = (Math.random() * 12) + 's';

      container.appendChild(orb);
    }
  }

  // =============================================
  // WEB STRING CONNECTORS (static decorative)
  // =============================================
  function createWebStrings() {
    const container = document.getElementById('spidermanBg');
    if (!container) return;

    for (let i = 0; i < CONFIG.webStrings.count; i++) {
      const string = document.createElement('div');
      string.className = 'web-string';

      const startX = Math.random() * 100;
      const startY = Math.random() * 100;
      const length = 100 + Math.random() * 250;
      const angle = Math.random() * 360;

      string.style.left = startX + '%';
      string.style.top = startY + '%';
      string.style.width = length + 'px';
      string.style.transform = `rotate(${angle}deg)`;
      string.style.animationDelay = (Math.random() * 3) + 's';

      // Gradient for web string
      const isRed = Math.random() > 0.4;
      string.style.background = isRed
        ? 'linear-gradient(90deg, transparent, rgba(226, 54, 54, 0.25), transparent)'
        : 'linear-gradient(90deg, transparent, rgba(30, 144, 255, 0.20), transparent)';

      container.appendChild(string);
    }
  }

  // =============================================
  // GYROSCOPE PARALLAX (Mobile)
  // =============================================
  function initGyroscope() {
    if (!window.DeviceOrientationEvent) return;

    // Request permission on iOS 13+
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      document.addEventListener('click', () => {
        DeviceOrientationEvent.requestPermission().then(state => {
          if (state === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation);
          }
        }).catch(console.error);
      }, { once: true });
    } else {
      window.addEventListener('deviceorientation', handleOrientation);
    }
  }

  function handleOrientation(e) {
    if (e.gamma === null || e.beta === null) return;
    // gamma: left/right tilt (-90 to 90)
    // beta: front/back tilt (-180 to 180)
    mouse.normX = Math.max(-1, Math.min(1, e.gamma / 30));
    mouse.normY = Math.max(-1, Math.min(1, (e.beta - 45) / 30));
  }

  // =============================================
  // ANIMATION LOOP
  // =============================================
  function animate() {
    updateParallax();
    drawParticles();
    requestAnimationFrame(animate);
  }

  // =============================================
  // INITIALIZATION
  // =============================================
  function init() {
    resizeCanvas();
    createParticles();
    createGlowOrbs();
    createWebStrings();
    initGyroscope();
    animate();

    // Resize handler
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        resizeCanvas();
        createParticles();
      }, 200);
    });
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
