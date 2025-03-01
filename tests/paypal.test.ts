import { generateAccessToken, paypal } from "../lib/paypal";

// test to generate access token from paypal
test("generates token from paypal", async () => {
  const token = await generateAccessToken();
  expect(typeof token).toBe("string");
  expect(token.length).toBeGreaterThan(0);
});

// test to create a paypal order
test("create a paypal order", async () => {
  const token = await generateAccessToken();
  const price = 10.0;

  const orderResponse = await paypal.createOrder(price);

  expect(orderResponse).toHaveProperty("id");
  expect(orderResponse).toHaveProperty("status");
  expect(orderResponse.status).toBe("CREATED");
});

// test to capture payment with mock order
test("simulate capturing payment", async () => {
  const orderId = "100";

  // mock the payment capture method
  const mockCapturePayment = jest
    .spyOn(paypal, "capturePayment")
    .mockResolvedValue({
      status: "COMPLETED",
    });

  const captureResponse = await paypal.capturePayment(orderId);
  expect(captureResponse).toHaveProperty("status");

  mockCapturePayment.mockRestore();
});
