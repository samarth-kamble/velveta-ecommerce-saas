import React from "react";
import { Controller, useFieldArray } from "react-hook-form";
import { Plus, Trash2, FileText, AlertCircle, Zap } from "lucide-react";

import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";

const CustomSpecification = ({ control, errors }: any) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "custom_specification",
  });

  const suggestionPairs = [
    { name: "Battery Life", value: "5000mAh" },
    { name: "Weight", value: "150g" },
    { name: "Material", value: "Aluminum" },
    { name: "Display Size", value: "6.1 inches" },
    { name: "Storage", value: "128GB" },
    { name: "RAM", value: "8GB" },
  ];

  const addSuggestion = (suggestion: { name: string; value: string }) => {
    append(suggestion);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <FileText className="w-5 h-5 text-emerald-500" />
        <Label className="text-sm font-semibold text-gray-700">
          Technical Specifications
        </Label>
        <Badge variant="secondary" className="text-xs">
          {fields.length} specs
        </Badge>
      </div>

      <div className="space-y-4">
        {/* Existing Specifications */}
        {fields?.map((item, index) => (
          <div
            key={item.id}
            className="group bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-xl p-4 hover:shadow-md transition-all duration-200"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                name={`custom_specification.${index}.name`}
                control={control}
                rules={{ required: "Specification name is required" }}
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-600">
                      Specification Name
                    </Label>
                    <Input
                      placeholder="e.g., Battery Life, Weight, Material"
                      {...field}
                      className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 bg-white"
                    />
                    {errors?.custom_specification?.[index]?.name && (
                      <p className="text-red-500 text-xs flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.custom_specification[index].name.message}
                      </p>
                    )}
                  </div>
                )}
              />

              <div className="flex items-end gap-2">
                <Controller
                  name={`custom_specification.${index}.value`}
                  control={control}
                  rules={{ required: "Specification value is required" }}
                  render={({ field }) => (
                    <div className="flex-1 space-y-2">
                      <Label className="text-sm font-medium text-gray-600">
                        Value
                      </Label>
                      <Input
                        placeholder="e.g., 5000mAh, 100g, Aluminum"
                        {...field}
                        className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 bg-white"
                      />
                      {errors?.custom_specification?.[index]?.value && (
                        <p className="text-red-500 text-xs flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.custom_specification[index].value.message}
                        </p>
                      )}
                    </div>
                  )}
                />

                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => remove(index)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-600 rounded-full p-2"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}

        {/* Quick Add Suggestions */}
        {fields.length === 0 && (
          <div className="bg-gradient-to-br from-emerald-50/50 to-green-50/50 border border-emerald-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-medium text-emerald-700">
                Quick Add Common Specifications
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {suggestionPairs.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => addSuggestion(suggestion)}
                  className="flex flex-col items-start p-3 bg-white border border-emerald-200 rounded-lg hover:bg-emerald-50 hover:border-emerald-300 transition-colors group text-left"
                >
                  <span className="text-sm font-medium text-gray-800 group-hover:text-emerald-700">
                    {suggestion.name}
                  </span>
                  <span className="text-xs text-gray-500 group-hover:text-emerald-600">
                    {suggestion.value}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Add New Specification */}
        <div className="bg-gradient-to-br from-blue-50/50 to-indigo-50/50 border-2 border-dashed border-blue-200 rounded-xl p-4">
          <Button
            type="button"
            variant="ghost"
            className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-0"
            onClick={() => append({ name: "", value: "" })}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Technical Specification
          </Button>
        </div>

        {/* Empty State */}
        {fields.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">No specifications added yet</p>
            <p className="text-xs text-gray-400 mt-1">
              Add technical details like battery life, dimensions, or materials
            </p>
          </div>
        )}

        {/* Global Error */}
        {errors.custom_specification &&
          typeof errors.custom_specification.message === "string" && (
            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
              <AlertCircle className="w-4 h-4" />
              {errors.custom_specification.message}
            </div>
          )}
      </div>
    </div>
  );
};

export default CustomSpecification;
