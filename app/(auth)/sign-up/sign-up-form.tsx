"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpWithCredentials } from "@/lib/actions/user.actions";
import { signUpDefaultValues } from "@/lib/constants";
import { Loader } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";

const SignUpForm = () => {
  const [data, action, pending] = useActionState(signUpWithCredentials, {
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
          <Label htmlFor="name">Name</Label>
          <Input
            type="name"
            id="name"
            name="name"
            required
            className="input"
            defaultValue={signUpDefaultValues.name}
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            name="email"
            required
            className="input"
            defaultValue={signUpDefaultValues.email}
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            id="password"
            name="password"
            required
            className="input"
            defaultValue={signUpDefaultValues.password}
          />
        </div>

        <div>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            className="input"
            required
            defaultValue={signUpDefaultValues.confirmPassword}
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
            Sign Up
          </Button>
        </div>

        {data && !data.success && (
          <div className="text-red-500 text-center text-pretty text-sm">
            {data.message}
          </div>
        )}

        <div className="text-sm text-center text-muted-foreground">
          Already have an account?{" "}
          <Link href={"/sign-in"} target="_self" className="link">
            Sign In
          </Link>
        </div>
      </div>
    </form>
  );
};

export default SignUpForm;
