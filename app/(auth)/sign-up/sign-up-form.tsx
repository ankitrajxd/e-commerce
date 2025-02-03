"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpWithCredentials } from "@/lib/actions/user.actions";
import { signUpDefaultValues } from "@/lib/constants";
import { Eye, EyeClosed, Loader } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState, useState } from "react";

const SignUpForm = () => {
  const [data, action, pending] = useActionState(signUpWithCredentials, {
    success: false,
    message: "",
  });

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [show, setShow] = useState(false);

  return (
    <form action={action} className="border p-4 rounded-lg w-[300px]">
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

        <div className="relative">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            type={show ? "text" : "password"}
            id="confirmPassword"
            name="confirmPassword"
            className="input"
            required
            defaultValue={signUpDefaultValues.confirmPassword}
          />
          {show && (
            <Eye
              size={20}
              onClick={() => setShow((prev) => !prev)}
              className="absolute right-2 top-8 cursor-pointer"
            />
          )}
          {!show && (
            <EyeClosed
              size={20}
              onClick={() => setShow((prev) => !prev)}
              className="absolute right-2 top-8 cursor-pointer"
            />
          )}
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
          <div className="text-red-500 text-center text-pretty text-xs">
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
