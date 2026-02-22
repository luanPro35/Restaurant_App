import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkOtps() {
  try {
    const otps = await prisma.otp.findMany({
      orderBy: { updatedAt: "desc" },
      take: 5,
    });
    console.log("Recent OTPs:", JSON.stringify(otps, null, 2));
  } catch (error) {
    console.error("Error checking OTPs:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkOtps();
