import { auth, currentUser } from "@clerk/nextjs/server";

export async function getCurrentClerkUser() {
  const session = await auth();

  if (!session.userId) {
    return null;
  }

  const user = await currentUser();

  return {
    clerkUserId: session.userId,
    email: user?.emailAddresses?.[0]?.emailAddress ?? null,
    firstName: user?.firstName ?? null,
    lastName: user?.lastName ?? null,
  };
}
