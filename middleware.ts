import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function middleware() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/aluno/:path*",
  ],
};
