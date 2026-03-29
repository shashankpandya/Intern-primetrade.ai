import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { env } from "./config/env";
import v1Routes from "./routes/v1";
import { errorHandler, notFound } from "./middleware/errorHandler";
import { openApiSpec } from "./docs/openapi";

const app = express();

app.use(helmet());
app.use(cors({ origin: env.corsOrigin }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));
app.use("/api/v1", v1Routes);

app.use(notFound);
app.use(errorHandler);

export default app;
