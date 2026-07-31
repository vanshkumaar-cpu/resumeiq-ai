import "server-only";
import { cookies } from "next/headers";
import { cache } from "react";
import { db } from "@/lib/db";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/session";

export const getCurrentUser = cache(async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const payload = await verifySessionToken(token);
  if (!payload) return null;

  const user = await db.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      name: true,
      email: true,
      avatarColor: true,
      jobTitle: true,
      location: true,
      theme: true,
      notifications: true,
      language: true,
      createdAt: true,
    },
  });

  return user;
});
