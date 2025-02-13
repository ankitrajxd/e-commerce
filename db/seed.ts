import { prisma } from "@/db/prisma";
import sampleData from "./sample-data";
import { hash } from "@/lib/encrypt";

async function main() {
  await prisma.product.deleteMany();
  await prisma.product.createMany({
    data: sampleData.products,
  });
  console.log("Db seeded successfully!");
}

// seeding users
async function seedUsers() {
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  // await prisma.user.createMany({
  //   data: sampleData.users,
  // });

  const users = [];
  for (let i = 0; i < sampleData.users.length; i++) {
    users.push({
      ...sampleData.users[i],
      password: await hash(sampleData.users[i].password),
    });
    console.log(
      sampleData.users[i].password,
      await hash(sampleData.users[i].password)
    );
  }
  await prisma.user.createMany({ data: users });

  console.log("Users seeded successfully!");
}

main();
seedUsers();
