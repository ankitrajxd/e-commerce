"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Product } from "@/types";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";

interface Props {
  products: Product[];
}

const ProductCarousel = ({ products }: Props) => {
  return (
    <Carousel
      opts={{
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: 2000,
          stopOnInteraction: true,
          stopOnMouseEnter: true,
        }),
      ]}
      className="w-full mb-12 rounded-md overflow-hidden"
    >
      <CarouselContent>
        {products.map((product) => (
          <CarouselItem key={product.id}>
            <Link href={`/product/${product.slug}`}>
              <div className="relative mx-auto">
                <Image
                  src={product.banner!}
                  alt={product.name}
                  height={0}
                  width={0}
                  sizes="100vw"
                  className="w-full h-auto"
                />

                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <h2 className="text-white text-2xl font-bold">
                    {product.name}
                  </h2>
                </div>
              </div>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default ProductCarousel;
