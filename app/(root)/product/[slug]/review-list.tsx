"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import ReviewForm from "@/app/(root)/product/[slug]/review-form";
import { getReviews } from "@/lib/actions/review.actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarIcon, UserIcon } from "lucide-react";
import { Review } from "@/types";
import { formatDateTime } from "@/lib/utils";

interface Props {
  userId: string;
  productId: string;
  productSlug: string;
}

const ReviewList = ({ userId, productSlug, productId }: Props) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  console.log(userId, productSlug, productId);

  function reload() {
    console.log("Review Submitted");
  }

  useEffect(() => {
    const loadReviews = async () => {
      const res = await getReviews({ productId });
      setReviews(res.data);
    };
    loadReviews();
  }, [productId]);

  return (
    <div className={"space-y-4"}>
      {reviews?.length === 0 && <div>No reviews yet</div>}
      {userId ? (
        <>
          <ReviewForm
            onReviewSubmitted={reload}
            userId={userId}
            productId={productId}
          />
        </>
      ) : (
        <div>
          Please
          <Link
            className={"underline underline-offset-2 ml-2"}
            href={`/sign-in?callbackUrl=/product/${productSlug}`} // manually setting up callbackUrl - good use case
          >
            sign in
          </Link>
        </div>
      )}
      <div>
        {reviews.map((r) => (
          <Card key={r.id}>
            <CardHeader>
              <div className="flex-between">
                <CardTitle>{r.title}</CardTitle>
              </div>
              <CardDescription>{r.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4 text-sm text-muted-foreground">
                {/*  rating */}
                <div className="flex items-center">
                  <UserIcon className={"mr-2 size-3"} />
                  {r.user.name}
                </div>
                <div className="flex items-center">
                  <CalendarIcon className={"mr-2 size-3"} />
                  {formatDateTime(r.createdAt).dateTime}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
export default ReviewList;
