"use client";
import React from "react";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import user1 from "@/assets/user1.jpg";
import user2 from "@/assets/user2.png";
import user3 from "@/assets/user3.jpg";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Pagination } from "@/components/Global/Pagination";
import SearchUser from "./SearchUser";

// Dummy Users
const users = [
    {
        id: 1,
        name: "Ahmad Hassan",
        email: "ahmad@example.com",
        role: "Student",
        status: "Active",
        image: user2,
    },
    {
        id: 2,
        name: "Sara Ali",
        email: "sara.ali@example.com",
        role: "Teacher",
        status: "Active",
        image: user3,
    },
    {
        id: 3,
        name: "Bilal Khan",
        email: "bilal.khan@example.com",
        role: "Admin",
        status: "Inactive",
        image: user1,
    },
    {
        id: 4,
        name: "Fatima Noor",
        email: "fatima.noor@example.com",
        role: "Student",
        status: "Active",
        image: user3,
    },
    {
        id: 5,
        name: "Omar Farooq",
        email: "omar.farooq@example.com",
        role: "Moderator",
        status: "Inactive",
        image: user2,
    },
];

export default function UserTable() {
    return (
        <div className=" rounded-lg p-6">
            {/* Header */}
            <div className="flex items-center justify-between pb-6">
                <h1 className="text-lg font-semibold">Users</h1>
            </div>

            {/* Table */}
            <SearchUser />
            <div className="overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Tier</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                {/* User (Avatar + Name + Email) */}
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Image
                                            src={user.image}
                                            alt={user.name}
                                            width={32}
                                            height={32}
                                            className="rounded-full"
                                        />
                                        <div>
                                            <div className="font-medium">{user.name}</div>
                                            <div className="text-sm text-muted-foreground">{user.email}</div>
                                        </div>
                                    </div>
                                </TableCell>

                                {/* Role */}
                                <TableCell>
                                    <Badge>{user.role}</Badge>
                                </TableCell>

                                {/* Ascend Button */}
                                <TableCell>
                                    <Button variant="outline" size="sm">
                                        Ascend
                                    </Button>
                                </TableCell>

                                {/* Status Toggle */}
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Switch checked={user.status === "Active"} />
                                        <span className="text-sm">{user.status}</span>

                                    </div>
                                </TableCell>

                                {/* Edit Button */}
                                <TableCell>
                                    <Button variant="outline" size="sm">
                                        Edit
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

            </div>
            <Pagination totalPages={5} />
        </div>
    );
}
