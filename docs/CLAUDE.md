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
- **Org ID Beautymania:** через env `BEAUTYMANIA_ORG_ID` в Vercel Trinity
- **User ID Анеты:** через env `BEAUTYMANIA_USER_ID` в Vercel Trinity
- **Email Анеты:** через env `BEAUTYMANIA_EMAIL`

---

## 4. Структура проекта

```
bm_site/
├── index.html              # Главная страница
├── shop-section.html       # Секция магазина (фрагмент)
├── vercel.json             # Конфигурация Vercel + security headers
├── .gitignore              # do_commit.bat исключён из git
├── do_commit.bat           # Локальный скрипт деплоя (НЕ в git)
├── css/
│   ├── style.css           # Основные стили сайта
│   ├── shop.css            # Стили страницы магазина + cross-sell
│   └── shop-modal.css      # Стили модального окна чекаута
├── js/
│   └── main.js             # Основная логика: контакт-форма, загрузка товаров
├── shop/
│   ├── index.html          # Страница магазина (+ Product schema.org JSON-LD)
│   ├── shop.css            # Дополнительные стили магазина
│   └── shop.js             # Логика: корзина, фильтры, schema.org, cross-sell
└── media/
    ├── img/                # Фото галереи
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
- Shop preview: 4 рандомных товара с главной (WebP через Supabase Transform)
- Contact: форма → Trinity API

---

## 6. API-интеграция с Trinity CRM

### Эндпоинты

| Метод | URL | Описание |
|-------|-----|----------|
| GET | `/api/beautymania/products` | Получить активные товары со склада |
| POST | `/api/beautymania/contact` | Отправить контактную форму |
| POST | `/api/beautymania/order` | Оформить заказ из корзины |
| GET | `/api/beautymania/related?ids=uuid1,uuid2` | Cross-sell товары для корзины |

### GET /api/beautymania/products
- Возвращает только активные товары (`is_active=true`, `quantity>0`) организации Beautymania
- Поля: `id, name, description, sell_price, image_url, category, quantity, unit`
- Кэш: `public, s-maxage=60, stale-while-revalidate=300`
- Инвалидация: webhook `/api/webhooks/products-updated` при изменении товара в Trinity

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

### GET /api/beautymania/related?ids=uuid1,uuid2
- Принимает список UUID товаров из корзины (до 10)
- Возвращает до 6 cross-sell товаров из таблицы `product_relations`
- Исключает товары уже в корзине
- Кэш: `public, s-maxage=60`

---

## 7. Оптимизация изображений (Supabase Transform)

Все изображения товаров автоматически конвертируются в WebP через Supabase Image Transformation.

### Функция `optimizeImg(url, width)`
```javascript
const SUPABASE_URL = 'https://tjryzcqvsavtllahjyrj.supabase.co/storage/v1/render/image/public'

function optimizeImg(url, width = 600) {
  if (!url || !url.includes('supabase.co/storage/v1/object/public')) return url
  const path = url.split('/storage/v1/object/public')[1]
  return `${SUPABASE_URL}${path}?width=${width}&quality=80&format=webp`
}
```

### Размеры по контексту
| Контекст | Width | Формат |
|----------|-------|--------|
| Карточки магазина | 600px | WebP 80% |
| Превью на главной | 400px | WebP 80% |
| Cross-sell миниатюры | 120px | WebP 80% |
| Product schema.org | 800px | WebP 80% |

**Fallback:** если URL не является Supabase Storage URL — возвращается оригинал без изменений.

---

## 8. SEO

### shop/index.html
- `og:title`, `og:description`, `og:url`, `og:type`
- `<link rel="canonical">`
- `<meta name="robots" content="index, follow">`

### Product schema.org (JSON-LD)
После загрузки товаров функция `injectProductSchema(products)` генерирует структурированные данные:

```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "itemListElement": [{
    "@type": "ListItem",
    "item": {
      "@type": "Product",
      "offers": {
        "@type": "Offer",
        "priceCurrency": "ILS",
        "price": "...",
        "availability": "https://schema.org/InStock"
      }
    }
  }]
}
```

- `availability` — динамически `InStock` / `OutOfStock` по реальному `quantity`
- Вставляется в `<script id="products-schema" type="application/ld+json">` после загрузки
- Даёт Google карточку товара в поиске с ценой и наличием

---

## 9. Cross-sell система

### Архитектура
- **БД:** таблица `product_relations` в Trinity Supabase
- **API:** `GET /api/beautymania/related?ids=...`
- **UI:** блок в корзине при открытии

### Таблица product_relations
```sql
id uuid, org_id uuid, product_id uuid, related_id uuid,
relation_type text CHECK IN ('cross_sell', 'upsell', 'bundle'),
UNIQUE(org_id, product_id, related_id, relation_type)
```
RLS: члены орга читают, owner/admin управляют.

### Управление связями (Trinity CRM)
**Путь:** `/inventory` → клик на товар → секция "Сопутствующие товары"

Компонент `ProductRelationsManager`:
- Кнопка "Добавить" → dropdown-picker со всеми товарами орга
- Поиск по имени и категории внутри picker
- Выбранные товары отображаются как синие чипы
- Кнопка "Сохранить изменения" появляется только при наличии несохранённых правок
- Сохранение: DELETE старых + INSERT новых (транзакционно)
- Оптимистичный UI — откат при ошибке

### Блок в корзине (shop.js)
- Открывается при каждом `openCart()`
- `fetch('/api/beautymania/related?ids=...')` с ID товаров из корзины
- Показывает до 3 товаров: миниатюра + имя + цена + кнопка `+`
- Клик `+` → `addRelatedToCart(id)` → товар добавляется в корзину + перезагрузка блока
- При пустом ответе — блок скрыт

---

## 10. Логика JS (js/main.js)

### Константы
```javascript
const TRINITY_API   = 'https://ambersol.co.il/api/beautymania/contact'
const PRODUCTS_API  = 'https://ambersol.co.il/api/beautymania/products'
const SITE_URL      = 'https://beautymania.co.il'
const SUPABASE_IMG  = 'https://tjryzcqvsavtllahjyrj.supabase.co/storage/v1/render/image/public'
```

### Модули
1. **Nav scroll** — класс `.scrolled` при прокрутке
2. **Burger menu** — мобильное меню
3. **Active nav link** — подсветка при скролле
4. **Scroll reveal** — IntersectionObserver
5. **Hero video** — чередование двух клипов
6. **3D Tilt Card** — mouse parallax на `#tiltCard`
7. **Gallery** — бесконечный loop + drag + touch + lightbox
8. **Shop preview** — 4 рандомных товара с WebP-оптимизацией (400px)
9. **Contact form** — POST на `TRINITY_API`

---

## 11. Логика JS (shop/shop.js)

### Константы
```javascript
const PRODUCTS_API  = 'https://ambersol.co.il/api/beautymania/products'
const ORDER_API     = 'https://ambersol.co.il/api/beautymania/order'
const RELATED_API   = 'https://ambersol.co.il/api/beautymania/related'
const SITE_URL      = 'https://beautymania.co.il'
const SUPABASE_URL  = 'https://tjryzcqvsavtllahjyrj.supabase.co/storage/v1/render/image/public'
```

### State
- `allProducts` — все товары из API
- `cart` — корзина в `localStorage('bm_cart')`
- `activeCategory` — активный фильтр
- `sortMode` — режим сортировки

### Модули
1. **Корзина** — add/update/remove/save/render
2. **Badge** — счётчик с pop-анимацией
3. **Cart sidebar** — открытие/закрытие
4. **Cross-sell** — `renderCrossSell()` при каждом `openCart()`
5. **Checkout modal** — форма + summary + POST на ORDER_API
6. **Products grid** — загрузка + фильтрация + сортировка
7. **Category filters** — динамические кнопки
8. **Qty controls** — инкремент/декремент
9. **Product schema.org** — `injectProductSchema(allProducts)` после загрузки
10. **Image optimization** — `optimizeImg(url, width)` везде где `<img>`

### Checkout flow
1. Клиент → "В корзину" → товар в `cart`
2. Открывает корзину → cross-sell блок подгружается
3. "Оформить заказ" → модал с формой
4. Заполняет имя/email/телефон → отправка
5. Каждый товар → отдельный `POST /api/beautymania/order`
6. Успех: корзина очищается, модал закрывается

---

## 12. Безопасность

### CORS (Trinity side)
```
https://beautymania.co.il
https://www.beautymania.co.il
https://bm-site-eight.vercel.app
http://localhost:3000
http://127.0.0.1:5500 / http://localhost:5500
```
Wildcard `*.vercel.app` убран — любой Vercel проект не может слать запросы.

### Security Headers (vercel.json)
- `Content-Security-Policy` — script/style/img/connect ограничены
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` — camera/microphone/geolocation отключены

### Tenant Isolation
- `org_id` Beautymania захардкожен в env vars Trinity (не приходит с клиента)
- Цена берётся из БД, не с клиента
- `product_name` берётся из БД, не с клиента
- Все `related_ids` в cross-sell API проверяются на принадлежность оргу

### Rate Limiting + Idempotency
- Все публичные API защищены `ratelimitPublic` по IP
- `idx_site_orders_idempotent` — двойной клик не создаст два заказа

---

## 13. Поток заказа (полный пайплайн)

```
Клиент на beautymania.co.il
    ↓ POST /api/beautymania/order
Trinity API
    ↓ Проверка product (org_id + is_active + quantity)
    ↓ Optimistic lock: quantity -= N
    ↓ INSERT site_orders
    ↓ INSERT notifications (для Анеты)
    ↓ [fire-and-forget] WhatsApp клиенту
    ↓ [fire-and-forget] WhatsApp Анете (если notify_new_orders_wa=true)
    ↓ Email Анете (Resend)
    ↓ Supabase Realtime → SiteOrdersRealtimeProvider в Trinity
        → Toast + звук в браузере Анеты
```

---

## 14. Управление заказами в Trinity CRM

**Путь:** `/sales` → вкладка "Заказы с сайта" (`SiteOrdersPanel`)

### Статусы заказа
| Статус | Кнопка в UI | WA клиенту |
|--------|-------------|-----------|
| `new` | → Подтвердить | При создании: "✅ Заказ принят!" |
| `confirmed` | → Отправлен | "✅ Заказ подтверждён, готовится к отправке" |
| `shipped` | → Доставлен | "📦 Заказ в пути, ожидайте 1-3 дня" |
| `delivered` | — | "🎉 Заказ доставлен!" |
| `cancelled` | Всегда видна | "❌ Заказ отменён" + возврат товара на склад |

Параметр `send_wa: false` в PATCH-запросе отключает WA при нужде.

---

## 15. Настройки уведомлений (Trinity)

**Путь:** `/settings/notifications` → карточка "WhatsApp-алерты"

| Поле в organizations | Тип | По умолчанию | Описание |
|---------------------|-----|-------------|----------|
| `notify_new_orders_wa` | boolean | false | Включить WA-алерт при новом заказе |
| `notification_phone` | text | null | Телефон для получения алертов |

**Формат сообщения:**
```
🔔 Новый заказ с сайта!
Товар: [Название]
Сумма: ₪[Сумма]
Клиент: [Имя]
Перейдите в CRM для обработки.
```

### In-App уведомления (Realtime)
- `SiteOrdersRealtimeProvider` — подписка через Supabase Realtime на INSERT в `site_orders`
- При событии: звук `/sounds/notification.wav` (880+1100Hz) + кастомный Toast
- Toast: оранжевая рамка, имя/товар/сумма, кнопка "Перейти к заказу" → `/sales`
- Инвалидация React Query `site-orders` и `new-orders-count`
- Защита от дублей при React StrictMode через глобальный флаг `channelCreated`

---

## 16. Webhook инвалидации кэша товаров

**URL:** `POST https://ambersol.co.il/api/webhooks/products-updated`

Настройка в Supabase Dashboard → Database Webhooks:
- Table: `products`
- Events: INSERT, UPDATE, DELETE
- Header: `x-webhook-signature: <PRODUCTS_WEBHOOK_SECRET>`

При изменении товара в Trinity → `revalidatePath('/api/beautymania/products')` → сайт видит актуальные данные сразу (не через 60 сек кэша).

---

## 17. Workflow деплоя

```bash
git add -A
git commit -m "feat/fix: описание"
git push origin main
# → Vercel деплоит статику автоматически, без билда
```

bm_site — чистый статичный HTML. Нет npm, нет билда. Vercel отдаёт файлы напрямую.

---

## 18. История изменений

### 02.04.2026

**Commit b274c82 (bm-site)** — SEO + Image optimization + Cross-sell frontend
- `shop/index.html` — og-теги, canonical, robots
- `shop/shop.js` — `injectProductSchema()` генерирует `ItemList+Product+Offer` JSON-LD
- `shop/shop.js` — `optimizeImg()` через Supabase Transform (WebP, width, quality=80)
- `main.js` — `optimizeImgMain()` для превью на главной (400px WebP)
- `shop/shop.js` — cross-sell блок в корзине (`renderCrossSell()`)
- `shop/shop.css` — стили `.cross-sell` секции

**Commit 04902e9 (trinity)** — Cross-sell backend
- `api/beautymania/related/route.ts` — GET /api/beautymania/related?ids=...
- Суп. миграция `add_product_relations` — таблица `product_relations` с RLS

**Commit b007501 (trinity)** — Cross-sell UI в Trinity
- `ProductRelationsManager.tsx` — компонент управления связями
- `api/products/[id]/relations/route.ts` — GET/PUT эндпоинты
- `ProductDetailSheet.tsx` — секция "Сопутствующие товары" встроена

### 01.04.2026

**Commit ab0929a (bm-site)** — Security headers в vercel.json

**Commit a299f01 (trinity)** — CORS fix, product_name из БД, env vars

**Commit 95e17ea (trinity)** — Stock decrement, WA клиенту, статусы заказа

**Commit 21b08ab (trinity)** — Полный UI цикла заказов, webhook products-updated

**Commit 1fcf368 (trinity)** — WA-алерт владельцу, Realtime toast+звук, настройки уведомлений

---

## 19. Контакты и доступы

| Ресурс | Данные |
|--------|--------|
| GitHub bm-site | github.com/Creepie132/bm-site |
| GitHub Trinity | github.com/Creepie132/trinity |
| Live сайт | https://beautymania.co.il |
| Trinity CRM | https://ambersol.co.il |
| Trinity docs | F:\Amber_solutions_Kira\Trinity\docs\CLAUDE.md |
| Supabase Trinity | app.supabase.com/project/tjryzcqvsavtllahjyrj |
| Клиент | Анета (Beautymania) |
