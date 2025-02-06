"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Cart } from "@/types";
import Link from "next/link";
// import { useRouter } from "next/navigation";
import { useTransition } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { ArrowRight, Loader2, Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  cart?: Cart;
}

const CartTable = ({ cart }: Props) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [isChechoutPending, startCheckoutTransition] = useTransition();

  return (
    <>
      <h1 className="py-4 h2-bold">Shopping Cart</h1>

      {!cart || cart.items.length === 0 ? (
        <div>Cart is empty.</div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.items.map((item) => (
                  <TableRow key={item.slug}>
                    <TableCell>
                      <Link
                        href={`/product/${item.slug}`}
                        className="flex items-center"
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={50}
                          height={50}
                          className="rounded-md"
                        />
                        <span className="ml-4">{item.name}</span>
                      </Link>
                    </TableCell>

                    <TableCell className="flex-center gap-2">
                      <Button
                        className="text-xs"
                        variant={"outline"}
                        type="button"
                        disabled={isPending}
                        onClick={() => {
                          startTransition(async () => {
                            const res = await removeItemFromCart(
                              item.productId
                            );
                            if (!res.success) {
                              toast({
                                variant: "destructive",
                                description: res.message,
                              });
                            }
                          });
                        }}
                      >
                        {isPending ? (
                          <Loader2 className="animate-spin" />
                        ) : (
                          <Minus />
                        )}
                      </Button>
                      <span>{item.qty}</span>

                      <Button
                        className="text-xs"
                        variant={"outline"}
                        type="button"
                        disabled={isPending}
                        onClick={() => {
                          startTransition(async () => {
                            const res = await addItemToCart(item);
                            if (!res.success) {
                              toast({
                                variant: "destructive",
                                description: res.message,
                              });
                            }
                          });
                        }}
                      >
                        {isPending ? (
                          <Loader2 className="animate-spin" />
                        ) : (
                          <Plus />
                        )}
                      </Button>
                    </TableCell>

                    <TableCell className="text-right">${item.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="md:col-span-1">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{cart.items.reduce((a, c) => a + c.qty, 0)}</span>
              </div>

              <div className="flex justify-between">
                <span>Taxes and Charges</span>
                <span>{cart.taxPrice || "Free"}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{cart.shippingPrice && "Free"}</span>
              </div>

              <div className="flex justify-between">
                <span>Total</span>
                <span>${cart.totalPrice}</span>
              </div>

              <Button
                className="w-full"
                disabled={isChechoutPending}
                variant={"default"}
                onClick={() => {
                  startCheckoutTransition(async () => {
                    router.push("/shipping-address");
                  });
                }}
              >
                {isChechoutPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <ArrowRight />
                )}
                Proceed to Checkout
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CartTable;
