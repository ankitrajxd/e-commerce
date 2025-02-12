interface Props {
  searchParams: Promise<{ page: string; query: string; catagory: string }>;
}

const AdminProductsPage = async ({ searchParams }: Props) => {
  const params = await searchParams;

  const page = Number(params.page) || 1;
  const searchText = params.query || "";
  const category = params.catagory || "";

  console.log(page, searchText, category);

  return (
    <div className="space-y-2">
      <div className="flex-between">
        <h1 className="h2-bold">Products</h1>
      </div>
    </div>
  );
};

export default AdminProductsPage;
