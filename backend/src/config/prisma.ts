import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export const checkDatabaseConnection = async (): Promise<boolean> => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
};
