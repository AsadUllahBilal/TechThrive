"use client";

import React from "react";
import { Heading } from "@/components/ui/heading";
import { useEffect, useState } from "react";
import { Product } from "@/types/product";
import ProductCard from "@/components/ProductCard";

type pageProps = {
  params: { id: Promise<string> };
};

const CategoryPage = ({ params }: pageProps) => {
  const { id } = React.use(params);
  const [categories, setCategories] = useState<
    {
      _id: string;
      name: string;
      slug: string;
      image: string;
      description: string;
    }[]
  >([]);
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        const categoryList = Array.isArray(data) ? data : data.categories;
        setCategories(categoryList || []);
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    }
    fetchCategories();
  }, []);

  const filterCategories = categories.filter((c) => {
    return c.slug.toLowerCase().includes(id);
  });

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        const productList = Array.isArray(data) ? data : data.products;
        setProducts(productList || []);
      } catch (error) {
        console.error("Failed To Load Products:", error);
      }
    }
    fetchProducts();
  }, []);

  const filterProducts = products.filter((c) => {
    return c.category?.slug.toLowerCase().includes(id);
  });

  return (
    <section className="w-full min-h-full px-20 py-10">
      {filterCategories.map((c) => (
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
          filterProducts.map((p) => (
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
