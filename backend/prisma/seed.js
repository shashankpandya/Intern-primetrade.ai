"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const adminPassword = await bcryptjs_1.default.hash("Admin@123", 10);
    const userPassword = await bcryptjs_1.default.hash("User@1234", 10);
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
