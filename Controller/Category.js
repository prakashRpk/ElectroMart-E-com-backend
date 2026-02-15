import Category from "../Models/Category.js";

// ---------------- Create Category ----------------
export const createCategory = async (req, res) => {
  try {
    const { name, description, status } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: "Category name is required" });
    }

    const exists = await Category.findOne({
      name: { $regex: `^${name.trim()}$`, $options: "i" }
    });

    if (exists) {
      return res.status(400).json({ success: false, message: "Category already exists" });
    }

    const category = await Category.create({
      name: name.trim(),
      description,
      status
    });

    res.status(201).json({ success: true, message: "Category created", category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------- Get All Categories ----------------
export const getAllCategories = async (req, res) => {
  try {
    let { page = 1, limit, search = "", sortBy = "createdAt", order = "desc" } = req.query;

    const query = {};

    // Users see only active categories
    if (req.user?.role?.toLowerCase() === "user") {
      query.status = "active";
    }

    if (search) {
      const regex = { $regex: search, $options: "i" };
      query.$or = [{ name: regex }, { description: regex }];
    }

    const total = await Category.countDocuments(query);

    let categoriesQuery = Category.find(query).sort({
      [sortBy]: order === "asc" ? 1 : -1
    });

    if (limit) {
      page = Number(page);
      limit = Number(limit);
      categoriesQuery = categoriesQuery.skip((page - 1) * limit).limit(limit);
    }

    const categories = await categoriesQuery;

    res.json({
      success: true,
      total,
      page,
      pages: limit ? Math.ceil(total / limit) : 1,
      categories
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------- Get Category By Id ----------------
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category)
      return res.status(404).json({ success: false, message: "Category not found" });

    if (
      req.user?.role?.toLowerCase() === "user" &&
      category.status !== "active"
    ) {
      return res.status(403).json({ success: false, message: "Category is inactive" });
    }

    res.json({ success: true, category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------- Update Category ----------------
export const updateCategory = async (req, res) => {
  try {
    const updates = {};
    const { name, description, status } = req.body;

    if (name) {
      const duplicate = await Category.findOne({
        _id: { $ne: req.params.id },
        name: { $regex: `^${name.trim()}$`, $options: "i" }
      });
      if (duplicate)
        return res.status(400).json({ success: false, message: "Category name already exists" });

      updates.name = name.trim();
    }

    if (description !== undefined) updates.description = description;
    if (status) updates.status = status;

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!category)
      return res.status(404).json({ success: false, message: "Category not found" });

    res.json({ success: true, message: "Category updated", category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------- Delete Category ----------------
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category)
      return res.status(404).json({ success: false, message: "Category not found" });

    res.json({ success: true, message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
