import ProductList from "@/components/shared/product/product-list";
import sampleData from "@/db/sample-data";
import { Metadata } from "next";
import React from "react";

const HomePage = () => {
  console.log(sampleData);

  return (
    <div>
      <ProductList data={sampleData.products} limit={4} title="Latest Products" />
    </div>
  );
};

export default HomePage;

export const metadata: Metadata = {
  title: "Home",
};
