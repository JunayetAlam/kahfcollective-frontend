"use client";

import { Pagination } from "@/components/Global/Pagination";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SearchUser from "./SearchUser";
import { useGetAllUsersQuery } from "@/redux/api/userApi";
import { useSearchParams } from "next/navigation";
import TableSkeleton from "@/components/Global/TableSkeleton";
import { TQueryParam } from "@/types";
import UserRow from "./UserRow";
import GroupManagement from "../Group/Group";
import AddUser from "./AddUser";

export default function UserTable() {
  const searchParams = useSearchParams();

  const page = searchParams?.get("page") || "";
  const role = searchParams?.get("role") || "";
  const searchTerm = searchParams?.get("searchTerm") || "";
  const status = searchParams?.get("status") || "";

  const queryFilter: TQueryParam[] = [
    { name: "page", value: page },
    { name: "role", value: role },
    { name: "searchTerm", value: searchTerm },
    { name: "status", value: status },
  ].filter((item) => item.value);

  const { data, isLoading } = useGetAllUsersQuery(queryFilter);
  const users = data?.data || [];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="groups">Group Management</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <div className="bg-background border-border rounded-lg border p-6">
            {/* Header */}
            <div className="border-border flex items-center justify-between border-b pb-6">
              <h1 className="text-lg font-semibold">Users</h1>
              <div className="flex items-center gap-2">
                <SearchUser />
                <AddUser />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden">
              {isLoading ? (
                <TableSkeleton
                  headers={[
                    "Name",
                    "Email",
                    "Phone",
                    "Group",
                    "Role",
                    "Referrals",
                    "Action",
                  ]}
                />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Referrals</TableHead>
                      <TableHead>Group</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Verify Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody colSpan={8}>
                    {users.map((user) => (
                      <UserRow key={user.id} user={user} />
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>

            <Pagination totalPages={data?.meta?.totalPage || 0} />
          </div>
        </TabsContent>

        <TabsContent value="groups">
          <GroupManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}
