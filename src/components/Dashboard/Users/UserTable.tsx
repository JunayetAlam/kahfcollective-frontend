"use client";

import React, { } from "react";
import { Pagination } from "@/components/Global/Pagination";
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import SearchUser from "./SearchUser";
import { useGetAllUsersQuery } from "@/redux/api/userApi";
import { useSearchParams } from "next/navigation";
import TableSkeleton from "@/components/Global/TableSkeleton";
import { TQueryParam } from "@/types";

import UserRow from "./UserRow";

export default function UserTable() {
    const searchParams = useSearchParams();

    const page = searchParams?.get("page") || '';
    const role = searchParams?.get("role") || '';
    const searchTerm = searchParams?.get("searchTerm") || '';
    const status = searchParams?.get("status") || '';

    const queryFilter: TQueryParam[] = [
        { name: "page", value: page },
        { name: "role", value: role },
        { name: "searchTerm", value: searchTerm },
        { name: "status", value: status },
    ].filter((item) => item.value);

    const { data, isLoading } = useGetAllUsersQuery(queryFilter);
    const users = data?.data || [];


    return (
        <div className="rounded-lg p-6 bg-background border border-border">
            {/* Header */}
            <div className="flex items-center justify-between pb-6 border-b border-border">
                <h1 className="text-lg font-semibold">Users</h1>
                <SearchUser />
            </div>

            {/* Table */}
            <div className="overflow-hidden">
                {isLoading ? (
                    <TableSkeleton
                        headers={["Name", "Email", "Phone", "Tier", "Role", "Referrals", "Action"]}
                    />
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Tier</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Referrals</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <UserRow key={user.id} user={user} />
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>

            <Pagination totalPages={data?.meta?.totalPage || 1} />


        </div>
    );
}
