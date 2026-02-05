# TechCode RU

Фронт: **Vue 3 + Vite**  
Бэкенд: **Node.js (Express) + PostgreSQL**  

Проект состоит из:
- **Frontend**: SPA в `src/` (сборка в `dist/`)
- **API**: `server/` (Express + Postgres, миграции, uploads)

## Быстрый старт (локально)

1) Установить зависимости:

```bash
npm install
```

2) Создать `.env`:

```bash
cp .env.example .env
```

3) Поднять PostgreSQL (рекомендуется через Docker):

```bash
docker compose up -d db
```

4) Запустить фронт + бэк:

```bash
npm run dev:full
```

Фронт: `http://localhost:5173`  
API: `http://localhost:3002` (или `PORT` из `.env`)  

## Скрипты

- `npm run dev`: Vite dev server (фронт)
- `npm run dev:server`: nodemon для API
- `npm run dev:full`: фронт + API параллельно
- `npm run build`: type-check + production build фронта
- `npm run preview`: предпросмотр фронта
- `npm run migrate`: применить SQL-миграции

## API (главное)

- `GET /api/health` — жив ли процесс + доступность БД
- `GET /api/ready` — готов ли сервис (БД доступна)
- `GET /api/modules` — список модулей
- `GET /api/modules/:slug` — модуль + список документов
- `GET /api/documents/:id` — документ
- `POST /api/uploads` — загрузка изображения (нужен Bearer-токен), ответ `{ url, path }`
- `GET /uploads/<file>` — раздача загруженных изображений

Админка использует Bearer-сессии в Postgres:
- `POST /api/auth/login` → `{ token }`
- `POST /api/auth/logout`

## Продакшен (обязательные переменные окружения)

### Backend (API)

- `NODE_ENV=production`
- `DATABASE_URL=postgresql://...`
- `ADMIN_LOGIN=...`
- `ADMIN_PASSWORD=...` (минимум 12 символов)
- `CORS_ORIGIN=https://your-site.com,https://www.your-site.com`
- `TRUST_PROXY=true` (если за nginx/traefik)
- `PUBLIC_BASE_URL=https://api.your-site.com` (чтобы API возвращало правильные абсолютные ссылки на uploads)

### Frontend (build-time)

- `VITE_API_BASE_URL=https://api.your-site.com`

Важно: **не собирай фронт с `VITE_API_BASE_URL=http://localhost:...`** для прода.

## Docker Compose (API + Postgres)

В репозитории есть `docker-compose.yml`, который поднимает:
- `db` (Postgres)
- `api` (Express API)

Команда:

```bash
docker compose up -d
```

## Firebase Hosting (фронт)

В `firebase.json` настроен SPA-rewrite на `index.html`, публикация из `dist/`.

Стандартный поток:
- собрать фронт: `npm run build-only`
- задеплоить хостинг: `firebase deploy`

API при этом деплоится отдельно (например, VPS/Docker/Render/Fly/Cloud Run).
