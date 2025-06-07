"use client";
import React, { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { Plus, X, Settings2, Tag, AlertCircle } from "lucide-react";

import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";

const CustomProperties = ({ control, errors }: any) => {
  const [properties, setProperties] = useState<
    {
      label: string;
      values: string[];
    }[]
  >([]);

  const [newLabel, setNewLabel] = useState("");
  const [newValue, setNewValue] = useState("");

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Settings2 className="w-5 h-5 text-indigo-500" />
        <Label className="text-sm font-semibold text-gray-700">
          Custom Properties
        </Label>
      </div>

      <Controller
        name="customProperties"
        control={control}
        render={({ field }) => {
          useEffect(() => {
            field.onChange(properties);
          }, [properties]);

          const addProperty = () => {
            if (!newLabel.trim()) return;
            setProperties([...properties, { label: newLabel, values: [] }]);
            setNewLabel("");
          };

          const addValue = (index: number) => {
            if (!newValue.trim()) return;
            const updatedProperties = [...properties];
            updatedProperties[index].values.push(newValue);
            setProperties(updatedProperties);
            setNewValue("");
          };

          const removeProperty = (index: number) => {
            setProperties(properties.filter((_, i) => i !== index));
          };

          const removeValue = (propertyIndex: number, valueIndex: number) => {
            const updatedProperties = [...properties];
            updatedProperties[propertyIndex].values.splice(valueIndex, 1);
            setProperties(updatedProperties);
          };

          return (
            <div className="space-y-4">
              {/* Existing Properties */}
              <div className="space-y-3">
                {properties.map((property, index) => (
                  <div
                    key={index}
                    className="group bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-xl p-4 hover:shadow-md transition-all duration-200"
                  >
                    {/* Property Header */}
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-indigo-500" />
                        <span className="text-gray-800 font-semibold">
                          {property.label}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {property.values.length} values
                        </Badge>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => removeProperty(index)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-600 rounded-full"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Add Value Input */}
                    <div className="flex items-center gap-2 mb-3">
                      <Input
                        type="text"
                        className="flex-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 bg-white"
                        placeholder="Add a value..."
                        value={newValue}
                        onChange={(e) => setNewValue(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addValue(index);
                          }
                        }}
                      />
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => addValue(index)}
                        className="bg-indigo-500 hover:bg-indigo-600 text-white shadow-sm"
                        disabled={!newValue.trim()}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Property Values */}
                    <div className="flex flex-wrap gap-2">
                      {property.values.map((value, valueIndex) => (
                        <div
                          key={valueIndex}
                          className="group/value flex items-center gap-1 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full text-sm font-medium border border-indigo-200 hover:bg-indigo-100 transition-colors"
                        >
                          <span>{value}</span>
                          <button
                            type="button"
                            onClick={() => removeValue(index, valueIndex)}
                            className="opacity-0 group-hover/value:opacity-100 transition-opacity hover:bg-indigo-200 rounded-full p-0.5 ml-1"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      {property.values.length === 0 && (
                        <span className="text-gray-400 text-sm italic">
                          No values added yet
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Property */}
              <div className="bg-gradient-to-br from-blue-50/50 to-indigo-50/50 border-2 border-dashed border-blue-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Plus className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium text-blue-700">
                    Add New Property
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    className="flex-1 border-blue-200 focus:border-blue-500 focus:ring-blue-500 bg-white"
                    placeholder="Property name (e.g., Material, Features)"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addProperty();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={addProperty}
                    disabled={!newLabel.trim()}
                    className="bg-blue-500 hover:bg-blue-600 text-white shadow-sm"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
              </div>

              {/* Empty State */}
              {properties.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Settings2 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">No custom properties added yet</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Add properties like Material, Features, or Specifications
                  </p>
                </div>
              )}

              {errors.customProperties && (
                <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                  <AlertCircle className="w-4 h-4" />
                  {errors.customProperties.message as string}
                </div>
              )}
            </div>
          );
        }}
      />
    </div>
  );
};

export default CustomProperties;
