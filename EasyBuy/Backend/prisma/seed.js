const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@easybuy.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@easybuy.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  // Create a regular user
  const userPassword = await bcrypt.hash('user123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'user@easybuy.com' },
    update: {},
    create: {
      name: 'John Doe',
      email: 'user@easybuy.com',
      password: userPassword,
      role: 'USER',
    },
  });

  // Create sample products
  const products = [
    {
      name: 'Wireless Headphones',
      description: 'Premium noise-cancelling wireless headphones',
      price: 99.99,
      category: 'Electronics',
      stock: 50,
      sellerId: admin.id,
    },
    {
      name: 'Running Shoes',
      description: 'Lightweight and comfortable running shoes',
      price: 59.99,
      category: 'Sports',
      stock: 30,
      sellerId: user.id,
    },
    {
      name: 'Coffee Maker',
      description: 'Programmable 12-cup coffee maker',
      price: 39.99,
      category: 'Home & Kitchen',
      stock: 20,
      sellerId: admin.id,
    },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  // Create a sample message
  await prisma.message.create({
    data: {
      content: 'Hello! Is the wireless headphones still available?',
      senderId: user.id,
      receiverId: admin.id,
    },
  });

  console.log('✅ Seeding complete!');
  console.log('👤 Admin:  admin@easybuy.com / admin123');
  console.log('👤 User:   user@easybuy.com  / user123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
