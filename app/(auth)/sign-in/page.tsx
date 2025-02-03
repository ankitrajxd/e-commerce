import { auth } from "@/auth";
import CredentialsSignInForm from "./credentials-signin-form";
import { redirect } from "next/navigation";

interface Props {
  searchParams: Promise<{
    callbackUrl: string;
  }>;
}

const SignInPage = async ({ searchParams }: Props) => {
  const session = await auth();
  const { callbackUrl } = await searchParams;

  if (session) {
    return redirect(callbackUrl || "/");
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <CredentialsSignInForm />
    </div>
  );
};

export default SignInPage;
