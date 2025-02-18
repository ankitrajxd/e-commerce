"use server";

import { prisma } from "@/db/prisma";
import { convertToPlainObject, formatError } from "../utils";
import { LATEST_PRODUCTS_LIMIT } from "../constants";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { insertProductSchema, updateProductSchema } from "../validators";
import { Prisma } from "@prisma/client";

// Get latest products
export async function getLatestProducts() {
  const data = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: {
      stock: "desc",
    },
  });

  return convertToPlainObject(data);
}

// get single product by its slug
export async function getProductBySlug(slug: string) {
  const data = await prisma.product.findFirst({
    where: {
      slug,
    },
  });

  return convertToPlainObject(data);
}

// get single product by its id
export async function getProductById(id: string) {
  const data = await prisma.product.findFirst({
    where: {
      id,
    },
  });

  return convertToPlainObject(data);
}

// get all products

export async function getAllProducts({
  query,
  limit = 4,
  page,
  category,
  price,
  sort,
  rating,
}: {
  query: string;
  limit?: number;
  page: number;
  category?: string;
  price?: string;
  sort?: string;
  rating?: string;
}) {
  // query filter
  const queryFilter: Prisma.ProductWhereInput =
    query && query !== "all"
      ? {
          name: {
            contains: query,
            mode: "insensitive",
          },
        }
      : {};

  const categoryFilter: Prisma.ProductWhereInput =
    category && category !== "all" ? { category } : {};
  const priceFilter: Prisma.ProductWhereInput =
    price && price !== "all"
      ? {
          price: {
            gte: Number(price.split("-")[0]),
            lte: Number(price.split("-")[1]),
          },
        }
      : {};
  const ratingFilter: Prisma.ProductWhereInput =
    rating && rating !== "all"
      ? {
          rating: {
            gte: Number(rating),
          },
        }
      : {};

  const data = await prisma.product.findMany({
    where: {
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    },
    skip: (page - 1) * limit,
    take: limit,
    orderBy:
      sort === "lowest"
        ? { price: "asc" }
        : sort === "highest"
          ? { price: "desc" }
          : { createdAt: "desc" },
  });

  const dataCount = await prisma.product.count();

  return convertToPlainObject({
    data,
    totalPages: Math.ceil(dataCount / limit),
  });
}

// delete a product
export async function deleteProduct(id: string) {
  try {
    const product = await prisma.product.findFirst({
      where: {
        id,
      },
    });

    if (!product) {
      return {
        success: false,
        message: "Product not found",
      };
    }

    await prisma.product.delete({
      where: {
        id,
      },
    });

    revalidatePath("/admin/products");

    return {
      success: true,
      message: "Product deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// create a product
export async function createProduct(data: z.infer<typeof insertProductSchema>) {
  try {
    const product = insertProductSchema.parse(data);

    await prisma.product.create({
      data: product,
    });

    revalidatePath("/admin/products");
    return {
      success: true,
      message: "Product created successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// update a product
export async function updateProduct(data: z.infer<typeof updateProductSchema>) {
  try {
    const product = updateProductSchema.parse(data);

    const existingProduct = await prisma.product.findFirst({
      where: {
        id: product.id,
      },
    });

    if (!existingProduct) {
      return {
        success: false,
        message: "Product not found",
      };
    }

    await prisma.product.update({
      where: {
        id: product.id,
      },
      data: product,
    });

    revalidatePath("/admin/products");
    return {
      success: true,
      message: "Product updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// get all categories
export async function getAllCategories() {
  const data = await prisma.product.groupBy({
    by: ["category"],
    _count: {
      category: true,
    },
  });

  return data;
}

// get featured produts
export async function getFeaturedProducts() {
  const data = await prisma.product.findMany({
    where: {
      isFeatured: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 4,
  });

  return convertToPlainObject(data);
}
