// ═══════════════════════════════════════════════════════════════
// BEAUTYMANIA — i18n (RU / HE)
// ═══════════════════════════════════════════════════════════════
;(function () {
  const TRANSLATIONS = {
    ru: {
      nav_about:          'Обо мне',
      nav_blog:           'Блог',
      nav_shop:           'Магазин',
      nav_collab:         'Реклама',
      nav_contact:        'Контакты',
      hero_label:         'Красота & Мода',
      hero_sub:           'Стиль — это не то, что ты носишь. Это то, как ты живёшь',
      hero_btn:           'В магазин',
      hero_scroll:        'Листать',
      about_label:        'Знакомьтесь',
      about_title:        'Привет, я — <em>Анета</em>',
      about_desc:         'Бьюти-эксперт, любительница моды и контент-мейкер из Израиля. Делюсь страстью к косметике, уходу за кожей и стилю с тысячами подписчиков, которые доверяют моим честным обзорам и смелой эстетике.',
      about_honest:       'Честно',
      about_cta:          'Сотрудничество',
      blog_label:         'Последние записи',
      blog_title:         'Из блога',
      blog1_tag:          'Уход за кожей',
      blog1_date:         'Февраль 2026',
      blog1_title:        'Мой утренний ритуал сияния — 5 шагов, которым я не изменяю',
      blog1_desc:         'Просыпаться с сияющей кожей — это не магия, а ритуал. Вот 5 продуктов, которые изменили мои утра...',
      blog_read:          'Читать далее →',
      blog2_tag:          'Мода',
      blog2_date:         'Январь 2026',
      blog2_title:        'Чёрный — это всегда новый чёрный',
      blog3_tag:          'Макияж',
      blog3_date:         'Декабрь 2025',
      blog3_title:        'Праздничный гламур: золото и эффектные образы',
      shop_label:         'Бьюти-эссенциалы',
      shop_title:         'Магазин <em>Анеты</em>',
      shop_cta:           'Весь магазин →',
      bs_label:           'Бьюти-коллекция',
      bs_title:           'Наши <em>бестселлеры</em>',
      carousel_prev:      '← Назад',
      carousel_next:      'Вперёд →',
      gallery_label:      'Визуал',
      gallery_title:      'Галерея',
      collab_label:       'Реклама & Партнёрство',
      collab_title:       'Создадим что-то <em>вместе</em>',
      collab_desc:        'Я сотрудничаю с бьюти-брендами, модными марками и лайфстайл-компаниями — создаю аутентичный спонсорский контент, обзоры продуктов и рекламные истории, которые находят отклик у моей аудитории.',
      collab_card1_title: 'Спонсорские посты',
      collab_card1_desc:  'Размещения в Instagram и Facebook с искренним сторителлингом',
      collab_card2_title: 'Обзоры продуктов',
      collab_card2_desc:  'Честные, детальные отзывы, которым доверяет моя аудитория',
      collab_card3_title: 'Бренд-кампании',
      collab_card3_desc:  'Полное творческое руководство, фотография и видеоконтент',
      collab_cta:         'Написать мне',
      contact_label:      'Давайте пообщаемся',
      contact_title:      'Написать <em>Анете</em>',
      contact_desc:       'По заказам из магазина, рекламным запросам или просто поздороваться — буду рада вашему сообщению.',
      form_name:          'Ваше имя',
      form_email:         'Электронная почта',
      form_subject_default: 'Тема обращения...',
      form_subject_order: 'Заказ из магазина',
      form_subject_collab:'Реклама / Коллаборация',
      form_subject_other: 'Общий вопрос',
      form_message:       'Ваше сообщение...',
      form_submit:        'Отправить сообщение',
      form_success:       '✓ Сообщение отправлено! Скоро свяжусь с вами.',
      form_error:         'Ошибка отправки. Попробуйте ещё раз.',
      footer_copy:        '© 2026 Beautymania by Aneta. Все права защищены.',
      footer_credit:      'Создано с ♥ командой <a href="https://ambersol.co.il" target="_blank">Amber Solutions</a>',
    },
    he: {
      nav_about:          'עליי',
      nav_blog:           'בלוג',
      nav_shop:           'חנות',
      nav_collab:         'שיתופי פעולה',
      nav_contact:        'צרו קשר',
      hero_label:         'יופי & אופנה',
      hero_sub:           'סטייל זה לא מה שאת לובשת. זה איך שאת חיה',
      hero_btn:           'לחנות',
      hero_scroll:        'גלול',
      about_label:        'הכירו אותי',
      about_title:        'שלום, אני — <em>אנטה</em>',
      about_desc:         'מומחית יופי, אוהבת אופנה ויוצרת תוכן מישראל. משתפת את התשוקה לקוסמטיקה, טיפוח העור וסטייל עם אלפי עוקבים שסומכים על הביקורות הכנות שלי.',
      about_honest:       'כנה 100%',
      about_cta:          'שיתוף פעולה',
      blog_label:         'פוסטים אחרונים',
      blog_title:         'מהבלוג',
      blog1_tag:          'טיפוח העור',
      blog1_date:         'פברואר 2026',
      blog1_title:        'הטקס הבוקרי שלי לזוהר — 5 צעדים שאני לא מוותרת עליהם',
      blog1_desc:         'להתעורר עם עור זוהר זה לא קסם — זה טקס. הנה 5 מוצרים שינו את הבוקרים שלי...',
      blog_read:          'קרא עוד ←',
      blog2_tag:          'אופנה',
      blog2_date:         'ינואר 2026',
      blog2_title:        'שחור הוא תמיד השחור החדש',
      blog3_tag:          'איפור',
      blog3_date:         'דצמבר 2025',
      blog3_title:        'גלאם לחגים: זהב ולוקים מרשימים',
      shop_label:         'אסנציאלים ליופי',
      shop_title:         'חנות <em>אנטה</em>',
      shop_cta:           'לכל החנות ←',
      bs_label:           'קולקציית יופי',
      bs_title:           '<em>הנמכרים ביותר</em> שלנו',
      carousel_prev:      '→ הקודם',
      carousel_next:      'הבא ←',
      gallery_label:      'ויזואל',
      gallery_title:      'גלריה',
      collab_label:       'פרסום & שיתוף פעולה',
      collab_title:       'ניצור משהו <em>יחד</em>',
      collab_desc:        'אני משתפת פעולה עם מותגי יופי, אופנה וחברות לייפסטייל — יוצרת תוכן ממומן אותנטי, ביקורות מוצרים וסיפורי מותג שמהדהדים עם הקהל שלי.',
      collab_card1_title: 'פוסטים ממומנים',
      collab_card1_desc:  'פרסומים באינסטגרם ופייסבוק עם סיפור אמיתי ואותנטי',
      collab_card2_title: 'ביקורות מוצרים',
      collab_card2_desc:  'ביקורות כנות ומפורטות שהקהל שלי סומך עליהן',
      collab_card3_title: 'קמפיינים למותגים',
      collab_card3_desc:  'הובלה יצירתית מלאה, צילום ותוכן וידאו',
      collab_cta:         'כתבי לי',
      contact_label:      'בואו נדבר',
      contact_title:      'כתבי ל<em>אנטה</em>',
      contact_desc:       'להזמנות מהחנות, פניות לשיתוף פעולה או סתם להגיד שלום — אשמח לשמוע ממך.',
      form_name:          'השם שלך',
      form_email:         'כתובת מייל',
      form_subject_default: 'נושא הפנייה...',
      form_subject_order: 'הזמנה מהחנות',
      form_subject_collab:'פרסום / שיתוף פעולה',
      form_subject_other: 'שאלה כללית',
      form_message:       'ההודעה שלך...',
      form_submit:        'שליחת הודעה',
      form_success:       '✓ ההודעה נשלחה! אחזור אלייך בקרוב.',
      form_error:         'שגיאה בשליחה. נסי שוב.',
      footer_copy:        '© 2026 Beautymania by Aneta. כל הזכויות שמורות.',
      footer_credit:      'נוצר עם ♥ על ידי <a href="https://ambersol.co.il" target="_blank">Amber Solutions</a>',
    }
  };

  function applyTranslations(lang) {
    const t = TRANSLATIONS[lang];
    if (!t) return;

    // data-i18n → innerHTML
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (t[key] !== undefined) el.innerHTML = t[key];
    });

    // data-i18n-placeholder → placeholder attribute
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-placeholder');
      if (t[key] !== undefined) el.placeholder = t[key];
    });

    // <html> lang + dir + data-lang
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', lang === 'he' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('data-lang', lang);

    // title
    document.title = lang === 'he'
      ? 'Beautymania — יופי ואופנה עם אנטה'
      : 'Beautymania — Красота и Мода с Анетой';

    // active button state — обновляем все копии кнопок (desktop + mobile)
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });

    // Сохраняем выбор
    try { localStorage.setItem('bm_lang', lang); } catch (_) {}
  }

  function initLang() {
    // Читаем сохранённый язык
    var saved = '';
    try { saved = localStorage.getItem('bm_lang') || ''; } catch (_) {}
    var lang = (saved === 'he' || saved === 'ru') ? saved : 'ru';
    applyTranslations(lang);
  }

  // Вешаем обработчики на ВСЕ кнопки языка (desktop + mobile)
  document.querySelectorAll('.lang-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      applyTranslations(btn.getAttribute('data-lang'));
    });
  });

  // Инициализируем
  initLang();
})();

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


/* ── BESTSELLERS CAROUSEL — динамический, бесконечный loop ── */
(function () {
  const BESTSELLERS_API = 'https://ambersol.co.il/api/beautymania/bestsellers';
  const SLIDE_W = 260;
  const SPD = 700;

  const track  = document.getElementById('bmTrack');
  const outer  = document.getElementById('bmOuter');
  const btnPrev = document.getElementById('bmPrev');
  const btnNext = document.getElementById('bmNext');
  const dotsEl  = document.getElementById('bmDots');
  if (!track) return;

  // ─── Рендер одного слайда ────────────────────────────────
  function renderSlide(item, isClone) {
    const imgUrl = item.image_url || '';
    const title  = escStr(item.title    || '');
    const sub    = escStr(item.subtitle || '');
    const price  = item.price ? '₪' + Number(item.price).toFixed(0) : '';
    const slideEl = document.createElement('div');
    slideEl.className = 'bm-slide' + (isClone ? ' bm-clone' : '');
    slideEl.innerHTML = `
      <div class="bm-card">
        <div class="bm-card-bg"></div>
        <div class="bm-bottle-wrap">
          ${imgUrl
            ? `<img class="bm-bottle-img" src="${escStr(imgUrl)}" alt="${title}" loading="lazy" />`
            : `<div class="bm-bottle-placeholder">✦</div>`}
        </div>
        <div class="bm-shadow"></div>
      </div>
      <div class="bm-info">
        ${sub   ? `<div class="bm-cat"><span>${sub}</span></div>`   : ''}
        ${title ? `<div class="bm-name"><span>${title}</span></div>` : ''}
        ${price ? `<div class="bm-price"><span>${price}</span></div>` : ''}
      </div>
    `;
    return slideEl;
  }

  // ─── Инициализация карусели после получения данных ───────
  function initCarousel(items) {
    if (!items.length) {
      outer.style.display = 'none';
      return;
    }

    track.innerHTML = '';
    dotsEl.innerHTML = '';

    const TOTAL = items.length;

    // ─── Circular buffer: полный набор клонов с каждой стороны ───
    // Структура трека: [...TOTAL клонов конца | TOTAL реальных | ...TOTAL клонов начала]
    // При этом по краям всегда есть TOTAL слайдов — прыжок никогда не будет виден.
    // current стартует с TOTAL (первый реальный слайд).
    for (var ci = 0; ci < TOTAL; ci++) {
      track.appendChild(renderSlide(items[ci], true)); // клоны начала (в конце трека придут позже)
    }
    // Вставляем в начало трека клоны конца (items в обратном порядке относительно конца → начала)
    // Сначала строим реальные, потом вставляем клоны конца перед ними
    var realSlides = items.map(function(item) { return renderSlide(item, false); });
    var clonesBefore = items.map(function(item) { return renderSlide(item, true); });
    var clonesAfter  = items.map(function(item) { return renderSlide(item, true); });

    // Очищаем и строим правильный порядок
    track.innerHTML = '';
    clonesBefore.forEach(function(el) { track.appendChild(el); });
    realSlides.forEach(function(el)   { track.appendChild(el); });
    clonesAfter.forEach(function(el)  { track.appendChild(el); });

    // current — индекс активного слайда в треке (0-based)
    // Реальные слайды: индексы [TOTAL .. 2*TOTAL-1]
    // Стартуем на первом реальном
    var current = TOTAL;
    var STOTAL  = TOTAL * 3; // всего слайдов в треке
    var isAnimating = false;

    // Точки — только TOTAL штук
    var dots = [];
    for (var di = 0; di < TOTAL; di++) {
      (function(i) {
        var d = document.createElement('div');
        d.className = 'bm-dot' + (i === 0 ? ' active' : '');
        d.addEventListener('click', function() { goTo(TOTAL + i); });
        dotsEl.appendChild(d);
        dots.push(d);
      })(di);
    }

    // ─── applyProgress ───────────────────────────────────────
    function applyProgress(animated) {
      var slides      = track.querySelectorAll('.bm-slide');
      var cards       = track.querySelectorAll('.bm-card');
      var cardBgs     = track.querySelectorAll('.bm-card-bg');
      var bottleWraps = track.querySelectorAll('.bm-bottle-wrap');
      var shadows     = track.querySelectorAll('.bm-shadow');
      var infos       = track.querySelectorAll('.bm-info');
      var cats        = track.querySelectorAll('.bm-cat span');
      var names       = track.querySelectorAll('.bm-name span');
      var prices      = track.querySelectorAll('.bm-price span');

      var cw = outer.offsetWidth || 680;
      var centerOff = (cw - SLIDE_W) / 2;
      var tx = centerOff - current * SLIDE_W;

      track.style.transition = animated
        ? 'transform ' + SPD + 'ms cubic-bezier(0.22,0.74,0.46,0.97)'
        : 'none';
      track.style.transform = 'translateX(' + tx + 'px)';

      var dur = SPD + 'ms';
      for (var i = 0; i < STOTAL; i++) {
        var prog  = i - current;
        var absP  = Math.abs(prog);
        var isAct = absP === 0;

        if (cards[i]) {
          cards[i].style.transition = animated ? ('transform ' + dur + ', filter ' + dur) : 'none';
          cards[i].style.transform  = 'scale(' + (1 - absP * 0.2) + ')';
          cards[i].style.filter     = absP >= 1 ? 'brightness(0.35)' : 'brightness(1)';
          cards[i].style.setProperty('--bm-border-op', isAct ? '1' : '0');
          cards[i].classList.toggle('bm-active', isAct);
        }
        if (cardBgs[i])     cardBgs[i].style.opacity     = isAct ? '1' : '0';
        if (infos[i])       infos[i].style.opacity       = isAct ? '1' : '0';
        if (shadows[i])     shadows[i].style.opacity     = isAct ? '1' : '0';

        if (bottleWraps[i]) {
          var imgTx  = prog * -80;
          var imgRot = absP * 15 - 15;
          bottleWraps[i].style.transition = animated ? ('transform ' + dur) : 'none';
          bottleWraps[i].style.transform  = 'translate3d(' + imgTx + 'px,0,0) rotate(' + imgRot + 'deg)';
        }
        if (shadows[i]) {
          shadows[i].style.transition = animated ? ('transform ' + dur) : 'none';
          shadows[i].style.transform  = 'translateX(' + ((prog * -80) / 2) + 'px)';
        }
        if (cats[i])   { cats[i].style.transition   = animated ? ('transform ' + dur) : 'none'; cats[i].style.transform   = 'translateY(0)'; }
        if (names[i])  { names[i].style.transition  = animated ? ('transform ' + dur) : 'none'; names[i].style.transform  = 'translateY(0)'; }
        if (prices[i]) { prices[i].style.transition = animated ? ('transform ' + dur) : 'none'; prices[i].style.transform = 'translateY(0)'; }
      }

      // Точки: реальный индекс = current - TOTAL, зациклен
      var realIdx = ((current - TOTAL) % TOTAL + TOTAL) % TOTAL;
      dots.forEach(function(d, i) { d.classList.toggle('active', i === realIdx); });

      btnPrev.disabled = false;
      btnNext.disabled = false;
    }

    // ─── goTo — circular buffer teleport ────────────────────
    function goTo(idx, skipAnimation) {
      if (isAnimating && !skipAnimation) return;
      isAnimating = true;
      current = idx;
      applyProgress(!skipAnimation);

      setTimeout(function() {
        // Если вышли за левый край клонов — телепортируемся в зеркальную позицию реальных
        if (current < TOTAL) {
          current = current + TOTAL;
          applyProgress(false);
        }
        // Если вышли за правый край клонов — телепортируемся назад
        else if (current >= TOTAL * 2) {
          current = current - TOTAL;
          applyProgress(false);
        }
        isAnimating = false;
      }, skipAnimation ? 0 : SPD + 20);
    }

    applyProgress(false);

    btnPrev.addEventListener('click', function() { goTo(current - 1); });
    btnNext.addEventListener('click', function() { goTo(current + 1); });

    var startX = 0;
    track.addEventListener('pointerdown', function(e) {
      e.preventDefault();
      startX = e.clientX;
    });
    track.addEventListener('pointerup', function(e) {
      var diff = startX - e.clientX;
      if (Math.abs(diff) > 40) goTo(current + (diff > 0 ? 1 : -1));
    });

    window.addEventListener('resize', function() { applyProgress(false); });
  }

  // ─── Загрузка данных из Trinity ──────────────────────────
  fetch(BESTSELLERS_API)
    .then(function (r) { return r.json(); })
    .then(function (data) {
      var items = (data.bestsellers || []).filter(function (b) { return b.product_id; });
      initCarousel(items);
    })
    .catch(function (err) {
      console.error('[BM Carousel] Failed to load bestsellers:', err);
      // Скрываем секцию если нет данных
      var section = document.getElementById('bestsellers');
      if (section) section.style.display = 'none';
    });
})();
