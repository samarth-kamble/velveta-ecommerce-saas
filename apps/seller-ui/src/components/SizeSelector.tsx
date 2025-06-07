import React, { useState } from "react";
import { Controller } from "react-hook-form";
import { Check, Sparkles, ShirtIcon } from "lucide-react";

import { Label } from "./ui/label";
import { Button } from "./ui/button";

interface SizeSelectorProps {
  control: any;
  errors: any;
  label?: string;
  description?: string;
  required?: boolean;
}

const sizes = [
  { value: "XS", label: "XS", description: "Extra Small" },
  { value: "S", label: "S", description: "Small" },
  { value: "M", label: "M", description: "Medium" },
  { value: "L", label: "L", description: "Large" },
  { value: "XL", label: "XL", description: "Extra Large" },
  { value: "XXL", label: "XXL", description: "2X Large" },
  { value: "XXXL", label: "XXXL", description: "3X Large" },
];

const SizeSelector: React.FC<SizeSelectorProps> = ({
  control,
  errors,
  label = "Size",
  description = "Select available sizes for this product",
  required = false,
}) => {
  const [hoveredSize, setHoveredSize] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <ShirtIcon size={18} className="text-gray-600" />
          <Label className="text-base font-semibold text-gray-800">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </Label>
        </div>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>

      {/* Size Selector */}
      <Controller
        control={control}
        name="sizes"
        render={({ field }) => {
          const selectedSizes = field.value || [];
          const selectedCount = selectedSizes.length;

          return (
            <div className="space-y-4">
              {/* Selection Summary */}
              {selectedCount > 0 && (
                <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200/50">
                  <div className="flex items-center gap-1">
                    <Sparkles size={16} className="text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">
                      {selectedCount} size{selectedCount !== 1 ? "s" : ""}{" "}
                      selected
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {selectedSizes.slice(0, 3).map((size: string) => (
                      <span
                        key={size}
                        className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-md"
                      >
                        {size}
                      </span>
                    ))}
                    {selectedCount > 3 && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-md">
                        +{selectedCount - 3}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Size Grid */}
              <div className="grid grid-cols-7 gap-2">
                {sizes.map((size, index) => {
                  const isSelected = selectedSizes.includes(size.value);
                  const isHovered = hoveredSize === size.value;

                  return (
                    <div
                      key={size.value}
                      className="relative group"
                      onMouseEnter={() => setHoveredSize(size.value)}
                      onMouseLeave={() => setHoveredSize(null)}
                    >
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          const newSelection = isSelected
                            ? selectedSizes.filter(
                                (s: string) => s !== size.value
                              )
                            : [...selectedSizes, size.value];
                          field.onChange(newSelection);
                        }}
                        className={`relative w-full h-14 text-sm font-medium transition-all duration-200 overflow-hidden ${
                          isSelected
                            ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white border-blue-500 shadow-lg shadow-blue-500/25 scale-105"
                            : "bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300 text-gray-700 hover:scale-102"
                        } ${isHovered && !isSelected ? "shadow-md" : ""}`}
                      >
                        {/* Background Animation */}
                        <div
                          className={`absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 opacity-0 transition-opacity duration-300 ${
                            isHovered && !isSelected ? "opacity-10" : ""
                          }`}
                        />

                        {/* Content */}
                        <div className="relative z-10 flex flex-col items-center justify-center">
                          <span
                            className={`text-base font-bold ${
                              isSelected ? "text-white" : "text-gray-800"
                            }`}
                          >
                            {size.label}
                          </span>
                        </div>

                        {/* Selection Indicator */}
                        {isSelected && (
                          <div className="absolute top-1 right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                            <Check size={12} className="text-blue-600" />
                          </div>
                        )}

                        {/* Hover Effect */}
                        <div
                          className={`absolute inset-0 border-2 border-dashed border-blue-400 rounded-md opacity-0 transition-opacity duration-300 ${
                            isHovered && !isSelected ? "opacity-50" : ""
                          }`}
                        />
                      </Button>

                      {/* Tooltip */}
                      {isHovered && (
                        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-20">
                          <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap">
                            {size.description}
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => field.onChange(sizes.map((s) => s.value))}
                  className="text-xs hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors duration-200"
                >
                  Select All
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => field.onChange([])}
                  className="text-xs hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-colors duration-200"
                >
                  Clear All
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => field.onChange(["S", "M", "L", "XL"])}
                  className="text-xs hover:bg-green-50 hover:border-green-300 hover:text-green-700 transition-colors duration-200"
                >
                  Popular Sizes
                </Button>
              </div>
            </div>
          );
        }}
      />

      {/* Error Message */}
      {errors.sizes && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <p className="text-red-600 text-sm font-medium">
            {errors.sizes.message as string}
          </p>
        </div>
      )}

      {/* Size Guide Link */}
      <div className="pt-2">
        <button
          type="button"
          className="text-sm text-blue-600 hover:text-blue-800 underline hover:no-underline transition-all duration-200"
          onClick={() => {
            // Add your size guide modal/popup logic here
            console.log("Open size guide");
          }}
        >
          Need help with sizing? View our size guide →
        </button>
      </div>
    </div>
  );
};

export default SizeSelector;
