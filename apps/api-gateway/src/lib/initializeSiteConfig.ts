import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const initializeConfig = async () => {
  try {
    const existingConfig = await prisma.site_config.findFirst();

    if (!existingConfig) {
      await prisma.site_config.create({
        data: {
          categories: [
            "Electronics",
            "Clothing",
            "Home & Garden",
            "Toys & Games",
            "Sports & Outdoors",
            "Health & Beauty",
          ],
          subCategories: {
            Electronics: ["Smartphones", "Laptops", "Tablets", "TVs", "Audio"],
            Clothing: ["Men", "Women", "Children", "Accessories"],
            "Home & Garden": [
              "Furniture",
              "Home Decor",
              "Garden & Outdoor",
              "Kitchenware",
            ],
            "Toys & Games": ["Toys", "Games", "Puzzles", "Sports Equipment"],
            "Sports & Outdoors": ["Sports", "Outdoor", "Fitness", "Hiking"],
            "Health & Beauty": ["Skincare", "Haircare", "Beauty", "Health"],
          },
        },
      });
    }
  } catch (error) {
    console.error("Error initializing site config:", error);
  }
};

export default initializeConfig;
