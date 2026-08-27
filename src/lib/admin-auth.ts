import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { Session } from "next-auth";

type AuthOk = { session: Session; error: null };
type AuthFail = { session: null; error: NextResponse };

export async function requireAdmin(): Promise<AuthOk | AuthFail> {
  const session = await auth();
  if (!session?.user) {
    return {
      session: null,
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  return { session, error: null };
}
