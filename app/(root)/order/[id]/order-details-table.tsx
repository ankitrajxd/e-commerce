"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
  approvePaypalOrder,
  createPaypalOrder,
  deliverOrder,
  updateOrderToPaidCOD,
} from "@/lib/actions/order.actions";
import { formatCurrency } from "@/lib/utils";
import { Order } from "@/types";
import {
  PayPalButtons,
  PayPalScriptProvider,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface Props {
  order: Order;
  paypalClientId: string;
  isAdmin: boolean;
}

const OrderDetailsTable = ({ order, paypalClientId, isAdmin }: Props) => {
  const {
    shippingAddress,
    orderItems,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    paymentMethod,
    isPaid,
    isDelivered,
    user: { name },
  } = order;

  const { toast } = useToast();

  const PrintLoadingState = () => {
    const [{ isPending, isRejected }] = usePayPalScriptReducer();

    let status = "";
    if (isPending) {
      status = "Loading PayPal...";
    } else if (isRejected) {
      status = "Failed to load PayPal";
    }
    return status;
  };

  const handleCreatePaypalOrder = async () => {
    const res = await createPaypalOrder(order.id);
    if (!res.success) {
      toast({
        variant: "destructive",
        description: res.message,
      });
    }

    return res.data;
  };

  const handleApprovePaypalorder = async (data: { orderID: string }) => {
    const res = await approvePaypalOrder(order.id, { orderId: data.orderID });

    toast({
      variant: res.success ? "default" : "destructive",
      description: res.message,
    });
  };

  return (
    <>
      <h1 className="py-4 text-2xl">
        <OrderIdExpandable id={order.id} />
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 md:gap-5 gap-y-4">
        <div className="col-span-2 space-y-4 overflow-x-auto">
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 text-sm">
              {paymentMethod}
              <Badge
                className="w-fit"
                variant={isPaid ? "default" : "destructive"}
              >
                {isPaid ? "Paid" : "Not Paid"}
              </Badge>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 text-sm">
              <p>{name}</p>
              <p>
                {shippingAddress.streetAddress}, {shippingAddress.city},{" "}
                {shippingAddress.country} - {shippingAddress.postalCode}
              </p>
              <Badge
                className="w-fit"
                variant={isDelivered ? "default" : "destructive"}
              >
                {isDelivered ? "Shipped" : "Not Delivered"}
              </Badge>
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
                  {orderItems.map((item) => (
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
        <div className="w-full  md:col-span-1">
          <Card className="">
            <CardContent className="space-y-2 text-sm p-6">
              <h2 className="text-xl pb-4">Order Summary</h2>
              <div className="flex justify-between">
                <p>Items</p>
                <p>{formatCurrency(itemsPrice)}</p>
              </div>
              <div className="flex justify-between">
                <p>Shipping</p>
                <p>{formatCurrency(shippingPrice)}</p>
              </div>
              <div className="flex justify-between">
                <p>Tax</p>
                <p>{formatCurrency(taxPrice)}</p>
              </div>
              <hr className="my-4" />
              <div className="flex justify-between">
                <p className="font-bold text-lg">Total</p>
                <p className="font-bold text-lg">
                  {" "}
                  {formatCurrency(totalPrice)}
                </p>
              </div>
            </CardContent>
            {/* paypal payment */}
            {!isPaid && paymentMethod === "Paypal" && (
              <div className="p-7">
                <PayPalScriptProvider options={{ clientId: paypalClientId }}>
                  <PrintLoadingState />
                  <PayPalButtons
                    createOrder={handleCreatePaypalOrder}
                    onApprove={handleApprovePaypalorder}
                  />
                </PayPalScriptProvider>
              </div>
            )}

            {/* cash on delivery */}

            <div className="flex gap-2 p-4">
              {!isPaid &&
                paymentMethod.toLowerCase() === "cashondelivery" &&
                isAdmin && (
                  <Button
                    className="w-full py-2 text-white bg-green-500 hover:bg-green-600"
                    onClick={async () => {
                      const res = await updateOrderToPaidCOD(order.id);
                      toast({
                        variant: res.success ? "default" : "destructive",
                        description: res.message,
                      });
                    }}
                  >
                    Mark as Paid
                  </Button>
                )}
              {/* mark as delivered */}
              {!isDelivered && isPaid && isAdmin && (
                <Button
                  className="w-full py-2 text-white bg-green-500 hover:bg-green-600"
                  onClick={async () => {
                    const res = await deliverOrder(order.id);
                    toast({
                      variant: res.success ? "default" : "destructive",
                      description: res.message,
                    });
                  }}
                >
                  Mark as Delivered
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default OrderDetailsTable;

function OrderIdExpandable({ id }: { id: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const show = isExpanded ? id : id.slice(-6);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset "Copied!" after 2 seconds
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-green-800 font-bold"
      >
        Order Id :- {isExpanded ? "" : "..."}
        {show}
      </button>
      <button
        onClick={handleCopy}
        className="px-2 py-1 text-sm bg-gray-200 rounded-md hover:bg-gray-300"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}
