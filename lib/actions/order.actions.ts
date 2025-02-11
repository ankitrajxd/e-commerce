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
import { Prisma } from "@prisma/client";

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

type SalesDataType = {
  month: string;
  totalSales: number;
};

// get sales data and order summary
export async function getOrderSummary() {
  // get counts for each resource - users, products, orders

  const orderCount = await prisma.order.count();
  const productCount = await prisma.product.count();
  const usersCount = await prisma.user.count();

  // get total sales

  const totalSales = await prisma.order.aggregate({
    _sum: {
      totalPrice: true,
    },
  });

  // get monthly sales
  const salesDataRaw = await prisma.$queryRaw<
    Array<{ month: string; totalSales: Prisma.Decimal }>
  >` SELECT to_char("createdAt", 'MM/YY') as "month", sum("totalPrice") as "totalSales" FROM "Order" GROUP BY to_char("createdAt", 'MM/YY')`;

  const salesData: SalesDataType[] = salesDataRaw.map((item) => ({
    month: item.month,
    totalSales: Number(item.totalSales),
  }));

  // get latest orders

  const latestSales = await prisma.order.findMany({
    orderBy: {
      createdAt: "desc",
    },

    take: 6,

    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  return {
    orderCount,
    productCount,
    usersCount,
    totalSales,
    salesData,
    latestSales,
  };
}

// get all orders
export async function getAllOrders({
  limit = PAGE_SIZE,
  page,
}: {
  limit?: number;
  page: number;
}) {
  const data = await prisma.order.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
    skip: (page - 1) * limit,
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  const dataCount = await prisma.order.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

// delete order by id

export async function deleteOrder(id: string) {
  try {
    const session = await auth();
    if (session?.user?.role !== "admin") {
      throw new Error("User is not authorized");
    }

    await prisma.order.delete({
      where: {
        id,
      },
    });

    revalidatePath("/admin/orders");

    return {
      success: true,
      message: "Order deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// mark order as delivered

export async function updateOrderToPaidCOD(orderId: string) {
  try {
    // same logic as update order to paid
    await updateOrderToPaid({ orderId });
    revalidatePath(`/order/${orderId}`);

    return {
      success: true,
      message: "Order marked as paid.",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// update cod order to delivered
export async function deliverOrder(orderId: string) {
  try {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    if (order.isDelivered) {
      throw new Error("Order already delivered");
    }

    if (!order.isPaid) {
      throw new Error("Order not paid");
    }

    // update order to delivered

    await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        isDelivered: true,
        deliveredAt: new Date(),
      },
    });

    revalidatePath(`/order/${orderId}`);
    return {
      success: true,
      mesage: "Order has been marked delivered",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}
