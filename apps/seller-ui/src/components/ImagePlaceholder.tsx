import React, { useState, useRef, useCallback } from "react";
import Image from "next/image";
import {
  Pencil,
  Trash,
  WandSparkles,
  Upload,
  ImageIcon,
  Loader2,
  Eye,
  RotateCcw,
} from "lucide-react";

import { Button } from "./ui/button";
import { Label } from "./ui/label";

interface ImagePlaceholderProps {
  size: string;
  small?: boolean;
  onImageChange: (file: File | null, index: number) => void;
  setSelectedImage: (url: string) => void;
  onRemove?: (index: number) => void;
  defaultImage?: string | null;
  index?: number;
  images: any[];
  setOpenImageModal?: (open: boolean) => void;
  pictureUploadingLoader: boolean;
}

const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({
  size,
  small = false,
  onImageChange,
  setSelectedImage,
  onRemove,
  defaultImage = null,
  index = 0,
  images,
  setOpenImageModal,
  pictureUploadingLoader,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(defaultImage);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        // Validate file type
        if (!file.type.startsWith("image/")) {
          alert("Please select a valid image file");
          return;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          alert("File size must be less than 10MB");
          return;
        }

        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
        onImageChange(file, index);
      }
    },
    [onImageChange, index]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        const file = files[0];
        if (file.type.startsWith("image/")) {
          const previewUrl = URL.createObjectURL(file);
          setImagePreview(previewUrl);
          onImageChange(file, index);
        }
      }
    },
    [onImageChange, index]
  );

  const handleRemove = useCallback(() => {
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    onRemove?.(index);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [imagePreview, onRemove, index]);

  const handleEditClick = useCallback(() => {
    if (setOpenImageModal && images[index]?.file_url) {
      setOpenImageModal(true);
      setSelectedImage(images[index].file_url);
    }
  }, [setOpenImageModal, setSelectedImage, images, index]);

  const containerHeight = small ? "h-[180px]" : "h-[450px]";

  return (
    <div
      className={`group relative ${containerHeight} w-full rounded-xl border-2 border-dashed transition-all duration-300 ease-out overflow-hidden ${
        isDragOver
          ? "border-blue-500 bg-blue-50/50 scale-[1.02]"
          : imagePreview
          ? "border-gray-200 bg-white"
          : "border-gray-300 bg-gray-50/50 hover:border-gray-400 hover:bg-gray-100/50"
      } ${isHovered && !imagePreview ? "shadow-lg shadow-gray-200/50" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        id={`image-upload-${index}`}
        onChange={handleFileChange}
      />

      {/* Action Buttons Overlay */}
      {imagePreview && (
        <div className="absolute top-3 right-3 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
          <Button
            type="button"
            size="sm"
            variant="secondary"
            disabled={pictureUploadingLoader}
            onClick={handleEditClick}
            className="h-8 w-8 p-0 bg-white/90 backdrop-blur-sm hover:bg-white shadow-md border-0 hover:scale-105 transition-all duration-200"
          >
            <Eye size={14} className="text-blue-600" />
          </Button>

          <Button
            type="button"
            size="sm"
            variant="secondary"
            disabled={pictureUploadingLoader}
            onClick={handleEditClick}
            className="h-8 w-8 p-0 bg-white/90 backdrop-blur-sm hover:bg-white shadow-md border-0 hover:scale-105 transition-all duration-200"
          >
            <WandSparkles size={14} className="text-purple-600" />
          </Button>

          <Button
            type="button"
            size="sm"
            variant="secondary"
            disabled={pictureUploadingLoader}
            onClick={() => fileInputRef.current?.click()}
            className="h-8 w-8 p-0 bg-white/90 backdrop-blur-sm hover:bg-white shadow-md border-0 hover:scale-105 transition-all duration-200"
          >
            <RotateCcw size={14} className="text-green-600" />
          </Button>

          <Button
            type="button"
            size="sm"
            variant="secondary"
            disabled={pictureUploadingLoader}
            onClick={handleRemove}
            className="h-8 w-8 p-0 bg-white/90 backdrop-blur-sm hover:bg-red-50 shadow-md border-0 hover:scale-105 transition-all duration-200"
          >
            <Trash size={14} className="text-red-500" />
          </Button>
        </div>
      )}

      {/* Upload Button for Empty State */}
      {!imagePreview && (
        <Label
          htmlFor={`image-upload-${index}`}
          className="absolute top-3 right-3 z-10 h-8 w-8 rounded-lg bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm cursor-pointer flex items-center justify-center hover:bg-white hover:scale-105 transition-all duration-200"
        >
          <Pencil size={14} className="text-gray-600" />
        </Label>
      )}

      {/* Loading Overlay */}
      {pictureUploadingLoader && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-20 rounded-xl">
          <div className="flex flex-col items-center gap-2">
            <Loader2 size={24} className="animate-spin text-blue-600" />
            <p className="text-sm text-gray-600 font-medium">Uploading...</p>
          </div>
        </div>
      )}

      {/* Content */}
      {imagePreview ? (
        <div className="relative w-full h-full group">
          <Image
            src={imagePreview}
            alt="Preview"
            className="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-[1.02]"
            width={400}
            height={300}
          />
          {/* Gradient Overlay on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
        </div>
      ) : (
        <div
          className="flex flex-col items-center justify-center h-full cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <div
            className={`relative mb-4 transition-all duration-300 ${
              isHovered || isDragOver ? "scale-110" : "scale-100"
            }`}
          >
            <div
              className={`absolute inset-0 rounded-full bg-gradient-to-r ${
                isDragOver
                  ? "from-blue-400 to-purple-400"
                  : "from-gray-400 to-gray-500"
              } blur-lg opacity-20 animate-pulse`}
            />
            <div
              className={`relative p-4 rounded-full ${
                isDragOver
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-100 text-gray-500"
              } transition-colors duration-300`}
            >
              {isDragOver ? (
                <Upload size={small ? 24 : 32} className="animate-bounce" />
              ) : (
                <ImageIcon size={small ? 24 : 32} />
              )}
            </div>
          </div>

          <div className="text-center space-y-2">
            <p
              className={`font-semibold transition-colors duration-300 ${
                isDragOver ? "text-blue-600" : "text-gray-700"
              } ${small ? "text-lg" : "text-2xl"}`}
            >
              {isDragOver ? "Drop image here" : size}
            </p>

            <div
              className={`space-y-1 ${
                small ? "text-xs" : "text-sm"
              } transition-colors duration-300 ${
                isDragOver ? "text-blue-500" : "text-gray-500"
              }`}
            >
              {isDragOver ? (
                <p>Release to upload</p>
              ) : (
                <>
                  <p>Drag & drop or click to upload</p>
                  <p className="text-xs text-gray-400">
                    PNG, JPG, WebP up to 10MB
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Animated Border */}
          <div
            className={`absolute inset-0 rounded-xl pointer-events-none transition-opacity duration-300 ${
              isDragOver ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="absolute inset-0 rounded-xl border-2 border-blue-500 animate-pulse" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImagePlaceholder;
