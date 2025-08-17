import ProductDetails from "@/components/ProductDetails";
import { getProductById } from "@/lib/getDBProducts";
import Reviews from "@/components/ProductReviews";

type PageProps = {
  params: { id: string };
};

export const dynamic = "force-dynamic";

const ProductDetailsPage = async ({ params }: PageProps) => {
  const { id } = params;

  const productDetails = await getProductById(id);

  return (
    <section className="w-full min-h-full px-20 py-10">
      <ProductDetails product={productDetails} />
      <Reviews productId={id} />
    </section>
  );
};

export default ProductDetailsPage;