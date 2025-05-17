"use client";
import React, { useEffect, useState } from "react";
import { Label } from "./ui/label";
import { Controller } from "react-hook-form";
import { Button } from "./ui/button";
import { Plus, X } from "lucide-react";
import { Input } from "./ui/input";

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
    <div>
      <div className="flex flex-col gap-3 space-y-2">
        <Controller
          name="customProperties"
          control={control}
          rules={{ required: "Custom properties are required" }}
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

            return (
              <div className="space-y-2">
                <Label>Custom Properties</Label>
                <div className="flex flex-col gap-3">
                  {properties.map((property, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 p-3 rounded-lg bg-gray-50"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-medium">
                          {property.label}
                        </span>
                        <Button
                          size={"icon"}
                          variant={"outline"}
                          onClick={() => removeProperty(index)}
                        >
                          <X size={18} className="text-red-500" />
                        </Button>
                      </div>
                      {/* Add Value to property */}
                      <div className="flex items-center mt-2 gap-2">
                        <Input
                          type="text"
                          className="border outline-none border-gray-700 bg-gray-50 p-2 rounded-md text-gray-950 w-full "
                          placeholder="Enter value..."
                          value={newValue}
                          onChange={(e) => setNewValue(e.target.value)}
                        />
                        <Button
                          variant={"outline"}
                          className="px-3 py-1 text-black rounded-md"
                          onClick={() => addValue(index)}
                        >
                          <Plus size={18} className="text-gray-7f00" />
                          Add
                        </Button>
                      </div>
                      {/* Show values */}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {property.values.map((value, i) => (
                          <div
                            key={i}
                            className="bg-gray-100 px-2 py-1 rounded-md text-gray-700"
                          >
                            {value}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Add new property */}
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      className="border outline-none  bg-gray-50 p-2 rounded-md text-gray-950 w-full "
                      placeholder="Enter property..."
                      value={newLabel}
                      onChange={(e) => setNewLabel(e.target.value)}
                    />
                    <Button
                      variant={"outline"}
                      className="px-3 py-1 text-black rounded-md"
                      onClick={addProperty}
                    >
                      <Plus size={18} className="text-gray-500" />
                      Add
                    </Button>
                  </div>
                </div>
                {errors.customProperties && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.customProperties.message as string}
                  </p>
                )}
              </div>
            );
          }}
        />
      </div>
    </div>
  );
};

export default CustomProperties;
