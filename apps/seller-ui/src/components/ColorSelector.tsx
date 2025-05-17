"use client";
import React, { useState } from "react";
import { Label } from "./ui/label";
import { Controller, useForm } from "react-hook-form";
import { Plus } from "lucide-react";

const defaultColors = [
  "#000000", // Black
  "#FFFFFF", // White
  "#FF0000", // Red
  "#00FF00", // Green
  "#0000FF", // Blue
  "#FFFF00", // Yellow
  "#FF00FF", // Magenta
  "#00FFFF", // Cyan
];

const ColorSelector = ({ errors }: any) => {
  const [customColors, setCustomColors] = useState<string[]>([]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [newColor, setNewColor] = useState("#FFFFFF");

  const { control } = useForm();

  return (
    <div className="mt-2">
      <Label className="block font-semibold mb-1">Product Colors</Label>
      <Controller
        name="colors"
        control={control}
        render={({ field }) => (
          <div className="flex gap-3 flex-wrap">
            {[...defaultColors, ...customColors].map((color) => {
              const isSelected = (field.value || []).includes(color);
              const isLightColor = ["#FFFFFF", "#FFFF00"].includes(color);

              return (
                <button
                  type="button"
                  key={color}
                  onClick={() =>
                    field.onChange(
                      isSelected
                        ? field.value.filter((c: string) => c !== color)
                        : [...(field.value || []), color]
                    )
                  }
                  className={`w-7 h-7 rounded-md my-1 flex items-center justify-center border-2 border-gray-500 transition ${
                    isSelected ? "scale-110 border-black" : "border-transparent"
                  } ${isLightColor ? "border-gray-600" : ""}`}
                  style={{ backgroundColor: color }}
                />
              );
            })}
            <button
              type="button"
              className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-gray-600 bg-white hover:bg-gray-200 transition"
              onClick={() => setShowColorPicker(!showColorPicker)}
            >
              <Plus size={16} color="black" />
            </button>
            {/* Color Picker */}
            {showColorPicker && (
              <div className="relative flex items-center gap-2">
                <input
                  type="color"
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  className="w-10 h-10 border-none cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => {
                    setCustomColors([...customColors, newColor]);
                    setShowColorPicker(false);
                  }}
                  className="px-3 py-1 bg-gray-100 rounded-md text-white text-sm"
                >
                  <Plus size={16} color="black" />
                </button>
              </div>
            )}
          </div>
        )}
      />
    </div>
  );
};

export default ColorSelector;
