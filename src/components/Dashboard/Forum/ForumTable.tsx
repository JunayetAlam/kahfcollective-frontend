"use client"
import React, { useState } from "react";
import CreateForum from "./CreateForum";
import CreateFraternityGroup from "./CreateFruternityGroup";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGetAllForumsQuery } from "@/redux/api/forumApi";
import { Forum, ForumTypeEnum } from "@/types";
import TableSkeleton from "@/components/Global/TableSkeleton";
import EditForum from "./EditForum";
import EditFruternityGroup from "./EditFruternityGroup";

export default function ForumTable() {
    const [activeTab, setActiveTab] = useState<ForumTypeEnum>("STUDY_CIRCLES");

    const { data, isLoading } = useGetAllForumsQuery([{ name: "limit", value: '1000', }, { name: 'forumType', value: activeTab }]);
    if (isLoading) {
        return <TableSkeleton headers={['Forum Name', 'Course', 'Posts', 'Action']} />
    };
    const forumData = data?.data || []

    return (
        <div className="py-6">
            {/* Header */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-xl font-semibold mb-1">All Forums</h1>
                        <p className="text-sm text-muted-foreground">Manage class discussions, workshop themes, and open topics</p>
                    </div>
                    {
                        activeTab === 'LOCATION_BASED' ? <CreateFraternityGroup /> : <CreateForum />

                    }
                </div>
            </div>

            {/* Tabs */}
            <div className="mb-6">
                <div className="flex border rounded-lg p-1 bg-background">
                    {(["STUDY_CIRCLES", "LOCATION_BASED"] as ForumTypeEnum[]).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === tab
                                ? "bg-secondary shadow-sm"
                                : "text-muted-foreground"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table Section */}
            <div className="mb-4">
                <h3 className="text-lg font-medium mb-4">
                    {activeTab} Discussions
                </h3>
            </div>

            {/* Table */}
            <div className="border rounded-lg overflow-hidden bg-background shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Forum Name</TableHead>
                            <TableHead>Course</TableHead>
                            <TableHead>Posts</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {forumData.map((forum) => (
                            <ForumTableRow key={forum.id} forum={forum} />
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}


function ForumTableRow({ forum }: { forum: Forum }) {
    return <TableRow key={forum.id}>
        <TableCell className="font-medium">{forum.title}</TableCell>
        <TableCell>{forum.course?.title}</TableCell>
        <TableCell>{forum._count.posts}</TableCell>
        <TableCell>
            {
                forum.forumType === 'LOCATION_BASED' ? <EditFruternityGroup forumId={forum.id} /> : <EditForum forumId={forum.id} />
            }
        </TableCell>
    </TableRow>
}