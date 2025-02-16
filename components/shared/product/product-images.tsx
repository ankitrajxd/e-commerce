"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

const ProductImages = ({ images }: { images: string[] }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  return (
    <div className="space-y-4">
      <Image
        src={images[selectedImage]}
        alt="product image"
        width={1000}
        height={1000}
        className="min-h-[300px] object-cover object-center rounded-md"
      />

      <div className="flex p-2 items-center gap-3">
        {images.map((image, index) => (
          <div
            key={index}
            onClick={() => setSelectedImage(index)}
            className={cn(
              "cursor-pointer hover:border border-orange-500 rounded-sm overflow-hidden",
              selectedImage === index && "border border-orange-500"
            )}
          >
            <Image
              src={image}
              alt="product image rounded-sm"
              width={100}
              height={100}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;
