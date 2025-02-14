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
  try {
    // Delete existing records
    await prisma.account.deleteMany();
    await prisma.session.deleteMany();
    await prisma.verificationToken.deleteMany();
    await prisma.user.deleteMany();

    const users = [];
    for (let i = 0; i < sampleData.users.length; i++) {
      // Hash the user's password once and store it in a variable
      const hashedPassword = await hash(sampleData.users[i].password);
      users.push({
        ...sampleData.users[i],
        password: hashedPassword,
      });
      console.log(sampleData.users[i].password, hashedPassword);
    }

    // Insert the seeded users into the database
    await prisma.user.createMany({ data: users });
    console.log("Users seeded successfully!");
  } catch (error) {
    console.error("Error seeding users:", error);
  }
}

main();
seedUsers();
