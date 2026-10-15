# Ферроплан

Персональный план питания и тренировок для студентки: низкий ферритин, бюджет, граммовка, адаптация под **вес/цель/цикл/сон/болезнь**.

> Не заменяет врача. Добавки железа — только по назначению.

## Локально

```bash
npm install
npm run dev
```

Открой [http://127.0.0.1:3847](http://127.0.0.1:3847).

Профиль по умолчанию: 64 → 60 кг, 164 см, ~20 лет. Меняешь поля — калории и граммы пересчитываются.

---

## Хостинг без Vercel (телефон + ПК)

Рекомендуем связку:

**GitHub** (код) → **Netlify** (сайт) → **Supabase** (база, по желанию)

### 1) Netlify (бесплатно, открывается с телефона)

1. Зайди на [netlify.com](https://www.netlify.com) → Sign up with **GitHub**.
2. **Add new site** → **Import an existing project**.
3. Выбери репозиторий `nunii-murmiay/feroplan`.
4. Build command: `npm run build` (уже в `netlify.toml`).
5. Deploy.

Получишь ссылку вида `https://что-то.netlify.app` — открой с телефона.

Альтернатива Netlify: [Render.com](https://render.com) (есть `render.yaml`) — тоже Import from GitHub, **без Vercel**.

### 2) Supabase (облачное сохранение профиля)

1. [supabase.com](https://supabase.com) → New project.
2. **SQL Editor** → вставь содержимое `supabase/schema.sql` → Run.
3. **Project Settings → API** → скопируй:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. В Netlify: **Site configuration → Environment variables** → добавь оба ключа → Redeploy.

Без Supabase сайт всё равно работает: профиль хранится в браузере телефона/ПК.

---

## Что адаптируется под параметры

| Параметр | Что меняется |
|----------|--------------|
| Вес / цель / рост / возраст / активность | BMR, TDEE, ккал, белки/жиры/углеводы, граммы в меню |
| Фаза цикла | Калории, акцент еды, интенсивность тренировок |
| Сон | При <6 ч — не усиливаем дефицит, только лёгкое движение |
| Болезнь | Отдых, тёплая еда, без жёсткого дефицита |
| Низкий ферритин | Предупреждения про чай/молочку рядом с железом |

---

## Стек

Next.js · TypeScript · Tailwind · shadcn/ui · Supabase (опционально) · Netlify / Render
