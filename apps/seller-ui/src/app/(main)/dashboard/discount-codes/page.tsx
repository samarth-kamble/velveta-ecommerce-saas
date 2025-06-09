"use client";
import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Controller, useForm } from "react-hook-form";
import {
  Loader2,
  Plus,
  Trash2,
  Tag,
  Percent,
  DollarSign,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
// Custom table components removed - using custom implementation
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import axiosInstance from "@/utils/axiosInstance";

interface DiscountCode {
  id: string;
  public_name: string;
  discountType: string;
  discountValue: string | number;
  discountCode: string;
}

const DiscountCodesPage = () => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState<DiscountCode | null>(
    null
  );

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      public_name: "",
      discountType: "percentage",
      discountValue: "",
      discountCode: "",
    },
  });

  const { data: discountCodes = [], isLoading } = useQuery({
    queryKey: ["shop-discounts"],
    queryFn: async () => {
      const res = await axiosInstance.get("/product/api/get-discount-codes");
      return res?.data?.discount_codes || [];
    },
  });

  const createDiscountCodeMutation = useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.post(
        "/product/api/create-discount-codes",
        data
      );
      return res?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shop-discounts"] });
      toast.success("Discount code created successfully");
      reset();
      setIsOpen(false);
    },
    onError: () => {
      toast.error("Failed to create discount code");
    },
  });

  const deleteDiscountCodeMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await axiosInstance.delete(
        `/product/api/delete-discount-code/${id}`
      );
      return res?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shop-discounts"] });
      toast.success("Discount code deleted successfully");
      setDeleteDialogOpen(false);
    },
    onError: () => {
      toast.error("Failed to delete discount code");
    },
  });

  const handleDeleteClick = (discount: any) => {
    setSelectedDiscount(discount);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedDiscount) {
      deleteDiscountCodeMutation.mutate(selectedDiscount.id);
    }
  };

  const onSubmit = (data: any) => {
    if (discountCodes.length >= 8) {
      toast.error("You can only have 8 discount codes");
      return;
    }
    createDiscountCodeMutation.mutate(data);
  };

  const getDiscountIcon = (type: string) => {
    return type === "percentage" ? Percent : DollarSign;
  };

  const getDiscountBadgeVariant = (type: string) => {
    return type === "percentage" ? "default" : "secondary";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        {/* Enhanced Header Section */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          {/* Stats Cards with Enhanced Design */}
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl">
            <Card className="flex-1 bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-sm border border-blue-200/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-blue-600/80">
                      Active Codes
                    </p>
                    <p className="text-3xl font-bold text-blue-700">
                      {discountCodes.length}
                    </p>
                    <p className="text-xs text-blue-500/70">
                      Currently available
                    </p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="flex-1 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 backdrop-blur-sm border border-emerald-200/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-emerald-600/80">
                      Remaining Slots
                    </p>
                    <p className="text-3xl font-bold text-emerald-700">
                      {8 - discountCodes.length}
                    </p>
                    <p className="text-xs text-emerald-500/70">
                      Out of 8 total
                    </p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg">
                    <Tag className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="flex-1 bg-gradient-to-br from-purple-500/10 to-purple-600/5 backdrop-blur-sm border border-purple-200/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-purple-600/80">
                      Usage Rate
                    </p>
                    <p className="text-3xl font-bold text-purple-700">
                      {Math.round((discountCodes.length / 8) * 100)}%
                    </p>
                    <p className="text-xs text-purple-500/70">Capacity used</p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                    <Percent className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        {/* Create Button */}
        <div className="flex justify-end">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                <Plus size={18} className="mr-2" />
                Create Discount Code
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Create Discount Code
                </DialogTitle>
                <DialogDescription>
                  Create a new discount code for your customers
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Discount Code Name */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Discount Code Name
                  </Label>
                  <Input
                    {...register("public_name", {
                      required: "Name is required",
                    })}
                    placeholder="e.g., Summer Sale 2024"
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                  {errors.public_name && (
                    <p className="text-sm text-red-500">
                      {errors.public_name.message}
                    </p>
                  )}
                </div>

                {/* Discount Type */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Discount Type</Label>
                  <Controller
                    control={control}
                    name="discountType"
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue placeholder="Select discount type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">
                            <div className="flex items-center gap-2">
                              <Percent className="h-4 w-4" />
                              Percentage (%)
                            </div>
                          </SelectItem>
                          <SelectItem value="flat">
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4" />
                              Flat Amount ($)
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                {/* Discount Value */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Discount Value</Label>
                  <Input
                    type="number"
                    min={1}
                    {...register("discountValue", {
                      required: "Discount value is required",
                      min: { value: 1, message: "Value must be at least 1" },
                    })}
                    placeholder="Enter discount value"
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                  {errors.discountValue && (
                    <p className="text-sm text-red-500">
                      {errors.discountValue.message}
                    </p>
                  )}
                </div>

                {/* Discount Code */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Discount Code</Label>
                  <Input
                    {...register("discountCode", {
                      required: "Discount code is required",
                    })}
                    placeholder="e.g., SUMMER2024"
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 font-mono"
                  />
                  {errors.discountCode && (
                    <p className="text-sm text-red-500">
                      {errors.discountCode.message}
                    </p>
                  )}
                </div>

                <DialogFooter className="gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      reset();
                      setIsOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createDiscountCodeMutation.isPending}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {createDiscountCodeMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Code"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Discount Codes Grid */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Your Discount Codes
            </CardTitle>
            <CardDescription>
              Manage and monitor your active discount codes
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="flex items-center gap-3">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                  <span className="text-gray-600">
                    Loading discount codes...
                  </span>
                </div>
              </div>
            ) : discountCodes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full mb-4">
                  <Tag className="h-12 w-12 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No discount codes yet
                </h3>
                <p className="text-gray-500 text-center max-w-md">
                  Create your first discount code to start offering promotions
                  to your customers
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Table Header */}
                <div className="hidden md:grid md:grid-cols-12 gap-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-lg border border-gray-100">
                  <div className="col-span-3 text-sm font-semibold text-gray-700">
                    Name
                  </div>
                  <div className="col-span-2 text-sm font-semibold text-gray-700">
                    Type
                  </div>
                  <div className="col-span-2 text-sm font-semibold text-gray-700">
                    Value
                  </div>
                  <div className="col-span-3 text-sm font-semibold text-gray-700">
                    Code
                  </div>
                  <div className="col-span-2 text-sm font-semibold text-gray-700 text-right">
                    Actions
                  </div>
                </div>

                {/* Table Rows */}
                {discountCodes.map((discount: any) => {
                  const IconComponent = getDiscountIcon(discount.discountType);
                  return (
                    <div
                      key={discount.id}
                      className="group bg-white rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-200 p-4 md:p-6"
                    >
                      {/* Mobile Layout */}
                      <div className="md:hidden space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">
                              {discount?.public_name}
                            </h3>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge
                                variant={getDiscountBadgeVariant(
                                  discount.discountType
                                )}
                                className="flex items-center gap-1"
                              >
                                <IconComponent className="h-3 w-3" />
                                {discount?.discountType === "percentage"
                                  ? "Percentage"
                                  : "Flat Amount"}
                              </Badge>
                              <span className="text-2xl font-bold text-gray-900">
                                {discount.discountType === "percentage"
                                  ? `${discount?.discountValue}%`
                                  : `${discount?.discountValue}`}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-500">
                                Code:
                              </span>
                              <Badge
                                variant="outline"
                                className="font-mono text-sm"
                              >
                                {discount?.discountCode}
                              </Badge>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteClick(discount)}
                            className="hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>

                      {/* Desktop Layout */}
                      <div className="hidden md:grid md:grid-cols-12 gap-4 items-center">
                        <div className="col-span-3">
                          <h3 className="font-semibold text-gray-900">
                            {discount?.public_name}
                          </h3>
                        </div>
                        <div className="col-span-2">
                          <Badge
                            variant={getDiscountBadgeVariant(
                              discount.discountType
                            )}
                            className="flex items-center gap-1 w-fit"
                          >
                            <IconComponent className="h-3 w-3" />
                            {discount?.discountType === "percentage"
                              ? "Percentage"
                              : "Flat Amount"}
                          </Badge>
                        </div>
                        <div className="col-span-2">
                          <span className="text-xl font-bold text-gray-900">
                            {discount.discountType === "percentage"
                              ? `${discount?.discountValue}%`
                              : `${discount?.discountValue}`}
                          </span>
                        </div>
                        <div className="col-span-3">
                          <Badge variant="outline" className="font-mono">
                            {discount?.discountCode}
                          </Badge>
                        </div>
                        <div className="col-span-2 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteClick(discount)}
                            className="hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                <Trash2 className="h-5 w-5" />
                Delete Discount Code
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{selectedDiscount?.public_name}
                "? This action cannot be undone and the discount code will no
                longer be valid.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
                disabled={deleteDiscountCodeMutation.isPending}
              >
                {deleteDiscountCodeMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete Code"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default DiscountCodesPage;
