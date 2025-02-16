import ProductCarousel from "@/components/shared/product/product-carousel";
import ProductList from "@/components/shared/product/product-list";
import {
  getFeaturedProducts,
  getLatestProducts,
} from "@/lib/actions/product.actions";
import { Metadata } from "next";

const HomePage = async () => {
  const latestProduct = await getLatestProducts();
  const featuredProducts = await getFeaturedProducts();

  return (
    <div>
      {featuredProducts.length > 0 && (
        <ProductCarousel products={featuredProducts} />
      )}
      <ProductList data={latestProduct} title="Latest Products" />
    </div>
  );
};

export default HomePage;

export const metadata: Metadata = {
  title: "Home",
};
