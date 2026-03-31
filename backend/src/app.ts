import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { env } from "./config/env";
import { checkDatabaseConnection } from "./config/prisma";
import v1Routes from "./routes/v1";
import { errorHandler, notFound } from "./middleware/errorHandler";
import { openApiSpec } from "./docs/openapi";

const app = express();

const isAllowedOrigin = (origin: string): boolean => {
  if (env.corsOrigins.includes("*")) {
    return true;
  }

  let requestHostname: string;
  try {
    requestHostname = new URL(origin).hostname;
  } catch {
    return false;
  }

  // Allow this project's Vercel production and preview domains.
  if (
    requestHostname.endsWith(".vercel.app") &&
    requestHostname.startsWith("intern-primetrade-ai-aeqq")
  ) {
    return true;
  }

  // Allow Vercel preview deployments in production without requiring manual CORS updates.
  if (env.nodeEnv === "production" && requestHostname.endsWith(".vercel.app")) {
    return true;
  }

  return env.corsOrigins.some((allowedOrigin) => {
    const allowed = allowedOrigin.trim();
    if (!allowed) {
      return false;
    }

    // Exact origin match, including protocol and optional port.
    if (allowed === origin) {
      return true;
    }

    const hostPattern = allowed
      .replace(/^https?:\/\//, "")
      .split("/")[0]
      .trim();

    // Allow host-only exact values such as "localhost".
    if (hostPattern === requestHostname) {
      return true;
    }

    // Allow host+port values such as "localhost:5173".
    if (hostPattern.includes(":")) {
      const [allowedHost, allowedPort] = hostPattern.split(":");
      const requestUrl = new URL(origin);
      const requestPort =
        requestUrl.port || (requestUrl.protocol === "https:" ? "443" : "80");
      if (allowedHost === requestUrl.hostname && allowedPort === requestPort) {
        return true;
      }
    }

    // Support wildcard host patterns such as "*.vercel.app" or "https://*.vercel.app".
    if (hostPattern.startsWith("*.")) {
      const suffix = hostPattern.slice(2);
      return (
        requestHostname === suffix || requestHostname.endsWith(`.${suffix}`)
      );
    }

    return false;
  });
};

app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || isAllowedOrigin(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
  }),
);
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/health/db", async (_req, res) => {
  const connected = await checkDatabaseConnection();
  if (!connected) {
    return res.status(503).json({
      status: "error",
      message:
        "Database connection unavailable. Check DATABASE_URL, Supabase status, and network access.",
    });
  }

  return res.status(200).json({ status: "ok" });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));
app.use("/api/v1", v1Routes);

app.use(notFound);
app.use(errorHandler);

export default app;
