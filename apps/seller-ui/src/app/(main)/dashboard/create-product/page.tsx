"use client";
import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Controller, useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";

import ColorSelector from "@/components/ColorSelector";
import CustomProperties from "@/components/CustomProperties";
import CustomSpecification from "@/components/CustomSpecification";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import SizeSelector from "@/components/SizeSelector";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import axiosInstance from "@/utils/axiosInstance";
import { toast } from "sonner";
import {
  Wand,
  X,
  Save,
  Plus,
  Package,
  Image as ImageIcon,
  DollarSign,
  Tag,
  Palette,
  Settings,
  Upload,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { enhancement } from "@/utils/AIEnhancement";
import { useRouter } from "next/navigation";

const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), {
  ssr: false,
});

interface UploadedImage {
  fileId: string;
  file_url: string;
}

interface ProductFormValues {
  title: string;
  short_description: string;
  tags: string;
  category: string;
  subCategory: string;
  brand: string;
  slug: string;
  regular_price: number;
  sale_price: number;
  stock: number;
  detailed_description: string;
  warranty: string;
  video_url?: string;
  cash_on_delivery: string;
  discountCodes: string[];
  images?: (UploadedImage | null)[];
  colors?: string[];
  sizes?: string[];
  specifications?: Record<string, string>;
  properties?: Record<string, string>;
}

const CreateProductPage = () => {
  const router = useRouter();

  // All useStates
  const [openImageModal, setOpenImageModal] = useState(false);
  const [isChanged, setIsChanged] = useState(true);
  const [images, setImages] = useState<(UploadedImage | null)[]>([null]);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [pictureUploadingLoader, setPictureUploadingLoader] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [activeEffect, setActiveEffect] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>("basic");

  const {
    watch,
    control,
    setValue,
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ProductFormValues>({
    mode: "onChange",
    defaultValues: {
      cash_on_delivery: "yes",
      discountCodes: [],
    },
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/product/api/get-categories");
        return res.data;
      } catch (error) {
        console.log(error);
        throw error;
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

  const onSubmit = async (data: any) => {
    try {
      console.log("Form data:", data); // Debug log

      // Validate images
      const validImages = images.filter((img) => img !== null);
      if (validImages.length === 0) {
        toast.error("Please upload at least one product image");
        return;
      }

      setLoading(true);
      setIsChanged(false);

      const submitData = {
        ...data,
        images: validImages,
      };

      console.log("Submitting data:", submitData); // Debug log

      const response = await axiosInstance.post(
        "/product/api/create-product",
        submitData
      );

      console.log("Response:", response.data); // Debug log

      toast.success("Product created successfully!");
      router.push("/dashboard/all-products");
    } catch (error: any) {
      console.error("Submit error:", error); // Debug log
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to create product";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const { data: discountCodes = [], isLoading: DiscountCodesLoading } =
    useQuery({
      queryKey: ["shop-discounts"],
      queryFn: async () => {
        const res = await axiosInstance.get("/product/api/get-discount-codes");
        return res?.data?.discount_codes || [];
      },
    });

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageChange = async (file: File | null, index: number) => {
    if (!file) return;

    setPictureUploadingLoader(true);
    try {
      const fileName = await convertFileToBase64(file);
      const response = await axiosInstance.post(
        "/product/api/upload-product-image",
        {
          fileName,
        }
      );

      const updatedImages = [...images];

      const uploadedImage: UploadedImage = {
        fileId: response.data.fileId,
        file_url: response.data.file_url,
      };

      updatedImages[index] = uploadedImage;

      if (index === images.length - 1 && updatedImages.length < 8) {
        updatedImages.push(null);
      }

      setImages(updatedImages);
      setValue("images", updatedImages);

      toast.success("Image uploaded successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to upload image");
    } finally {
      setPictureUploadingLoader(false);
    }
  };

  const handleRemoveImage = async (index: number) => {
    try {
      const updatedImages = [...images];

      const imageToDelete = updatedImages[index];
      if (imageToDelete && typeof imageToDelete === "object") {
        await axiosInstance.delete(`/product/api/delete-product-image`, {
          data: {
            fileId: imageToDelete.fileId,
          },
        });
        toast.success("Image deleted successfully");
      }

      updatedImages.splice(index, 1);
      if (!updatedImages.includes(null) && updatedImages.length < 8) {
        updatedImages.push(null);
      }

      setImages(updatedImages);
      setValue("images", updatedImages);
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete image");
    }
  };

  const applyTransformation = async (transformation: string) => {
    if (!selectedImage) {
      toast.error("Please select an image to enhance.");
      return;
    }

    setProcessing(true);
    setActiveEffect(transformation);

    try {
      const transformedUrl = `${selectedImage}?tr=${transformation}`;
      setProcessing(false);
      setActiveEffect(transformation);
      toast.success("Image enhanced successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to enhance image");
    } finally {
      setProcessing(false);
    }
  };

  const handleSaveDraft = async () => {
    try {
      const formData = watch();
      console.log("Saving draft:", formData);
      // Add your draft saving logic here
      toast.success("Draft saved successfully");
    } catch (error) {
      toast.error("Failed to save draft");
    }
  };

  const sections = [
    { id: "basic", label: "Basic Info", icon: Package },
    { id: "media", label: "Media", icon: ImageIcon },
    { id: "pricing", label: "Pricing", icon: DollarSign },
    { id: "details", label: "Details", icon: Settings },
  ];

  const getFieldCount = (sectionId: string) => {
    const fieldCounts = {
      basic: Object.keys(errors).filter((key) =>
        [
          "title",
          "short_description",
          "tags",
          "category",
          "subCategory",
        ].includes(key)
      ).length,
      media: images.filter((img) => img !== null).length,
      pricing: Object.keys(errors).filter((key) =>
        ["regular_price", "sale_price", "stock"].includes(key)
      ).length,
      details: Object.keys(errors).filter((key) =>
        ["details_description", "warranty", "brand", "slug"].includes(key)
      ).length,
    };
    return fieldCounts[sectionId as keyof typeof fieldCounts] || 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-7xl mx-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Side - Images */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4 shadow-lg border-0 bg-white/80 backdrop-blur">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-blue-500" />
                    Product Images
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    Upload up to 8 high-quality images
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {images?.length > 0 && (
                    <div className="relative group">
                      <ImagePlaceholder
                        setOpenImageModal={setOpenImageModal}
                        size="765 x 850"
                        small={false}
                        index={0}
                        onImageChange={handleImageChange}
                        setSelectedImage={setSelectedImage}
                        onRemove={handleRemoveImage}
                        images={images}
                        pictureUploadingLoader={pictureUploadingLoader}
                      />
                      <Badge className="absolute top-2 left-2 bg-blue-500">
                        Main Image
                      </Badge>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    {images?.slice(1).map((_, index) => (
                      <ImagePlaceholder
                        setOpenImageModal={setOpenImageModal}
                        size="765 x 850"
                        key={index}
                        small
                        index={index + 1}
                        onImageChange={handleImageChange}
                        setSelectedImage={setSelectedImage}
                        images={images}
                        pictureUploadingLoader={pictureUploadingLoader}
                        onRemove={handleRemoveImage}
                      />
                    ))}
                  </div>

                  <div className="text-center p-4 border-2 border-dashed border-gray-300 rounded-lg">
                    <p className="text-sm text-gray-600">
                      {images.filter((img) => img !== null).length}/8 images
                      uploaded
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Side - Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-green-500" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">
                        Product Title *
                      </Label>
                      <Input
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter Product Title"
                        {...register("title", {
                          required: "Title is required!",
                        })}
                      />
                      {errors.title && (
                        <p className="text-red-500 text-xs flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.title.message as string}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">
                        Product Brand *
                      </Label>
                      <Input
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Samsung, Apple"
                        {...register("brand", {
                          required: "Brand is required!",
                        })}
                      />
                      {errors.brand && (
                        <p className="text-red-500 text-xs flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.brand.message as string}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">
                      Product Description *
                    </Label>
                    <Textarea
                      rows={3}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Enter Product Description"
                      {...register("short_description", {
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
                    {errors.short_description && (
                      <p className="text-red-500 text-xs flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.short_description.message as string}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">
                        Category *
                      </Label>
                      {isLoading ? (
                        <Skeleton className="h-10 w-full" />
                      ) : (
                        <Controller
                          name="category"
                          control={control}
                          rules={{ required: "Category is required" }}
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="border-gray-300 focus:border-blue-500">
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
                        <p className="text-red-500 text-xs flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.category.message as string}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">
                        Sub Category *
                      </Label>
                      <Controller
                        name="subCategory"
                        control={control}
                        rules={{ required: "Sub Category is required" }}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="border-gray-300 focus:border-blue-500">
                              <SelectValue placeholder="Select a Sub Category" />
                            </SelectTrigger>
                            <SelectContent>
                              {subCategories.map((subCategory: string) => (
                                <SelectItem
                                  key={subCategory}
                                  value={subCategory}
                                >
                                  {subCategory}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.subCategory && (
                        <p className="text-red-500 text-xs flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.subCategory.message as string}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">
                        Tags *
                      </Label>
                      <Input
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="samsung, apple, electronics"
                        {...register("tags", {
                          required: "Tags are required",
                        })}
                      />
                      {errors.tags && (
                        <p className="text-red-500 text-xs flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.tags.message as string}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">
                        Slug *
                      </Label>
                      <Input
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="product-slug"
                        {...register("slug", {
                          required: "Slug is required!",
                          pattern: {
                            value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                            message:
                              "Slug must contain only lowercase letters, numbers, and hyphens",
                          },
                        })}
                      />
                      {errors.slug && (
                        <p className="text-red-500 text-xs flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.slug.message as string}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pricing */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-500" />
                    Pricing & Stock
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">
                        Regular Price *
                      </Label>
                      <Input
                        type="number"
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="0.00"
                        {...register("regular_price", {
                          required: "Regular Price is required!",
                          valueAsNumber: true,
                          min: {
                            value: 0.01,
                            message: "Price must be greater than 0",
                          },
                        })}
                      />
                      {errors.regular_price && (
                        <p className="text-red-500 text-xs flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.regular_price.message as string}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">
                        Sale Price *
                      </Label>
                      <Input
                        type="number"
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="0.00"
                        {...register("sale_price", {
                          required: "Sale Price is required!",
                          valueAsNumber: true,
                          min: {
                            value: 0.01,
                            message: "Price must be greater than 0",
                          },
                          validate: (value) => {
                            if (regularPrice && value >= regularPrice) {
                              return "Sale Price must be less than Regular Price";
                            }
                            return true;
                          },
                        })}
                      />
                      {errors.sale_price && (
                        <p className="text-red-500 text-xs flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.sale_price.message as string}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">
                        Stock *
                      </Label>
                      <Input
                        type="number"
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="0"
                        {...register("stock", {
                          required: "Stock is required!",
                          valueAsNumber: true,
                          min: {
                            value: 1,
                            message: "Stock must be greater than 0",
                          },
                          max: {
                            value: 10000,
                            message: "Stock cannot exceed 10000",
                          },
                        })}
                      />
                      {errors.stock && (
                        <p className="text-red-500 text-xs flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.stock.message as string}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Details */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-purple-500" />
                    Additional Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">
                      Detailed Description * (Min 100 words)
                    </Label>
                    <Controller
                      name="detailed_description"
                      control={control}
                      rules={{
                        required: "Details Description is required!",
                        validate: (value) => {
                          const wordCount =
                            value?.split(/\s+/).filter((word: string) => word)
                              .length || 0;
                          return (
                            wordCount >= 100 ||
                            `Must be at least 100 words (Current: ${wordCount})`
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
                    {errors.detailed_description && (
                      <p className="text-red-500 text-xs flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.detailed_description.message as string}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">
                        Warranty *
                      </Label>
                      <Input
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="1 Year Warranty"
                        {...register("warranty", {
                          required: "Warranty is required!",
                        })}
                      />
                      {errors.warranty && (
                        <p className="text-red-500 text-xs flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.warranty.message as string}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">
                        Video URL
                      </Label>
                      <Input
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="https://www.youtube.com/embed/..."
                        {...register("video_url", {
                          pattern: {
                            value:
                              /^https:\/\/www\.youtube\.com\/embed\/[a-zA-Z0-9_-]+$/,
                            message: "Invalid YouTube embed URL",
                          },
                        })}
                      />
                      {errors.video_url && (
                        <p className="text-red-500 text-xs flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.video_url.message as string}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <ColorSelector control={control} errors={errors} />
                    <SizeSelector control={control} errors={errors} />
                    <CustomSpecification control={control} errors={errors} />
                    <CustomProperties control={control} errors={errors} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Controller
                      name="cash_on_delivery"
                      control={control}
                      rules={{
                        required: "Cash On Delivery selection is required!",
                      }}
                      render={({ field }) => (
                        <div className="space-y-2">
                          <Label className="text-sm font-semibold text-gray-700">
                            Cash On Delivery *
                          </Label>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="border-gray-300 focus:border-blue-500">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="yes">Yes</SelectItem>
                              <SelectItem value="no">No</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    />

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">
                        Discount Codes
                      </Label>
                      {DiscountCodesLoading ? (
                        <Skeleton className="h-20 w-full" />
                      ) : (
                        <div className="flex flex-wrap gap-2 p-3 border border-gray-300 rounded-lg min-h-[60px]">
                          {discountCodes.map((code: any) => (
                            <Button
                              key={code.id}
                              type="button"
                              variant="outline"
                              size="sm"
                              className={`transition-all ${
                                watch("discountCodes")?.includes(code?.id)
                                  ? "bg-blue-500 text-white border-blue-500 hover:bg-blue-600"
                                  : "bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100"
                              }`}
                              onClick={() => {
                                const currentSelection =
                                  watch("discountCodes") || [];
                                const updatedSelection =
                                  currentSelection?.includes(code?.id)
                                    ? currentSelection?.filter(
                                        (id: string) => id !== code?.id
                                      )
                                    : [...currentSelection, code?.id];
                                setValue("discountCodes", updatedSelection);
                              }}
                            >
                              <Tag className="w-3 h-3 mr-1" />
                              {code?.public_name} (
                              {code?.discountType === "percentage"
                                ? `${code?.discountValue}%`
                                : `${code?.discountValue}`}
                              )
                            </Button>
                          ))}
                          {discountCodes.length === 0 && (
                            <p className="text-gray-500 text-sm">
                              No discount codes available
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row gap-4 justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleSaveDraft}
                      className="flex items-center gap-2 border-gray-300 hover:bg-gray-50"
                      disabled={loading}
                    >
                      <Save className="w-4 h-4" />
                      Save Draft
                    </Button>

                    <Button
                      type="submit"
                      className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg"
                      disabled={loading || !isValid}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Creating Product...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Create Product
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Form Status */}
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Form Status:</span>
                      <div className="flex items-center gap-2">
                        {isValid ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-green-600 font-medium">
                              Ready to Submit
                            </span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-4 h-4 text-amber-500" />
                            <span className="text-amber-600 font-medium">
                              {Object.keys(errors).length} field
                              {Object.keys(errors).length !== 1 ? "s" : ""} need
                              attention
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>

        {/* Image Enhancement Modal */}
        {openImageModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Enhance Product Image
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Apply AI-powered enhancements to your image
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setOpenImageModal(false)}
                  className="rounded-full hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="p-6 space-y-6">
                {/* Image Preview */}
                <div className="relative w-full h-64 rounded-xl overflow-hidden bg-gray-100 border-2 border-gray-200">
                  {selectedImage ? (
                    <Image
                      src={selectedImage}
                      alt="Selected Image"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <ImageIcon className="w-12 h-12" />
                    </div>
                  )}
                </div>

                {/* Enhancement Options */}
                {selectedImage && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Wand className="w-5 h-5 text-purple-500" />
                      <h3 className="font-semibold text-gray-900">
                        AI Enhancement Options
                      </h3>
                    </div>

                    <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                      {enhancement.map(({ label, effect }) => (
                        <Button
                          key={effect}
                          type="button"
                          variant="outline"
                          className={`p-3 h-auto flex items-center gap-2 transition-all ${
                            activeEffect === effect
                              ? "bg-purple-50 border-purple-300 text-purple-700"
                              : "hover:bg-gray-50"
                          }`}
                          onClick={() => applyTransformation(effect)}
                          disabled={processing}
                        >
                          {processing && activeEffect === effect ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Wand className="w-4 h-4" />
                          )}
                          <span className="text-sm font-medium">{label}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateProductPage;
