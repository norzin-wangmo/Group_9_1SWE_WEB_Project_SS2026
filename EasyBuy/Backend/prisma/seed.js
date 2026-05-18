// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log(' Seeding database...\n');

  // ─── Users ──────────────────────────────────────────────────────────────────
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

  const seller2Password = await bcrypt.hash('seller123', 10);
  const seller2 = await prisma.user.upsert({
    where: { email: 'seller@easybuy.com' },
    update: {},
    create: {
      name: 'Jane Smith',
      email: 'seller@easybuy.com',
      password: seller2Password,
      role: 'USER',
    },
  });

  console.log(' Users seeded');

  // ─── Categories ─────────────────────────────────────────────────────────────
  const categoriesData = [
    { name: 'Electronics',   slug: 'electronics',   description: 'Phones, laptops, gadgets and accessories' },
    { name: 'Sports',        slug: 'sports',         description: 'Sporting goods, fitness and outdoor equipment' },
    { name: 'Home & Kitchen',slug: 'home-kitchen',   description: 'Appliances, furniture and kitchenware' },
    { name: 'Fashion',       slug: 'fashion',        description: 'Clothing, shoes and accessories' },
    { name: 'Books',         slug: 'books',          description: 'Textbooks, novels and educational materials' },
  ];

  const categories = {};
  for (const cat of categoriesData) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    categories[cat.slug] = created;
  }

  console.log(' Categories seeded');

  // ─── Products ────────────────────────────────────────────────────────────────
  const headphones = await prisma.product.create({
    data: {
      name: 'Wireless Headphones',
      description: 'Premium noise-cancelling wireless headphones with 30-hour battery life.',
      price: 99.99,
      stock: 50,
      sellerId: admin.id,
      categoryId: categories['electronics'].id,
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    },
  });

  const shoes = await prisma.product.create({
    data: {
      name: 'Running Shoes',
      description: 'Lightweight and comfortable running shoes for all terrains.',
      price: 59.99,
      stock: 30,
      sellerId: user.id,
      categoryId: categories['sports'].id,
      imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    },
  });

  const coffeeMaker = await prisma.product.create({
    data: {
      name: 'Coffee Maker',
      description: 'Programmable 12-cup coffee maker with built-in grinder.',
      price: 39.99,
      stock: 20,
      sellerId: admin.id,
      categoryId: categories['home-kitchen'].id,
      imageUrl: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400',
    },
  });

  const laptop = await prisma.product.create({
    data: {
      name: 'Refurbished Laptop',
      description: '14" refurbished laptop, 8GB RAM, 256GB SSD. Great for students.',
      price: 299.99,
      stock: 5,
      sellerId: seller2.id,
      categoryId: categories['electronics'].id,
    },
  });

  console.log(' Products seeded');

  // ─── Product Images ──────────────────────────────────────────────────────────
  await prisma.productImage.createMany({
    data: [
      // Headphones — 2 images
      {
        productId: headphones.id,
        url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
        altText: 'Wireless headphones front view',
        isPrimary: true,
        sortOrder: 0,
      },
      {
        productId: headphones.id,
        url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800',
        altText: 'Wireless headphones side view',
        isPrimary: false,
        sortOrder: 1,
      },
      // Running shoes — 2 images
      {
        productId: shoes.id,
        url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
        altText: 'Running shoes side profile',
        isPrimary: true,
        sortOrder: 0,
      },
      {
        productId: shoes.id,
        url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800',
        altText: 'Running shoes top view',
        isPrimary: false,
        sortOrder: 1,
      },
      // Coffee maker — 1 image
      {
        productId: coffeeMaker.id,
        url: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800',
        altText: 'Coffee maker on kitchen counter',
        isPrimary: true,
        sortOrder: 0,
      },
    ],
  });

  console.log(' Product images seeded');

  // ─── Messages ────────────────────────────────────────────────────────────────
  await prisma.message.createMany({
    data: [
      {
        content: 'Hello! Is the wireless headphones still available?',
        senderId: user.id,
        receiverId: admin.id,
        isRead: true,
      },
      {
        content: 'Yes they are! Would you like to place an order?',
        senderId: admin.id,
        receiverId: user.id,
        isRead: false,
      },
      {
        content: 'Is the laptop negotiable on price?',
        senderId: user.id,
        receiverId: seller2.id,
        isRead: false,
      },
    ],
  });

  console.log(' Messages seeded');

  // ─── Upload Requests ─────────────────────────────────────────────────────────
  // seller2's laptop needs admin approval
  const pendingRequest = await prisma.uploadRequest.create({
    data: {
      userId: seller2.id,
      productId: laptop.id,
      status: 'PENDING',
      note: 'Fully refurbished with 6-month warranty. Please approve.',
    },
  });

  // user's shoes — already approved
  const approvedRequest = await prisma.uploadRequest.create({
    data: {
      userId: user.id,
      productId: shoes.id,
      status: 'APPROVED',
      note: 'Brand new stock from supplier.',
    },
  });

  console.log(' Upload requests seeded');

  // ─── Admin Reviews ────────────────────────────────────────────────────────────
  await prisma.adminReview.create({
    data: {
      uploadRequestId: approvedRequest.id,
      adminId: admin.id,
      decision: 'APPROVED',
      reason: 'Product looks legitimate. Good photos and description.',
    },
  });

  console.log(' Admin reviews seeded');

  // ─── Payments ────────────────────────────────────────────────────────────────
  await prisma.payment.createMany({
    data: [
      {
        userId: user.id,
        uploadRequestId: approvedRequest.id,
        amount: 5.00,
        status: 'COMPLETED',
        description: 'Listing fee for Running Shoes',
        reference: 'TXN-SEED-001',
      },
      {
        userId: seller2.id,
        amount: 5.00,
        status: 'PENDING',
        description: 'Listing fee for Refurbished Laptop (awaiting approval)',
        reference: 'TXN-SEED-002',
      },
    ],
  });

  console.log(' Payments seeded');

  // ─── Notifications ────────────────────────────────────────────────────────────
  await prisma.notification.createMany({
    data: [
      {
        userId: user.id,
        type: 'PRODUCT_APPROVED',
        title: 'Product Approved!',
        body: 'Your product "Running Shoes" has been approved and is now live.',
        isRead: false,
        link: `/products/${shoes.id}`,
      },
      {
        userId: user.id,
        type: 'MESSAGE',
        title: 'New Message',
        body: 'Admin User replied to your enquiry about Wireless Headphones.',
        isRead: true,
        link: `/messages`,
      },
      {
        userId: seller2.id,
        type: 'SYSTEM',
        title: 'Welcome to EasyBuy!',
        body: 'Your account has been created. Start listing your products today.',
        isRead: false,
      },
      {
        userId: seller2.id,
        type: 'PAYMENT_RECEIVED',
        title: 'Payment Recorded',
        body: 'Your listing fee of $5.00 for "Refurbished Laptop" has been received.',
        isRead: false,
        link: `/payments`,
      },
    ],
  });

  console.log(' Notifications seeded');

  // ─── Summary ─────────────────────────────────────────────────────────────────
  console.log('\n Seeding complete!\n');
  console.log(' Admin:   admin@easybuy.com  / admin123');
  console.log(' User:    user@easybuy.com   / user123');
  console.log(' Seller:  seller@easybuy.com / seller123');
  console.log('\n Products:         4');
  console.log(' Categories:       5');
  console.log(' Product images:   5');
  console.log(' Upload requests:  2 (1 pending, 1 approved)');
  console.log(' Admin reviews:    1');
  console.log(' Payments:         2');
  console.log(' Notifications:    4\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });