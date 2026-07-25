import { z } from "zod";
import { db } from "@/lib/db";
import { hashPassword, verifyPassword, createSessionCookie, clearSessionCookie, getSession } from "@/lib/auth";
import { logEvent } from "@/lib/logger";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export async function registerUser(input: z.infer<typeof registerSchema>) {
  const validated = registerSchema.parse(input);

  const existing = await db.user.findUnique({
    where: { email: validated.email.toLowerCase() },
  });

  if (existing) {
    throw new Error("An account with this email already exists");
  }

  const hashedPassword = await hashPassword(validated.password);

  const user = await db.user.create({
    data: {
      name: validated.name,
      email: validated.email.toLowerCase(),
      password: hashedPassword,
    },
    select: { id: true, name: true, email: true },
  });

  await createSessionCookie({
    userId: user.id,
    email: user.email,
    name: user.name,
  });

  logEvent("info", {
    event: "AUTH_REGISTER",
    userId: user.id,
    details: { email: user.email },
  });

  return user;
}

export async function loginUser(input: z.infer<typeof loginSchema>) {
  const validated = loginSchema.parse(input);

  const user = await db.user.findUnique({
    where: { email: validated.email.toLowerCase() },
  });

  if (!user) {
    logEvent("warn", {
      event: "AUTH_LOGIN",
      details: { email: validated.email, reason: "User not found" },
    });
    throw new Error("Invalid credentials");
  }

  const isValid = await verifyPassword(validated.password, user.password);
  if (!isValid) {
    logEvent("warn", {
      event: "AUTH_LOGIN",
      userId: user.id,
      details: { email: validated.email, reason: "Incorrect password" },
    });
    throw new Error("Invalid credentials");
  }

  await createSessionCookie({
    userId: user.id,
    email: user.email,
    name: user.name,
  });

  logEvent("info", {
    event: "AUTH_LOGIN",
    userId: user.id,
    details: { email: user.email },
  });

  return { id: user.id, name: user.name, email: user.email };
}

export async function logoutUser() {
  const session = await getSession();
  if (session?.userId) {
    logEvent("info", {
      event: "AUTH_LOGOUT",
      userId: session.userId,
    });
  }
  await clearSessionCookie();
}
