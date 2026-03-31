import app from "./app";
import { env } from "./config/env";
import { checkDatabaseConnection, prisma } from "./config/prisma";

const server = app.listen(env.port, () => {
  console.log(`Backend running on http://localhost:${env.port}`);

  checkDatabaseConnection()
    .then((connected) => {
      if (connected) {
        console.log("Database connection check: OK");
      } else {
        console.error(
          "Database connection check: FAILED - verify DATABASE_URL, Supabase status, and network access.",
        );
      }
    })
    .catch(() => {
      console.error("Database connection check: FAILED");
    });
});

const shutdown = async () => {
  await prisma.$disconnect();
  server.close(() => process.exit(0));
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
