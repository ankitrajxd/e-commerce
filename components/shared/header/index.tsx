import { APP_NAME } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import Menu from "./menu";

const Header = () => {
  return (
    <header className="w-full border-b">
      <div className="wrapper flex-between">
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
            <span className="font-semibold text-2xl ml-3">{APP_NAME}</span>
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
