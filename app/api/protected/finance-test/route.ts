import { NextResponse } from "next/server";
import { withPermissionGuard } from "@/lib/authz/guards/with-permission-guard";

const protectedHandler = withPermissionGuard(
  {
    resource: "finance",
    action: "admin",
  },
  async (context) => {
    return {
      ok: true,
      message: "Finance access granted.",
      workspace: context.workspace,
      role: context.role,
    };
  }
);

export async function GET() {
  try {
    const result = await protectedHandler();

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Protected route failed.",
      },
      { status: 403 }
    );
  }
}
