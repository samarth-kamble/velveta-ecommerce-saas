import React from "react";
import { Controller, useFieldArray } from "react-hook-form";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Plus, Trash2 } from "lucide-react";

const CustomSpecification = ({ control, errors }: any) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "custom_specification",
  });
  return (
    <div>
      <Label className="block font-semibold text-gray-800 mb-2">
        Custom Specification
      </Label>
      <div className="flex flex-col gap-3 space-y-2">
        {fields?.map((item, index) => (
          <div key={index} className="flex gap-2 items-center">
            <Controller
              name={`custom_specification.${index}.name`}
              control={control}
              rules={{ required: "Specification name is required" }}
              render={({ field }) => (
                <div className="space-y-2">
                  <Label>Specification Name</Label>
                  <Input
                    placeholder="e.g, Battery Life, Weight, Material"
                    {...field}
                  />
                </div>
              )}
            />
            <Controller
              name={`custom_specification.${index}.value`}
              control={control}
              rules={{ required: "Specification value is required" }}
              render={({ field }) => (
                <div className="space-y-2">
                  <Label>Value</Label>
                  <Input placeholder="eg. 5000mAh, 100g, Aluminum" {...field} />
                </div>
              )}
            />
            <Button
              type="button"
              className="text-gray-100 hover:text-gray-300 mt-[20px]"
              onClick={() => remove(index)}
            >
              <Trash2 size={20} />
            </Button>
          </div>
        ))}

        <Button
          type="button"
          variant={"ghost"}
          className="text-gray-500 hover:text-gray-700"
          onClick={() => append({ name: "", value: "" })}
        >
          <Plus size={20} /> Add Specification
        </Button>
      </div>
      {errors.custom_specification && (
        <p className="text-red-500 text-xs mt-1">
          {errors.custom_specification.message as string}
        </p>
      )}
    </div>
  );
};

export default CustomSpecification;
