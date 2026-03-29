// ─── Config ──────────────────────────────────────────────────
const PRODUCTS_API = 'https://ambersol.co.il/api/beautymania/products'
const ORDER_API    = 'https://ambersol.co.il/api/beautymania/order'

// ─── State ───────────────────────────────────────────────────
let allProducts = []
let cart = JSON.parse(localStorage.getItem('bm_cart') || '[]')
let activeCategory = 'all'
let sortMode = 'default'

// ─── Nav burger ──────────────────────────────────────────────
const burger = document.getElementById('burger')
const mobileMenu = document.getElementById('mobileMenu')
burger?.addEventListener('click', () => {
  mobileMenu.classList.toggle('open')
  burger.classList.toggle('open')
})

// ─── Cart open/close ─────────────────────────────────────────
const cartBtn     = document.getElementById('cartBtn')
const cartSidebar = document.getElementById('cartSidebar')
const cartOverlay = document.getElementById('cartOverlay')
const cartClose   = document.getElementById('cartClose')

function openCart()  { cartSidebar.classList.add('open'); cartOverlay.classList.add('open') }
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
  const grid = document.getElementById('shopGrid')
  try {
    const res = await fetch(PRODUCTS_API)
    if (!res.ok) throw new Error()
    const { products } = await res.json()
    allProducts = products || []
    buildCategoryFilters()
    renderProducts()
  } catch {
    document.getElementById('shopGrid').innerHTML =
      '<p class="shop-empty">Не удалось загрузить товары. Попробуйте позже.</p>'
  }
}

function buildCategoryFilters() {
  const cats = [...new Set(allProducts.map(p => p.category).filter(Boolean))]
  const bar  = document.getElementById('shopFilters')
  const all  = bar.querySelector('[data-cat="all"]')
  cats.forEach(cat => {
    const btn = document.createElement('button')
    btn.className = 'filter-chip'
    btn.dataset.cat = cat
    btn.textContent = cat
    bar.appendChild(btn)
  })
  bar.addEventListener('click', e => {
    const chip = e.target.closest('.filter-chip')
    if (!chip) return
    bar.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'))
    chip.classList.add('active')
    activeCategory = chip.dataset.cat
    renderProducts()
  })
}

function sortedFiltered() {
  let list = activeCategory === 'all' ? [...allProducts] : allProducts.filter(p => p.category === activeCategory)
  if (sortMode === 'price_asc')  list.sort((a,b) => (a.sell_price||0) - (b.sell_price||0))
  if (sortMode === 'price_desc') list.sort((a,b) => (b.sell_price||0) - (a.sell_price||0))
  if (sortMode === 'name_asc')   list.sort((a,b) => a.name.localeCompare(b.name))
  return list
}

function renderProducts() {
  const grid = document.getElementById('shopGrid')
  const list = sortedFiltered()
  if (list.length === 0) {
    grid.innerHTML = '<p class="shop-empty">Нет товаров в этой категории</p>'
    return
  }
  grid.innerHTML = list.map(p => {
    const qty = 1
    return `
    <div class="sp-card" data-id="${p.id}">
      <div class="sp-card__img">
        ${p.image_url
          ? `<img src="${esc(p.image_url)}" alt="${esc(p.name)}" loading="lazy" />`
          : `<div class="sp-card__placeholder">✦</div>`}
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
  }).join('')

  // qty controls
  grid.querySelectorAll('.qty-ctrl__btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation()
      const id  = btn.dataset.id
      const el  = document.getElementById(`qty-${id}`)
      let val = parseInt(el.textContent) || 1
      if (btn.dataset.action === 'plus')  val = Math.min(99, val + 1)
      if (btn.dataset.action === 'minus') val = Math.max(1, val - 1)
      el.textContent = val
    })
  })

  // add to cart
  grid.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation()
      const id = btn.dataset.id
      const product = allProducts.find(p => p.id === id)
      if (!product) return
      const qty = parseInt(document.getElementById(`qty-${id}`)?.textContent) || 1
      addToCart(product, qty)
      btn.textContent = '✓ Добавлено'
      btn.classList.add('added')
      setTimeout(() => {
        btn.textContent = 'В корзину'
        btn.classList.remove('added')
      }, 1500)
    })
  })
}

// Sort
document.getElementById('sortSelect')?.addEventListener('change', e => {
  sortMode = e.target.value
  renderProducts()
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
