"use client";

import { useSearchParams, usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { useRouter } from "nextjs-toploader/app";

interface Props {
  page: number | string;
  totalPages: number;
  urlParamName?: string;
}

const Pagination = ({ page, totalPages, urlParamName = "page" }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathName = usePathname();

  const createNewUrl = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set(urlParamName, newPage.toString());
    router.replace(`${pathName}?${params.toString()}`);
  };

  return (
    <div className="flex gap-2 my-5">
      <Button
        size={"default"}
        variant={"outline"}

        disabled={Number(page) <= 1}
        onClick={() => createNewUrl(Number(page) - 1)}
      >
        Prev
      </Button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((item) => (
        <Button
          key={item}
          size={"default"}
          variant={Number(page) === item ? "default" : "outline"}
          onClick={() => createNewUrl(item)}
        >
          {item}
        </Button>
      ))}
      <Button
        size={"default"}
        variant={"outline"}
        disabled={Number(page) >= totalPages}
        onClick={() => createNewUrl(Number(page) + 1)}
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;
