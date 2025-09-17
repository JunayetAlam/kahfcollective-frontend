"use client";

import React, {  } from "react";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/Global/Pagination";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import SearchUser from "./SearchUser";
import { useGetAllUsersQuery } from "@/redux/api/userApi";
import { useSearchParams } from "next/navigation";
import TableSkeleton from "@/components/Global/TableSkeleton";
import { AppConfig } from "@/config";
import Image from "next/image";
import avatarImg from "@/assets/user.png";
import { Button } from "@/components/ui/button";
import {  TQueryParam } from "@/types";

import { UserDetailsModal } from "./UserDetailsModal";

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
        <div className="rounded-lg p-6 bg-white border border-gray-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-6 border-b border-gray-200">
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
                                <TableRow key={user.id}>
                                    {/* Name + Avatar */}
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full overflow-hidden">
                                                <Image
                                                    src={user.profile ? `${AppConfig.backendUrl}${user.profile}` : avatarImg}
                                                    alt={user.fullName}
                                                    width={32}
                                                    height={32}
                                                />
                                            </div>
                                            <span className="font-medium">{user.fullName}</span>
                                        </div>
                                    </TableCell>

                                    {/* Email */}
                                    <TableCell>{user.email}</TableCell>

                                    {/* Phone */}
                                    <TableCell>{user.phoneNumber}</TableCell>

                                    {/* Tier */}
                                    <TableCell>
                                        <Button variant="outline" size="sm">
                                            Ascend
                                        </Button>
                                    </TableCell>

                                    {/* Role */}
                                    <TableCell>
                                        <Badge>{user.role}</Badge>
                                    </TableCell>

                                    {/* Referrals */}
                                    <TableCell>
                                        {user.isReferredBySheikhSalmam
                                            ? "Referred by Sheikh Salman"
                                            : user.referredBy || "—"}
                                    </TableCell>

                                    {/* Action */}
                                    <TableCell className="flex gap-2">
                                       
                                        <UserDetailsModal user={user} />
                                        <Button variant="outline" size="sm">
                                            Edit
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>

            <Pagination totalPages={data?.meta?.totalPage || 1} />


        </div>
    );
}
