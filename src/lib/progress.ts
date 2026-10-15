import type { ProgressPayload } from "@/db/schema";

export const STORAGE_KEY = "ferroplan-progress-v1";
export const USER_ID_KEY = "ferroplan-user-id";

export const defaultPayload = (): ProgressPayload => ({
  week: 1,
  nickname: "",
  mealChoices: {},
  cravingChecks: [],
  notes: "",
  ferritinReminder: "",
});

export function createUserId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `local-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export const mealSlots = [
  { key: "breakfast", label: "Завтрак" },
  { key: "lunch", label: "Обед" },
  { key: "snack", label: "Перекус" },
  { key: "dinner", label: "Ужин" },
] as const;

export type MealSlotKey = (typeof mealSlots)[number]["key"];
