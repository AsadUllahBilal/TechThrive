import { Heading } from "@/components/ui/heading";
import HomeClient from "./HomeClient";
import { getAllCategories, getAllProducts } from "@/lib/getDBData";

export default async function Page() {
  const [ categories, products ] = await Promise.all([
    getAllCategories(),
    getAllProducts()
  ]);

  return (
    <section className="w-full min-h-full px-2 py-10 tablet:px-20 tablet:py-10">
      <Heading
        title="Home Page"
        description="You can buy almost all the Tech Products from this website."
      />
      <HomeClient categories={JSON.parse(JSON.stringify(categories))} products={JSON.parse(JSON.stringify(products))} />
    </section>
  );
}