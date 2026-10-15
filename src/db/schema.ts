import { jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import type { UserProfile } from "@/lib/profile";

/** One row per browser/user key — personal progress blob */
export const progress = pgTable("progress", {
  id: text("id").primaryKey(),
  payload: jsonb("payload").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
});

export type ProgressPayload = {
  week: number;
  nickname: string;
  mealChoices: Record<
    string,
    {
      breakfast?: number;
      lunch?: number;
      snack?: number;
      dinner?: number;
    }
  >;
  cravingChecks: string[];
  notes: string;
  ferritinReminder: string;
  profile: UserProfile;
};
