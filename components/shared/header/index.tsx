import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";
import { ShoppingCart, UserIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ModeToggle } from "./themeToggle";

const Header = () => {
  return (
    <header className="w-full border-b">
      <div className="wrapper flex-between">
        <div className="flex-start">
          <Link className="flex-start" href="/">
            <Image
              src="/images/logo.svg"
              alt={`${APP_NAME} logo`}
              width={48}
              height={48}
              priority
            />
            <span className="hidden lg:block font-bold text-2xl ml-3">
              {APP_NAME}
            </span>
          </Link>
        </div>
        <div className="space-x-2 text-sm">
          <ModeToggle />
          <Link href="/cart">
            <Button
              variant="outline"
              aria-label="Shopping Cart"
              className="p-2"
            >
              <ShoppingCart size={24} /> Cart
            </Button>
          </Link>
          <Link href="/account">
            <Button variant="default" aria-label="Account" className="p-2">
              <UserIcon size={24} /> Sign In
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
