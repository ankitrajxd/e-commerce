"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HTMLAttributes } from "react";

const links = [
  {
    title: "Profile",
    href: "/user/profile",
  },
  {
    title: "Orders",
    href: "/user/orders",
  },
];

const MainNav = ({ className, ...props }: HTMLAttributes<HTMLElement>) => {
  const pathName = usePathname();

  return (
    <nav
      {...props}
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
    >
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "text-sm font-medium transition-colors",
            "hover:text-primary",
            pathName.includes(link.href) ? "" : "text-muted-foreground"
          )}
        >
          {link.title}
        </Link>
      ))}
    </nav>
  );
};

export default MainNav;
