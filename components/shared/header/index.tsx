import { APP_NAME } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import Menu from "./menu";

const Header = () => {
  return (
    <header className="w-full sticky top-0 z-50 dark:bg-black dark:bg-opacity-80 bg-white bg-opacity-80 backdrop-blur-xl border-b dark:border-zinc-800 border-zinc-100 shadow-sm">
      <div className="max-w-7xl mx-auto p-4 md:px-10 py-3 flex-between">
        <div className="flex-start">
          <Link className="flex-start" href="/">
            <Image
              src="/logo.svg"
              alt={`${APP_NAME} logo`}
              className="cursor-pointer"
              width={35}
              height={35}
              priority
            />
            <span className="font-semibold ml-3">{APP_NAME}</span>
          </Link>
        </div>
        <div>
          <Menu />
        </div>
      </div>
    </header>
  );
};

export default Header;
