const prisma = require('../utils/prisma');

// ─── GET /api/products ────────────────────────────────────────────────────────
const getAllProducts = async (req, res, next) => {
  try {
    const { category, search, minPrice, maxPrice, page = 1, limit = 12 } = req.query;

    const where = {};

    if (category) where.category = { equals: category, mode: 'insensitive' };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          seller: { select: { id: true, name: true, email: true } },
        },
      }),
      prisma.product.count({ where }),
    ]);

    res.status(200).json({
      products,
      pagination: {
        total,
        page: parseInt(page),
        limit: take,
        totalPages: Math.ceil(total / take),
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/products/:id ────────────────────────────────────────────────────
const getProductById = async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        seller: { select: { id: true, name: true, email: true } },
      },
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    res.status(200).json({ product });
  } catch (error) {
    next(error);
  }
};

// ─── POST /api/products ───────────────────────────────────────────────────────
const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, category, stock, imageUrl } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: 'Name and price are required.' });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        category,
        stock: stock ? parseInt(stock) : 0,
        imageUrl: imageUrl || null,
        sellerId: req.user.id,
      },
      include: {
        seller: { select: { id: true, name: true, email: true } },
      },
    });

    res.status(201).json({ message: 'Product created.', product });
  } catch (error) {
    next(error);
  }
};

// ─── PUT /api/products/:id ────────────────────────────────────────────────────
const updateProduct = async (req, res, next) => {
  try {
    const productId = parseInt(req.params.id);

    const existing = await prisma.product.findUnique({ where: { id: productId } });
    if (!existing) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    // Only the seller or an admin can update
    if (existing.sellerId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Not authorized to update this product.' });
    }

    const { name, description, price, category, stock, imageUrl } = req.body;

    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(price && { price: parseFloat(price) }),
        ...(category && { category }),
        ...(stock !== undefined && { stock: parseInt(stock) }),
        ...(imageUrl !== undefined && { imageUrl }),
      },
      include: {
        seller: { select: { id: true, name: true, email: true } },
      },
    });

    res.status(200).json({ message: 'Product updated.', product });
  } catch (error) {
    next(error);
  }
};

// ─── DELETE /api/products/:id ─────────────────────────────────────────────────
const deleteProduct = async (req, res, next) => {
  try {
    const productId = parseInt(req.params.id);

    const existing = await prisma.product.findUnique({ where: { id: productId } });
    if (!existing) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    if (existing.sellerId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Not authorized to delete this product.' });
    }

    await prisma.product.delete({ where: { id: productId } });

    res.status(200).json({ message: 'Product deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/products/my ─────────────────────────────────────────────────────
const getMyProducts = async (req, res, next) => {
  try {
    const products = await prisma.product.findMany({
      where: { sellerId: req.user.id },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json({ products });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts,
};
