import mongoose from "mongoose";

// Variant Schema (ONE variant = ONE SKU)
const variantSchema = new mongoose.Schema({
  color: {
    type: String,
    enum: ["Red", "Blue", "Green", "Black", "White", "Yellow", "Pink", "Gray", "Maroon", "Purple"],
    required: true,
  },

  ram: {
    type: Number, // GB
    enum: [4, 6, 8, 12, 16, 24, 32, 64],
    required: true,
  },

  storage: {
    type: Number, // GB
    enum: [64, 128, 256, 512, 1024, 2048],
    required: true,
  },

  sku: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },

  price: {
    type: Number,
    required: true,
    min: 0,
  },

  stock: {
    type: Number,
    default: 0,
    min: 0,
  },

  // 🔥 EMI SUPPORT
  emiEligible: {  
    type: Boolean,
    default: false,
  },

  emiPlans: [
    {
      months: { type: Number, enum: [3, 6, 9, 12, 18, 24] },
      interestRate: { type: Number, default: 0 }, // %
    }
  ],
});

// Product schema
const productSchema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Product must belong to a category"],
    },
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: [3, "Product name must be at least 3 characters"],
      maxlength: [200, "Product name cannot exceed 200 characters"],
    },
    brand: {
      type: String,
      trim: true,
      default: null,
    },
    specifications: {
      type: Map,
      of: String,
      default: {},
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
      default: null,
    },
    images: [
      {
        url: {
          type: String,
          trim: true,
          required: true,
          validate: {
            validator: (v) => /^https?:\/\/.*$/i.test(v),
            message: "Image must be a valid URL",
          },
        },
        public_id: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],
    status: {
      type: String,
      enum: ["Available", "Out of Stock", "Discontinued"],
      default: "Available",
    },
    variants: [variantSchema], // Multiple variants
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
