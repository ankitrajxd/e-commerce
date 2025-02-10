import Menu from "@/components/shared/header/menu";
import Image from "next/image";
import Link from "next/link";
import MainNav from "./main-nav";

interface layoutProps {
  children: React.ReactNode;
}

function layout({ children }: layoutProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="border-b container mx-auto">
        <div className="flex item-center h-16 px-4">
          <Link href={"/"} className="flex items-center">
            <Image src={"/logo.svg"} height={35} width={35} alt="app_name" />
          </Link>

          {/* main nav */}
          <MainNav className="mx-6"/>
          <div className="ml-auto items-center flex space-x-4">
            <Menu />
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-4 p-8 pt-6 container mx-auto">
        {children}
      </div>
    </div>
  );
}

export default layout;
