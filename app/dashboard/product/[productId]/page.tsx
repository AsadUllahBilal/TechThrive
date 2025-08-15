"use client";

import PageContainer from "@/components/layout/page-container";
import { FileUploader } from "@/components/file-uploader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  category: z.string().min(1, "Category is required"),
  price: z.coerce.number().min(0, "Price must be positive"),
  description: z.string().min(5, "Description is required"),
  images: z.array(z.string()).optional(),
  stock: z.coerce.number().min(0, "stock is required"),
  brand: z.string().min(2, "brand Name is required.").optional(),
});

type PageProps = { params: Promise<{ productId: string }> };

export default function Page({ params }: PageProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>(
    []
  );

  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const defaultValues = {
    name: "",
    category: "",
    price: 0,
    description: "",
    images: [],
    stock: 0,
    brand: "",
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: defaultValues,
  });
  // Upload function to send files to backend and get URLs
  async function uploadFiles(files: File[]): Promise<string[]> {
    const urls: string[] = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      urls.push(data.url);
    }

    return urls;
  }

  async function handleUpload(files: File[]) {
    try {
      const urls = await uploadFiles(files);
      setUploadedImages(urls);

      // Save URLs to form state, always as array (you can adapt if you want single string)
      form.setValue("images", urls);
    } catch (err) {
      console.error(err);
      alert("Image upload failed");
    }
  }

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
  }, []); // ✅ runs once, no dependency on Data

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await fetch(`/api/products/${(await params).productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error("Failed to save product");

      alert("Product Edited successfully!");
      form.reset();
      setUploadedImages([]);
      router.push("/dashboard/product");
    } catch (err) {
      console.error(err);
      alert("Error Editing product");
      console.log(err);
      
    }
  }
  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <Card className="mx-auto w-full">
          <CardHeader>
            <CardTitle className="text-left text-2xl font-bold">
              Edit Product
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                {/* Image Upload */}
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Images</FormLabel>
                      <FormControl>
                        <FileUploader
                          value={field.value || []}
                          onValueChange={field.onChange}
                          onUpload={handleUpload}
                          maxFiles={4}
                          maxSize={4 * 1024 * 1024}
                          multiple
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Product Name */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter product name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Product Brand */}
                  <FormField
                    control={form.control}
                    name="brand"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Brand Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter product brand name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Category */}
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat._id} value={cat._id}>
                                {cat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Price */}
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="Enter price"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* stock */}
                  <FormField
                    control={form.control}
                    name="stock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Stock</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="1"
                            placeholder="Enter Product Stock"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter product description"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit">Edit Product</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}