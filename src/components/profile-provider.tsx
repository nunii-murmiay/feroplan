"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ProgressPayload } from "@/db/schema";
import {
  buildMacroPlan,
  defaultProfile,
  type MacroPlan,
  type UserProfile,
} from "@/lib/profile";
import {
  STORAGE_KEY,
  USER_ID_KEY,
  createUserId,
  defaultPayload,
} from "@/lib/progress";
import { getSupabaseBrowser } from "@/lib/supabase";

type Ctx = {
  ready: boolean;
  userId: string;
  payload: ProgressPayload;
  profile: UserProfile;
  plan: MacroPlan;
  syncLabel: string;
  setProfile: (patch: Partial<UserProfile>) => void;
  setPayload: (next: ProgressPayload) => void;
};

const ProfileContext = createContext<Ctx | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [userId, setUserId] = useState("");
  const [payload, setPayloadState] = useState<ProgressPayload>(defaultPayload);
  const [syncLabel, setSyncLabel] = useState("Локально");

  useEffect(() => {
    let id = localStorage.getItem(USER_ID_KEY);
    if (!id) {
      id = createUserId();
      localStorage.setItem(USER_ID_KEY, id);
    }
    setUserId(id);

    const raw = localStorage.getItem(STORAGE_KEY);
    let local = defaultPayload();
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Partial<ProgressPayload>;
        local = {
          ...defaultPayload(),
          ...parsed,
          profile: { ...defaultProfile(), ...parsed.profile },
        };
      } catch {
        local = defaultPayload();
      }
    }
    setPayloadState(local);

    (async () => {
      const supabase = getSupabaseBrowser();
      if (!supabase) {
        setSyncLabel("Локально · Supabase не подключен");
        setReady(true);
        return;
      }
      try {
        const { data, error } = await supabase
          .from("ferro_progress")
          .select("payload")
          .eq("id", id)
          .maybeSingle();
        if (!error && data?.payload) {
          const cloud = data.payload as ProgressPayload;
          const merged = {
            ...defaultPayload(),
            ...cloud,
            profile: { ...defaultProfile(), ...cloud.profile },
          };
          setPayloadState(merged);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          setSyncLabel("Облако Supabase");
        } else {
          setSyncLabel("Supabase готов · пока локально");
        }
      } catch {
        setSyncLabel("Локально (облако недоступно)");
      } finally {
        setReady(true);
      }
    })();
  }, []);

  const persist = useCallback(
    (next: ProgressPayload) => {
      setPayloadState(next);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));

      const supabase = getSupabaseBrowser();
      if (!supabase || !userId) {
        setSyncLabel("Сохранено локально");
        return;
      }

      void (async () => {
        const { error } = await supabase.from("ferro_progress").upsert({
          id: userId,
          payload: next,
          updated_at: new Date().toISOString(),
        });
        setSyncLabel(
          error ? "Локально (ошибка Supabase)" : "Сохранено в Supabase",
        );
      })();
    },
    [userId],
  );

  const setProfile = useCallback(
    (patch: Partial<UserProfile>) => {
      const profile = { ...payload.profile, ...patch };
      persist({
        ...payload,
        nickname: patch.nickname ?? payload.nickname,
        profile,
      });
    },
    [payload, persist],
  );

  const setPayload = useCallback(
    (next: ProgressPayload) => {
      persist({
        ...next,
        profile: { ...defaultProfile(), ...next.profile },
      });
    },
    [persist],
  );

  const plan = useMemo(
    () => buildMacroPlan(payload.profile),
    [payload.profile],
  );

  const value = useMemo(
    () => ({
      ready,
      userId,
      payload,
      profile: payload.profile,
      plan,
      syncLabel,
      setProfile,
      setPayload,
    }),
    [ready, userId, payload, plan, syncLabel, setProfile, setPayload],
  );

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used within ProfileProvider");
  return ctx;
}
