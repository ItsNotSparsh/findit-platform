import "dotenv/config";
import { db, client } from "./index";
import { categories } from "./schema";

const defaultCategories = [
  { name: "Phones", slug: "phones" },
  { name: "Laptops", slug: "laptops" },
  { name: "Headphones", slug: "headphones" },
  { name: "Wallets", slug: "wallets" },
  { name: "Keys", slug: "keys" },
  { name: "Bags", slug: "bags" },
  { name: "ID Cards", slug: "id-cards" },
  { name: "Books", slug: "books" },
  { name: "Glasses", slug: "glasses" },
  { name: "Clothing", slug: "clothing" },
  { name: "Watches", slug: "watches" },
  { name: "Other", slug: "other" },
];

async function main() {
  await db.insert(categories).values(defaultCategories).onConflictDoNothing({ target: categories.slug });
  console.log("Default categories are ready.");
}

main()
  .catch((error) => {
    console.error("Category setup failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await client.end();
  });
