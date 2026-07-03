# Чек-лист оптимизаций и анимаций — Модуль 3

## База данных

| Проверка | Статус | Комментарий |
|---|---|---|
| Индекс на movies.genre | ✅ | idx_movies_genre |
| Индекс на movies.title | ✅ | idx_movies_title |
| Индекс на subscriptions.user_id | ✅ | idx_subscriptions_user_id |
| Индекс на subscriptions.status | ✅ | idx_subscriptions_status |
| Constraint на status подписки | ✅ | chk_subscription_status |
| Constraint на payment_method | ✅ | chk_payment_method |
| Таблица логов subscription_logs | ✅ | Фиксирует смену статуса с автором |

## Интеграция фронтенд/бэкенд

| Проверка | Статус | Комментарий |
|---|---|---|
| Каталог фильмов подключён к API | ✅ | GET /api/movies |
| Фильтр по жанру работает | ✅ | GET /api/movies?genre=... |
| Поиск по названию работает | ✅ | GET /api/movies?search=... |
| Страница фильма подключена к API | ✅ | GET /api/movies/:id |
| Жанры загружаются из БД | ✅ | GET /api/genres |
| Активная подписка проверяется | ✅ | GET /api/user/subscription/active |
| Логирование смены статуса | ✅ | subscription_logs |

## Анимации и UX

| Проверка | Статус | Комментарий |
|---|---|---|
| Hover на карточках фильмов | ✅ | scale(1.03), transition 0.2s |
| Toast-уведомления | ✅ | fadeIn 0.3s, dashboard и admin |
| Плавное появление страниц | ✅ | fadeIn 0.3s, класс page-enter |
| Spinner загрузки | ✅ | каталог и страница фильма |
| Scale на нажатие кнопок | ✅ | button:active scale(0.97) |
| Плавный переход слайдера | ✅ | opacity 0.6s ease |
| Анимация точек слайдера | ✅ | width transition 0.3s |
| Hover на кнопке плеера | ✅ | scale + цвет |
| prefers-reduced-motion | ✅ | отключает все анимации |

## Адаптивность

| Проверка | Статус | Комментарий |
|---|---|---|
| Главная 390px | ✅ | слайдер вертикальный layout |
| Каталог 390px | ✅ | grid auto-fill minmax(160px) |
| Страница фильма 390px | ✅ | flexWrap, постер и текст стекируются |
| Login/Register 390px | ✅ | одна колонка, card на всю ширину |
| Dashboard 390px | ✅ | таблица с overflow:auto |
| Admin 390px | ✅ | таблица с overflow:auto |
| Навбар 390px | ✅ | скрыт пункт Каталог |

## Производительность (Lighthouse, production build)

| Метрика | До | После |
|---|---|---|
| Performance | 60 | 94 |
| Accessibility | 89 | 95 |
| Best Practices | 100 | 100 |
| SEO | 100 | 100 |
| LCP | 6.2s | 3.0s |
| CLS | 0.348 | 0 |
| TBT | 70ms | 40ms |