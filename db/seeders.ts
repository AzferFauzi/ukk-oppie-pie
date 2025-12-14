// db/seeders.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // --- Category ---
  console.log("Creating categories...");

  let fruitPie = await prisma.category.findFirst({
    where: { name: "Fruit Pie" }
  });
  if (!fruitPie) {
    fruitPie = await prisma.category.create({
      data: { name: "Fruit Pie" }
    });
  }

  let brownies = await prisma.category.findFirst({
    where: { name: "Brownies" }
  });
  if (!brownies) {
    brownies = await prisma.category.create({
      data: { name: "Brownies" }
    });
  }

  let cake = await prisma.category.findFirst({
    where: { name: "Cake" }
  });
  if (!cake) {
    cake = await prisma.category.create({
      data: { name: "Cake" }
    });
  }

  let minuman = await prisma.category.findFirst({
    where: { name: "Minuman" }
  });
  if (!minuman) {
    minuman = await prisma.category.create({
      data: { name: "Minuman" }
    });
  }

  console.log("✅ Categories seeded");

  // --- Products ---
  console.log("Creating products...");

const products = [
  // Fruit Pie Products
  {
    name: "Diameter 5cm Pack 4 x 2 : 8 pcs",
    price: 35000,
    description: "Fruit Pie ukuran kecil, cocok untuk snack",
    image: "/assets/products/54x2.jpg", // ← Gambar 5cm x 4x2
    stock: 50,
    categoryId: fruitPie.id,
  },
  {
    name: "Diameter 5cm Pack 3 x 3 : 9 pcs",
    price: 35000,
    description: "Fruit Pie ukuran kecil dengan berbagai rasa",
    image: "/assets/products/pie_kecil_d.jpg", // ← Gambar pie kecil
    stock: 50,
    categoryId: fruitPie.id,
  },
  {
    name: "Diameter 5cm Pack 4 x 6 : 16 pcs",
    price: 55000,
    description: "Fruit Pie paket hemat",
    image: "/assets/products/54x4.jpg", // ← Gambar 5cm x 4x4
    stock: 30,
    categoryId: fruitPie.id,
  },
  {
    name: "Diameter 6cm Pack 3 x 3 : 9 pcs",
    price: 75000,
    description: "Fruit Pie ukuran besar, lebih banyak isian",
    image: "/assets/products/63x3.jpg", // ← Gambar 6cm x 3x3
    stock: 40,
    categoryId: fruitPie.id,
  },
  {
    name: "Diameter 5cm Pack 4 x 2 : 8 pcs (Blueberry)",
    price: 35000,
    description: "Fruit Pie rasa blueberry segar",
    image: "/assets/products/pie_buah_2.jpg", // ← Gambar pie buah
    stock: 45,
    categoryId: fruitPie.id,
  },
  {
    name: "Diameter 6cm Pack 3 x 3 : 9 pcs (Strawberry)",
    price: 75000,
    description: "Fruit Pie ukuran besar rasa strawberry",
    image: "/assets/products/pie_buah_3.jpg", // ← Gambar pie buah
    stock: 35,
    categoryId: fruitPie.id,
  },
  // Brownies Products
  {
    name: "Brownies Pack 3 x 3 : 9 pcs",
    price: 35000,
    description: "Brownies coklat lembut",
    image: "/assets/products/brownies.jpg", // ← Gambar brownies
    stock: 40,
    categoryId: brownies.id,
  },
  {
    name: "Brownies Small Pack 4 x 2 : 8 pcs",
    price: 30000,
    description: "Brownies ukuran kecil untuk cemilan",
    image: "/assets/products/pie_brownies_2.jpg", // ← Gambar brownies kecil
    stock: 60,
    categoryId: brownies.id,
  },
  {
    name: "Brownies Big Pack 3 x 3 : 9 pcs",
    price: 65000,
    description: "Brownies ukuran besar dengan topping keju",
    image: "/assets/products/pie_brownies_1 (1).jpg", // ← Gambar brownies besar
    stock: 25,
    categoryId: brownies.id,
  },
  // Cake Products
  {
    name: "Chocolate Cake",
    price: 45000,
    description: "Kue coklat lembut dengan lapisan krim",
    image: "/assets/products/hbd_1.jpg", // ← Gambar cake
    stock: 20,
    categoryId: cake.id,
  },
];

  for (const product of products) {
    const existingProduct = await prisma.product.findFirst({
      where: { name: product.name }
    });

    if (!existingProduct) {
      await prisma.product.create({
        data: product,
      });
      console.log(`✅ Created: ${product.name}`);
    } else {
      console.log(`⏭️  Skip: ${product.name} (already exists)`);
    }
  }

  console.log("✅ Products seeded");

  // --- User Admin ---
  console.log("Creating admin user...");

  const hashedPassword = await bcrypt.hash('admin123', 10);

  const existingUser = await prisma.user.findUnique({
    where: { email: "admin@oppie.com" }
  });

  if (!existingUser) {
    await prisma.user.create({
      data: {
        name: "Admin Oppie Pie",
        email: "admin@oppie.com",
        password: hashedPassword,
        role: "ADMIN",
        alamat: "Klipang Pesona Asri 3, Semarang",
        noTelp: "081234567890",
      },
    });
    console.log("✅ Admin user created (email: admin@oppie.com, password: admin123)");
  } else {
    console.log("⏭️  Skip: Admin user (already exists)");
  }
}

main()
  .catch((e) => {
    console.error("❌ Error seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });