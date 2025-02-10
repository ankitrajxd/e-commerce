"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { convertToPlainObject, formatError } from "../utils";
import { auth } from "@/auth";
import { getMyCart } from "./cart.actions";
import { getUserById } from "./user.actions";
import { insertOrderSchema } from "../validators";
import { prisma } from "@/db/prisma";
import { CartItem, OrderItem, PaymentResult } from "@/types";
import { paypal } from "../paypal";
import { revalidatePath } from "next/cache";
import { PAGE_SIZE } from "../constants";

// create order and create the order items
export const createOrder = async () => {
  try {
    const session = await auth();
    if (!auth) {
      throw new Error("User is not authenticated");
    }

    const cart = await getMyCart();
    const userId = session?.user?.id;
    if (!userId) {
      throw new Error("User is not authenticated");
    }
    const user = await getUserById(userId);
    if (!cart || cart.items.length === 0) {
      return {
        success: false,
        message: "Cart is empty",
        redirectTo: "/cart",
      };
    }
    if (!user.address) {
      return {
        success: false,
        message: "User address is not set",
        redirectTo: "/shipping-address",
      };
    }
    if (!user.paymentMethod) {
      return {
        success: false,
        message: "User payment method is not set",
        redirectTo: "/payment-method",
      };
    }

    // construct order object
    const order = insertOrderSchema.parse({
      userId: user.id,
      shippingAddress: user.address,
      paymentMethod: user.paymentMethod,
      itemsPrice: cart.itemsPrice,
      shippingPrice: cart.shippingPrice,
      taxPrice: cart.taxPrice,
      totalPrice: cart.totalPrice,
    });

    // create a transaction to create the order and order items in db
    const newOrderId = await prisma.$transaction(async (tx) => {
      // create order
      const newOrder = await tx.order.create({
        data: order,
      });

      // create order items from the cart items
      for (const item of cart.items as CartItem[]) {
        await tx.orderItem.create({
          data: {
            ...item,
            price: item.price,
            orderId: newOrder.id,
          },
        });
      }

      // clear the cart
      await tx.cart.update({
        where: { id: cart.id },
        data: {
          items: [],
          totalPrice: 0,
          itemsPrice: 0,
          shippingPrice: 0,
          taxPrice: 0,
        },
      });

      return newOrder.id;
    });

    if (!newOrderId) {
      throw new Error("Order not created");
    }

    return {
      success: true,
      message: "Order created successfully",
      redirectTo: `/order/${newOrderId}`,
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return {
      success: false,
      message: formatError(error),
    };
  }
};

// get order by id
export async function getOrderById(orderId: string) {
  const data = await prisma.order.findFirst({
    where: {
      id: orderId,
    },
    include: {
      OrderItems: true,
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  return convertToPlainObject(data);
}

// creeate new paypal order
export async function createPaypalOrder(orderId: string) {
  try {
    //get order from db
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
    });

    if (order) {
      // create paypal order
      const paypalOrder = await paypal.createOrder(Number(order.totalPrice));

      // update order with paypal order id
      await prisma.order.update({
        where: {
          id: orderId,
        },
        data: {
          paymentResult: {
            id: paypalOrder.id,
            email_address: "",
            status: "",
            pricePaid: 0,
          },
        },
      });

      return {
        success: true,
        message: "Paypal order created successfully",
        data: paypalOrder.id,
      };
    } else {
      throw new Error("Order not found");
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// execute paypal order and update order to paid
export async function approvePaypalOrder(
  orderId: string,
  data: { orderId: string }
) {
  try {
    //get order from db
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    const captureData = await paypal.capturePayment(data.orderId);

    if (
      !captureData ||
      captureData.id !== (order.paymentResult as PaymentResult).id ||
      captureData.status !== "COMPLETED"
    ) {
      throw new Error("Payment not completed");
    }

    // update order to paid
    await updateOrderToPaid({
      orderId,
      paymentResult: {
        id: captureData.id,
        status: captureData.status,
        email_address: captureData.payer.email_address,
        pricePaid:
          captureData.purchase_units[0]?.payments?.captures[0]?.amount?.value,
      },
    });

    revalidatePath(`/order/${orderId}`);
    return {
      success: true,
      message: "Order paid successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// update order to paid
async function updateOrderToPaid({
  orderId,
  paymentResult,
}: {
  orderId: string;
  paymentResult?: PaymentResult;
}) {
  //get order from db
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
    },
    include: {
      OrderItems: true,
    },
  });

  if (order?.isPaid) {
    throw new Error("Order already paid");
  }

  // transaction to update order to paid and account for product stock
  await prisma.$transaction(async (tx) => {
    // iterate over product and update stock
    for (const item of order?.OrderItems as OrderItem[]) {
      await tx.product.update({
        where: {
          id: item.productId,
        },
        data: {
          stock: {
            decrement: item.qty,
          },
        },
      });
    }

    // set the order to paid
    await tx.order.update({
      where: {
        id: orderId,
      },
      data: {
        isPaid: true,
        paidAt: new Date(),
        paymentResult,
      },
    });
  });

  // get updated order after transaction
  const updatedOrder = await prisma.order.findFirst({
    where: {
      id: orderId,
    },
    include: {
      OrderItems: true,
      user: { select: { name: true, email: true } },
    },
  });

  if (!updatedOrder) {
    throw new Error("Order not found");
  }
}

// get user's orders

export async function getMyOrders({
  limit = PAGE_SIZE,
  page,
}: {
  limit?: number;
  page: number;
}) {
  const session = await auth();
  if (!session) {
    throw new Error("User is not authenticated");
  }

  const data = await prisma.order.findMany({
    where: {
      userId: session?.user?.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
    skip: (page - 1) * limit,
  });

  const dataCount = await prisma.order.count({
    where: {
      userId: session?.user?.id,
    },
  });

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}
