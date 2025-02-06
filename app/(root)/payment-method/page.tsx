import { auth } from "@/auth";
import { getUserById } from "@/lib/actions/user.actions";
import { Metadata } from "next";
import PaymentMethodForm from "./payment-method-form";
import CheckoutSteps from "@/components/shared/checkout-steps";

const PaymentMethodPage = async () => {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("User not found");
  }

  const user = await getUserById(userId);

  const paymentMethod = user.paymentMethod;

  return (
    <>
      <CheckoutSteps current={2} />
      <PaymentMethodForm preferredPaymentMethod={paymentMethod} />
    </>
  );
};

export default PaymentMethodPage;

export const metadata: Metadata = {
  title: "Select Payment Method",
};
