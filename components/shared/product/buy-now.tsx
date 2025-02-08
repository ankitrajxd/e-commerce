"use client";

import { Button } from "@/components/ui/button";
import { addItemToCart } from "@/lib/actions/cart.actions";
import { CartItem } from "@/types";
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";
import { useTransition } from "react";

interface Props {
  cartItem: CartItem;
}

const BuyNowButton = ({ cartItem }: Props) => {
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <Button
        disabled={isPending}
        onClick={() => {
          startTransition(async () => {
            // Add item to cart
            const res = await addItemToCart(cartItem);
            if (res.success) {
              // Redirect to cart page
              redirect("/cart");
            }
          });
        }}
        className="w-full"
        variant={"outline"}
      >
        {isPending && <Loader2 className="animate-spin" />}
        ⚡Buy Now
      </Button>
    </>
  );
};

export default BuyNowButton;
