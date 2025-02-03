import { auth } from "@/auth";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import SignUpForm from "./sign-up-form";

interface Props {
  searchParams: Promise<{
    callbackUrl: string;
  }>;
}

const SignUpPage = async ({ searchParams }: Props) => {
  const session = await auth();
  const { callbackUrl } = await searchParams;

  if (session) {
    return redirect(callbackUrl || "/");
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <SignUpForm />
    </div>
  );
};

export default SignUpPage;

export const metadata: Metadata = {
  title: "Sign Up",
};
