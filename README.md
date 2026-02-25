
### Что нужно

- Node.js (рекомендуется LTS)
- Docker Desktop (для PostgreSQL)

### Быстрый старт

В папке `teccode_ru/`:

```bash
npm install
docker compose up -d db
npx prisma migrate dev
npm run dev:full
```

- Фронт: Vite поднимется на `http://localhost:5173/` 
- API: сервер по умолчанию на `http://localhost:3002/`.

=======
# TechCode RU

Корпоративный веб-сайт компании TechCode — каталог программных модулей с документацией и админ-панелью для управления контентом.

## Стек технологий

| Часть       | Технологии                                        |
| ----------- | ------------------------------------------------- |
| Frontend    | Vue 3, TypeScript, Pinia, Vue Router, SCSS        |
| Backend     | Express.js, Node 22                               |
| Сборка      | Vite 5                                            |
| Деплой      | Firebase Hosting                                  |
| База данных | JSON-файл (`server/data/db.json`)                 |

## Быстрый старт

### Требования

- Node.js 22+
- npm

### Установка

```bash
git clone https://github.com/VyacheslavBogdanov/teccode_ru.git
cd teccode_ru
npm install
cp .env.example .env
```

### Запуск в режиме разработки

```bash
# Frontend (Vite :5173) + Backend (Express :3001) одновременно
npm run dev:full

# Только frontend
npm run dev

# Только backend (с авто-перезапуском через nodemon)
npm run dev:server
```

Vite проксирует запросы `/api/*` и `/uploads/*` на backend (`localhost:3001`).

### Продакшен-сборка

```bash
npm run build       # TypeScript проверка + Vite build → dist/
npm run preview     # Предпросмотр собранного приложения
npm run server      # Запуск продакшен-сервера
```

### Деплой

```bash
npm run build
firebase deploy
```

Деплоится в проект `teccode-ru` на Firebase Hosting. Все маршруты перенаправляются на `index.html` (SPA).

## Переменные окружения

| Переменная         | Описание                       | По умолчанию             |
| ------------------ | ------------------------------ | ------------------------ |
| `PORT`             | Порт backend-сервера           | `3001`                   |
| `CORS_ORIGIN`      | Разрешённые origins для CORS   | `*` (все)                |
| `ADMIN_LOGIN`      | Логин администратора           | `admin`                  |
| `ADMIN_PASSWORD`   | Пароль администратора          | `admin123`               |
| `VITE_API_BASE_URL`| URL API для frontend           | `http://localhost:3001`  |
| `NODE_ENV`         | Режим окружения                | `development`            |

> В продакшене `ADMIN_LOGIN` и `ADMIN_PASSWORD` обязательны — сервер не запустится без них.

## Команды

| Команда            | Описание                                  |
| ------------------ | ----------------------------------------- |
| `npm run dev`      | Vite dev-сервер                           |
| `npm run dev:server` | Express с автоперезапуском (nodemon)    |
| `npm run dev:full` | Frontend + backend параллельно            |
| `npm run build`    | Продакшен-сборка с проверкой типов        |
| `npm run type-check` | Проверка TypeScript (`vue-tsc`)         |
| `npm run lint`     | ESLint с авто-исправлением                |
| `npm run format`   | Prettier для `src/`                       |

## Архитектура

### Структура проекта

```
src/
├── pages/              # Страницы-маршруты
├── components/         # Компоненты по фичам (HomePage/, Header/, ContactFormPage/ и т.д.)
├── admin/              # Админ-панель (изолированный модуль)
│   ├── pages/          # AdminLoginPage, AdminPanelPage, AdminModuleEditPage
│   ├── stores/         # Pinia-стор авторизации
│   ├── api/            # API-клиент админки
│   └── styles/         # Стили админки (светлая тема)
├── stores/             # Pinia-сторы (главный стор)
├── api/                # HTTP-клиент и API-определения
├── data/               # Статические данные и типы модулей
├── router/             # Конфигурация маршрутов
└── assets/styles/      # Глобальные SCSS (переменные, миксины, анимации)

server/
├── index.js            # Express-приложение со всеми эндпоинтами
├── lib/
│   ├── db.js           # Операции с JSON-базой
│   ├── auth.js         # Аутентификация и сессии
│   └── slugify.js      # Транслитерация кириллицы в URL-slug
└── seed/
    └── defaultData.js  # Начальные данные при первом запуске
```

### Frontend

- **Composition API** с `<script setup lang="ts">` во всех компонентах
- **Pinia** для состояния: главный стор (каталог модулей/документов) и админ-стор (авторизация)
- **Vue Router** с route guards (`requiresAdmin`, `guestOnly`) и константами маршрутов в `routes.ts`
- **SCSS** с БЭМ-нотацией, scoped стили в компонентах, глобальные переменные и миксины
- **Две темы**: тёмная (публичный сайт) и светлая (админка через `body.admin-mode`)
- **Алиас**: `@/*` → `src/*`

### Backend

- REST API с CORS
- JSON-файловая база данных с атомарной записью (temp-файл + rename)
- Авторизация через Bearer-токены, сессии хранятся в БД (TTL 12 часов)
- Rate-limiting на логин: 20 попыток за 10 минут на IP
- Загрузка изображений: PNG, JPEG, WebP, GIF (макс. 3 МБ)
- При первом запуске БД автоматически создаётся и заполняется начальными данными

### Маршруты

| Путь                            | Страница                 | Доступ         |
| ------------------------------- | ------------------------ | -------------- |
| `/`                             | Главная                  | Публичный      |
| `/directions`                   | Направления              | Публичный      |
| `/software-solutions`           | Программные решения      | Публичный      |
| `/contacts`                     | Контакты                 | Публичный      |
| `/contact-form`                 | Форма обратной связи     | Публичный      |
| `/products/:slug`               | Страница модуля          | Публичный      |
| `/products/:slug/docs/:docId`   | Документ модуля          | Публичный      |
| `/admin/login`                  | Вход в админку           | Только гости   |
| `/admin`                        | Панель администратора    | Только админ   |
| `/admin/modules/:id`            | Редактирование модуля    | Только админ   |

## API

### Публичные эндпоинты

| Метод | Путь                    | Описание                           |
| ----- | ----------------------- | ---------------------------------- |
| GET   | `/api/health`           | Проверка состояния сервера         |
| GET   | `/api/modules`          | Список всех модулей                |
| GET   | `/api/modules/:slug`    | Модуль с описанием и документами   |
| GET   | `/api/documents/:id`    | Полный текст документа             |

### Аутентификация

| Метод | Путь                | Тело запроса           | Описание          |
| ----- | ------------------- | ---------------------- | ----------------- |
| POST  | `/api/auth/login`   | `{ login, password }`  | Вход, возвращает `{ token, expiresAt }` |
| POST  | `/api/auth/logout`  | —                      | Выход             |

### Админские эндпоинты

Требуют заголовок `Authorization: Bearer <token>`.

**Модули:**

| Метод  | Путь                       | Описание            |
| ------ | -------------------------- | -------------------- |
| GET    | `/api/admin/modules`       | Список модулей       |
| GET    | `/api/admin/modules/:id`   | Данные модуля        |
| POST   | `/api/admin/modules`       | Создать модуль       |
| PUT    | `/api/admin/modules/:id`   | Обновить модуль      |
| DELETE | `/api/admin/modules/:id`   | Удалить модуль (каскадно удаляет документы) |

**Документы:**

| Метод  | Путь                                          | Описание           |
| ------ | --------------------------------------------- | ------------------- |
| POST   | `/api/admin/modules/:moduleId/documents`      | Создать документ    |
| PUT    | `/api/admin/documents/:id`                    | Обновить документ   |
| DELETE | `/api/admin/documents/:id`                    | Удалить документ    |

**Загрузка изображений:**

| Метод | Путь                  | Тело запроса              | Описание         |
| ----- | --------------------- | ------------------------- | ----------------- |
| POST  | `/api/uploads`        | `{ dataUrl: "base64..." }`| Загрузить изображение |
| POST  | `/api/admin/uploads`  | `{ dataUrl: "base64..." }`| Загрузить изображение (админ) |

## Код-стайл

- **Prettier**: табы (ширина 4), одинарные кавычки, точка с запятой, trailing commas, 100 символов на строку
- **ESLint**: Vue 3 + TypeScript + Prettier
- **CSS**: БЭМ-нотация с SCSS
- **Компоненты**: PascalCase, Composition API
