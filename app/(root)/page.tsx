"use client";

import { Heading } from "@/components/ui/heading";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { IconSearch } from "@tabler/icons-react";
import { Product } from "@/types/product";
import ProductCard from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [categories, setCategories] = useState<
    { _id: string; name: string; slug: string; image: string }[]
  >([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch Categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        const categoryList = Array.isArray(data) ? data : data.categories;
        setCategories(categoryList || []);
      } catch (err) {
        console.error("Failed to load categories:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  // Fetch Products
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        const productList = Array.isArray(data) ? data : data.products;
        setProducts(productList || []);
        setFilteredProducts(productList || []); // initially show all
      } catch (error) {
        console.error("Failed To Load Products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Filter products when search term changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);
  
  return (
    <section className="w-full min-h-full px-20 py-10">
      <Heading
        title="Home Page"
        description="You can buy almost all the Tech Products from this website."
        />
      <h1 className="mt-10">
        <Heading title="All Categories" />
      </h1>

      {loading && (
        <div className="w-full bg-[#ddd] rounded-lg flex items-center flex-wrap p-6 gap-3 mt-5 dark:bg-[#222]">
            <Skeleton className="w-[157px] h-[9rem]" />
            <Skeleton className="w-[157px] h-[9rem]" />
            <Skeleton className="w-[157px] h-[9rem]" />
            <Skeleton className="w-[157px] h-[9rem]" />
            <Skeleton className="w-[157px] h-[9rem]" />
        </div>
      )}

      <div className="w-full bg-[#ddd] rounded-lg flex items-center flex-wrap p-6 gap-3 mt-5 dark:bg-[#222]">
        {categories.map((cat) => (
          <Link href={`/category/${cat.slug}`} key={cat._id}>
            <div className="bg-[#fff] dark:bg-[#171717] w-[157px] rounded-md p-2 grid place-items-center">
              <img
                src={cat.image}
                alt="categoryPic"
                className="w-full h-[8rem] object-cover"
              />
              <p>{cat.name}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="w-full mt-10">
        <div className="w-full flex items-center justify-between flex-wrap gap-2">
          <Heading title="All Products" />
          <div className="flex items-center justify-center">
            <Button
              variant={"outline"}
              className="relative flex items-center justify-center gap-2 px-3"
            >
              <IconSearch size={18} />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none outline-none text-sm"
                placeholder="Search Any Product"
              />
            </Button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="w-full flex items-center gap-6 mt-10 flex-wrap">
          <Skeleton className="w-[300px] h-[26.5rem]"/>
          <Skeleton className="w-[300px] h-[26.5rem]"/>
          <Skeleton className="w-[300px] h-[26.5rem]"/>
          <Skeleton className="w-[300px] h-[26.5rem]"/>
          <Skeleton className="w-[300px] h-[26.5rem]"/>
        </div>
      )}
      <div className="w-full flex items-center gap-6 mt-10 flex-wrap">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((p) => (
            <ProductCard key={p._id} productDetails={p} />
          ))
        ) : (
          <p className="text-gray-500">No products found.</p>
        )}
      </div>
    </section>
  );
}
