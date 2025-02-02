import { Button } from "@/components/ui/button";
import { EllipsisVertical, ShoppingCart, UserIcon } from "lucide-react";
import { ModeToggle } from "./themeToggle";
import Link from "next/link";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Menu = () => {
  return (
    <div className="flex justify-end gap-3">
      <nav className="hidden md:flex w-full max-w-xs gap-2">
        <ModeToggle />
        <Link href="/cart">
          <Button variant="outline" aria-label="Shopping Cart" className="p-2">
            <ShoppingCart size={24} /> Cart
          </Button>
        </Link>
        <Link href="/account">
          <Button variant="default" aria-label="Account" className="p-2">
            <UserIcon size={24} /> Sign In
          </Button>
        </Link>
      </nav>

      <nav className="md:hidden">
        <Sheet>
          <SheetTrigger className="align-middle">
            <EllipsisVertical />
          </SheetTrigger>

          <SheetContent className="flex flex-col items-start">
            <SheetTitle>Menu</SheetTitle>

            <ModeToggle />
            <Button asChild variant={"outline"}>
              <Link href="/cart">
                <ShoppingCart size={24} />
                Cart{" "}
              </Link>
            </Button>

            <Link href="/account">
              <Button variant="default" aria-label="Account" className="p-2">
                <UserIcon size={24} /> Sign In
              </Button>
            </Link>
            <SheetDescription></SheetDescription>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
};

export default Menu;
