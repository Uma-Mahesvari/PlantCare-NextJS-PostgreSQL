import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const firstName = process.env.ADMIN_FIRST_NAME?.trim() || "PlantCare";
  const lastName = process.env.ADMIN_LAST_NAME?.trim() || "Admin";

  if (!email || !password || password.length < 8) {
    throw new Error(
      "Set ADMIN_EMAIL and ADMIN_PASSWORD (minimum 8 characters) in .env before running this command.",
    );
  }

  const passwordHash = await hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: { firstName, lastName, role: "ADMIN", passwordHash },
    create: { firstName, lastName, email, passwordHash, role: "ADMIN" },
  });

  console.log(`Admin account ready: ${email}`);
}

main()
  .catch((error) => {
    console.error("Unable to create the administrator account.");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
