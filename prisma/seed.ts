import { hash } from "bcryptjs";
import { prisma } from "../src/config/prisma-client";

async function main() {
  await prisma.user.create({
    data: {
      email: "jane.doe@gmail.com",
      name: "Jane Doe",
      password: await hash("janedoe123", 10),
      role: "ADMIN"
    }
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
