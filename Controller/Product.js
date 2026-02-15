import Category from "../Models/Category.js";
import Product from "../Models/Product.js";
import { v2 as cloudinary } from "cloudinary";

/* =========================
   CREATE PRODUCT
========================= */
export const createProduct = async (req, res) => {
  try {
    const { category, name, description, status, variants } = req.body;

    if (!category || !name || !variants?.length) {
      return res.status(400).json({ message: "Category, name and variants are required" });
    }

    // Validate category
    const cat = await Category.findById(category);
    if (!cat) return res.status(404).json({ message: "Category not found" });

    // Duplicate product name
    const existingProduct = await Product.findOne({ name: name.trim() });
    if (existingProduct)
      return res.status(400).json({ message: "Product name already exists" });

    // Validate variants
    for (let v of variants) {
      const existingSku = await Product.findOne({ "variants.sku": v.sku });
      if (existingSku)
        return res.status(400).json({ message: `SKU ${v.sku} already exists` });

      if (v.emiEligible && (!v.emiPlans || v.emiPlans.length === 0)) {
        return res.status(400).json({
          message: `EMI plans required for SKU ${v.sku}`,
        });
      }
    }

    const product = await Product.create({
      category,
      name: name.trim(),
      description,
      status: ["Available", "Out of Stock", "Discontinued"].includes(status)
        ? status
        : "Available",
      variants,
      images: [],
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   GET ALL PRODUCTS
========================= */
export const getAllProducts = async (req, res) => {
  try {
    let { search, page = 1, limit = 10, sortBy = "createdAt", order = "desc" } = req.query;
    let query = {};

    if (req.user?.role === "user") query.status = "Available";

    if (search) {
      const regex = { $regex: search, $options: "i" };
      query.$or = [
        { name: regex },
        { description: regex },
        { "variants.sku": regex },
        { "variants.color": regex },
      ];

      if (!isNaN(search)) {
        query.$or.push(
          { "variants.price": Number(search) },
          { "variants.ram": Number(search) },
          { "variants.storage": Number(search) }
        );
      }
    }

    const skip = (page - 1) * limit;
    const sortOrder = order === "asc" ? 1 : -1;

    const products = await Product.find(query)
      .populate("category", "name")
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: products.map(p => ({
        ...p,
        images: p.images.map(img => img.url),
      })),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   GET PRODUCT BY ID
========================= */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category", "name")
      .lean();

    if (!product) return res.status(404).json({ message: "Product not found" });

    if (req.user?.role === "user" && product.status !== "Available") {
      return res.status(403).json({ message: "Product not available" });
    }

    res.json({
      success: true,
      data: { ...product, images: product.images.map(img => img.url) },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   UPLOAD PRODUCT IMAGE
========================= */
export const uploadProductImage = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.images.push({
      url: req.file.path,
      public_id: req.file.filename,
    });

    await product.save();
    res.json({ success: true, message: "Image uploaded", data: product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   DELETE PRODUCT IMAGE
========================= */
export const deleteProductImage = async (req, res) => {
  try {
    const { productId, public_id } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    await cloudinary.uploader.destroy(public_id);
    product.images = product.images.filter(img => img.public_id !== public_id);
    await product.save();

    res.json({ success: true, message: "Image deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   UPDATE PRODUCT
========================= */
export const updateProduct = async (req, res) => {
  try {
    const { category, name, description, status, variants } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (category) {
      const cat = await Category.findById(category);
      if (!cat) return res.status(404).json({ message: "Invalid category" });
      product.category = category;
    }

    if (name) product.name = name.trim();
    if (description) product.description = description;
    if (status) product.status = status;
    if (variants) product.variants = variants;

    await product.save();
    res.json({ success: true, message: "Product updated", data: product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   DELETE PRODUCT
========================= */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    for (let img of product.images) {
      await cloudinary.uploader.destroy(img.public_id);
    }

    await product.deleteOne();
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   STOCK MANAGEMENT
========================= */
export const decreaseStock = async (req, res) => {
  try {
    const { productId, variantSku, quantity } = req.body;
    if (!quantity || quantity <= 0)
      return res.status(400).json({ message: "Invalid quantity" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const variant = product.variants.find(v => v.sku === variantSku);
    if (!variant) return res.status(404).json({ message: "Variant not found" });

    if (variant.stock < quantity)
      return res.status(400).json({ message: `Only ${variant.stock} left` });

    variant.stock -= quantity;

    product.status =
      product.variants.reduce((sum, v) => sum + v.stock, 0) === 0
        ? "Out of Stock"
        : "Available";

    await product.save();
    res.json({ success: true, message: "Stock decreased" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const increaseStock = async (req, res) => {
  try {
    const { productId, variantSku, quantity } = req.body;
    if (!quantity || quantity <= 0)
      return res.status(400).json({ message: "Invalid quantity" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const variant = product.variants.find(v => v.sku === variantSku);
    if (!variant) return res.status(404).json({ message: "Variant not found" });

    variant.stock += quantity;

    product.status = "Available";
    await product.save();

    res.json({ success: true, message: "Stock increased" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
