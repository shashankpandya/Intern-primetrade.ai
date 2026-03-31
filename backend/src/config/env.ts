import dotenv from "dotenv";

dotenv.config();

const requiredVars = [
  "DATABASE_URL",
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
] as const;

for (const key of requiredVars) {
  if (!process.env[key]) {
    throw new Error(`Missing required env variable: ${key}`);
  }
}

const parseCorsOrigins = (): string[] => {
  const corsOrigin = process.env.CORS_ORIGIN ?? "http://localhost:5173";
  return corsOrigin
    .split(",")
    .map((origin) => origin.trim().replace(/^['\"]|['\"]$/g, ""))
    .filter(Boolean);
};

export const env = {
  port: Number(process.env.PORT ?? 5000),
  nodeEnv: process.env.NODE_ENV ?? "development",
  databaseUrl: process.env.DATABASE_URL as string,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET as string,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET as string,
  accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN ?? "15m",
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN ?? "7d",
  corsOrigins: parseCorsOrigins(),
};
