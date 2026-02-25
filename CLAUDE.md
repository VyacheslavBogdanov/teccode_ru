# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Full-stack веб-приложение для компании TechCode: публичный маркетинговый сайт с каталогом продуктов/документацией и админ-панель для управления контентом.

## Commands

```bash
npm run dev:full      # Запуск frontend (Vite :5173) + backend (Express :3001) параллельно
npm run dev           # Только frontend dev-сервер
npm run dev:server    # Только backend с автоперезапуском (nodemon)
npm run build         # Продакшен-сборка (type-check + vite build)
npm run type-check    # Проверка типов (vue-tsc)
npm run lint          # ESLint с авто-исправлением
npm run format        # Prettier для src/
```

Для запуска сервера требуется `.env` файл (скопировать из `.env.example`).

## Architecture

**Frontend:** Vue 3 (Composition API, `<script setup>`) + TypeScript + Pinia + Vue Router + SCSS

**Backend:** Express.js с JSON-файловой базой данных (`server/data/db.json`), при первом запуске автоматически сидируется.

### Структура frontend (`src/`)

- `pages/` — страницы-маршруты (верхнеуровневые компоненты для роутера)
- `components/` — компоненты организованы по фичам/страницам (HomePage/, ContactFormPage/, Header/ и т.д.)
- `router/` — маршруты определены как константы в `routes.ts`, используются через объект `ROUTES`
- `stores/` — Pinia-сторы: `main.ts` (каталог документов, модули), `admin/stores/` (авторизация)
- `api/` — HTTP-клиенты: `http.ts` (обёртка над fetch с таймаутами и обработкой ошибок), `software.ts` (публичный API), `admin/api/` (админский API)
- `data/` — статические данные и типы модулей/документов
- `assets/styles/` — глобальные SCSS: переменные (`variables.scss`), миксины (`mixins.scss`), анимации

### Маршрутизация

Роутер использует мета-поля `requiresAdmin` и `guestOnly` для guard-ов. Динамические маршруты: `:slug` для продуктов, `:docId` для документов. Пути определены константами — не хардкодить строки.

### Аутентификация

Session storage с Bearer-токенами. Админ-модуль (`src/admin/`) полностью изолирован: свои API-клиенты, стор, стили (светлая тема через `body.admin-mode`).

### Backend (`server/`)

REST API с CORS. Rate-limiting на логин. Загрузка изображений до 15MB. Эндпоинты: публичные (`/api/modules`, `/api/documents`) и админские (`/api/admin/*`) с Bearer-авторизацией.

## Code Conventions

- **Стиль:** Prettier — табы, 4 пробела ширина, одинарные кавычки, точка с запятой, trailing commas, 100 символов на строку
- **CSS:** БЭМ-нотация с SCSS (`header__container`, `form__field--full`), scoped стили в компонентах
- **Компоненты:** PascalCase имена, Composition API с `<script setup lang="ts">`
- **Ошибки API:** Русскоязычные сообщения для пользователей (см. `http.ts`)
- **Алиас:** `@/*` → `src/*` в импортах
- **Темы:** Тёмная тема (публичный сайт), светлая тема (админка)
