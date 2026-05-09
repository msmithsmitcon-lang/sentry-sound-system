import { NextResponse } from "next/server";
import { getCurrentClerkUser } from "@/lib/authz/get-current-clerk-user";

export async function GET() {
  const user = await getCurrentClerkUser();

  return NextResponse.json({
    authenticated: Boolean(user),
    user,
  });
}
