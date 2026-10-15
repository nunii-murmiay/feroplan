# Ферроплан

Интерактивное руководство на 4 недели для студентки: бюджетное питание при низком ферритине (с граммовкой), домашние тренировки + зал, йога для новичков, работа со сладким/ПМС и личный прогресс.

> Не заменяет консультацию врача. При низком ферритине обсудите анализы и добавки со специалистом.

## Быстрый старт локально

```bash
npm install
npm run dev
```

Откройте [http://127.0.0.1:3847](http://127.0.0.1:3847).

Прогресс по умолчанию сохраняется **в браузере** (localStorage). Облачная БД не обязательна.

---

## Бесплатный хостинг: GitHub + что-то ещё

Схема такая:

**GitHub** = хранит код  
**Vercel / Netlify / Render** = бесплатно крутит сайт  
(по желанию) **Neon** = бесплатная Postgres-база

`GitHub Pages` для этого проекта **не подходит**: нужен сервер для Next.js API. Бери один из вариантов ниже.

### 0) Сначала код на GitHub

1. Создай пустой репозиторий на GitHub.
2. Залей туда этот проект (через Cursor «Create repo» / `git remote` + `git push`).
3. Дальше в хостинге жми **Import from GitHub**.

---

### Вариант A — GitHub + Vercel (самый простой для Next.js)

1. [vercel.com](https://vercel.com) → войти через **GitHub**.
2. **Add New Project** → выбрать репозиторий Ферроплана.
3. **Deploy** (настройки можно не трогать).
4. Ссылка вида `https://ferro-plan.vercel.app`.

Каждый `git push` в `main` = новый деплой автоматически.

---

### Вариант B — GitHub + Netlify

1. [netlify.com](https://netlify.com) → войти через **GitHub**.
2. **Add new site** → **Import an existing project**.
3. Выбери репозиторий. Build command: `npm run build` (уже в `netlify.toml`).
4. Deploy.

Тоже автодеплой на каждый push.

---

### Вариант C — GitHub + Render

1. [render.com](https://render.com) → войти через **GitHub**.
2. **New** → **Blueprint** (подхватит `render.yaml`) или **Web Service**.
3. Free plan → Create.

Чуть медленнее «просыпается» на free-тарифе, но тоже бесплатно.

---

## Бесплатная БД (Neon) — по желанию

Нужна, чтобы прогресс синхронизировался между устройствами.

1. [neon.tech](https://neon.tech) → создать проект → скопировать `DATABASE_URL`.
2. Локально:

```bash
cp .env.example .env.local
# вставь DATABASE_URL=postgresql://...
npm run db:push
```

3. В Vercel / Netlify / Render → **Environment Variables** → `DATABASE_URL` → Redeploy.

Без `DATABASE_URL` сайт живёт нормально: прогресс только в браузере.

---

## CI на GitHub

В репозитории уже есть `.github/workflows/ci.yml`: на каждый push проверяется `npm run build`.

## Что в приложении

1. Принципы питания при низком ферритине + бюджет  
2. Меню-ротация на неделю **с граммовкой**  
3. Тренировки: дом / зал / йога  
4. Чек-лист тяги к сладкому и фазы цикла  
5. **Мой прогресс** — неделя, выбор блюд, заметки, дата анализа ферритина  

## Стек

Next.js · TypeScript · Tailwind · shadcn/ui · Drizzle ORM · Neon (опционально) · GitHub + Vercel/Netlify/Render
