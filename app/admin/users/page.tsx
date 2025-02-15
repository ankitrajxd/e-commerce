import DeleteDialog from "@/components/shared/delete-dialog";
import Pagination from "@/components/shared/pagination";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteUserById, getAllUsers } from "@/lib/actions/user.actions";
import { formatId } from "@/lib/utils";
import { Metadata } from "next";
import Link from "next/link";

interface Props {
  searchParams: Promise<{ page: string }>;
}

const AdminUserPage = async ({ searchParams }: Props) => {
  const { page = "1" } = await searchParams;

  const users = await getAllUsers({ page: Number(page) });

  //   console.log(users);

  return (
    <div className="space-y-2">
      <h2 className="h2-bold ">Users</h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {users.data.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{formatId(user.id)}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell> {user.role}</TableCell>

                <TableCell className="flex gap-2">
                  <Button size={"sm"} variant={"outline"}>
                    <Link href={`/admin/users/${user.id}`}>
                      <span className="px-2">Edit</span>
                    </Link>
                  </Button>

                  <DeleteDialog id={user.id} action={deleteUserById} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {users.totalPage > 1 && (
          <Pagination page={Number(page) || 1} totalPages={users.totalPage} />
        )}
      </div>
    </div>
  );
};

export default AdminUserPage;

export const metadata: Metadata = {
  title: "Users",
};
