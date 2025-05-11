"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Store, User, MapPin, Clock, Globe, Tag } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { shopCategories } from "@/constant";

interface ShopSetupFormProps {
  sellerId: string;
  setStep: (step: number) => void;
}

export const ShopSetupForm = ({ sellerId, setStep }: ShopSetupFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const createShopMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/create-shop`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Shop created successfully");
      setStep(3);
    },
    onError: () => {
      toast.error("Failed to create shop");
    },
  });

  const onSubmit = (data: any) => {
    const shopData = { ...data, sellerId };
    createShopMutation.mutate(shopData);
  };

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-gray-700">
          Shop Name
        </Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            <Store size={18} />
          </div>
          <Input
            id="name"
            placeholder="Green Roots"
            className="pl-10 h-12 border-gray-300"
            {...register("name", { required: true })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio" className="text-gray-700">
          Shop Bio
        </Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            <User size={18} />
          </div>
          <Input
            id="bio"
            placeholder="Tell us about your shop"
            className="pl-10 h-12 border-gray-300"
            {...register("bio", { required: true })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address" className="text-gray-700">
          Address
        </Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            <MapPin size={18} />
          </div>
          <Input
            id="address"
            placeholder="123 Market Street"
            className="pl-10 h-12 border-gray-300"
            {...register("address", { required: true })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="opening_hours" className="text-gray-700">
          Opening Hours
        </Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            <Clock size={18} />
          </div>
          <Input
            id="opening_hours"
            placeholder="Mon-Fri: 9am-5pm, Sat: 10am-4pm"
            className="pl-10 h-12 border-gray-300"
            {...register("opening_hours", { required: true })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="website" className="text-gray-700">
          Website
        </Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            <Globe size={18} />
          </div>
          <Input
            id="website"
            placeholder="https://yourshop.com"
            className="pl-10 h-12 border-gray-300"
            {...register("website")}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category" className="text-gray-700">
          Category
        </Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 z-10 pointer-events-none text-gray-400">
            <Tag size={18} />
          </div>
          <Select onValueChange={(value) => setValue("category", value)}>
            <SelectTrigger className="w-full h-12 pl-10 border-gray-300">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {shopCategories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        type="button"
        onClick={handleSubmit(onSubmit)}
        className="w-full h-12 mt-6 bg-rose-600 hover:bg-rose-700 text-white rounded-md transition-colors"
      >
        Create Shop
      </Button>
    </div>
  );
};
