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

