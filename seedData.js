import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "./Models/Category.js";
import Product from "./Models/Product.js";

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log("Cleared existing categories and products.");

    // Create Categories
    const categories = await Category.insertMany([
      { name: "Mobiles", description: "Latest smartphones and accessories" },
      { name: "Laptops", description: "High-performance laptops and ultrabooks" },
      { name: "Home Appliances", description: "Smart home electronics and appliances" },
    ]);

    const catMap = {};
    categories.forEach(cat => {
      catMap[cat.name.toLowerCase()] = cat._id;
    });

    // Create Products
    const products = [
      {
        category: catMap["mobiles"],
        name: "iPhone 15 Pro",
        brand: "Apple",
        description: "The latest iPhone with Titanium design and A17 Pro chip.",
        images: [{ url: "https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=800", public_id: "iphone15pro" }],
        status: "Available",
        specifications: {
          Display: "6.1-inch Super Retina XDR",
          Chip: "A17 Pro",
          Camera: "48MP Main | Ultra Wide | Telephoto",
        },
        variants: [
          { color: "Black", ram: 8, storage: 128, sku: "IP15P-BLK-128", price: 129900, stock: 50 },
          { color: "Blue", ram: 8, storage: 256, sku: "IP15P-BLU-256", price: 139900, stock: 30 },
        ],
      },
      {
        category: catMap["mobiles"],
        name: "Samsung Galaxy S24 Ultra",
        brand: "Samsung",
        description: "The ultimate Galaxy experience with Galaxy AI.",
        images: [{ url: "https://images.unsplash.com/photo-1707227152093-6893693297d0?auto=format&fit=crop&q=80&w=800", public_id: "s24ultra" }],
        status: "Available",
        specifications: {
          Display: "6.8-inch Dynamic AMOLED 2X",
          Chip: "Snapdragon 8 Gen 3",
          Camera: "200MP Main | 50MP Periscope",
        },
        variants: [
          { color: "Gray", ram: 12, storage: 256, sku: "S24U-GRY-256", price: 129999, stock: 40 },
          { color: "Black", ram: 12, storage: 512, sku: "S24U-BLK-512", price: 139999, stock: 25 },
        ],
      },
      {
        category: catMap["laptops"],
        name: "MacBook Air M3",
        brand: "Apple",
        description: "Lean. Mean. M3 machine.",
        images: [{ url: "https://images.unsplash.com/photo-1517336714460-4c50d91c330d?auto=format&fit=crop&q=80&w=800", public_id: "macbookairm3" }],
        status: "Available",
        specifications: {
          Display: "13.6-inch Liquid Retina",
          Chip: "Apple M3",
          Battery: "Up to 18 hours",
        },
        variants: [
          { color: "Gray", ram: 8, storage: 256, sku: "MBA-M3-GRY-256", price: 114900, stock: 20 },
          { color: "White", ram: 16, storage: 512, sku: "MBA-M3-WHT-512", price: 134900, stock: 15 },
        ],
      },
      {
        category: catMap["laptops"],
        name: "Dell XPS 13",
        brand: "Dell",
        description: "The world's smallest 13-inch laptop.",
        images: [{ url: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800", public_id: "dellxps13" }],
        status: "Available",
        specifications: {
          Display: "13.4-inch InfinityEdge",
          Processor: "Intel Core i7",
          RAM: "16GB LPDDR5",
        },
        variants: [
          { color: "White", ram: 12, storage: 512, sku: "XPS13-WHT-512", price: 145000, stock: 10 },
        ],
      },
      {
        category: catMap["home appliances"],
        name: "LG Smart OLED TV",
        brand: "LG",
        description: "Self-lit pixels for infinite contrast.",
        images: [{ url: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=800", public_id: "lgoledtv" }],
        status: "Available",
        specifications: {
          Size: "55-inch",
          Resolution: "4K UHD",
          OS: "webOS",
        },
        variants: [
          { color: "Black", ram: 4, storage: 64, sku: "LG-OLED-55", price: 159990, stock: 15 },
        ],
      },
    ];

    await Product.insertMany(products);
    console.log("Successfully seeded ElectroMart data!");

    process.exit(0);
  } catch (error) {
    if (error.name === 'ValidationError') {
      console.error("Validation Error Details:");
      for (let field in error.errors) {
        console.error(`- ${field}: ${error.errors[field].message}`);
      }
    } else {
      console.error("Error seeding data:", error);
    }
    process.exit(1);
  }
};

seedData();
