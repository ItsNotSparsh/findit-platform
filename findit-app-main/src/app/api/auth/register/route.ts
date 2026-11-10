import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import bcrypt from "bcryptjs";
import { registerUserSchema } from "@/lib/validators/auth";

export async function POST(request: Request) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const parsed = registerUserSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid registration details" },
        { status: 400 }
      );
    }

    const { username, password } = parsed.data;
    if (new TextEncoder().encode(password).byteLength > 72) {
      return NextResponse.json(
        { error: "Password must be at most 72 bytes when encoded" },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const [created] = await db
      .insert(users)
      .values({ username, passwordHash })
      .onConflictDoNothing({ target: users.username })
      .returning({ id: users.id });

    if (!created) {
      return NextResponse.json(
        { error: "Username already taken" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: "Account created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
