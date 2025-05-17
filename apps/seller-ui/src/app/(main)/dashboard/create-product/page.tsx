"use client";
import ColorSelector from "@/components/ColorSelector";
import CustomProperties from "@/components/CustomProperties";
import CustomSpecification from "@/components/CustomSpecification";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import SizeSelector from "@/components/SizeSelector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import axiosInstance from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import React, { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";

const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), {
  ssr: false,
});

const CreateProductPage = () => {
  // All useStates
  const [openImageModal, setOpenImageModal] = useState(false);
  const [isChanged, setIsChanged] = useState(true);
  const [images, setImages] = useState<(File | null)[]>([null]);
  const [loading, setLoading] = useState(false);

  const {
    watch,
    control,
    setValue,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/product/api/get-categories");
        return res.data;
      } catch (error) {
        console.log(error);
      }
    },
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  const categories = data?.categories || [];
  const subCategoriesData = data?.subCategories || {};

  const selectedCategory = watch("category");
  const regularPrice = watch("regular_price");

  const subCategories = useMemo(() => {
    return selectedCategory ? subCategoriesData[selectedCategory] : [];
  }, [selectedCategory, subCategoriesData]);

  const onSubmit = (data: any) => {
    console.log(data);
  };

  const handleImageChange = (file: File | null, index: number) => {
    const updatedImages = [...images];

    updatedImages[index] = file;

    if (index === images.length - 1 && images.length < 8) {
      updatedImages.push(null);
    }

    setImages(updatedImages);
    setValue("images", updatedImages);
  };

  const handleRemoveImage = (index: number) => {
    setImages((prevImages) => {
      const updatedImages = [...prevImages];

      if (index === -1) {
        updatedImages[0] = null;
      } else {
        updatedImages.splice(index, 1);
      }

      if (!updatedImages.includes(null) && updatedImages.length < 8) {
        updatedImages.push(null);
      }

      return updatedImages;
    });
    setValue("images", images);
  };

  const handleSaveDraft = () => {
    console.log("Save Draft");
  };

  return (
    <form
      className="w-full mx-auto p-8 text-gray-800"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Content Layout */}
      <div className="py-4 w-full flex gap-6">
        {/* Left Side */}
        <div className="md:w-[35%]">
          {images?.length > 0 && (
            <ImagePlaceholder
              setOpenImageModal={setOpenImageModal}
              size="765 x 850"
              small={false}
              index={0}
              onImageChange={handleImageChange}
              onRemove={handleRemoveImage}
            />
          )}
          <div className="grid grid-cols-2 gap-3 mt-4">
            {images?.slice(1).map((_, index) => (
              <ImagePlaceholder
                setOpenImageModal={setOpenImageModal}
                size="765 x 850"
                key={index}
                small
                index={index + 1}
                onImageChange={handleImageChange}
                onRemove={handleRemoveImage}
              />
            ))}
          </div>
        </div>

        {/*  Right Side - Form Inputs */}
        <div className="md:w-[65%]">
          <div className="w-full flex gap-6">
            {/* Product Title */}
            <div className="w-2/4 space-y-4">
              <div className="space-y-2">
                <Label>Product Title</Label>
                <Input
                  className="border-gray-300"
                  placeholder="Enter Product Title"
                  {...register("title", { required: "Title is required!" })}
                />
                {errors.title && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.title.message as string}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Product Description</Label>
                <Textarea
                  rows={2}
                  cols={10}
                  className="border-gray-300"
                  placeholder="Enter Product Description"
                  {...register("description", {
                    required: "Description is required!",
                    validate: (value) => {
                      const wordCount = value.trim().split(/\s+/).length;
                      return (
                        wordCount <= 150 ||
                        `Description cannot exceed 150 words (Current: ${wordCount})`
                      );
                    },
                  })}
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.description.message as string}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Tags</Label>
                <Input
                  className="border-gray-300"
                  placeholder="samsung, apple, etc"
                  {...register("tags", {
                    required: "Separate related products tags with a coma,",
                  })}
                />
                {errors.tags && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.tags.message as string}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Product Warranty</Label>
                <Input
                  className="border-gray-300"
                  placeholder="Enter Product Warranty"
                  {...register("warranty", {
                    required: "Warranty is required!",
                  })}
                />
                {errors.warranty && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.warranty.message as string}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Slug</Label>
                <Input
                  className="border-gray-300"
                  placeholder="product_slug"
                  {...register("slug", {
                    required: "Slug is required!",
                    pattern: {
                      value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                      message:
                        "Slug must contain only lowercase letters, numbers, and hyphens",
                    },
                    minLength: {
                      value: 3,
                      message: "Slug must be at least 3 characters long",
                    },
                    maxLength: {
                      value: 50,
                      message: "Slug must be less than 50 characters",
                    },
                  })}
                />
                {errors.slug && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.slug.message as string}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Product Brand</Label>
                <Input
                  className="border-gray-300"
                  placeholder="Samsung, Apple"
                  {...register("brand", { required: "Brand is required!" })}
                />
                {errors.brand && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.brand.message as string}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <ColorSelector control={control} errors={errors} />
              </div>
              <div className="space-y-2">
                <CustomSpecification control={control} errors={errors} />
              </div>
              <div className="space-y-2">
                <CustomProperties control={control} errors={errors} />
              </div>
              <div className="space-y-2">
                <Controller
                  name="cash_on_delivery"
                  control={control}
                  defaultValue="yes"
                  rules={{ required: "Cash On Delivery is required!" }}
                  render={({ field }) => (
                    <div className="space-y-2">
                      <Label className="block font-semibold text-gray-600 mb-1">
                        Cash On Delivery *
                      </Label>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.cash_on_delivery && (
                        <p className="text-sm text-red-500">
                          {errors.cash_on_delivery.message as string}
                        </p>
                      )}
                    </div>
                  )}
                />
                {errors.cash_on_delivery && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.cash_on_delivery.message as string}
                  </p>
                )}
              </div>
            </div>
            <div className="w-2/4 space-y-4">
              <div className="space-y-2">
                <Label>Product Category</Label>
                {isLoading ? (
                  <Skeleton className="h-[40px] w-full" />
                ) : isError ? (
                  <p className="text-red-500 text-xs mt-1">
                    Error loading categories
                  </p>
                ) : (
                  <Controller
                    name="category"
                    control={control}
                    rules={{ required: "Category is required" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category: string) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                )}
                {errors.category && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.category.message as string}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Sub Category</Label>
                {isLoading ? (
                  <Skeleton className="h-[40px] w-full" />
                ) : isError ? (
                  <p className="text-red-500 text-xs mt-1">
                    Error loading categories
                  </p>
                ) : (
                  <Controller
                    name="subCategory"
                    control={control}
                    rules={{ required: "Sub Category is required" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a Sub Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {subCategories.map((subCategory: string) => (
                            <SelectItem key={subCategory} value={subCategory}>
                              {subCategory}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                )}
                {errors.subCategory && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.subCategory.message as string}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Details Description(Min 100 words)</Label>
                <Controller
                  name="details_description"
                  control={control}
                  rules={{
                    required: "Details Description is required!",
                    validate: (value) => {
                      const wordCount = value
                        ?.split(/\s+/)
                        .filter((word: string) => word).length;
                      return (
                        wordCount >= 100 ||
                        `Details Description must be at least 100 words (Current: ${wordCount})`
                      );
                    },
                  }}
                  render={({ field }) => (
                    <RichTextEditor
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label>Video Url</Label>
                <Input
                  className="border-gray-300"
                  placeholder="https://www.youtube.com/embed/"
                  {...register("video_url", {
                    pattern: {
                      value:
                        /^https:\/\/www\.youtube\.com\/embed\/[a-zA-Z0-9_-]+$/,
                      message: "Invalid Youtube Video Link",
                    },
                  })}
                />
                {errors.video_url && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.video_url.message as string}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Regular Price</Label>
                <Input
                  className="border-gray-300"
                  placeholder="Enter Regular Price($20)"
                  {...register("regular_price", {
                    valueAsNumber: true,
                    min: { value: 1, message: "Price must be greater than 0" },
                    validate: (value) => {
                      return !isNaN(value) || "Price must be a number";
                    },
                    required: "Regular Price is required!",
                  })}
                />
                {errors.regular_price && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.regular_price.message as string}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Sale Price</Label>
                <Input
                  placeholder="Enter Discount Price($10)"
                  {...register("sale_price", {
                    required: "Sale Price is required!",
                    valueAsNumber: true,
                    min: { value: 1, message: "Price must be greater than 0" },
                    validate: (value) => {
                      if (isNaN(value)) return "Only number are allowed!";
                      if (regularPrice && value >= regularPrice) {
                        return "Sale Price cannot be greater than Regular Price";
                      }
                      return true;
                    },
                  })}
                />
                {errors.sale_price && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.sale_price.message as string}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Stock</Label>
                <Input
                  className="border-gray-300"
                  placeholder="Enter Stock"
                  {...register("stock", {
                    required: "Stock is required!",
                    valueAsNumber: true,
                    min: { value: 1, message: "Stock must be greater than 0" },
                    max: {
                      value: 5000,
                      message: "Stock cannot be greater than 10000",
                    },
                    validate: (value) => {
                      if (isNaN(value)) return "Only number are allowed!";
                      if (!Number.isInteger(value))
                        return "Stock must be an integer";
                      return true;
                    },
                  })}
                />
                {errors.stock && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.stock.message as string}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <SizeSelector control={control} errors={errors} />
              </div>

              <div className="space-y-2">
                <Label>Select Discount Code</Label>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            {isChanged && (
              <Button
                type="submit"
                className="px-4 py-2 rounded-md"
                variant="outline"
                onClick={handleSaveDraft}
              >
                Save Draft
              </Button>
            )}

            <Button
              type="submit"
              className="px-4 py-2 rounded-md"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Product"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CreateProductPage;
