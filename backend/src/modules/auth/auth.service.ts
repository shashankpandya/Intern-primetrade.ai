import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import { prisma } from "../../config/prisma";
import { ApiError } from "../../middleware/errorHandler";

type UserRole = "USER" | "ADMIN";

const hashToken = (token: string) =>
  crypto.createHash("sha256").update(token).digest("hex");

const signAccessToken = (userId: string, role: UserRole, email: string) => {
  return jwt.sign({ role, email }, env.jwtAccessSecret as jwt.Secret, {
    subject: userId,
    expiresIn: env.accessTokenExpiresIn as jwt.SignOptions["expiresIn"],
  });
};

const signRefreshToken = (userId: string, role: UserRole, email: string) => {
  return jwt.sign({ role, email }, env.jwtRefreshSecret as jwt.Secret, {
    subject: userId,
    expiresIn: env.refreshTokenExpiresIn as jwt.SignOptions["expiresIn"],
  });
};

const parseExpiresInDays = (expires: string) => {
  if (expires.endsWith("d")) {
    return Number(expires.replace("d", ""));
  }

  return 7;
};

export const authService = {
  async register(name: string, email: string, password: string) {
    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (existing) {
      throw new ApiError(409, "Email already exists");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name: normalizedName,
        email: normalizedEmail,
        passwordHash,
      },
    });

    return user;
  },

  async login(email: string, password: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (!user) {
      throw new ApiError(401, "Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new ApiError(401, "Invalid credentials");
    }

    const accessToken = signAccessToken(user.id, user.role, user.email);
    const refreshToken = signRefreshToken(user.id, user.role, user.email);

    await prisma.refreshToken.create({
      data: {
        tokenHash: hashToken(refreshToken),
        userId: user.id,
        expiresAt: new Date(
          Date.now() +
            parseExpiresInDays(env.refreshTokenExpiresIn) * 24 * 60 * 60 * 1000,
        ),
      },
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  },

  async refresh(refreshToken: string) {
    let payload: { sub: string; role: UserRole; email: string };

    try {
      payload = jwt.verify(refreshToken, env.jwtRefreshSecret) as {
        sub: string;
        role: UserRole;
        email: string;
      };
    } catch (_error) {
      throw new ApiError(401, "Invalid refresh token");
    }

    const stored = await prisma.refreshToken.findUnique({
      where: {
        tokenHash: hashToken(refreshToken),
      },
      include: {
        user: true,
      },
    });

    if (!stored || stored.expiresAt < new Date()) {
      throw new ApiError(401, "Refresh token expired or revoked");
    }

    const accessToken = signAccessToken(
      stored.user.id,
      stored.user.role,
      stored.user.email,
    );

    return { accessToken };
  },
};
