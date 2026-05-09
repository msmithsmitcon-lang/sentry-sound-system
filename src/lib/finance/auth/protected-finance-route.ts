import { auth } from "@clerk/nextjs/server"

export type ProtectedFinanceRouteContext = {
  userId: string
  workspaceId: string
  role: string
}

export async function protectedFinanceRoute(): Promise<ProtectedFinanceRouteContext> {
  const session = await auth()

  if (!session.userId) {
    throw new Error("UNAUTHORIZED")
  }

  return {
    userId: session.userId,
    workspaceId: "system",
    role: "admin",
  }
}
