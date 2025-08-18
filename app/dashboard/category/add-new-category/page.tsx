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
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast, Bounce } from "react-toastify";
import { Loader2Icon } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Category name is required"),
  description: z.string().min(5, "Description is required"),
  image: z.string().min(1, "Image is required"), // single image
});

const Page = () => {
  const router = useRouter();
  const [uploadedImage, setUploadedImage] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const defaultValues = {
    name: "",
    description: "",
    image: "",
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // Upload single file
  async function uploadFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Upload failed");

    const data = await res.json();
    return data.url; // return single image URL
  }

  async function handleUpload(files: File[]) {
    try {
      if (files.length === 0) return;

      const url = await uploadFile(files[0]); // only first file
      setUploadedImage(url);
      form.setValue("image", url); // save to form state
    } catch (err) {
      console.error(err);
      alert("Image upload failed");
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error("Failed to save category");

      setLoading(false);
      toast.success("Category Saved Successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
      form.reset();
      setUploadedImage("");
      router.push("/dashboard/product");
    } catch (err) {
      console.error(err);
      toast.error("Error Saving Category!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    }
  }

  return (
    <PageContainer scrollable>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
      <div className="flex-1 space-y-4">
        <Card className="mx-auto w-full">
          <CardHeader>
            <CardTitle className="text-left text-2xl font-bold">
              Add Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                {/* Single Image Upload */}
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Image</FormLabel>
                      <FormControl>
                        <FileUploader
                          value={uploadedImage ? [uploadedImage] : []}
                          onValueChange={() => {}}
                          onUpload={handleUpload}
                          maxFiles={1}
                          maxSize={4 * 1024 * 1024}
                          multiple={false}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Category Name */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter category name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Description */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter category description"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {loading ? (
                  <Button disabled>
                    <Loader2Icon className="animate-spin" /> Add Category
                  </Button>
                ) : (
                  <Button type="submit">Add Category</Button>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default Page;
