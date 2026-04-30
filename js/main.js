// ─── Config ──────────────────────────────────────────────────
const TRINITY_API   = 'https://ambersol.co.il/api/beautymania/contact';
const PRODUCTS_API  = 'https://ambersol.co.il/api/beautymania/products';
const SITE_URL      = 'https://beautymania.co.il';
// Image Transform требует Supabase Pro — используем прямые URL

// ─── Traffic Attribution Tracker (лендинг) ───────────────────
// Тот же трекер что и в shop.js — первый заход фиксируется здесь,
// shop.js проверяет localStorage и не перезаписывает.
;(function captureTrafficSource() {
  const KEY = 'bm_traffic_source';
  if (localStorage.getItem(KEY)) return;
  const p = new URLSearchParams(window.location.search);
  const utmSource = p.get('utm_source') || '';
  const utmMedium = p.get('utm_medium') || '';
  const utmCampaign = p.get('utm_campaign') || '';
  let referrer = 'direct';
  try {
    const ref = document.referrer;
    if (ref) {
      const host = new URL(ref).hostname.replace(/^www\./, '');
      if (host.includes('google.'))       referrer = 'google';
      else if (host.includes('instagram.') || host.includes('l.instagram.')) referrer = 'instagram';
      else if (host.includes('facebook.') || host.includes('l.facebook.'))   referrer = 'facebook';
      else if (host.includes('tiktok.'))  referrer = 'tiktok';
      else if (host.includes('t.co') || host.includes('twitter.')) referrer = 'twitter';
      else if (host.includes('whatsapp.')) referrer = 'whatsapp';
      else if (host.includes('bing.'))    referrer = 'bing';
      else if (host.includes('yandex.'))  referrer = 'yandex';
      else referrer = host || 'direct';
    }
  } catch (_) {}
  const source = utmSource || referrer;
  try {
    localStorage.setItem(KEY, JSON.stringify({
      utm_source:   source,
      utm_medium:   utmMedium   || (utmSource ? 'referral' : referrer === 'direct' ? 'direct' : 'organic'),
      utm_campaign: utmCampaign || '',
      referrer:     referrer,
      captured_at:  new Date().toISOString(),
    }));
  } catch (_) {}
})();

function optimizeImgMain(url, _width) {
  return url || '';
}

// ─── NAV scroll ──────────────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ─── Burger menu ─────────────────────────────────────────────
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
burger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  burger.classList.toggle('open');
});
mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    burger.classList.remove('open');
  });
});

// ─── Active nav link ─────────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__links a, .nav__mobile a');
window.addEventListener('scroll', () => {
  let cur = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) cur = s.id; });
  navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + cur));
}, { passive: true });

// ─── Scroll reveal ───────────────────────────────────────────
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in-view'); revealObs.unobserve(e.target); } });
}, { threshold: 0.1 });

function initReveal() {
  document.querySelectorAll('.about__grid, .blog-card, .product-card, .collab-card, .contact__info, .contact__form, .stat')
    .forEach((el, i) => {
      if (el.classList.contains('reveal')) return;
      el.classList.add('reveal');
      el.style.transitionDelay = (i * 0.055) + 's';
      revealObs.observe(el);
    });
}
initReveal();

// ─── Hero video — alternate between two clips ─────────────────
(function () {
  const video = document.getElementById('heroVideo');
  if (!video) return;
  const clips = ['media/vid/landvid.MP4', 'media/vid/landvid2.MP4'];
  let idx = 0;
  video.addEventListener('ended', () => {
    idx = (idx + 1) % clips.length;
    video.src = clips[idx];
    video.load();
    video.play().catch(() => {});
  });
})();

// ─── 3D Tilt Card ────────────────────────────────────────────
(function () {
  const card = document.getElementById('tiltCard');
  if (!card) return;
  const inner = card.querySelector('.tilt-card__inner');
  const shine = card.querySelector('.tilt-card__shine');
  const MAX = 14;
  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    inner.style.transform = `rotateX(${-y * MAX * 2}deg) rotateY(${x * MAX * 2}deg) scale3d(1.03,1.03,1.03)`;
    shine.style.background = `radial-gradient(circle at ${(x+0.5)*100}% ${(y+0.5)*100}%, rgba(201,168,76,0.22) 0%, transparent 60%)`;
  });
  card.addEventListener('mouseleave', () => {
    inner.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
    shine.style.background = '';
  });
})();

// ─── Gallery — INFINITE LOOP + drag ──────────────────────────
(function () {
  const strip = document.getElementById('galleryStrip');
  if (!strip) return;
  const origItems = Array.from(strip.querySelectorAll('.gallery__item'));
  const origSrcs  = origItems.map(it => it.querySelector('img').src);
  const ITEM_W    = 280 + 3;
  const clonesBefore = origItems.map(it => it.cloneNode(true));
  const clonesAfter  = origItems.map(it => it.cloneNode(true));
  clonesBefore.forEach(c => { c.dataset.clone = '1'; strip.insertBefore(c, strip.firstChild); });
  clonesAfter.forEach(c  => { c.dataset.clone = '1'; strip.appendChild(c); });
  const totalItems = origItems.length;
  const totalWidth = totalItems * ITEM_W;
  let offset = totalWidth;
  strip.style.transform = `translateX(${-offset}px)`;
  strip.style.transition = 'none';
  function wrapIfNeeded() {
    if (offset >= totalWidth * 2) { offset -= totalWidth; strip.style.transition = 'none'; strip.style.transform = `translateX(${-offset}px)`; }
    if (offset <= 0)              { offset += totalWidth; strip.style.transition = 'none'; strip.style.transform = `translateX(${-offset}px)`; }
  }
  let isDragging = false, startX = 0, startOffset = 0, movedPx = 0;
  strip.addEventListener('mousedown', e => { isDragging = true; strip.classList.add('dragging'); startX = e.clientX; startOffset = offset; movedPx = 0; strip.style.transition = 'none'; });
  window.addEventListener('mousemove', e => { if (!isDragging) return; const dx = startX - e.clientX; movedPx = Math.abs(dx); offset = startOffset + dx; strip.style.transform = `translateX(${-offset}px)`; });
  window.addEventListener('mouseup', () => { if (!isDragging) return; isDragging = false; strip.classList.remove('dragging'); wrapIfNeeded(); });
  let touchStartX = 0, touchOffset = 0;
  strip.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; touchOffset = offset; strip.style.transition = 'none'; }, { passive: true });
  strip.addEventListener('touchmove', e => { const dx = touchStartX - e.touches[0].clientX; offset = touchOffset + dx; strip.style.transform = `translateX(${-offset}px)`; }, { passive: true });
  strip.addEventListener('touchend', () => wrapIfNeeded(), { passive: true });
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.innerHTML = `<button class="lightbox__close">✕</button><button class="lightbox__prev">‹</button><button class="lightbox__next">›</button><div class="lightbox__img-wrap"><img class="lightbox__img" src="" alt="" /></div><p class="lightbox__count"></p>`;
  document.body.appendChild(lb);
  let lbCurrent = 0;
  function lbOpen(i) { lbCurrent = ((i % totalItems) + totalItems) % totalItems; lb.querySelector('.lightbox__img').src = origSrcs[lbCurrent]; lb.querySelector('.lightbox__count').textContent = (lbCurrent + 1) + ' / ' + totalItems; lb.classList.add('active'); document.body.style.overflow = 'hidden'; }
  function lbClose() { lb.classList.remove('active'); document.body.style.overflow = ''; }
  lb.querySelector('.lightbox__close').addEventListener('click', lbClose);
  lb.querySelector('.lightbox__prev').addEventListener('click', () => lbOpen(lbCurrent - 1));
  lb.querySelector('.lightbox__next').addEventListener('click', () => lbOpen(lbCurrent + 1));
  lb.addEventListener('click', e => { if (e.target === lb) lbClose(); });
  document.addEventListener('keydown', e => { if (!lb.classList.contains('active')) return; if (e.key === 'Escape') lbClose(); if (e.key === 'ArrowLeft') lbOpen(lbCurrent - 1); if (e.key === 'ArrowRight') lbOpen(lbCurrent + 1); });
  strip.addEventListener('click', e => { if (movedPx > 5) return; const item = e.target.closest('.gallery__item'); if (!item || item.dataset.clone) return; const idx = origItems.indexOf(item); if (idx !== -1) lbOpen(idx); });
})();

// ─── SHOP — 4 рандомных товара + кнопка в магазин ────────────
(function () {
  const grid = document.getElementById('shopGrid');
  if (!grid) return;

  async function loadProducts() {
    grid.innerHTML = '<div class="shop__loading">Загрузка...</div>';
    try {
      const res = await fetch(PRODUCTS_API);
      if (!res.ok) throw new Error('API error');
      const { products } = await res.json();

      if (!products || products.length === 0) {
        grid.innerHTML = '<p class="shop__empty">Товары скоро появятся...</p>';
        return;
      }

      // 4 рандомных товара
      const four = [...products].sort(() => Math.random() - 0.5).slice(0, 4);

      grid.innerHTML = four.map(p => `
        <div class="product-card">
          <div class="product-card__img">
            ${p.image_url
              ? `<img src="${escStr(optimizeImgMain(p.image_url, 400))}" alt="${escStr(p.name)}" loading="lazy" width="400" height="400" />`
              : `<div class="product-card__placeholder">✦</div>`}
            <div class="product-card__overlay">
              <a href="/shop" class="btn btn--gold btn--sm">Смотреть</a>
            </div>
          </div>
          <div class="product-card__info">
            <h4>${escStr(p.name)}</h4>
            ${p.description ? `<p class="product-card__sub">${escStr(p.description.slice(0, 60))}${p.description.length > 60 ? '...' : ''}</p>` : ''}
            ${p.sell_price ? `<p class="product-card__price">₪${Number(p.sell_price).toFixed(0)}</p>` : ''}
          </div>
        </div>
      `).join('');

      initReveal();
      if (window._clearImgSkeleton) window._clearImgSkeleton();
    } catch (err) {
      console.error('[Shop] Failed to load products:', err);
      grid.innerHTML = '<p class="shop__empty">Не удалось загрузить товары.</p>';
    }
  }

  loadProducts();
})();

// ─── Contact form → Trinity API ──────────────────────────────
(function () {
  const form    = document.getElementById('contactForm');
  const btn     = document.getElementById('formBtn');
  const success = document.getElementById('formSuccess');
  const error   = document.getElementById('formError');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    success.classList.remove('visible');
    error.classList.remove('visible');
    btn.textContent = 'Отправляю...';
    btn.disabled = true;
    try {
      const res = await fetch(TRINITY_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:    document.getElementById('formName').value.trim(),
          email:   document.getElementById('formEmail').value.trim(),
          subject: document.getElementById('formSubject').value,
          message: document.getElementById('formMessage').value.trim(),
        }),
      });
      if (!res.ok) throw new Error('Server error');
      success.classList.add('visible');
      form.reset();
      setTimeout(() => success.classList.remove('visible'), 6000);
    } catch {
      error.classList.add('visible');
      setTimeout(() => error.classList.remove('visible'), 5000);
    } finally {
      btn.textContent = 'Отправить сообщение';
      btn.disabled = false;
    }
  });
})();

// ─── Image Skeleton — снимаем shimmer после загрузки изображений ─────────────
(function () {
  function clearSkeleton(img) {
    const parent = img.closest('.blog-card__img, .product-card__img, .gallery__item, .tilt-card__inner');
    if (parent) parent.classList.add('img-loaded');
  }
  function applyToAll() {
    document.querySelectorAll('.blog-card__img img, .product-card__img img, .gallery__item img, .tilt-card__inner img').forEach(img => {
      if (img.complete && img.naturalWidth > 0) {
        clearSkeleton(img);
      } else {
        img.addEventListener('load', () => clearSkeleton(img), { once: true });
      }
    });
  }
  applyToAll();
  // Для динамически загружаемых карточек (shop preview)
  window._clearImgSkeleton = applyToAll;
})();

// ─── Helpers ─────────────────────────────────────────────────
function escStr(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
}


/* ── BESTSELLERS CAROUSEL ── */
(function() {
  const track = document.getElementById('bmTrack');
  const outer = document.getElementById('bmOuter');
  const btnPrev = document.getElementById('bmPrev');
  const btnNext = document.getElementById('bmNext');
  const dotsEl = document.getElementById('bmDots');
  if (!track) return;

  const slides = track.querySelectorAll('.bm-slide');
  const cards = track.querySelectorAll('.bm-card');
  const imgs = track.querySelectorAll('.bm-bottle-img');
  const shadows = track.querySelectorAll('.bm-shadow');
  const cats = track.querySelectorAll('.bm-cat span');
  const names = track.querySelectorAll('.bm-name span');
  const prices = track.querySelectorAll('.bm-price span');
  const TOTAL = slides.length;
  const SLIDE_W = 260;
  const SPD = 700;
  let current = 0;

  // Загрузка цен из Trinity API по имени товара
  fetch('https://ambersol.co.il/api/beautymania/products')
    .then(function(r) { return r.json(); })
    .then(function(data) {
      var products = data.products || data || [];
      names.forEach(function(nameEl, i) {
        var cardName = nameEl.textContent.trim().toLowerCase();
        var match = products.find(function(p) {
          return p.name && p.name.trim().toLowerCase().indexOf(cardName) !== -1
              || cardName.indexOf((p.name || '').trim().toLowerCase()) !== -1;
        });
        if (match && match.sell_price) {
          prices[i].textContent = '₪' + Number(match.sell_price).toFixed(0);
        }
      });
    })
    .catch(function() {}); // тихо — цены просто не обновятся

  const dots = [];
  for (let i = 0; i < TOTAL; i++) {
    const d = document.createElement('div');
    d.className = 'bm-dot' + (i === 0 ? ' active' : '');
    d.addEventListener('click', function() { goTo(i); });
    dotsEl.appendChild(d);
    dots.push(d);
  }

  function applyProgress() {
    const cw = outer.offsetWidth || 680;
    const centerOff = (cw - SLIDE_W) / 2;
    const tx = centerOff - current * SLIDE_W;
    track.style.transition = 'transform ' + SPD + 'ms cubic-bezier(0.22,0.74,0.46,0.97)';
    track.style.transform = 'translateX(' + tx + 'px)';

    for (let i = 0; i < TOTAL; i++) {
      const prog = i - current;
      const absP = Math.abs(prog);
      const dur = SPD + 'ms';

      cards[i].style.transition = 'transform ' + dur + ', filter ' + dur;
      imgs[i].style.transition = 'transform ' + dur;
      shadows[i].style.transition = 'transform ' + dur;
      [cats[i], names[i], prices[i]].forEach(function(s) {
        if (s) s.style.transition = 'transform ' + dur;
      });

      if (absP > 1.5) {
        cards[i].style.transform = 'scale(0.7)';
        cards[i].style.filter = 'brightness(0.08)';
        cards[i].style.setProperty('--bm-border-op', '0');
        cards[i].classList.remove('bm-active');
        continue;
      }

      cards[i].style.transform = 'scale(' + (1 - absP * 0.2) + ')';
      cards[i].style.filter = absP >= 1 ? 'brightness(0.35)' : 'brightness(1)';
      // ::before управляется через CSS-переменную — нет артефактов обрезки
      var borderOp = absP >= 1 ? '0' : String(1 - absP * 0.5);
      cards[i].style.setProperty('--bm-border-op', borderOp);
      cards[i].classList.toggle('bm-active', absP === 0);

      var imgTx = prog * -80;
      var imgRot = absP * 15 - 15;
      imgs[i].style.transform = 'translate3d(' + imgTx + 'px,0,0) rotate(' + imgRot + 'deg)';
      shadows[i].style.transform = 'translateX(' + (imgTx / 2) + 'px)';

      var textY = absP * 50;
      [cats[i], names[i], prices[i]].forEach(function(s, si) {
        if (s) s.style.transform = 'translateY(' + (textY * (si + 1)) + 'px)';
      });
    }

    btnPrev.disabled = current === 0;
    btnNext.disabled = current === TOTAL - 1;
    dots.forEach(function(d, i) { d.classList.toggle('active', i === current); });
  }

  function goTo(idx) {
    current = Math.max(0, Math.min(TOTAL - 1, idx));
    applyProgress();
  }

  btnPrev.addEventListener('click', function() { goTo(current - 1); });
  btnNext.addEventListener('click', function() { goTo(current + 1); });

  var startX = 0;
  track.addEventListener('pointerdown', function(e) { startX = e.clientX; });
  track.addEventListener('pointerup', function(e) {
    var diff = startX - e.clientX;
    if (Math.abs(diff) > 40) goTo(current + (diff > 0 ? 1 : -1));
  });

  window.addEventListener('resize', applyProgress);
  setTimeout(applyProgress, 50);
})();
