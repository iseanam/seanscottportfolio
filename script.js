const revealElements = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });
revealElements.forEach((el) => observer.observe(el));

const navToggle = document.getElementById('navToggle');
const siteNav = document.getElementById('siteNav');
if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => siteNav.classList.toggle('open'));
  siteNav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => siteNav.classList.remove('open')));
}

const API_BASE = 'https://backendgallerycarla.onrender.com';
const TOKEN_KEY = 'sean-gallery-admin-token';

const galleryGrid = document.getElementById('galleryGrid');
const ownerPanel = document.getElementById('ownerPanel');
const loginToggle = document.getElementById('loginToggle');
const logoutButton = document.getElementById('logoutButton');
const authStatus = document.getElementById('authStatus');
const loginForm = document.getElementById('loginForm');
const uploadForm = document.getElementById('uploadForm');
const passwordInput = document.getElementById('passwordInput');
const titleInput = document.getElementById('titleInput');
const descriptionInput = document.getElementById('descriptionInput');
const imageInput = document.getElementById('imageInput');

function token() { return localStorage.getItem(TOKEN_KEY); }
function setToken(value) {
  if (value) localStorage.setItem(TOKEN_KEY, value);
  else localStorage.removeItem(TOKEN_KEY);
  syncAuthUI();
}
function isAuthed() { return !!token(); }

function escapeHTML(value = '') {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function syncAuthUI() {
  const authed = isAuthed();
  authStatus.textContent = authed ? 'Owner mode active' : 'Public view';
  logoutButton.classList.toggle('hidden', !authed);
  loginForm.classList.toggle('hidden', authed);
  uploadForm.classList.toggle('hidden', !authed);
}

async function fetchGallery() {
  try {
    const res = await fetch(`${API_BASE}/api/artworks`);
    const items = await res.json();
    renderGallery(items);
  } catch (error) {
    galleryGrid.innerHTML = `<article class="gallery-item"><div class="gallery-copy"><h3>Backend not connected yet</h3><p>Start your backend and set API_BASE in script.js to your real backend URL.</p></div></article>`;
  }
}

function renderGallery(items) {
  galleryGrid.innerHTML = items.map((item) => `
    <article class="gallery-item reveal visible">
      ${isAuthed() ? `<button class="remove-btn" data-id="${item.id}" type="button">Remove</button>` : ''}
      <img src="${API_BASE}${item.imageUrl}" alt="${escapeHTML(item.title || 'Artwork')}" loading="lazy" />
      <div class="gallery-copy">
        <h3>${escapeHTML(item.title || 'Untitled')}</h3>
        <p>${escapeHTML(item.description || '')}</p>
      </div>
    </article>
  `).join('');

  if (isAuthed()) {
    document.querySelectorAll('.remove-btn').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const res = await fetch(`${API_BASE}/api/artworks/${btn.dataset.id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token()}` }
        });
        if (res.ok) fetchGallery();
        else alert('Could not delete artwork.');
      });
    });
  }
}

loginToggle.addEventListener('click', () => ownerPanel.classList.toggle('hidden'));
logoutButton.addEventListener('click', () => setToken(''));

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  try {
    const res = await fetch(`${API_BASE}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: passwordInput.value })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    setToken(data.token);
    passwordInput.value = '';
    fetchGallery();
  } catch (error) {
    alert(error.message || 'Login failed');
  }
});

uploadForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const file = imageInput.files?.[0];
  if (!file) return alert('Please choose an image.');

  const formData = new FormData();
  formData.append('title', titleInput.value.trim());
  formData.append('description', descriptionInput.value.trim());
  formData.append('image', file);

  try {
    const res = await fetch(`${API_BASE}/api/artworks`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token()}` },
      body: formData
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Upload failed');
    uploadForm.reset();
    fetchGallery();
  } catch (error) {
    alert(error.message || 'Upload failed');
  }
});

syncAuthUI();
fetchGallery();
