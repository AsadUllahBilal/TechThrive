import { searchParamsCache } from "@/lib/searchparams";
import { ProductTable } from "../products/components/product-tables";
import { columns } from "../products/components/product-tables/columns";
import { cartProduct } from "@/components/ProductDetails";

export default function ProductListingCartPage() {
//   const page = Number(searchParamsCache.get("page")) || 1;
//   const search = searchParamsCache.get("name") || "";
//   const pageLimit = Number(searchParamsCache.get("perPage")) || 10;
//   const categories = searchParamsCache.get("category") || "";

//   const filters = {
//     page,
//     limit: pageLimit,
//     search,
//     categories,
//   };

  return (
    <ProductTable
      data={cartProduct}
      totalItems={cartProduct.length}
      columns={columns}
    />
  );
}
