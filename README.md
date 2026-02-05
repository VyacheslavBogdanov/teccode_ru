## Запуск в dev (Windows)

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

- Фронт: Vite поднимется на `http://localhost:5173/` (если порт занят — выберет следующий).
- API: сервер по умолчанию на `http://localhost:3001/`.

### Частые проблемы

#### Порт 3001 занят

Обычно это значит, что у вас уже запущен старый `node`‑процесс или контейнер `teccode_app` (production compose).

- Остановить production контейнеры:

```bash
docker compose -f docker-compose.prod.yml --env-file .env.prod down --remove-orphans
```

- Или просто сменить порт для dev‑сервера: в `.env` поставьте, например, `PORT=3002`.

#### База недоступна (`Can't reach database server at localhost:5432`)

- Проверьте, что Docker Desktop запущен.
- Поднимите базу:

```bash
docker compose up -d db
```

#### Prisma падает с EPERM на Windows (query_engine*.dll.node)

Это почти всегда блокировка файла (антивирус/Defender или запущенный `node`, который держит Prisma engine).

- Остановите все dev‑процессы (`npm run dev:full`, `dev:server`), закройте лишние `node.exe`.
- Повторите:

```bash
npx prisma migrate dev
```
