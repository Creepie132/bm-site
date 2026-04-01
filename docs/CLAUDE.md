# Beautymania — Документация проекта

> Последнее обновление: 02.04.2026
> Ведётся Claude (Amber Solutions). После каждых изменений — обновлять этот файл.

---

## 1. Обзор проекта

**Сайт:** https://beautymania.co.il
**Клиент:** Анета (Beautymania) — салон красоты
**Назначение:** Публичный сайт-витрина с магазином, интегрированный с Trinity CRM
**Разработчик:** Amber Solutions (ambersol.co.il)
**Архитектура:** Статичный HTML/CSS/JS фронтенд + Trinity CRM как бэкенд (через API)

---

## 2. Технический стек

| Компонент | Технология |
|-----------|-----------|
| Frontend | Vanilla HTML5 + CSS3 + JavaScript (ES2020) |
| Стили | CSS (style.css + shop.css + shop-modal.css) |
| Деплой | Vercel (Static) |
| Репозиторий | github.com/Creepie132/bm-site |
| Локальный путь | F:\Amber_solutions_Kira\bm_site |
| Backend (API) | Trinity CRM — https://ambersol.co.il/api/beautymania/* |

---

## 3. Конфигурация инфраструктуры

### Vercel
- **Репозиторий:** Creepie132/bm-site
- **Production URL:** beautymania.co.il / www.beautymania.co.il
- **Деплой:** push в `main` → автодеплой
- **Тип:** Static Site (cleanUrls: true, trailingSlash: false)

### Trinity CRM (бэкенд)
- **Supabase Project ID (Trinity):** tjryzcqvsavtllahjyrj
- **Org ID Beautymania:** 1e77c781-3848-4b16-a623-693de123c6bc (в env Vercel Trinity)
- **User ID Анеты:** 0be0d9ad-d88e-4e7f-aee2-d2b171e03c58 (в env Vercel Trinity)
- **Email Анеты:** через env BEAUTYMANIA_EMAIL

---

## 4. Структура проекта

```
bm_site/
├── index.html              # Главная страница
├── shop-section.html       # Секция магазина (фрагмент, не страница)
├── vercel.json             # Конфигурация Vercel + security headers
├── .gitignore              # do_commit.bat исключён из git
├── do_commit.bat           # Локальный скрипт деплоя (НЕ в git)
├── css/
│   ├── style.css           # Основные стили сайта
│   ├── shop.css            # Стили страницы магазина
│   └── shop-modal.css      # Стили модального окна чекаута
├── js/
│   └── main.js             # Основная логика: контакт-форма, загрузка товаров
├── shop/
│   ├── index.html          # Страница магазина
│   ├── shop.css            # Дополнительные стили магазина
│   └── shop.js             # Логика: корзина, фильтры, сортировка, чекаут
└── media/
    ├── img/                # Фото галереи (about.jpg, about2.jpg, IMG-*.jpg)
    ├── logo/               # Logo_Bm_Trans.png
    └── vid/                # landvid.MP4, landvid2.MP4 (hero видео)
```

---

## 5. Дизайн и UI

**Цветовая палитра:**
- Фон: `#0a0a0a` (почти чёрный)
- Текст: `#faf6ef` (кремовый)
- Акцент: `#c9a84c` (золото)
- Второй акцент: `#8a6b28` (тёмное золото)
- Разделители: `#1e1e1e`, `#222`

**Типографика:**
- Заголовки: Cormorant Garamond (Google Fonts, serif)
- Текст: Montserrat (Google Fonts, sans-serif)

**Компоненты:**
- Hero: fullscreen видео с двумя клипами (чередование через JS)
- About: 3D tilt-карточка с mouse parallax (max 14°)
- Gallery: infinite loop drag-scroll с lightbox
- Blog: карточки с reveal-анимацией при скролле
- Shop preview: 4 рандомных товара с главной
- Contact: форма → Trinity API

---

## 6. API-интеграция с Trinity CRM

### Эндпоинты

| Метод | URL | Описание |
|-------|-----|----------|
| GET | `/api/beautymania/products` | Получить активные товары со склада |
| POST | `/api/beautymania/contact` | Отправить контактную форму |
| POST | `/api/beautymania/order` | Оформить заказ из корзины |

### GET /api/beautymania/products
- Возвращает только активные товары (`is_active=true`, `quantity>0`) организации Beautymania
- Поля: `id, name, description, sell_price, image_url, category, quantity, unit`
- Кэш: `public, s-maxage=60, stale-while-revalidate=300`
- Инвалидация кэша: через webhook `/api/webhooks/products-updated` при изменении товара в Trinity

### POST /api/beautymania/contact
- Body: `{ name, email, subject?, message }`
- Zod-валидация на сервере
- Отправляет email Анете через Resend
- Rate limit: `ratelimitPublic` по IP

### POST /api/beautymania/order
- Body: `{ product_id (UUID), quantity, name, email, phone?, message? }`
- **Сервер берёт product_name из БД** — клиент не может подменить
- Списывает товар со склада (optimistic lock по quantity)
- Создаёт `site_order` в Trinity
- Создаёт уведомление Анете в Trinity
- Отправляет WhatsApp клиенту (подтверждение заказа)
- Отправляет WhatsApp Анете (алерт, если включён `notify_new_orders_wa`)
- Отправляет email Анете через Resend
- Rate limit: `ratelimitPublic` по IP

---

## 7. Логика JS (js/main.js)

### Константы
```javascript
const TRINITY_API   = 'https://ambersol.co.il/api/beautymania/contact'
const PRODUCTS_API  = 'https://ambersol.co.il/api/beautymania/products'
```

### Модули
1. **Nav scroll** — класс `.scrolled` на `#nav` при прокрутке
2. **Burger menu** — открытие/закрытие мобильного меню
3. **Active nav link** — подсветка активной секции при скролле
4. **Scroll reveal** — IntersectionObserver для `.reveal` элементов
5. **Hero video** — чередование двух клипов при окончании
6. **3D Tilt Card** — mouse parallax на `#tiltCard`
7. **Gallery** — бесконечный loop + drag + touch + lightbox
8. **Shop preview** — загрузка 4 рандомных товаров с `PRODUCTS_API`
9. **Contact form** — POST на `TRINITY_API`, показ success/error

### Хелпер `escStr(str)`
HTML-экранирование для безопасного рендеринга данных из API:
`&` → `&amp;`, `<` → `&lt;`, `>` → `&gt;`, `"` → `&quot;`, `'` → `&#039;`

---

## 8. Логика JS (shop/shop.js)

### Константы
```javascript
const PRODUCTS_API = 'https://ambersol.co.il/api/beautymania/products'
const ORDER_API    = 'https://ambersol.co.il/api/beautymania/order'
```

### State
- `allProducts` — все товары загруженные из API
- `cart` — корзина, хранится в `localStorage('bm_cart')`
- `activeCategory` — активный фильтр категории
- `sortMode` — режим сортировки (`default | price_asc | price_desc | name_asc`)

### Модули
1. **Корзина** — `addToCart`, `updateCartQty`, `removeFromCart`, `saveCart`, `renderCart`
2. **Badge** — счётчик на иконке корзины с pop-анимацией
3. **Cart sidebar** — открытие/закрытие через overlay
4. **Checkout modal** — форма с summary, POST на `ORDER_API`
5. **Products grid** — загрузка, фильтрация, сортировка
6. **Category filters** — динамические кнопки из уникальных категорий товаров
7. **Qty controls** — инкремент/декремент количества на карточке товара

### Checkout flow
1. Клиент кликает "В корзину" → товар в `cart`
2. Открывает корзину → видит summary с итогом
3. Кликает "Оформить заказ" → открывается модал с формой
4. Заполняет имя/email/телефон → отправка
5. Каждый товар отправляется отдельным `POST /api/beautymania/order`
6. При успехе: корзина очищается, форма сбрасывается, модал закрывается

---

## 9. Безопасность

### CORS (Trinity side)
Разрешённые origins для beautymania API:
```
https://beautymania.co.il
https://www.beautymania.co.il
https://bm-site-eight.vercel.app  (Vercel preview)
http://localhost:3000
http://127.0.0.1:5500
http://localhost:5500
```
**Важно:** wildcard `*.vercel.app` был убран — закрыта дыра (любой Vercel мог слать запросы).

### Security Headers (vercel.json)
- `Content-Security-Policy` — script/style/img/connect ограничены
- `X-Frame-Options: DENY` — запрет iframe embedding
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` — camera/microphone/geolocation отключены

### Tenant Isolation
- `org_id` Beautymania захардкожен на сервере Trinity (env vars)
- Клиент физически не может передать чужой org_id
- Цена товара берётся из БД, не с клиента

### Rate Limiting
- Все три API-роута защищены `ratelimitPublic` по IP

### Idempotency
- Уникальный индекс `idx_site_orders_idempotent` на `(org_id, customer_email, product_id, order_date)`
- Двойной клик не создаст два заказа — второй упадёт с 409

---

## 10. Поток заказа (полный пайплайн)

```
Клиент на beautymania.co.il
    ↓ POST /api/beautymania/order
Trinity API (ambersol.co.il)
    ↓ Проверка product в БД (org_id + is_active + quantity)
    ↓ Optimistic lock: quantity = quantity - N
    ↓ INSERT site_orders
    ↓ INSERT notifications (для Анеты в Trinity)
    ↓ [fire-and-forget] WhatsApp клиенту (Whapi Cloud)
    ↓ [fire-and-forget] WhatsApp Анете (если notify_new_orders_wa=true)
    ↓ Email Анете (Resend)
    ↓ Supabase Realtime → SiteOrdersRealtimeProvider в Trinity
        → Toast + звук в браузере Анеты
```

---

## 11. Управление заказами в Trinity CRM

После того как заказ создан через сайт, Анета управляет им в Trinity:

**Путь:** `/sales` → вкладка "Заказы с сайта" (`SiteOrdersPanel`)

### Статусы заказа
| Статус | Описание | WA клиенту |
|--------|----------|-----------|
| `new` | Новый заказ с сайта | При создании: "Заказ принят!" |
| `confirmed` | Подтверждён | "✅ Заказ подтверждён, готовится к отправке" |
| `shipped` | Отправлен | "📦 Заказ в пути, ожидайте 1-3 дня" |
| `delivered` | Доставлен | "🎉 Заказ доставлен! Надеемся, понравится" |
| `cancelled` | Отменён | "❌ Заказ отменён" + товар возвращается на склад |

### Что происходит при отмене
- `site_orders.status = 'cancelled'`
- RPC `increment_product_quantity` возвращает товар на склад
- WhatsApp сообщение клиенту об отмене

---

## 12. Настройки уведомлений (Trinity)

**Путь:** `/settings/notifications` → карточка "WhatsApp-алерты"

| Поле в organizations | Тип | Описание |
|---------------------|-----|----------|
| `notify_new_orders_wa` | boolean | Включить WA-алерт при новом заказе |
| `notification_phone` | text | Телефон для получения алертов |

**Формат сообщения владельцу:**
```
🔔 Новый заказ с сайта!
Товар: [Название]
Сумма: ₪[Сумма]
Клиент: [Имя]
Перейдите в CRM для обработки.
```

### In-App уведомления (Realtime)
- `SiteOrdersRealtimeProvider` — подписка через Supabase Realtime
- При новом `site_order` → звук `/sounds/notification.wav` + Toast
- Toast: оранжевая рамка, имя/товар/сумма, кнопка "Перейти к заказу"

---

## 13. Webhook инвалидации кэша

**URL:** `POST https://ambersol.co.il/api/webhooks/products-updated`

Настройка в Supabase Dashboard → Database Webhooks:
- Table: `products`
- Events: INSERT, UPDATE, DELETE
- Header: `x-webhook-signature: <PRODUCTS_WEBHOOK_SECRET>`

При изменении товара в Trinity → кэш `/api/beautymania/products` сбрасывается → сайт показывает актуальные данные сразу (не через 60 сек).

---

## 14. Workflow деплоя

```bash
# Локально — просто пушим main
git add -A
git commit -m "feat/fix: описание"
git push origin main
# → Vercel автоматически задеплоит static сайт
```

**Важно:** bm_site — статичный HTML, нет билда, нет npm. Vercel просто отдаёт файлы как есть с заголовками из vercel.json.

---

## 15. История изменений

### 01.04.2026 — Security Audit

**Commit ab0929a** — `vercel.json` security headers
- Добавлены: CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy

### 01.04.2026 — Trinity API security fixes (в Trinity repo)

**Commit a299f01** — CORS + product_name + env vars
- CORS: убран wildcard `*.vercel.app` из `contact/route.ts` и `order/route.ts`
- `product_name` теперь берётся из БД (не с клиента)
- Добавлена проверка остатка склада (`quantity < requested → 409`)
- `BM_ORG_ID`, `ANETA_USER_ID`, `ANETA_EMAIL` вынесены в env vars

### 01.04.2026 — Order pipeline + WhatsApp (в Trinity repo)

**Commit 95e17ea** — Stock decrement + WA notifications
- Списание товара со склада при заказе (optimistic lock)
- WhatsApp клиенту при создании заказа
- WhatsApp клиенту при смене статуса (4 шаблона)
- Возврат товара на склад при отмене
- Новые статусы: confirmed / shipped / delivered

**Commit 21b08ab** — UI полный цикл + webhook
- `SiteOrdersPanel` — новые статусы в фильтрах
- `OrderDetailModal` — кнопки смены статуса
- `webhooks/products-updated` — инвалидация кэша
- Idempotency index в БД

**Commit 1fcf368** — Notification system
- WA-алерт владельцу (fire-and-forget, 8сек таймаут)
- `notify_new_orders_wa` + `notification_phone` в organizations
- UI настроек в `/settings/notifications`
- `SiteOrdersRealtimeProvider` — Realtime toast + звук

---

## 16. Контакты и доступы

| Ресурс | Данные |
|--------|--------|
| GitHub | github.com/Creepie132/bm-site |
| Live сайт | https://beautymania.co.il |
| Trinity CRM | https://ambersol.co.il |
| Trinity API docs | F:\Amber_solutions_Kira\Trinity\docs\CLAUDE.md |
| Клиент | Анета (Beautymania) |
