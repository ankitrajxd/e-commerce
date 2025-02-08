"use client";

import { Button } from "@/components/ui/button";
import { createOrder } from "@/lib/actions/order.actions";
import { Loader2 } from "lucide-react";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

const PlaceOrderBtn = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <>
      <Button
        disabled={isPending}
        onClick={() => {
          startTransition(async () => {
            // Place order logic
            // call the action
            const res = await createOrder();
            if (!res.success) {
              throw new Error(res.message as string);
            }

            // redirect to order page
            router.push(res.redirectTo as string);
          });
        }}
      >
        {isPending && <Loader2 className="animate-spin" />}
        Place Order
      </Button>
    </>
  );
};

export default PlaceOrderBtn;
