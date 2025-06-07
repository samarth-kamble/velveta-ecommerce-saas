"use client";
import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Controller, useForm } from "react-hook-form";
import { Loader2, Plus, Trash2 } from "lucide-react";

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import axiosInstance from "@/utils/axiosInstance";

const DiscountCodesPage = () => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
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
    },
    onError: () => {
      toast.error("Failed to delete discount code");
    },
  });

  const handleDeleteClick = (discount: any) => {
    deleteDiscountCodeMutation.mutate(discount.id);
  };

  const onSubmit = (data: any) => {
    if (discountCodes.length >= 8) {
      toast.error("You can only have 8 discount codes");
      return;
    }
    createDiscountCodeMutation.mutate(data);
  };

  return (
    <div className="w-full p-8">
      <div className="flex justify-end mb-4">
        {/* Dialog for Creating Discount Code */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus size={18} className="mr-2" />
              Create Discount Code
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Discount Code</DialogTitle>
            </DialogHeader>

            {/* Form Inputs */}
            <div className="space-y-4 py-2">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Discount Code Name */}
                <div className="space-y-2">
                  <Label>Discount Code Name</Label>
                  <Input
                    {...register("public_name")}
                    placeholder="Enter discount code name"
                  />
                </div>

                {/* Discount Type */}
                <div className="space-y-2">
                  <Label>Discount Type</Label>
                  <Controller
                    control={control}
                    name="discountType"
                    render={({ field }) => (
                      <Select
                        {...field}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select discount type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">
                            Percentage (%)
                          </SelectItem>
                          <SelectItem value="flat">Flat ($)</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                {/* Discount Value */}
                <div className="space-y-2">
                  <Label>Discount Value</Label>
                  <Input
                    type="number"
                    min={1}
                    {...register("discountValue", {
                      required: "Discount value is required",
                    })}
                    placeholder="Enter discount value"
                  />
                </div>

                {/* Discount Codes */}
                <div className="space-y-2">
                  <Label>Discount Codes</Label>
                  <Input
                    {...register("discountCode", {
                      required: "Discount codes are required",
                    })}
                    placeholder="Enter discount codes"
                  />
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      reset();
                    }}
                  >
                    Reset
                  </Button>
                  <Button
                    type="submit"
                    disabled={createDiscountCodeMutation.isPending}
                  >
                    {createDiscountCodeMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create"
                    )}
                  </Button>
                  {createDiscountCodeMutation.isError && (
                    <p className="text-red-500 text-sm">
                      {"Failed to create discount code"}
                    </p>
                  )}
                </DialogFooter>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table for Discount Codes */}
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Code</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5}>Loading...</TableCell>
              </TableRow>
            ) : discountCodes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No discount codes found.
                </TableCell>
              </TableRow>
            ) : (
              discountCodes.map((discount: any) => (
                <TableRow key={discount.id}>
                  <TableCell>{discount?.public_name}</TableCell>
                  <TableCell>
                    {discount?.discountType === "percentage"
                      ? "Percentage (%)"
                      : "Flat ($)"}
                  </TableCell>
                  <TableCell>
                    {discount.discountType === "percentage"
                      ? `${discount?.discountValue}%`
                      : `$${discount?.discountValue}`}
                  </TableCell>
                  <TableCell>{discount?.discountCode}</TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDeleteClick(discount)}
                        >
                          <Trash2 size={18} />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Are you sure?</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to delete this discount code?
                            This action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setIsOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => handleDeleteClick(discount)}
                          >
                            Delete
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DiscountCodesPage;
