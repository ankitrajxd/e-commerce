import { Resend } from "resend";
import { Order } from "@/types";
import { APP_NAME, SENDER_EMAIL } from "@/lib/constants";

import { config } from "dotenv";
import PurchaseReceipt from "@/app/email/purchase-receipt";

config();

const resend = new Resend(process.env.RESEND_API_KEY as string);
export const sendPurchaseReceipt = async ({ order }: { order: Order }) => {
  await resend.emails.send({
    from: `${APP_NAME} <${SENDER_EMAIL}>`,
    to: order.user.email,
    subject: `Order confirmation ${order.id}`,
    react: <PurchaseReceipt order={order} />,
  });
};
