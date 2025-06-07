"use client";
import React, { useState } from "react";
import { Plus, Palette, Check, X, AlertCircle } from "lucide-react";
import { Controller } from "react-hook-form";

import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

const defaultColors = [
  { hex: "#000000", name: "Black" },
  { hex: "#FFFFFF", name: "White" },
  { hex: "#FF0000", name: "Red" },
  { hex: "#00FF00", name: "Green" },
  { hex: "#0000FF", name: "Blue" },
  { hex: "#FFFF00", name: "Yellow" },
  { hex: "#FF00FF", name: "Magenta" },
  { hex: "#00FFFF", name: "Cyan" },
  { hex: "#FFA500", name: "Orange" },
  { hex: "#800080", name: "Purple" },
  { hex: "#FFC0CB", name: "Pink" },
  { hex: "#A52A2A", name: "Brown" },
];

const ColorSelector = ({ control, errors }: any) => {
  const [customColors, setCustomColors] = useState<
    { hex: string; name: string }[]
  >([]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [newColor, setNewColor] = useState("#FF6B6B");
  const [colorName, setColorName] = useState("");

  const addCustomColor = () => {
    if (!colorName.trim()) return;
    setCustomColors([...customColors, { hex: newColor, name: colorName }]);
    setColorName("");
    setShowColorPicker(false);
  };

  const removeCustomColor = (colorToRemove: string) => {
    setCustomColors(
      customColors.filter((color) => color.hex !== colorToRemove)
    );
  };

  const allColors = [...defaultColors, ...customColors];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Palette className="w-5 h-5 text-pink-500" />
        <Label className="text-sm font-semibold text-gray-700">
          Product Colors
        </Label>
        <Badge variant="secondary" className="text-xs">
          Available Options
        </Badge>
      </div>

      <Controller
        name="colors"
        control={control}
        render={({ field }) => (
          <div className="space-y-4">
            {/* Color Grid */}
            <div className="grid grid-cols-8 gap-3">
              {allColors.map((color) => {
                const isSelected = (field.value || []).includes(color.hex);
                const isLightColor = [
                  "#FFFFFF",
                  "#FFFF00",
                  "#00FFFF",
                  "#FFC0CB",
                ].includes(color.hex);
                const isCustom = customColors.some((c) => c.hex === color.hex);

                return (
                  <div key={color.hex} className="relative group">
                    <button
                      type="button"
                      onClick={() =>
                        field.onChange(
                          isSelected
                            ? field.value.filter((c: string) => c !== color.hex)
                            : [...(field.value || []), color.hex]
                        )
                      }
                      className={`relative w-12 h-12 rounded-xl border-2 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-opacity-30 ${
                        isSelected
                          ? "border-gray-800 shadow-lg scale-110 ring-4 ring-blue-500 ring-opacity-30"
                          : isLightColor
                          ? "border-gray-300 hover:border-gray-400"
                          : "border-transparent hover:border-gray-300"
                      }`}
                      style={{ backgroundColor: color.hex }}
                    >
                      {isSelected && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Check
                            className={`w-5 h-5 ${
                              isLightColor ? "text-gray-800" : "text-white"
                            }`}
                          />
                        </div>
                      )}
                    </button>

                    {/* Custom color remove button */}
                    {isCustom && (
                      <button
                        type="button"
                        onClick={() => removeCustomColor(color.hex)}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 flex items-center justify-center"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}

                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                      {color.name}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                );
              })}

              {/* Add Custom Color Button */}
              <button
                type="button"
                className="w-12 h-12 flex items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400 transition-all duration-200 group"
                onClick={() => setShowColorPicker(!showColorPicker)}
              >
                <Plus className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </button>
            </div>

            {/* Selected Colors Display */}
            {field.value && field.value.length > 0 && (
              <div className="bg-gradient-to-br from-blue-50/50 to-indigo-50/50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Check className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium text-blue-700">
                    Selected Colors ({field.value.length})
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {field.value.map((selectedColor: string) => {
                    const colorInfo = allColors.find(
                      (c) => c.hex === selectedColor
                    );
                    return (
                      <div
                        key={selectedColor}
                        className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-blue-200 text-sm"
                      >
                        <div
                          className="w-4 h-4 rounded-full border border-gray-300"
                          style={{ backgroundColor: selectedColor }}
                        />
                        <span className="text-gray-700">
                          {colorInfo?.name || selectedColor}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Custom Color Picker */}
            {showColorPicker && (
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Palette className="w-4 h-4 text-purple-500" />
                  <span className="font-medium text-gray-800">
                    Add Custom Color
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={newColor}
                      onChange={(e) => setNewColor(e.target.value)}
                      className="w-16 h-12 border border-gray-300 rounded-lg cursor-pointer bg-transparent"
                    />
                    <div className="flex-1">
                      <input
                        type="text"
                        value={colorName}
                        onChange={(e) => setColorName(e.target.value)}
                        placeholder="Color name (e.g., Forest Green)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addCustomColor();
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      onClick={addCustomColor}
                      disabled={!colorName.trim()}
                      className="bg-purple-500 hover:bg-purple-600 text-white"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Color
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowColorPicker(false)}
                      className="border-gray-300"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {errors.colors && (
              <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                <AlertCircle className="w-4 h-4" />
                {errors.colors.message as string}
              </div>
            )}
          </div>
        )}
      />
    </div>
  );
};

export default ColorSelector;
