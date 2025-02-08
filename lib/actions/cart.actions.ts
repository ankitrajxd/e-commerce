"use server";

import { CartItem } from "@/types";
import { convertToPlainObject, round2, sendResponse } from "../utils";
import { cookies } from "next/headers";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { cartItemSchema, insertCartSchema } from "../validators";
import { revalidatePath } from "next/cache";

// Calculate cart prices
const calcPrice = (items: CartItem[]) => {
  const itemsPrice = round2(
      items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0)
    ),
    shippingPrice = round2(itemsPrice > 100 ? 0 : 10),
    taxPrice = round2(0.15 * itemsPrice),
    totalPrice = round2(itemsPrice + taxPrice + shippingPrice);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
};

export async function addItemToCart(data: CartItem) {
  try {
    // check for cart cookie
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;

    if (!sessionCartId) {
      throw new Error("Cart session cookie not found");
    }

    // Get session and user id
    const session = await auth();
    const userId = session?.user?.id || undefined;

    // get cart
    const cart = await getMyCart();

    // parse and validate item
    const item = cartItemSchema.parse(data);

    // find product in db
    const product = await prisma.product.findFirst({
      where: { id: item.productId },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    if (!cart) {
      // create a new cart object
      const newCart = insertCartSchema.parse({
        userId: userId,
        items: [item],
        sessionCartId: sessionCartId,
        ...calcPrice([item]),
      });

      // add to db
      await prisma.cart.create({
        data: newCart,
      });

      console.log("cart created successfully");

      // revalidate product page
      revalidatePath(`/product/${product.slug}`);

      return sendResponse(true, `${product.name} added to cart`);
    } else {
      // check if item already exists in cart
      const existItem = (cart.items as CartItem[]).find(
        (x) => x.productId === item.productId
      );
      if (existItem) {
        // check stock
        if (product.stock < existItem.qty + 1) {
          throw new Error("Product out of stock");
        }

        // increase the quantity
        (cart.items as CartItem[]).find(
          (x) => x.productId === item.productId
        )!.qty = existItem.qty + 1;
      } else {
        // if item does not exist in cart
        // check stock
        if (product.stock < 1) {
          throw new Error("Product out of stock");
        }

        // add item to carts.etem
        cart.items.push(item);
      }

      // save to database
      await prisma.cart.update({
        where: {
          id: cart.id,
        },
        data: {
          items: cart.items,
          ...calcPrice(cart.items),
        },
      });

      revalidatePath(`/product/${product.slug}`);

      return sendResponse(
        true,
        `${product.name} ${existItem ? "quantity updated" : "added to cart"}`
      );
    }
  } catch (error) {
    return sendResponse(false, error);
  }
}

export async function getMyCart() {
  const sessionCartId = (await cookies()).get("sessionCartId")?.value;

  if (!sessionCartId) {
    throw new Error("Cart session cookie not found");
  }

  // Get session and user id
  const session = await auth();
  const userId = session?.user?.id || undefined;

  // get the cart by userId from db
  const cart = await prisma.cart.findFirst({
    where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
  });

  if (!cart) {
    return undefined;
  }

  // convert decimals and return
  return convertToPlainObject({
    ...cart,
    items: cart.items as CartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
  });
}

// remove items from cart
export async function removeItemFromCart(productId: string) {
  try {
    // check for cart cookie
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) {
      throw new Error("Cart session cookie not found");
    }

    // get product
    const product = await prisma.product.findFirst({
      where: { id: productId },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    // get user cart
    const cart = await getMyCart();
    if (!cart) {
      throw new Error("Cart not found");
    }

    // check for item
    const exist = (cart.items as CartItem[]).find(
      (x) => x.productId === productId
    );

    if (!exist) {
      throw new Error("Product not found in cart");
    }

    // check if only one in qty
    if (exist.qty === 1) {
      cart.items = (cart.items as CartItem[]).filter(
        (x) => x.productId !== exist.productId
      );
    } else {
      // decrese qty
      (cart.items as CartItem[]).find((x) => x.productId === productId)!.qty =
        exist.qty - 1;
    }

    // update cart in db
    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: cart.items,
        ...calcPrice(cart.items as CartItem[]),
      },
    });

    revalidatePath(`/product/${product.slug}`);

    return sendResponse(true, `${product.name} removed from cart`);
  } catch (error) {
    return sendResponse(false, error);
  }
}

// buy now
export async function buyNow(data: CartItem) {
  try {
    const response = await addItemToCart(data);
    if (response.success) {
      return {
        success: true,
        message: "Order created successfully",
        redirectTo: "/cart",
      };
    } else {
      return {
        success: false,
        message: response.message,
      };
    }
  } catch (error) {
    return sendResponse(false, error);
  }
}
