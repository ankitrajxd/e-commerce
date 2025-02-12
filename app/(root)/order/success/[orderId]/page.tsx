import Link from "next/link";

interface Props {
  params: Promise<{ orderId: string }>;
}

const SuccessPage = async ({ params }: Props) => {
  const orderId = (await params).orderId;

  return (
    <div className="flex justify-center items-center h-full">
      <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md text-center space-y-6 border border-gray-700">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-2xl blur-xl"></div>
        <div className="relative z-10">
          <div className="bg-gradient-to-br from-green-400 to-green-600 p-4 rounded-full inline-block mb-6 shadow-lg shadow-green-500/50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-16 h-16 text-white mx-auto animate-pulse"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Order Placed Successfully!
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Thank you for shopping with us.
          </p>
          <div className="flex flex-col">
            <Link href={`/`}>
              <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-300 ease-in-out hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900">
                Continue Shopping
              </button>
            </Link>
            <Link href={`/order/${orderId}`} className="">
              <button className="text-xs mt-3 hover:underline underline-offset-2">
                View order Details
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
