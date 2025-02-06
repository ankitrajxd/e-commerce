import { cn } from "@/lib/utils";
import React from "react";

const CheckoutSteps = ({ current = 0 }) => {
  const steps = [
    "User Login",
    "Shipping Address",
    "Payment Method",
    "Place Order",
  ];

  return (
    <>
      <div className="flex flex-col justify-center items-center md:flex-row gap-5 mb-10">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div
              className={cn(
                "p-2 px-4 rounded-full text-center text-xs",
                index === current ? "bg-secondary" : ""
              )}
            >
              {step}
            </div>

            {step !== steps[steps.length - 1] && (
              <hr className="border border-gray-500 w-14" />
            )}
          </React.Fragment>
        ))}
      </div>
    </>
  );
};

export default CheckoutSteps;
