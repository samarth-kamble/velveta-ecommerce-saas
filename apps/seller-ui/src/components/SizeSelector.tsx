import React from "react";
import { Controller } from "react-hook-form";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
const sizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

const SizeSelector = ({ control, errors }: any) => {
  return (
    <div className="space-y-2">
      <Label>Size</Label>
      <Controller
        control={control}
        name="sizes"
        render={({ field }) => (
          <div className="flex gap-2 flex-wrap">
            {sizes.map((size) => {
              const isSelected = (field.value || []).includes(size);
              return (
                <Button
                  key={size}
                  variant={isSelected ? "default" : "outline"}
                  onClick={() =>
                    field.onChange(
                      isSelected
                        ? field.value.filter((s: string) => s !== size)
                        : [...(field.value || []), size]
                    )
                  }
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    isSelected
                      ? "bg-primary text-white border-[#000000]"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {size}
                </Button>
              );
            })}
          </div>
        )}
      />
      {errors.sizes && (
        <p className="text-red-500 text-xs mt-1">
          {errors.sizes.message as string}
        </p>
      )}
    </div>
  );
};

export default SizeSelector;
