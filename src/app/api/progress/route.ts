import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb, hasDatabase } from "@/db";
import { progress, type ProgressPayload } from "@/db/schema";
import { defaultPayload } from "@/lib/progress";

export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get("id")?.trim();
  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  if (!hasDatabase()) {
    return NextResponse.json({
      mode: "local" as const,
      payload: null,
      message:
        "Серверная БД не задана — используй Supabase (NEXT_PUBLIC_SUPABASE_*) или локальное сохранение.",
    });
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json({ mode: "local" as const, payload: null });
  }

  try {
    const rows = await db
      .select()
      .from(progress)
      .where(eq(progress.id, id))
      .limit(1);

    const row = rows[0];
    return NextResponse.json({
      mode: "cloud" as const,
      payload: (row?.payload as ProgressPayload | undefined) ?? null,
      updatedAt: row?.updatedAt?.toISOString() ?? null,
    });
  } catch (error) {
    console.error("progress GET", error);
    return NextResponse.json(
      {
        mode: "local" as const,
        payload: null,
        error:
          "Не удалось прочитать БД. Проверь DATABASE_URL и что таблицы созданы (npm run db:push).",
      },
      { status: 503 },
    );
  }
}

export async function PUT(request: Request) {
  const body = (await request.json()) as {
    id?: string;
    payload?: ProgressPayload;
  };

  const id = body.id?.trim();
  if (!id || !body.payload) {
    return NextResponse.json(
      { error: "id and payload required" },
      { status: 400 },
    );
  }

  const payload: ProgressPayload = {
    ...defaultPayload(),
    ...body.payload,
    week: Math.min(4, Math.max(1, Number(body.payload.week) || 1)),
    nickname: String(body.payload.nickname ?? "").slice(0, 40),
    notes: String(body.payload.notes ?? "").slice(0, 2000),
    ferritinReminder: String(body.payload.ferritinReminder ?? "").slice(0, 32),
    cravingChecks: Array.isArray(body.payload.cravingChecks)
      ? body.payload.cravingChecks.map(String).slice(0, 20)
      : [],
    mealChoices: body.payload.mealChoices ?? {},
    profile: {
      ...defaultPayload().profile,
      ...body.payload.profile,
    },
  };

  if (!hasDatabase()) {
    return NextResponse.json({
      mode: "local" as const,
      saved: false,
      message: "Облако выключено — сохранено только локально в браузере.",
    });
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json({ mode: "local" as const, saved: false });
  }

  try {
    const updatedAt = new Date();
    await db
      .insert(progress)
      .values({ id, payload, updatedAt })
      .onConflictDoUpdate({
        target: progress.id,
        set: { payload, updatedAt },
      });

    return NextResponse.json({
      mode: "cloud" as const,
      saved: true,
      updatedAt: updatedAt.toISOString(),
    });
  } catch (error) {
    console.error("progress PUT", error);
    return NextResponse.json(
      {
        mode: "local" as const,
        saved: false,
        error:
          "Не удалось записать в БД. Создай таблицы: npm run db:push (нужен DATABASE_URL).",
      },
      { status: 503 },
    );
  }
}
