import bcrypt from "bcryptjs";
import { prisma } from "../../src/lib/prisma";

export async function resetDb() {
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "products", "users" RESTART IDENTITY CASCADE');
}

export async function seedAdmin(username = "admin", password = "admin12345") {
  const passwordHash = await bcrypt.hash(password, 10);
  return prisma.user.create({ data: { username, passwordHash, role: "admin" } });
}
