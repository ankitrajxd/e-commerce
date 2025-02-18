"use server";

import { z } from "zod";
import { insertReviewSchema } from "@/lib/validators";
import { formatError } from "@/lib/utils";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { revalidatePath } from "next/cache";

// create and update Reviews
export async function createUpdateReview(
  data: z.infer<typeof insertReviewSchema>,
) {
  try {
    const session = await auth();
    if (!session) {
      throw new Error("user is not authenticated");
    }

    //   validate and store the review
    const review = insertReviewSchema.parse({
      ...data,
      userId: session.user.id,
    });

    const product = await prisma.product.findFirst({
      where: {
        id: review.productId,
      },
    });
    if (!product) {
      throw new Error("Product not found");
    }

    //   check if user already reviewed
    const reviewExists = await prisma.review.findFirst({
      where: {
        productId: review.productId,
        userId: review.userId,
      },
    });

    await prisma.$transaction(async (tx) => {
      if (reviewExists) {
        // update the review
        await tx.review.update({
          where: {
            id: reviewExists.id,
          },
          data: {
            title: review.title,
            description: review.description,
            rating: review.rating,
          },
        });
      } else {
        //     create a review
        await tx.review.create({
          data: review,
        });
      }

      //   get avg rating
      const averageRating = await tx.review.aggregate({
        _avg: {
          rating: true,
        },
        where: {
          productId: review.productId,
        },
      });

      //   get number of reviews
      const numReview = await tx.review.count({
        where: {
          productId: review.productId,
        },
      });

      //   update the rating and numReviews in product table
      await tx.product.update({
        where: {
          id: review.productId,
        },
        data: {
          rating: averageRating._avg.rating || 0,
          numReviews: numReview,
        },
      });
    });

    revalidatePath(`/product/${product.slug}`);
    return {
      success: true,
      message: "Review Updated successfully",
    };
  } catch (e) {
    return {
      success: false,
      message: formatError(e),
    };
  }
}

// get all reviews for a product
export async function getReviews({ productId }: { productId: string }) {
  const data = await prisma.review.findMany({
    where: {
      productId: productId,
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return { data };
}

// get a review written by the current user
export async function getReviewByProductId({
  productId,
}: {
  productId: string;
}) {
  const session = await auth();
  if (!session) {
    throw new Error("User is not authenticated");
  }
  return await prisma.review.findFirst({
    where: {
      productId,
      userId: session.user.id,
    },
  });
}
