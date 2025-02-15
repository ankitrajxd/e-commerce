import ProductList from "@/components/shared/product/product-list";
import { getLatestProducts } from "@/lib/actions/product.actions";
import { Metadata } from "next";

const HomePage = async () => {
  const latestProduct = await getLatestProducts();
  return (
    <div>
      <ProductList data={latestProduct} title="Latest Products" />
    </div>
  );
};

export default HomePage;

export const metadata: Metadata = {
  title: "Home",
};
