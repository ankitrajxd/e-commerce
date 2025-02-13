"use client";

import { useToast } from "@/hooks/use-toast";
import { productDefaultValues } from "@/lib/constants";
import { insertProductSchema, updateProductSchema } from "@/lib/validators";
import { Product } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface Props {
  type: "create" | "update";
  product?: Product;
  productId?: string;
}

const ProductForm = ({ type, product, productId }: Props) => {
  const router = useRouter();
  const toast = useToast();
  const form = useForm<z.infer<typeof insertProductSchema>>({
    resolver:
      type === "update"
        ? zodResolver(updateProductSchema)
        : zodResolver(insertProductSchema),
    defaultValues: type === "update" ? product : productDefaultValues,
  });

  return <>form</>;
};

export default ProductForm;
