import { Heading } from "@/components/ui/heading";
import HomeClient from "./HomeClient";

async function getData() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const [catRes, prodRes] = await Promise.all([
    fetch(`${baseUrl}/api/categories`, {
      cache: "no-store",
    }),
    fetch(`${baseUrl}/api/products`, {
      cache: "no-store",
    }),
  ]);

  const categories = await catRes.json();
  const products = await prodRes.json();

  return {
    categories: Array.isArray(categories) ? categories : categories.categories,
    products: Array.isArray(products) ? products : products.products,
  };
}

export default async function Page() {
  const { categories, products } = await getData();

  return (
    <section className="w-full min-h-full px-20 py-10">
      <Heading
        title="Home Page"
        description="You can buy almost all the Tech Products from this website."
      />
      <HomeClient categories={categories} products={products} />
    </section>
  );
}