"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { useCartStore } from "@/lib/cartStore";
import { Badge } from "./ui/badge";
import Image from "next/image";

const ProductDetails = ({ product }: any) => {
  const [isClick, setIsClick] = useState(false);
  const { addToCart, removeFromCart } = useCartStore();
  const [orderSelectedItem, setOrderSelectedItem] = useState({});

  const handleAddCart = () => {
    addToCart({
      _id: product._id || product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      brand: product.brand,
      description: product.description,
      category: product.category,
    });
    setIsClick(true);
  };

  const handleRemoveCart = () => {
    removeFromCart(product._id || product.id);
    setIsClick(false);
  };

  const navigateToOrderPage = () => {
    const productData = [{
    _id: product._id || product.id,
    name: product.name,
    price: product.price,
    image: product.images[0],
    brand: product.brand,
    description: product.description,
    category: product.category,
  }];

  sessionStorage.setItem("checkoutItems", JSON.stringify(productData));
  };

  return (
    <div className="w-full flex justify-between gap-10 tablet:flex-nowrap flex-wrap">
      <div className="tablet:w-[50%] w-full">
        <h1 className="text-4xl font-bold">{product.name}</h1>
        <p className="text-lg text-muted-foreground mt-6">
          {product.description}
        </p>
        <p className="text-lg font-bold mt-10">
          Price:{" "}
          <span className="text-red-500 font-medium">${product.price}</span>
        </p>
        <p className="text-lg font-bold">
          Available Stock:{" "}
          <span className="text-red-500 font-medium">{product.stock}</span>
        </p>
        <div className="flex items-center gap-2 mt-6">
          <Badge>{product.brand}</Badge>
          <Badge>{product.category?.name}</Badge>
        </div>
        <div className="flex gap-2 mt-10">
          {isClick === true ? (
            <Button
              variant={"navbarBtn"}
              size={"lg"}
              onClick={handleRemoveCart}
            >
              Remove From Cart
            </Button>
          ) : (
            <Button variant={"navbarBtn"} size={"lg"} onClick={handleAddCart}>
              Add To Cart
            </Button>
          )}
          <Link href="/checkout">
            <Button variant={"navbarBtn"} size={"lg"} onClick={() => navigateToOrderPage()}>
              Order
            </Button>
          </Link>
        </div>
      </div>
      <Image
        src={product.images[0]}
        alt={product.name}
        height={100}
        width={100}
        className="tablet:w-[50%] w-full tablet:h-[30rem] h-[20rem] object-cover"
      />
    </div>
  );
};

export default ProductDetails;
