import { searchParamsCache } from "@/lib/searchparams";
import { ProductTable } from "./product-tables";
import { columns } from "./product-tables/columns";
import { getAllProducts } from "@/lib/getDBProducts";

export default async function ProductListingPage() {
  const page = Number(searchParamsCache.get("page")) || 1;
  const search = searchParamsCache.get("name") || "";
  const pageLimit = Number(searchParamsCache.get("perPage")) || 10;
  const categories = searchParamsCache.get("category") || "";

  const filters = {
    page,
    limit: pageLimit,
    search,
    categories,
  };

  const { products, total_products } = await getAllProducts(filters);

  return (
    <ProductTable
      data={products}
      totalItems={total_products}
      columns={columns}
    />
  );
}
