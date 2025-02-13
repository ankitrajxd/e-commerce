import { auth } from "@/auth";
import CheckoutSteps from "@/components/shared/checkout-steps";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getMyCart } from "@/lib/actions/cart.actions";
import { getUserById } from "@/lib/actions/user.actions";
import { formatCurrency } from "@/lib/utils";
import { ShippingAddress } from "@/types";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import PlaceOrderBtn from "./place-order-btn";

const PlaceOrderPage = async () => {
  const cart = await getMyCart();
  const session = await auth();
  const userId = session?.user?.id;
  const user = await getUserById(userId as string);
  if (!userId) {
    throw new Error("User not found");
  }
  if (!cart || cart.items.length === 0) {
    redirect("/cart");
  }

  if (!user.address) {
    redirect("/shipping-address");
  }

  if (!user.paymentMethod) {
    redirect("/payment-method");
  }

  const userAddress = user.address as ShippingAddress;

  return (
    <>
      <CheckoutSteps current={3} />
      <h1 className="py-4 text-2xl">Place Order</h1>
      <div className="grid md:grid-cols-3 gap-5">
        <div className="md:col-span-2 overflow-x-auto space-y-4">
          <Card>
            <CardContent className="p-4 gap-4 text-sm">
              <h2 className="text-xl pb-4">Shipping Address</h2>
              <p>{userAddress.fullName}</p>
              <p>
                {userAddress.streetAddress}, {userAddress.city}
                {","}
              </p>
              <p>
                {userAddress.postalCode}, {userAddress.country}
              </p>

              <div className="mt-3">
                <Link href="/shipping-address">
                  <Button variant={"outline"}>Edit</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 gap-4 text-sm">
              <h2 className="text-xl pb-4">Payment Method</h2>
              <p>{user.paymentMethod}</p>

              <div className="mt-3">
                <Link href="/payment-method">
                  <Button variant={"outline"}>Edit</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 gap-4 text-sm">
              <h2 className="text-xl pb-4">Order Items</h2>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody className="rounded-lg border">
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
                          />
                          <span className="px-2">{item.name}</span>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <span className="p-2">{item.qty}</span>
                      </TableCell>
                      <TableCell>{formatCurrency(item.price)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardContent className="p-4 gap-4 text-sm">
              <h2 className="text-xl pb-4">Order Summary</h2>
              <div className="flex justify-between">
                <p>Items</p>
                <p>{formatCurrency(cart.itemsPrice)}</p>
              </div>
              <div className="flex justify-between">
                <p>Shipping</p>
                <p>{formatCurrency(cart.shippingPrice)}</p>
              </div>
              <div className="flex justify-between">
                <p>Tax</p>
                <p>{formatCurrency(cart.taxPrice)}</p>
              </div>
              <div className="flex justify-between">
                <p>Total</p>
                <p>{formatCurrency(cart.totalPrice)}</p>
              </div>
              <div className="mt-4">
                <PlaceOrderBtn />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default PlaceOrderPage;

export const metadata: Metadata = {
  title: "Place Order",
};
