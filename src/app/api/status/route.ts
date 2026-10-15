import { NextResponse } from "next/server";
import { hasDatabase } from "@/db";
import { hasSupabaseConfig } from "@/lib/supabase";

export async function GET() {
  return NextResponse.json({
    cloud: hasDatabase(),
    supabase: hasSupabaseConfig(),
    host: "netlify-ready",
  });
}
