// src/controllers/productImageController.js
const prisma = require('../utils/prisma');

// ─── Helper ───────────────────────────────────────────────────────────────────
// Confirms the product exists and that the requesting user owns it.
const getOwnedProduct = async (productId, userId) => {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) return { error: 'Product not found.', status: 404 };
  if (product.sellerId !== userId) return { error: 'Not authorized. You do not own this product.', status: 403 };
  return { product };
};

// ─── GET /api/products/:productId/images ─────────────────────────────────────
// Public — get all images for a product, primary image first.
const getProductImages = async (req, res, next) => {
  try {
    const productId = parseInt(req.params.productId);

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return res.status(404).json({ message: 'Product not found.' });

    const images = await prisma.productImage.findMany({
      where: { productId },
      orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }, { createdAt: 'asc' }],
    });

    res.status(200).json({ images });
  } catch (error) {
    next(error);
  }
};

// ─── POST /api/products/:productId/images ────────────────────────────────────
// Seller adds one or more images to their product.
// Body: { images: [{ url, altText?, isPrimary?, sortOrder? }, ...] }
// If isPrimary is true, all other images for this product are set to false first.
const addProductImages = async (req, res, next) => {
  try {
    const productId = parseInt(req.params.productId);
    const { error, status } = await getOwnedProduct(productId, req.user.id);
    if (error) return res.status(status).json({ message: error });

    const { images } = req.body; // array of image objects

    if (!Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ message: 'Provide at least one image in the images array.' });
    }

    // If any incoming image is marked primary, clear existing primary flag first
    const hasPrimary = images.some((img) => img.isPrimary);
    if (hasPrimary) {
      await prisma.productImage.updateMany({
        where: { productId },
        data: { isPrimary: false },
      });
    }

    const created = await prisma.$transaction(
      images.map((img, index) =>
        prisma.productImage.create({
          data: {
            productId,
            url: img.url,
            altText: img.altText || null,
            isPrimary: img.isPrimary === true,
            sortOrder: img.sortOrder ?? index,
          },
        })
      )
    );

    res.status(201).json({ message: `${created.length} image(s) added.`, images: created });
  } catch (error) {
    next(error);
  }
};

// ─── PATCH /api/products/:productId/images/:imageId ──────────────────────────
// Seller updates a single image (alt text, sort order, or promote to primary).
const updateProductImage = async (req, res, next) => {
  try {
    const productId = parseInt(req.params.productId);
    const imageId   = parseInt(req.params.imageId);

    const { error, status } = await getOwnedProduct(productId, req.user.id);
    if (error) return res.status(status).json({ message: error });

    const image = await prisma.productImage.findUnique({ where: { id: imageId } });
    if (!image || image.productId !== productId) {
      return res.status(404).json({ message: 'Image not found on this product.' });
    }

    const { altText, sortOrder, isPrimary } = req.body;

    // If promoting this image to primary, demote all others first
    if (isPrimary === true) {
      await prisma.productImage.updateMany({
        where: { productId, id: { not: imageId } },
        data: { isPrimary: false },
      });
    }

    const data = {};
    if (altText   !== undefined) data.altText   = altText;
    if (sortOrder !== undefined) data.sortOrder  = parseInt(sortOrder);
    if (isPrimary !== undefined) data.isPrimary  = Boolean(isPrimary);

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ message: 'Provide at least one field to update (altText, sortOrder, isPrimary).' });
    }

    const updated = await prisma.productImage.update({ where: { id: imageId }, data });

    res.status(200).json({ message: 'Image updated.', image: updated });
  } catch (error) {
    next(error);
  }
};

// ─── DELETE /api/products/:productId/images/:imageId ─────────────────────────
// Seller removes an image. If the deleted image was primary,
// the oldest remaining image is automatically promoted.
const deleteProductImage = async (req, res, next) => {
  try {
    const productId = parseInt(req.params.productId);
    const imageId   = parseInt(req.params.imageId);

    const { error, status } = await getOwnedProduct(productId, req.user.id);
    if (error) return res.status(status).json({ message: error });

    const image = await prisma.productImage.findUnique({ where: { id: imageId } });
    if (!image || image.productId !== productId) {
      return res.status(404).json({ message: 'Image not found on this product.' });
    }

    await prisma.productImage.delete({ where: { id: imageId } });

    // If the deleted image was primary, promote the next one
    if (image.isPrimary) {
      const next = await prisma.productImage.findFirst({
        where: { productId },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
      });
      if (next) {
        await prisma.productImage.update({
          where: { id: next.id },
          data: { isPrimary: true },
        });
      }
    }

    res.status(200).json({ message: 'Image deleted.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProductImages,
  addProductImages,
  updateProductImage,
  deleteProductImage,
};