import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("Admin@123", 10);
  const userPassword = await bcrypt.hash("User@1234", 10);

  await prisma.user.upsert({
    where: { email: "admin@primetrade.ai" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@primetrade.ai",
      passwordHash: adminPassword,
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { email: "user@primetrade.ai" },
    update: {},
    create: {
      name: "Standard User",
      email: "user@primetrade.ai",
      passwordHash: userPassword,
      role: "USER",
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
