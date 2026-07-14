import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import { signAuthToken } from "../lib/jwt";
import { ApiError } from "../utils/ApiError";
import { LoginInput } from "../schemas/auth.schema";

export async function login({ username, password }: LoginInput) {
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    throw ApiError.unauthorized("Invalid username or password");
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) {
    throw ApiError.unauthorized("Invalid username or password");
  }

  const token = signAuthToken({ sub: user.id, username: user.username, role: user.role });

  return {
    token,
    user: { id: user.id, username: user.username, role: user.role },
  };
}
