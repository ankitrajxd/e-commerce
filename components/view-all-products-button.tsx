import Link from "next/link";
import { Button } from "./ui/button";

const ViewAllProductsButton = () => {
  return (
    <div className="flex justify-center mt-4">
      <Link href={"/search"}>
        <Button size={"sm"}>View all products</Button>
      </Link>
    </div>
  );
};

export default ViewAllProductsButton;
