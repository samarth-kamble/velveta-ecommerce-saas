import React, { useState } from "react";
import { Button } from "./ui/button";
import { Pencil, Trash, WandSparkles } from "lucide-react";
import { Label } from "./ui/label";
import Image from "next/image";

const ImagePlaceholder = ({
  size,
  small,
  onImageChange,
  onRemove,
  defaultImage = null,
  index = null,
  setOpenImageModal,
}: {
  size: string;
  small?: boolean;
  onImageChange: (file: File | null, index: number) => void;
  onRemove?: (index: number) => void;
  defaultImage?: string | null;
  setOpenImageModal?: (openImageModel: boolean) => void;
  index?: any;
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(defaultImage);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      onImageChange(file, index);
    }
  };

  return (
    <div
      className={`relative ${
        small ? "h-[180px]" : "h-[450px]"
      } w-full cursor-pointer border border-gray-600 rounded-lg flex flex-col justify-center items-center`}
    >
      <input
        type="file"
        accept="image/*"
        className="hidden"
        id={`image-upload-${index}`}
        onChange={handleFileChange}
      />
      {imagePreview ? (
        <>
          <Button
            type="button"
            size="icon"
            onClick={() => onRemove?.(index!)}
            className="absolute top-3 right-3 p-2 !rounded bg-red-600 shadow-md"
          >
            <Trash size={16} />
          </Button>
          <Button
            type="button"
            size="icon"
            className="absolute top-3 right-[70px] p-2 !rounded bg-green-600 shadow-md cursor-pointer"
            onClick={() => setOpenImageModal?.(true)}
          >
            <WandSparkles size={16} />
          </Button>
        </>
      ) : (
        <Label
          htmlFor={`image-upload-${index}`}
          className="absolute top-3 right-3 p-2 !rounded bg-slate-100 border shadow-lg cursor-pointer"
        >
          <Pencil size={16} />
        </Label>
      )}
      {imagePreview ? (
        <Image
          src={imagePreview}
          alt="Image Preview"
          className="w-full h-full object-cover rounded-lg"
          width={400}
          height={300}
        />
      ) : (
        <>
          <p
            className={`text-gray-400 ${
              small ? "text-xl" : "text-4xl"
            } font-semibold`}
          >
            {size}
          </p>
          <p
            className={`text-gray-500 ${
              small ? "text-sm" : "text-lg"
            } pt-2 text-center`}
          >
            Please choose an image <br />
            According to the expected ratio
          </p>
        </>
      )}
    </div>
  );
};

export default ImagePlaceholder;
