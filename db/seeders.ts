import { PrismaClient } from  "../lib/prisma"

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // --- Category ---
  const categories = await prisma.category.createMany({
    data: [
      { name: "Cake" },
      { name: "Pie" },
      { name: "Kue Basah" },
      { name: "Minuman" },
    ],
  });

  console.log("✔ Category seeded");

  // ambil semua category buat referensi
  const categoryData = await prisma.category.findMany();

  // --- Product ---
  const products = await prisma.product.createMany({
    data: [
      {
        name: "Brownie Pie",
        stock: 20,
        price: 25000,
        categoryId: categoryData[1].id, // Pie
      },
      {
        name: "Fruit Pie",
        stock: 15,
        price: 30000,
        categoryId: categoryData[1].id,
      },
      {
        name: "Chocolate Cake",
        stock: 10,
        price: 45000,
        categoryId: categoryData[0].id, // Cake
      },
    ],
  });

  console.log("✔ Products seeded");

  // --- User ---
  const user = await prisma.user.create({
    data: {
      name: "Admin Oppie",
      email: "admin@oppiepie.com",
      password: "admin123", // NOTE: Wajib bcrypt nanti bro
      alamat: "Jl. Contoh No. 1",
      no_telp: 81234567890,
    },
  });

  console.log("✔ User seeded");

  console.log("🌱 Done seeding!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
