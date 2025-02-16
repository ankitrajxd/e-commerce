"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Input } from "../ui/input";
import { useRouter } from "nextjs-toploader/app";
import { useDebouncedCallback } from "use-debounce";

const AdminSearch = () => {
  const pathName = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = useDebouncedCallback((query: string) => {
    console.log(query);
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set("query", query);
    } else {
      params.delete("query");
    }
    router.replace(`${pathName}?${params.toString()}`);
  }, 1000);

  // hide if in /admin/overview
  if (pathName === "/admin/overview") {
    return null;
  }

  return (
    <Input
      type="search"
      placeholder="Search"
      name="query"
      defaultValue={searchParams.get("query") || ""}
      onChange={(e) => handleSearch(e.target.value)}
      className="md:w-[100px] lg:w-[300px]"
    />
  );
};

export default AdminSearch;
