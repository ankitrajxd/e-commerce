import ProductCard from "@/components/shared/product/product-card";
import { getAllProducts } from "@/lib/actions/product.actions";

interface Props {
  searchParams: Promise<{
    q?: string;
    category?: string;
    price?: string;
    sort?: string;
    rating?: string;
    page?: string;
  }>;
}

const SearchPage = async ({ searchParams }: Props) => {
  const {
    q = "all",
    category = "all",
    price = "all",
    sort = "newest",
    rating = "all",
    page = "1",
  } = await searchParams;

  const products = await getAllProducts({
    query: q,
    page: parseInt(page),
    category: category,
    price,
    sort,
    rating,
  });

  return (
    <div className="grid md:grid-cols-5 md:gap-5">
      <div className="filter-links">{/* filter */}</div>

      <div className="space-y-4 md:col-span-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {products.data.length === 0 && <div>No Products found</div>}
          {products.data.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
