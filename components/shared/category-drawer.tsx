import { getAllCategories } from "@/lib/actions/product.actions";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { Button } from "../ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";

const CategoryDrawer = async () => {
  const categores = await getAllCategories();
  return (
    <Drawer direction="left">
      <DrawerTrigger asChild>
        <Button variant={"outline"}>
          <Menu />
        </Button>
      </DrawerTrigger>

      <DrawerContent className="h-full max-w-sm">
        <DrawerHeader>
          <DrawerTitle>Select a category</DrawerTitle>
          <div className="space-y-1 mt-3 flex flex-col">
            {categores.map((category) => (
              <Link
                href={`/search?category=${category.category}`}
                key={category.category}
              >
                <Button variant="outline">{category.category}</Button>
              </Link>
            ))}
          </div>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
};

export default CategoryDrawer;
