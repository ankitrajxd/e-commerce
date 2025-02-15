import { getUserById } from "@/lib/actions/user.actions";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import UpdateUserForm from "./update-user-form";

interface Props {
  params: Promise<{ id: string }>;
}

const AdminUserUpdatePage = async ({ params }: Props) => {
  const { id: userId } = await params;
  const user = await getUserById(userId);

  if (!user) {
    return notFound();
  }

  return (
    <div className="space-y-8 max-w-lg mx-auto">
      <h1 className="h2-bold">Update User</h1>
      <UpdateUserForm user={user} />
    </div>
  );
};

export default AdminUserUpdatePage;

export const metadata: Metadata = {
  title: "Update User",
};
