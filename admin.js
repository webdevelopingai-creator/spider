/* ================================================
   SPIDER-MAN PORTFOLIO — ADMIN.JS
   Admin Dashboard Logic
   ================================================ */

// =============================================
// DATA STORE (shared with script.js)
// =============================================
const STORE_KEYS = {
  hero: 'spiderdev_hero',
  about: 'spiderdev_about',
  projects: 'spiderdev_projects',
  videos: 'spiderdev_videos',
  contact: 'spiderdev_contact',
  theme: 'spiderdev_theme',
  messages: 'spiderdev_messages',
  auth: 'spiderdev_auth'
};

// Admin credentials (change these!)
const ADMIN_USER = 'harish';
const ADMIN_PASS = 'hi';

function getData(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch { return null; }
}

function setData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// =============================================
// TOAST NOTIFICATION
// =============================================
function showToast(message, type = 'default') {
  const toast = document.getElementById('adminToast');
  toast.textContent = message;
  toast.className = 'admin-toast show ' + type;
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// =============================================
// AUTHENTICATION
// =============================================
function handleLogin(e) {
  e.preventDefault();
  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value;

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    setData(STORE_KEYS.auth, { loggedIn: true, user: username, time: Date.now() });
    showDashboard();
  } else {
    const err = document.getElementById('loginError');
    err.classList.add('show');
    setTimeout(() => err.classList.remove('show'), 3000);
  }
}

function handleLogout() {
  localStorage.removeItem(STORE_KEYS.auth);
  document.getElementById('adminDashboard').classList.remove('active');
  document.getElementById('loginPage').style.display = 'flex';
  showToast('Logged out successfully');
}

function checkAuth() {
  const auth = getData(STORE_KEYS.auth);
  if (auth && auth.loggedIn) {
    showDashboard();
  }
}

function showDashboard() {
  document.getElementById('loginPage').style.display = 'none';
  document.getElementById('adminDashboard').classList.add('active');
  loadAllPanelData();
  updateStats();
}

// =============================================
// PANEL SWITCHING
// =============================================
function switchPanel(panelId) {
  // Hide all panels
  document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));

  // Show target panel
  const panel = document.getElementById('panel-' + panelId);
  if (panel) panel.classList.add('active');

  // Update nav active state
  document.querySelectorAll('.admin-nav a').forEach(a => a.classList.remove('active'));
  event.currentTarget.classList.add('active');

  // Update title
  const titles = {
    overview: 'Dashboard Overview',
    hero: 'Hero Section',
    about: 'About Section',
    projects: 'Manage Projects',
    videosPanel: 'Manage Videos',
    contact: 'Contact Information',
    theme: 'Theme Customization'
  };
  document.getElementById('panelTitle').textContent = titles[panelId] || 'Dashboard';

  // Close mobile sidebar
  closeMobileSidebar();
}

// =============================================
// MOBILE SIDEBAR
// =============================================
function toggleAdminSidebar() {
  document.getElementById('adminSidebar').classList.toggle('open');
  document.getElementById('adminOverlay').classList.toggle('show');
}

function closeMobileSidebar() {
  document.getElementById('adminSidebar').classList.remove('open');
  document.getElementById('adminOverlay').classList.remove('show');
}

// =============================================
// LOAD PANEL DATA
// =============================================
function loadAllPanelData() {
  loadHeroData();
  loadAboutData();
  loadProjectsData();
  loadVideosData();
  loadContactData();
  loadThemeData();
  loadMessages();
}

function loadHeroData() {
  const data = getData(STORE_KEYS.hero) || {};
  document.getElementById('adminHeroTitle').value = data.title || 'I am Spider Dev';
  document.getElementById('adminHeroSubtitle').value = data.subtitle || 'Friendly Neighborhood Developer';
  document.getElementById('adminHeroTagline').value = data.tagline || '';
}

function loadAboutData() {
  const data = getData(STORE_KEYS.about) || {};
  document.getElementById('adminAboutTitle').value = data.title || 'Who Am I?';
  document.getElementById('adminAboutBio').value = data.bio || '';
}

function loadContactData() {
  const data = getData(STORE_KEYS.contact) || {};
  document.getElementById('adminContactText').value = data.text || '';
  document.getElementById('adminEmail').value = data.email || '';
  document.getElementById('adminPhone').value = data.phone || '';
  document.getElementById('adminLocation').value = data.location || '';
  document.getElementById('adminGithub').value = data.github || '';
  document.getElementById('adminLinkedin').value = data.linkedin || '';
  document.getElementById('adminTwitter').value = data.twitter || '';
  document.getElementById('adminInstagram').value = data.instagram || '';
  document.getElementById('adminYoutube').value = data.youtube || '';
}

function loadThemeData() {
  const data = getData(STORE_KEYS.theme) || {};
  const red = data.red || '#e23636';
  const blue = data.blue || '#1e90ff';
  const bgP = data.bgPrimary || '#0a0a0f';
  const bgS = data.bgSecondary || '#111118';

  document.getElementById('themeRed').value = red;
  document.getElementById('themeRedHex').textContent = red;
  document.getElementById('themeBlue').value = blue;
  document.getElementById('themeBlueHex').textContent = blue;
  document.getElementById('themeBgPrimary').value = bgP;
  document.getElementById('themeBgPrimaryHex').textContent = bgP;
  document.getElementById('themeBgSecondary').value = bgS;
  document.getElementById('themeBgSecondaryHex').textContent = bgS;

  // Color picker live preview
  document.getElementById('themeRed').addEventListener('input', (e) => {
    document.getElementById('themeRedHex').textContent = e.target.value;
  });
  document.getElementById('themeBlue').addEventListener('input', (e) => {
    document.getElementById('themeBlueHex').textContent = e.target.value;
  });
  document.getElementById('themeBgPrimary').addEventListener('input', (e) => {
    document.getElementById('themeBgPrimaryHex').textContent = e.target.value;
  });
  document.getElementById('themeBgSecondary').addEventListener('input', (e) => {
    document.getElementById('themeBgSecondaryHex').textContent = e.target.value;
  });
}

// =============================================
// PROJECTS MANAGEMENT
// =============================================
let editingProjectId = null;

function loadProjectsData() {
  const projects = getData(STORE_KEYS.projects) || [];
  const list = document.getElementById('adminProjectsList');

  if (projects.length === 0) {
    list.innerHTML = '<p style="color:var(--text-muted);padding:15px;">No projects added yet.</p>';
    return;
  }

  list.innerHTML = projects.map(p => `
    <div class="admin-item">
      <div class="admin-item-info">
        <div class="item-thumb">
          ${p.image ? `<img src="${p.image}" alt="${p.title}">` : '🕸️'}
        </div>
        <div>
          <h4>${p.title}</h4>
          <p>${(p.tech || []).join(', ')}</p>
        </div>
      </div>
      <div class="admin-item-actions">
        <button class="btn-admin secondary small" onclick="editProject('${p.id}')">
          <i class="fas fa-edit"></i> Edit
        </button>
        <button class="btn-admin danger small" onclick="deleteProject('${p.id}')">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
  `).join('');
}

function addProject(e) {
  e.preventDefault();
  const projects = getData(STORE_KEYS.projects) || [];

  const project = {
    id: editingProjectId || Date.now().toString(),
    title: document.getElementById('projectTitle').value,
    description: document.getElementById('projectDesc').value,
    image: document.getElementById('projectImage').value,
    tech: document.getElementById('projectTech').value.split(',').map(t => t.trim()).filter(t => t),
    liveUrl: document.getElementById('projectLive').value,
    codeUrl: document.getElementById('projectCode').value
  };

  if (editingProjectId) {
    const index = projects.findIndex(p => p.id === editingProjectId);
    if (index !== -1) projects[index] = project;
    editingProjectId = null;
    showToast('✅ Project updated successfully!', 'success');
  } else {
    projects.push(project);
    showToast('✅ Project added successfully!', 'success');
  }

  setData(STORE_KEYS.projects, projects);
  loadProjectsData();
  clearProjectForm();
  updateStats();
}

function editProject(id) {
  const projects = getData(STORE_KEYS.projects) || [];
  const p = projects.find(proj => proj.id === id);
  if (!p) return;

  editingProjectId = id;
  document.getElementById('projectTitle').value = p.title;
  document.getElementById('projectDesc').value = p.description;
  document.getElementById('projectImage').value = p.image || '';
  document.getElementById('projectTech').value = (p.tech || []).join(', ');
  document.getElementById('projectLive').value = p.liveUrl || '';
  document.getElementById('projectCode').value = p.codeUrl || '';

  // Scroll to form
  document.getElementById('panel-projects').scrollIntoView({ behavior: 'smooth' });
}

function deleteProject(id) {
  if (!confirm('Are you sure you want to delete this project?')) return;
  let projects = getData(STORE_KEYS.projects) || [];
  projects = projects.filter(p => p.id !== id);
  setData(STORE_KEYS.projects, projects);
  loadProjectsData();
  updateStats();
  showToast('🗑️ Project deleted', 'default');
}

function clearProjectForm() {
  editingProjectId = null;
  document.getElementById('projectTitle').value = '';
  document.getElementById('projectDesc').value = '';
  document.getElementById('projectImage').value = '';
  document.getElementById('projectTech').value = '';
  document.getElementById('projectLive').value = '';
  document.getElementById('projectCode').value = '';
}

// =============================================
// VIDEOS MANAGEMENT
// =============================================
let editingVideoId = null;

function loadVideosData() {
  const videos = getData(STORE_KEYS.videos) || [];
  const list = document.getElementById('adminVideosList');

  if (videos.length === 0) {
    list.innerHTML = '<p style="color:var(--text-muted);padding:15px;">No videos added yet.</p>';
    return;
  }

  list.innerHTML = videos.map(v => `
    <div class="admin-item">
      <div class="admin-item-info">
        <div class="item-thumb">
          <img src="https://img.youtube.com/vi/${v.videoId}/mqdefault.jpg" alt="${v.title}">
        </div>
        <div>
          <h4>${v.title}</h4>
          <p>${v.description || 'No description'}</p>
        </div>
      </div>
      <div class="admin-item-actions">
        <button class="btn-admin secondary small" onclick="editVideo('${v.id}')">
          <i class="fas fa-edit"></i> Edit
        </button>
        <button class="btn-admin danger small" onclick="deleteVideo('${v.id}')">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
  `).join('');
}

function extractVideoId(input) {
  // Handle various YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/
  ];
  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match) return match[1];
  }
  return input;
}

function addVideo(e) {
  e.preventDefault();
  const videos = getData(STORE_KEYS.videos) || [];

  const video = {
    id: editingVideoId || Date.now().toString(),
    title: document.getElementById('videoTitle').value,
    videoId: extractVideoId(document.getElementById('videoUrl').value),
    description: document.getElementById('videoDesc').value
  };

  if (editingVideoId) {
    const index = videos.findIndex(v => v.id === editingVideoId);
    if (index !== -1) videos[index] = video;
    editingVideoId = null;
    showToast('✅ Video updated successfully!', 'success');
  } else {
    videos.push(video);
    showToast('✅ Video added successfully!', 'success');
  }

  setData(STORE_KEYS.videos, videos);
  loadVideosData();
  clearVideoForm();
  updateStats();
}

function editVideo(id) {
  const videos = getData(STORE_KEYS.videos) || [];
  const v = videos.find(vid => vid.id === id);
  if (!v) return;

  editingVideoId = id;
  document.getElementById('videoTitle').value = v.title;
  document.getElementById('videoUrl').value = v.videoId;
  document.getElementById('videoDesc').value = v.description || '';

  document.getElementById('panel-videosPanel').scrollIntoView({ behavior: 'smooth' });
}

function deleteVideo(id) {
  if (!confirm('Are you sure you want to delete this video?')) return;
  let videos = getData(STORE_KEYS.videos) || [];
  videos = videos.filter(v => v.id !== id);
  setData(STORE_KEYS.videos, videos);
  loadVideosData();
  updateStats();
  showToast('🗑️ Video deleted', 'default');
}

function clearVideoForm() {
  editingVideoId = null;
  document.getElementById('videoTitle').value = '';
  document.getElementById('videoUrl').value = '';
  document.getElementById('videoDesc').value = '';
}

// =============================================
// SAVE FUNCTIONS
// =============================================
function saveHero(e) {
  e.preventDefault();
  const data = {
    title: document.getElementById('adminHeroTitle').value,
    subtitle: document.getElementById('adminHeroSubtitle').value,
    tagline: document.getElementById('adminHeroTagline').value
  };
  setData(STORE_KEYS.hero, data);
  showToast('✅ Hero section saved!', 'success');
}

function saveAbout(e) {
  e.preventDefault();
  const data = {
    title: document.getElementById('adminAboutTitle').value,
    bio: document.getElementById('adminAboutBio').value
  };
  setData(STORE_KEYS.about, data);
  showToast('✅ About section saved!', 'success');
}

function saveContact(e) {
  e.preventDefault();
  const data = {
    text: document.getElementById('adminContactText').value,
    email: document.getElementById('adminEmail').value,
    phone: document.getElementById('adminPhone').value,
    location: document.getElementById('adminLocation').value,
    github: document.getElementById('adminGithub').value,
    linkedin: document.getElementById('adminLinkedin').value,
    twitter: document.getElementById('adminTwitter').value,
    instagram: document.getElementById('adminInstagram').value,
    youtube: document.getElementById('adminYoutube').value
  };
  setData(STORE_KEYS.contact, data);
  showToast('✅ Contact info saved!', 'success');
}

function saveTheme(e) {
  e.preventDefault();
  const data = {
    red: document.getElementById('themeRed').value,
    blue: document.getElementById('themeBlue').value,
    bgPrimary: document.getElementById('themeBgPrimary').value,
    bgSecondary: document.getElementById('themeBgSecondary').value
  };
  setData(STORE_KEYS.theme, data);

  // Apply theme live
  const root = document.documentElement;
  root.style.setProperty('--red-primary', data.red);
  root.style.setProperty('--red-glow', data.red);
  root.style.setProperty('--blue-primary', data.blue);
  root.style.setProperty('--blue-glow', data.blue);
  root.style.setProperty('--bg-primary', data.bgPrimary);
  root.style.setProperty('--bg-secondary', data.bgSecondary);

  showToast('🎨 Theme applied!', 'success');
}

function resetTheme() {
  localStorage.removeItem(STORE_KEYS.theme);
  const root = document.documentElement;
  root.style.removeProperty('--red-primary');
  root.style.removeProperty('--red-glow');
  root.style.removeProperty('--blue-primary');
  root.style.removeProperty('--blue-glow');
  root.style.removeProperty('--bg-primary');
  root.style.removeProperty('--bg-secondary');

  document.getElementById('themeRed').value = '#e23636';
  document.getElementById('themeRedHex').textContent = '#e23636';
  document.getElementById('themeBlue').value = '#1e90ff';
  document.getElementById('themeBlueHex').textContent = '#1e90ff';
  document.getElementById('themeBgPrimary').value = '#0a0a0f';
  document.getElementById('themeBgPrimaryHex').textContent = '#0a0a0f';
  document.getElementById('themeBgSecondary').value = '#111118';
  document.getElementById('themeBgSecondaryHex').textContent = '#111118';

  showToast('🔄 Theme reset to defaults', 'default');
}

// =============================================
// MESSAGES
// =============================================
function loadMessages() {
  const messages = getData(STORE_KEYS.messages) || [];
  const list = document.getElementById('messagesList');

  if (messages.length === 0) {
    list.innerHTML = '<p style="color:var(--text-muted);">No messages yet.</p>';
    return;
  }

  list.innerHTML = messages.slice().reverse().slice(0, 10).map(m => `
    <div class="admin-item">
      <div class="admin-item-info">
        <div class="item-thumb" style="font-size:1.5rem;">💬</div>
        <div>
          <h4>${m.name} — ${m.subject || 'No Subject'}</h4>
          <p>${m.email} • ${new Date(m.date).toLocaleDateString()}</p>
        </div>
      </div>
      <div class="admin-item-actions">
        <button class="btn-admin secondary small" onclick="alert('${m.message.replace(/'/g, "\\'")}')">
          <i class="fas fa-eye"></i> View
        </button>
        <button class="btn-admin danger small" onclick="deleteMessage('${m.id}')">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
  `).join('');
}

function deleteMessage(id) {
  let messages = getData(STORE_KEYS.messages) || [];
  messages = messages.filter(m => m.id !== id);
  setData(STORE_KEYS.messages, messages);
  loadMessages();
  updateStats();
  showToast('🗑️ Message deleted', 'default');
}

// =============================================
// STATS
// =============================================
function updateStats() {
  const projects = getData(STORE_KEYS.projects) || [];
  const videos = getData(STORE_KEYS.videos) || [];
  const messages = getData(STORE_KEYS.messages) || [];

  document.getElementById('statProjects').textContent = projects.length;
  document.getElementById('statVideos').textContent = videos.length;
  document.getElementById('statMessages').textContent = messages.length;
}

// =============================================
// INITIALIZE
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
});
