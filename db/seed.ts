import { prisma } from "@/db/prisma";
import sampleData from "./sample-data";

async function main() {
  await prisma.product.deleteMany();
  // await prisma.product.createMany({
  //   data: sampleData.products,
  // });
  console.log("Db seeded successfully!");
}

// seeding users
async function seedUsers() {
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  await prisma.user.createMany({
    data: sampleData.users,
  });

  console.log("Users seeded successfully!");
}

// main();
// seedUsers();
