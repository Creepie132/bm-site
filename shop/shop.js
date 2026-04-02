// ─── Config ──────────────────────────────────────────────────
const PRODUCTS_API  = 'https://ambersol.co.il/api/beautymania/products'
const ORDER_API     = 'https://ambersol.co.il/api/beautymania/order'
const SITE_URL      = 'https://beautymania.co.il'
const SUPABASE_URL  = 'https://tjryzcqvsavtllahjyrj.supabase.co/storage/v1/render/image/public'

// ─── Traffic Attribution Tracker ─────────────────────────────
// Захватываем источник трафика при первом заходе и сохраняем в
// localStorage. При повторных визитах данные НЕ перезаписываются
// (первый клик имеет приоритет — first-touch attribution).
// При оформлении заказа данные прикрепляются к payload.
;(function captureTrafficSource() {
  const STORAGE_KEY = 'bm_traffic_source'

  // Уже сохранено — не трогаем (first-touch model)
  if (localStorage.getItem(STORAGE_KEY)) return

  // 1. Читаем UTM-параметры из URL
  const params     = new URLSearchParams(window.location.search)
  const utmSource   = params.get('utm_source')   || ''
  const utmMedium   = params.get('utm_medium')   || ''
  const utmCampaign = params.get('utm_campaign') || ''

  // 2. Читаем referrer — определяем источник трафика
  let referrer = 'direct'
  try {
    const ref = document.referrer
    if (ref) {
      const url  = new URL(ref)
      const host = url.hostname.replace(/^www\./, '')
      // Нормализуем популярные источники → читаемые имена
      if (host.includes('google.'))    referrer = 'google'
      else if (host.includes('instagram.') || host.includes('l.instagram.')) referrer = 'instagram'
      else if (host.includes('facebook.') || host.includes('l.facebook.'))   referrer = 'facebook'
      else if (host.includes('tiktok.'))  referrer = 'tiktok'
      else if (host.includes('t.co') || host.includes('twitter.')) referrer = 'twitter'
      else if (host.includes('whatsapp.')) referrer = 'whatsapp'
      else if (host.includes('bing.'))  referrer = 'bing'
      else if (host.includes('yandex.')) referrer = 'yandex'
      else referrer = host || 'direct'
    }
  } catch (_) { /* невалидный URL — оставляем 'direct' */ }

  // 3. UTM перекрывает автоматически определённый источник
  const source = utmSource || referrer

  const attribution = {
    utm_source:   source,
    utm_medium:   utmMedium   || (utmSource ? 'referral' : referrer === 'direct' ? 'direct' : 'organic'),
    utm_campaign: utmCampaign || '',
    referrer:     referrer,
    captured_at:  new Date().toISOString(),
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(attribution))
  } catch (_) { /* localStorage недоступен — silent fail */ }
})()

// Читает сохранённые данные атрибуции (используется при отправке заказа)
function getTrafficAttribution() {
  try {
    const raw = localStorage.getItem('bm_traffic_source')
    if (!raw) return { utm_source: 'direct', utm_medium: 'direct', utm_campaign: '', referrer: 'direct' }
    return JSON.parse(raw)
  } catch (_) {
    return { utm_source: 'direct', utm_medium: 'direct', utm_campaign: '', referrer: 'direct' }
  }
}

// ─── State ───────────────────────────────────────────────────
let allProducts      = []      // весь массив из API — никогда не мутируется
let filteredProducts = []      // активный срез для рендера (результат фильтрации)
let cart = JSON.parse(localStorage.getItem('bm_cart') || '[]')
let activeCategory = 'all'
let sortMode       = 'default'
let currentPage    = 1
const PAGE_SIZE    = 10

// ─── Nav burger ──────────────────────────────────────────────
const burger = document.getElementById('burger')
const mobileMenu = document.getElementById('mobileMenu')
burger?.addEventListener('click', () => {
  mobileMenu.classList.toggle('open')
  burger.classList.toggle('open')
})

const RELATED_API = 'https://ambersol.co.il/api/beautymania/related'

// ─── Cart open/close ─────────────────────────────────────────
const cartBtn     = document.getElementById('cartBtn')
const cartSidebar = document.getElementById('cartSidebar')
const cartOverlay = document.getElementById('cartOverlay')
const cartClose   = document.getElementById('cartClose')

function openCart()  {
  cartSidebar.classList.add('open')
  cartOverlay.classList.add('open')
  renderCrossSell()
}
function closeCart() { cartSidebar.classList.remove('open'); cartOverlay.classList.remove('open') }

cartBtn?.addEventListener('click', openCart)
cartClose?.addEventListener('click', closeCart)
cartOverlay?.addEventListener('click', closeCart)

// ─── Cart logic ──────────────────────────────────────────────
function saveCart() { localStorage.setItem('bm_cart', JSON.stringify(cart)) }

function addToCart(product, qty = 1) {
  const existing = cart.find(i => i.id === product.id)
  if (existing) existing.qty = Math.min(99, existing.qty + qty)
  else cart.push({ id: product.id, name: product.name, price: product.sell_price || 0, image_url: product.image_url || null, qty })
  saveCart()
  renderCart()
  updateBadge(true)
}

function updateCartQty(id, delta) {
  const item = cart.find(i => i.id === id)
  if (!item) return
  item.qty += delta
  if (item.qty <= 0) cart = cart.filter(i => i.id !== id)
  saveCart()
  renderCart()
  updateBadge(false)
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id)
  saveCart()
  renderCart()
  updateBadge(false)
}

function cartTotal() {
  return cart.reduce((s, i) => s + i.price * i.qty, 0)
}

function updateBadge(animate) {
  const badge = document.getElementById('cartBadge')
  const count = cart.reduce((s, i) => s + i.qty, 0)
  badge.textContent = count
  badge.style.display = count === 0 ? 'none' : 'flex'
  if (animate) { badge.classList.add('pop'); setTimeout(() => badge.classList.remove('pop'), 300) }
}

function renderCart() {
  const body      = document.getElementById('cartItems')
  const empty     = document.getElementById('cartEmpty')
  const totalEl   = document.getElementById('cartTotal')

  if (cart.length === 0) {
    empty.style.display = 'flex'
    body.innerHTML = ''
    totalEl.textContent = '₪0'
    return
  }
  empty.style.display = 'none'
  body.innerHTML = cart.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <div class="cart-item__img">
        ${item.image_url ? `<img src="${esc(item.image_url)}" alt="${esc(item.name)}" />` : '✦'}
      </div>
      <div class="cart-item__info">
        <p class="cart-item__name">${esc(item.name)}</p>
        <p class="cart-item__price">₪${(item.price * item.qty).toFixed(0)}</p>
        <div class="cart-item__ctrl">
          <button onclick="updateCartQty('${item.id}',-1)">−</button>
          <span>${item.qty}</span>
          <button onclick="updateCartQty('${item.id}',+1)">+</button>
        </div>
      </div>
      <button class="cart-item__remove" onclick="removeFromCart('${item.id}')">✕</button>
    </div>
  `).join('')
  totalEl.textContent = '₪' + cartTotal().toFixed(0)
}

// ─── Cross-sell block in cart ─────────────────────────────────
async function renderCrossSell() {
  const container = document.getElementById('crossSellBlock')
  if (!container) return

  if (cart.length === 0) { container.innerHTML = ''; return }

  const ids = cart.map(i => i.id).join(',')
  try {
    const res = await fetch(`${RELATED_API}?ids=${ids}`)
    if (!res.ok) throw new Error()
    const { products } = await res.json()
    if (!products || products.length === 0) { container.innerHTML = ''; return }

    container.innerHTML = `
      <div class="cross-sell">
        <p class="cross-sell__title">✦ С этим идеально сочетается</p>
        <div class="cross-sell__list">
          ${products.slice(0, 3).map(p => `
            <div class="cross-sell__item">
              <div class="cross-sell__img">
                ${p.image_url
                  ? `<img src="${esc(optimizeImg(p.image_url, 120))}" alt="${esc(p.name)}" loading="lazy" />`
                  : '<div class="cross-sell__placeholder">✦</div>'}
              </div>
              <div class="cross-sell__info">
                <p class="cross-sell__name">${esc(p.name)}</p>
                ${p.sell_price ? `<p class="cross-sell__price">₪${Number(p.sell_price).toFixed(0)}</p>` : ''}
              </div>
              <button class="cross-sell__btn" data-id="${p.id}" onclick="addRelatedToCart('${p.id}')">+</button>
            </div>
          `).join('')}
        </div>
      </div>`
  } catch {
    container.innerHTML = ''
  }
}

window.addRelatedToCart = function(id) {
  const product = allProducts.find(p => p.id === id)
  if (product) {
    addToCart(product, 1)
    renderCrossSell()
  }
}

// ─── Checkout ────────────────────────────────────────────────
const checkoutBtn     = document.getElementById('checkoutBtn')
const checkoutModal   = document.getElementById('checkoutModal')
const checkoutBackdrop = document.getElementById('checkoutBackdrop')
const checkoutClose   = document.getElementById('checkoutClose')

function openCheckout() {
  if (cart.length === 0) return
  closeCart()
  // populate summary
  const summary = document.getElementById('checkoutSummary')
  summary.innerHTML = cart.map(item => `
    <div class="checkout-summary__item">
      <span>${esc(item.name)} × ${item.qty}</span>
      <span>₪${(item.price * item.qty).toFixed(0)}</span>
    </div>
  `).join('') + `
    <div class="checkout-summary__total">
      <span>Итого</span>
      <span>₪${cartTotal().toFixed(0)}</span>
    </div>`
  checkoutModal.classList.add('open')
  document.getElementById('coSuccess').classList.remove('visible')
  document.getElementById('coError').classList.remove('visible')
}

function closeCheckout() { checkoutModal.classList.remove('open') }

checkoutBtn?.addEventListener('click', openCheckout)
checkoutBackdrop?.addEventListener('click', closeCheckout)
checkoutClose?.addEventListener('click', closeCheckout)

document.getElementById('checkoutForm')?.addEventListener('submit', async (e) => {
  e.preventDefault()
  const btn     = document.getElementById('coSubmitBtn')
  const success = document.getElementById('coSuccess')
  const error   = document.getElementById('coError')
  success.classList.remove('visible')
  error.classList.remove('visible')
  btn.textContent = 'Отправляю...'
  btn.disabled = true

  const name    = document.getElementById('coName').value.trim()
  const email   = document.getElementById('coEmail').value.trim()
  const phone   = document.getElementById('coPhone').value.trim()
  const message = document.getElementById('coMessage').value.trim()

  try {
    // Читаем данные атрибуции трафика из localStorage
    const attribution = getTrafficAttribution()

    // Отправляем каждый товар отдельным запросом
    await Promise.all(cart.map(item =>
      fetch(ORDER_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id:   item.id,
          product_name: item.name,
          quantity:     item.qty,
          name, email, phone,
          message: message + (cart.length > 1 ? `\n\n[Заказ на ${cart.length} товаров, итого ₪${cartTotal().toFixed(0)}]` : ''),
          // Traffic attribution
          utm_source:   attribution.utm_source   || 'direct',
          utm_medium:   attribution.utm_medium   || 'direct',
          utm_campaign: attribution.utm_campaign || '',
          referrer:     attribution.referrer     || 'direct',
        }),
      })
    ))
    success.classList.add('visible')
    cart = []
    saveCart()
    renderCart()
    updateBadge(false)
    document.getElementById('checkoutForm').reset()
    setTimeout(() => closeCheckout(), 4000)
  } catch {
    error.classList.add('visible')
  } finally {
    btn.textContent = 'Подтвердить заказ'
    btn.disabled = false
  }
})

// ─── Products ────────────────────────────────────────────────
async function loadProducts() {
  try {
    const res = await fetch(PRODUCTS_API)
    if (!res.ok) throw new Error()
    const { products } = await res.json()
    allProducts      = products || []
    filteredProducts = allProducts          // изначально = весь массив
    buildCategoryFilters()
    renderProducts(true)
    injectProductSchema(allProducts)
  } catch {
    document.getElementById('shopGrid').innerHTML =
      '<p class="shop-empty">Не удалось загрузить товары. Попробуйте позже.</p>'
  }
}

function buildCategoryFilters() {
  const cats = [...new Set(allProducts.map(p => p.category).filter(Boolean))]
  const bar  = document.getElementById('shopFilters')
  cats.forEach(cat => {
    const btn = document.createElement('button')
    btn.className  = 'filter-chip'
    btn.dataset.cat = cat
    btn.textContent = cat
    bar.appendChild(btn)
  })
  bar.addEventListener('click', e => {
    const chip = e.target.closest('.filter-chip')
    if (!chip) return
    bar.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'))
    chip.classList.add('active')
    activeCategory   = chip.dataset.cat
    filteredProducts = applyFilters()
    currentPage      = 1
    renderProducts(true)
  })
}

// Возвращает новый массив: категория + поиск + сортировка.
// Не мутирует allProducts. Вызывается перед каждым renderProducts(true).
function applyFilters() {
  const searchVal = document.getElementById('shopSearch')?.value.trim().toLowerCase() || ''
  let list = activeCategory === 'all'
    ? [...allProducts]
    : allProducts.filter(p => p.category === activeCategory)

  if (searchVal.length >= 2) {
    list = list.filter(p => p.name.toLowerCase().includes(searchVal))
  }

  if (sortMode === 'price_asc')  list.sort((a, b) => (a.sell_price || 0) - (b.sell_price || 0))
  if (sortMode === 'price_desc') list.sort((a, b) => (b.sell_price || 0) - (a.sell_price || 0))
  if (sortMode === 'name_asc')   list.sort((a, b) => a.name.localeCompare(b.name))

  return list
}

// clearContainer = true  → очищаем grid, рисуем срез с начала (поиск / фильтр / сортировка)
// clearContainer = false → дописываем следующую страницу в конец (кнопка "Загрузить ещё")
function renderProducts(clearContainer) {
  const grid        = document.getElementById('shopGrid')
  const loadMoreBtn = document.getElementById('loadMoreBtn')

  // Пустой результат — показываем заглушку
  if (filteredProducts.length === 0) {
    const searchVal = document.getElementById('shopSearch')?.value.trim() || ''
    grid.innerHTML  = searchVal.length >= 2
      ? `<p class="shop-empty">По запросу «${esc(searchVal)}» ничего не найдено</p>`
      : '<p class="shop-empty">Нет товаров в этой категории</p>'
    if (loadMoreBtn) loadMoreBtn.style.display = 'none'
    return
  }

  // Срез текущей страницы
  const start   = (currentPage - 1) * PAGE_SIZE
  const end     = currentPage * PAGE_SIZE
  const slice   = filteredProducts.slice(start, end)
  const hasMore = end < filteredProducts.length

  function cardHtml(p) {
    return `<div class="sp-card" data-id="${p.id}">
      <div class="sp-card__img">
        ${p.image_url
          ? `<img src="${esc(optimizeImg(p.image_url, 600))}" alt="${esc(p.name)}" loading="lazy" width="600" height="600" />`
          : '<div class="sp-card__placeholder">✦</div>'}
        ${p.category ? `<span class="sp-card__badge">${esc(p.category)}</span>` : ''}
      </div>
      <div class="sp-card__body">
        ${p.category ? `<p class="sp-card__cat">${esc(p.category)}</p>` : ''}
        <h3 class="sp-card__name">${esc(p.name)}</h3>
        ${p.description ? `<p class="sp-card__desc">${esc(p.description)}</p>` : '<div class="sp-card__desc"></div>'}
        <div class="sp-card__foot">
          ${p.sell_price ? `<span class="sp-card__price">₪${Number(p.sell_price).toFixed(0)}</span>` : '<span></span>'}
          <div class="sp-card__add">
            <div class="qty-ctrl">
              <button class="qty-ctrl__btn" data-action="minus" data-id="${p.id}">−</button>
              <span class="qty-ctrl__val" id="qty-${p.id}">1</span>
              <button class="qty-ctrl__btn" data-action="plus" data-id="${p.id}">+</button>
            </div>
            <button class="add-to-cart-btn" data-id="${p.id}">В корзину</button>
          </div>
        </div>
      </div>
    </div>`
  }

  if (clearContainer) {
    // Полная перерисовка — очищаем и вставляем срез страницы 1
    grid.innerHTML = slice.map(cardHtml).join('')
  } else {
    // Append — добавляем только новые карточки в конец
    const fragment = document.createDocumentFragment()
    slice.forEach(p => {
      const tmp = document.createElement('div')
      tmp.innerHTML = cardHtml(p)
      fragment.appendChild(tmp.firstElementChild)
    })
    grid.appendChild(fragment)
  }

  // Навешиваем обработчики только на новые карточки
  const newCards = clearContainer
    ? grid.querySelectorAll('.sp-card')
    : grid.querySelectorAll(`.sp-card:nth-child(n+${start + 1})`)

  newCards.forEach(card => {
    card.querySelectorAll('.qty-ctrl__btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation()
        const id  = btn.dataset.id
        const el  = document.getElementById(`qty-${id}`)
        let val   = parseInt(el.textContent) || 1
        val = btn.dataset.action === 'plus' ? Math.min(99, val + 1) : Math.max(1, val - 1)
        el.textContent = val
      })
    })
    card.querySelector('.add-to-cart-btn')?.addEventListener('click', e => {
      e.stopPropagation()
      const id      = e.currentTarget.dataset.id
      const product = allProducts.find(p => p.id === id)
      if (!product) return
      const qty = parseInt(document.getElementById(`qty-${id}`)?.textContent) || 1
      addToCart(product, qty)
      e.currentTarget.textContent = '✓ Добавлено'
      e.currentTarget.classList.add('added')
      setTimeout(() => {
        e.currentTarget.textContent = 'В корзину'
        e.currentTarget.classList.remove('added')
      }, 1500)
    })
  })

  if (loadMoreBtn) loadMoreBtn.style.display = hasMore ? 'block' : 'none'
}

// ─── Sort ─────────────────────────────────────────────────────
document.getElementById('sortSelect')?.addEventListener('change', e => {
  sortMode         = e.target.value
  filteredProducts = applyFilters()
  currentPage      = 1
  renderProducts(true)
})

// ─── Search — строго in-memory, нет fetch ─────────────────────
document.getElementById('shopSearch')?.addEventListener('input', e => {
  const val = e.target.value.trim()
  filteredProducts = val.length >= 2
    ? allProducts
        .filter(p => activeCategory === 'all' || p.category === activeCategory)
        .filter(p => p.name.toLowerCase().includes(val.toLowerCase()))
    : applyFilters()           // сброс поиска → только категория + сортировка
  currentPage = 1
  renderProducts(true)
})

// ─── Load more — append, не полный ре-рендер ─────────────────
document.getElementById('loadMoreBtn')?.addEventListener('click', () => {
  currentPage++
  renderProducts(false)
})

// ─── Init ─────────────────────────────────────────────────────
updateBadge(false)
renderCart()
loadProducts()

// ─── Helper ──────────────────────────────────────────────────
function esc(str) {
  if (!str) return ''
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;')
}

// ─── Image URL passthrough ────────────────────────────────────
// Supabase Image Transform (/render/image/) требует Pro Plan.
// Используем прямой /object/public/ URL без трансформаций.
function optimizeImg(url, _width = 600) {
  return url || ''
}

// ─── Product schema.org (JSON-LD) ────────────────────────────
function injectProductSchema(products) {
  const el = document.getElementById('products-schema')
  if (!el || !products.length) return

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'name': 'Магазин Beautymania',
    'url': `${SITE_URL}/shop`,
    'numberOfItems': products.length,
    'itemListElement': products.map((p, i) => ({
      '@type': 'ListItem',
      'position': i + 1,
      'item': {
        '@type': 'Product',
        '@id': `${SITE_URL}/shop#product-${p.id}`,
        'name': p.name,
        'description': p.description || undefined,
        'image': p.image_url ? optimizeImg(p.image_url, 800) : undefined,
        'sku': p.id,
        'brand': {
          '@type': 'Brand',
          'name': 'Beautymania'
        },
        'offers': {
          '@type': 'Offer',
          'url': `${SITE_URL}/shop#product-${p.id}`,
          'priceCurrency': 'ILS',
          'price': p.sell_price ? String(Number(p.sell_price).toFixed(2)) : '0',
          'availability': p.quantity > 0
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
          'seller': {
            '@type': 'Organization',
            'name': 'Beautymania'
          }
        }
      }
    }))
  }

  el.textContent = JSON.stringify(itemListSchema)
}
