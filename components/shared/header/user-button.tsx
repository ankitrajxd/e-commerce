import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { signOutUser } from "@/lib/actions/user.actions";
import { UserIcon } from "lucide-react";
import Link from "next/link";

const UserButton = async () => {
  const session = await auth();
  if (!session) {
    return (
      <Link href="/sign-in">
        <Button variant="default" aria-label="Account" className="p-2">
          <UserIcon size={24} /> Sign In
        </Button>
      </Link>
    );
  }

  const firstInitial = session.user?.name?.charAt(0).toUpperCase() ?? "U";

  return (
    <div className="flex gap-2 items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex item-center">
            <button className="p-2 relative size-8 rounded-full flex items-center justify-center bg-gray-200 hover:bg-gray-800 hover:text-white">
              {firstInitial}
            </button>
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <div className="text-sm font-medium leading-none">
                {session.user?.name}
              </div>
              <div className="text-xs font-medium leading-none">
                {session.user?.email}
              </div>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuItem>
            <Link href={"/profile"} className="w-full">
              User Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href={"/user/orders"} className="w-full">
              Order History
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <form action={signOutUser} className="w-full">
              <Button
                variant={"ghost"}
                className="w-full py-4 px-2 h-4 justify-start"
              >
                Sign Out
              </Button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserButton;
