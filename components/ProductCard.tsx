import { Product } from "@/types/product";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";

const ProductCard = ({
  productDetails
}: {
  productDetails: Product;
}) => {
    const trimDes = (des: string) => {
        if(des && des.length > 70 ){
            return des.slice(0, 70) + "..."
        }

        return des;
    }

    const trimName = (name: string) => {
        if(name && name.length > 32 ){
            return name.slice(0, 32) + "..."
        }

        return name;
    }
  return (
    <div className="w-[300px] p-3 rounded-md bg-gray-200 dark:bg-[#222] min-h-[26.5rem] shadow-2xl" key={productDetails._id}>
      <div className="flex items-center justify-between">
        <Badge variant={"outline"} className="bg-red-500">{productDetails.brand || "No Brand"}</Badge>
        <Badge variant={"outline"} className="bg-yellow-500">{productDetails.category?.name || "Uncategorized"}</Badge>
      </div>
      <Image
        src={productDetails.images[0]}
        alt={productDetails.name}
        height={100}
        width={100}
        className="w-full h-[10rem] object-cover mt-3"
      />
      <Link href={`/product/${productDetails._id}`}>
        <h1 className="text-2xl font-bold my-2">
            {trimName(productDetails.name)}
        </h1>
      </Link>
      <p className="text-muted-foreground text-sm">
        {trimDes(productDetails.description)}
      </p>
      <div className="flex items-center justify-between">
        <p className="text-md my-3">Price: <span className="text-red-500">{productDetails.price}</span></p>
        <p className="text-md my-3">Stock: <span className="text-red-500">{productDetails.stock}</span></p>
      </div>
      <Link href={`/product/${productDetails._id}`}>
        <Button variant={"navbarBtn"} size={"sm"} className="bg-red-600 text-white hover:bg-red-700 transition-all">View Details</Button>
      </Link>
    </div>
  );
};

export default ProductCard;
