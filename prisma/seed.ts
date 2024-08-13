import { hash } from "bcryptjs"
import { prisma } from "../src/config/prisma-client"
import { Role, Status } from "@prisma/client"
import { faker } from "@faker-js/faker"

async function main() {
  await prisma.user.create({
    data: {
      email: "admin@example.com",
      password: await hash("imadmin123", 10),
      name: "John Doe",
      role: Role.ADMIN
    }
  })

  const users = await Promise.all(
    Array.from({ length: 19 }).map(async () => {
      return prisma.user.create({
        data: {
          name: faker.person.fullName(),
          email: faker.internet.email().toLowerCase(),
          password: faker.internet.password({ length: 10 }),
          role: Role.CLIENT,
        },
      })
    })
  )

  const tables = await Promise.all(
    Array.from({ length: 30 }).map(async () => {
      return prisma.table.create({
        data: {
          capacity: 5,
          description: faker.lorem.sentence(),
        },
      })
    })
  )

  await Promise.all(
    Array.from({ length: 20 }).map(() => {
      const generatedDate = faker.date.recent({ refDate: new Date() })

      return prisma.reservation.create({
        data: {
          date: generatedDate,
          hour: generatedDate,
          totalPeople: faker.number.int({ min: 1, max: 5 }),
          status: Math.random() > 0.5 ? Status.CONFIRMED : Status.CANCELED,
          userId: users[Math.floor(Math.random() * users.length)].id,
          tableId: tables[Math.floor(Math.random() * tables.length)].id,
        },
      })
    })
  )
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
