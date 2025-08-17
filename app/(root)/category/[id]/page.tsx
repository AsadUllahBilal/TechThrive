import { Heading } from "@/components/ui/heading";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types/product";

type PageProps = {
  params: { id: string };
};

export const dynamic = "force-dynamic";

async function getData() {
  // Use absolute URL only in production
  const baseUrl =
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_BASE_URL || "https://tech-thrive-tau.vercel.app"
      : "http://localhost:3000";

  const [catRes, prodRes] = await Promise.all([
    fetch(`${baseUrl}/api/categories`, {
      cache: "no-store",
    }),
    fetch(`${baseUrl}/api/products`, {
      cache: "no-store",
    }),
  ]);

  if (!catRes.ok) {
    throw new Error(`Failed to fetch categories: ${catRes.status}`);
  }
  if (!prodRes.ok) {
    throw new Error(`Failed to fetch products: ${prodRes.status}`);
  }

  const categories = await catRes.json();
  const products = await prodRes.json();

  return {
    categories: Array.isArray(categories)
      ? categories
      : categories.categories || [],
    products: Array.isArray(products)
      ? products
      : products.products || [],
  };
}

const CategoryPage = async ({ params }: PageProps) => {
  const { id } = params;
  const { categories, products } = await getData();

  const filterCategories = categories.filter((c: any) =>
    c.slug.toLowerCase().includes(id.toLowerCase())
  );

  const filterProducts = products.filter(
    (p: Product) => p.category?.slug.toLowerCase().includes(id.toLowerCase())
  );

  return (
    <section className="w-full min-h-full px-20 py-10">
      {filterCategories.map((c: any) => (
        <div key={c._id}>
          <img
            src={c.image}
            alt={c.name}
            className="w-[130px] h-[120px] rounded-md object-cover mb-6"
          />
          <Heading title={c.name} description={c.description} />
          <h1 className="text-3xl font-bold mt-10">{c.name} Products</h1>
        </div>
      ))}

      <div className="w-full flex items-center gap-6 mt-10 flex-wrap">
        {filterProducts.length > 0 ? (
          filterProducts.map((p: Product) => (
            <ProductCard productDetails={p} key={p._id} />
          ))
        ) : (
          <p>No Products Is here</p>
        )}
      </div>
    </section>
  );
};

export default CategoryPage;
