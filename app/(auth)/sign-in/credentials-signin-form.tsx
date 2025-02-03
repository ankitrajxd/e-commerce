"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInWithCredentials } from "@/lib/actions/user.actions";
import { signInDefaultValues } from "@/lib/constants";
import { Loader } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";

const CredentialsSignInForm = () => {
  const [data, action, pending] = useActionState(signInWithCredentials, {
    success: false,
    message: "",
  });

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  return (
    <form action={action}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            name="email"
            required
            className="input"
            defaultValue={signInDefaultValues.email}
          />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            id="password"
            name="password"
            className="input"
            required
            defaultValue={signInDefaultValues.password}
          />
        </div>
        <div>
          <Button
            disabled={pending}
            variant={"default"}
            type="submit"
            className="w-full flex gap-2"
          >
            {pending && <Loader />}
            Sign In
          </Button>
        </div>

        {data && !data.success && (
          <div className="text-red-500 text-center text-pretty text-sm">
            {data.message}
          </div>
        )}

        <div className="text-sm text-center text-muted-foreground">
          Dont&apos;t have an account?{" "}
          <Link href={"/signup"} target="_self" className="link">
            Sign Up
          </Link>
        </div>
      </div>
    </form>
  );
};

export default CredentialsSignInForm;
