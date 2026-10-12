const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const Product = require("../models/Product");
const Category = require("../models/Category");

const categoryName = "Incense Sticks";
const imageBaseUrl = (process.env.BASE_URL || "http://localhost:8502").replace(/\/$/, "");
const imageDirectory = path.resolve(__dirname, "../statics/product_images");

const productSamples = [
  {
    title: "Demo Sandalwood Incense Sticks 50g Pack",
    brand_name: "AromaNest",
    category: categoryName,
    fragnance_type: "Warm sandalwood",
    mrp: 299,
    discount: 10,
    actual_price: 269,
    stock: 24,
    description: "Sample sandalwood incense sticks for a calm, woody fragrance at home. Update this sample copy in Admin before selling.",
    burning_time: "About 40 minutes per stick",
    weight: "50 g",
    material: "Natural wood powder and fragrance oils",
    image: "demo-sandalwood-incense.jpg",
  },
  {
    title: "Demo Lavender Incense Sticks 50g Pack",
    brand_name: "AromaNest",
    category: categoryName,
    fragnance_type: "Soft lavender",
    mrp: 279,
    discount: 10,
    actual_price: 251,
    stock: 18,
    description: "Sample lavender incense sticks with a gentle floral aroma for evening relaxation. Update this sample copy in Admin before selling.",
    burning_time: "About 35 minutes per stick",
    weight: "50 g",
    material: "Natural wood powder and fragrance oils",
    image: "demo-lavender-incense.jpg",
  },
  {
    title: "Demo Jasmine Incense Sticks 50g Pack",
    brand_name: "AromaNest",
    category: categoryName,
    fragnance_type: "Fresh jasmine",
    mrp: 279,
    discount: 10,
    actual_price: 251,
    stock: 18,
    description: "Sample jasmine incense sticks with a fresh floral scent for everyday use. Update this sample copy in Admin before selling.",
    burning_time: "About 35 minutes per stick",
    weight: "50 g",
    material: "Natural wood powder and fragrance oils",
    image: "demo-jasmine-incense.jpg",
  },
];

async function seedDemoProducts() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing from Backend/.env");
  }

  for (const product of productSamples) {
    if (!fs.existsSync(path.join(imageDirectory, product.image))) {
      throw new Error(`Missing product image: ${product.image}`);
    }
  }

  await mongoose.connect(process.env.MONGO_URI);
  await Category.updateOne(
    { name: categoryName },
    { $setOnInsert: { name: categoryName } },
    { upsert: true }
  );

  for (const sample of productSamples) {
    const { image, ...product } = sample;
    await Product.findOneAndUpdate(
      { title: product.title },
      {
        $setOnInsert: {
          ...product,
          images: [`${imageBaseUrl}/assets/product_images/${image}`],
        },
      },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
    );
  }

  const seededCount = await Product.countDocuments({
    title: { $in: productSamples.map(({ title }) => title) },
  });
  console.log(`Catalog ready: ${seededCount} sample products in "${categoryName}".`);
}

seedDemoProducts()
  .catch((error) => {
    console.error("Could not seed the sample product catalog:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
