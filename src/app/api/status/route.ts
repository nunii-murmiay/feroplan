import { NextResponse } from "next/server";
import { hasDatabase } from "@/db";

export async function GET() {
  return NextResponse.json({
    cloud: hasDatabase(),
    host: "vercel-ready",
  });
}
