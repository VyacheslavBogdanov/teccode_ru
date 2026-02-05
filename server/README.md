# Backend (Node.js API) — TechCode RU

Это API-сервер на **Node.js + Express** с:

- **PostgreSQL** вместо `db.json` (нет гонок записи, есть индексы/ограничения, можно масштабировать).
- **Миграциями** (SQL-файлы в `server/migrations/` применяются автоматически при старте сервера).
- **Docker Compose** для запуска `api + db`.

## Быстрый старт

1) Установить зависимости

```bash
npm install
```

2) Создать файл переменных окружения

```bash
cp .env.example .env
```

3) Поднять PostgreSQL (варианты)

### Вариант A (рекомендую): Docker Compose

```bash
docker compose up -d
```

После этого API будет доступен на `http://localhost:3001`, Postgres — на `localhost:5432`.

### Вариант B: локальная PostgreSQL

- Создай БД/пользователя и пропиши `DATABASE_URL` в `.env`.

4) Запустить бэкенд

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

Данные хранятся в **PostgreSQL**.

- **Схема** создаётся миграциями: `server/migrations/*.sql`
- **Применение миграций**: при старте сервера вызывается `migrate()` (так проще деплоить: контейнер поднялся → схема гарантированно есть).
- Отдельно можно запустить миграции так:

```bash
npm run migrate
```

## Переменные окружения (главные)

- `DATABASE_URL` — строка подключения к Postgres, пример:
  - `postgresql://techcode:techcode@localhost:5432/techcode`
- `ADMIN_LOGIN`, `ADMIN_PASSWORD` — логин/пароль админки (в **production** обязательны).
- `CORS_ORIGIN` — список origin через запятую (в продакшене обязательно явный список доменов).
- `PORT` — порт API.

## Продакшен-заметки (важно)

- В **production** нельзя оставлять `CORS_ORIGIN=*` — сервер потребует явный список origin.
- Не деплой `ADMIN_PASSWORD=change-me` и дефолтные пароли БД.

## Почему Postgres лучше, чем JSON-файл (кратко)

- **Надёжность**: нет ситуации “два запроса одновременно перезаписали файл и потеряли данные”.
- **Ограничения**: уникальность `slug`, внешние ключи, каскадное удаление документов при удалении модуля.
- **Производительность**: индексы и выборки без чтения всего файла.
- **Масштабирование**: можно держать несколько инстансов API за балансировщиком.
