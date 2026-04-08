
const revealElements = document.querySelectorAll('.reveal');
const tiltCards = document.querySelectorAll('.tilt-card, .floating-card');
const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

revealElements.forEach((el) => observer.observe(el));

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    siteNav.classList.toggle('open');
  });

  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => siteNav.classList.remove('open'));
  });
}

tiltCards.forEach((card) => {
  card.addEventListener('mousemove', (event) => {
    if (window.innerWidth < 760) return;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 8;
    const rotateX = ((y / rect.height) - 0.5) * -8;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

const ownerToggle = document.getElementById('ownerToggle');
const ownerPanel = document.getElementById('ownerPanel');
const addArtworkBtn = document.getElementById('addArtworkBtn');
const clearGalleryBtn = document.getElementById('clearGalleryBtn');
const imageInput = document.getElementById('imageInput');
const titleInput = document.getElementById('titleInput');
const descInput = document.getElementById('descInput');
const galleryGrid = document.getElementById('galleryGrid');

const STORAGE_KEY = 'sean-portfolio-gallery-v1';
let ownerMode = false;

const starterGallery = [
  {
    id: crypto.randomUUID(),
    title: "Carla's first featured piece",
    desc: "Replace this with a real drawing whenever you're ready.",
    src: "https://images.unsplash.com/photo-1515405295579-ba7b45403062?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: crypto.randomUUID(),
    title: "Sketchbook corner",
    desc: "A soft placeholder card so the gallery feels complete from day one.",
    src: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=900&q=80"
  }
];

function readGallery() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return starterGallery;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length ? parsed : starterGallery;
  } catch (error) {
    return starterGallery;
  }
}

function saveGallery(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function escapeHTML(value = '') {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function renderGallery() {
  const items = readGallery();
  galleryGrid.innerHTML = items.map((item) => `
    <article class="gallery-item">
      ${ownerMode ? `<button class="remove-btn" type="button" data-id="${item.id}">Remove</button>` : ''}
      <img src="${item.src}" alt="${escapeHTML(item.title || 'Artwork image')}" loading="lazy" />
      <div class="gallery-copy">
        <h3>${escapeHTML(item.title || 'Untitled')}</h3>
        <p>${escapeHTML(item.desc || '')}</p>
      </div>
    </article>
  `).join('');

  document.body.classList.toggle('owner-enabled', ownerMode);

  if (ownerMode) {
    document.querySelectorAll('.remove-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const items = readGallery().filter((item) => item.id !== btn.dataset.id);
        saveGallery(items);
        renderGallery();
      });
    });
  }
}

if (ownerToggle) {
  ownerToggle.addEventListener('click', () => {
    ownerMode = !ownerMode;
    ownerPanel.classList.toggle('hidden', !ownerMode);
    ownerToggle.textContent = ownerMode ? 'Disable Owner Mode' : 'Enable Owner Mode';
    renderGallery();
  });
}

if (addArtworkBtn) {
  addArtworkBtn.addEventListener('click', () => {
    const file = imageInput.files?.[0];
    if (!file) {
      alert('Choose an image first.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const items = readGallery();
      items.unshift({
        id: crypto.randomUUID(),
        title: titleInput.value.trim() || 'Untitled artwork',
        desc: descInput.value.trim(),
        src: reader.result
      });
      saveGallery(items);
      imageInput.value = '';
      titleInput.value = '';
      descInput.value = '';
      renderGallery();
    };
    reader.readAsDataURL(file);
  });
}

if (clearGalleryBtn) {
  clearGalleryBtn.addEventListener('click', () => {
    const ok = confirm('Clear all uploaded gallery items from this browser?');
    if (!ok) return;
    localStorage.removeItem(STORAGE_KEY);
    renderGallery();
  });
}

renderGallery();
