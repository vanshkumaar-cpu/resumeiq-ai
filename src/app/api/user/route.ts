import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { profileUpdateSchema } from "@/lib/validations/user";

export async function PATCH(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = profileUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  const updated = await db.user.update({
    where: { id: user.id },
    data: parsed.data,
    select: {
      id: true,
      name: true,
      email: true,
      jobTitle: true,
      location: true,
      theme: true,
      notifications: true,
      language: true,
      avatarColor: true,
    },
  });

  return NextResponse.json({ user: updated });
}
