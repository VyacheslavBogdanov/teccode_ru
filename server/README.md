# Backend (Express) — TechCode RU

Это бэкенд на **Express** с хранением данных в **PostgreSQL** (через Prisma).

## Быстрый старт

1) Установить зависимости

```bash
npm install
```

2) Создать файл переменных окружения

```bash
cp .env.example .env
```

3) Поднять Postgres (Docker)

```bash
docker compose up -d db
```

4) Применить миграции

```bash
npx prisma migrate dev
```

5) Запустить бэкенд

```bash
npm run dev:server
```

Бэкенд поднимется на `http://localhost:3001`.

## Эндпоинты (коротко)

### Публичные

- `GET /api/health` — проверка.
- `GET /api/modules` — список модулей.
- `GET /api/modules/:slug` — модуль (описание + документы).
- `GET /api/documents/:id` — документ (текст).

### Админ

- `POST /api/auth/login` — вход (логин/пароль), возвращает `{ token }`.
- `POST /api/auth/logout` — выход.

Дальше запросы с заголовком:

`Authorization: Bearer <token>`

- `POST /api/admin/modules` — создать модуль.
- `PUT /api/admin/modules/:id` — редактировать модуль.
- `DELETE /api/admin/modules/:id` — удалить модуль (и его документы).

- `POST /api/admin/modules/:moduleId/documents` — создать документ в модуле.
- `PUT /api/admin/documents/:id` — редактировать документ.
- `DELETE /api/admin/documents/:id` — удалить документ.

## Хранение данных

Postgres + Prisma.



```bash
docker compose up -d db
```

### Миграции

```bash
npx prisma migrate dev
```
