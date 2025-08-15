import { notFound } from "next/navigation";
import ProductForm from "./product-form";
import { getProductById } from "@/lib/getDBProducts"; // <-- our real DB fetch
import { Product } from "@/types/product";

type TProductViewPageProps = {
  productId: string;
};

export default async function ProductViewPage({
  productId,
}: TProductViewPageProps) {
  let product: Product | null = null;
  let pageTitle = "Create New Product";

  if (productId !== "new") {
    const data = await getProductById(productId);
    product = data;
    pageTitle = "Edit Product";
  }

  return <ProductForm initialData={product} productId={productId} pageTitle={pageTitle} />;
}
