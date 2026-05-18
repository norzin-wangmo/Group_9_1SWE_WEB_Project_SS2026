// src/controllers/categoryController.js
const prisma = require('../utils/prisma');

// ─── Helper ───────────────────────────────────────────────────────────────────
// Converts a category name into a URL-safe slug.
// e.g. "Home & Kitchen" → "home-kitchen"
const toSlug = (name) =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')   // strip special chars
    .replace(/\s+/g, '-')           // spaces → hyphens
    .replace(/-+/g, '-');           // collapse multiple hyphens

// ─── GET /api/categories ──────────────────────────────────────────────────────
// Public — anyone can browse categories.
const getAllCategories = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { products: true } },
      },
    });

    res.status(200).json({ categories });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/categories/:id ──────────────────────────────────────────────────
// Public — get one category + its products.
const getCategoryById = async (req, res, next) => {
  try {
    const categoryId = parseInt(req.params.id);

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        products: {
          select: {
            id: true,
            name: true,
            price: true,
            imageUrl: true,
            stock: true,
            seller: { select: { id: true, name: true } },
            images: { where: { isPrimary: true }, take: 1 },
          },
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
        _count: { select: { products: true } },
      },
    });

    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    res.status(200).json({ category });
  } catch (error) {
    next(error);
  }
};

// ─── POST /api/categories  (admin only) ──────────────────────────────────────
const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const slug = toSlug(name);

    // Check uniqueness manually for a friendlier error message
    const existing = await prisma.category.findFirst({
      where: { OR: [{ name }, { slug }] },
    });
    if (existing) {
      return res.status(409).json({ message: `Category "${name}" already exists.` });
    }

    const category = await prisma.category.create({
      data: { name: name.trim(), slug, description: description || null },
    });

    res.status(201).json({ message: 'Category created.', category });
  } catch (error) {
    next(error);
  }
};

// ─── PUT /api/categories/:id  (admin only) ───────────────────────────────────
const updateCategory = async (req, res, next) => {
  try {
    const categoryId = parseInt(req.params.id);
    const { name, description } = req.body;

    const existing = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!existing) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    const data = {};
    if (name) {
      data.name = name.trim();
      data.slug = toSlug(name);
    }
    if (description !== undefined) data.description = description;

    const updated = await prisma.category.update({
      where: { id: categoryId },
      data,
    });

    res.status(200).json({ message: 'Category updated.', category: updated });
  } catch (error) {
    next(error);
  }
};

// ─── DELETE /api/categories/:id  (admin only) ────────────────────────────────
// Products in this category will have their categoryId set to NULL (SetNull).
const deleteCategory = async (req, res, next) => {
  try {
    const categoryId = parseInt(req.params.id);

    const existing = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!existing) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    await prisma.category.delete({ where: { id: categoryId } });

    res.status(200).json({ message: 'Category deleted. Affected products are now uncategorised.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};