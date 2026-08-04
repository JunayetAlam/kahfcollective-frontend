"use client"
import React, { useState } from "react";
import Link from "next/link";
import CreateStudyCirclesGroup from "./CreateStudyCirclesGroup";
import CreateLocationBasedGroup from "./CreateLocationBasedGroup";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGetAllGroupsQuery } from "@/redux/api/groupApi";
import { Group, GroupTypeEnum } from "@/types";
import TableSkeleton from "@/components/Global/TableSkeleton";
import EditStudyCirclesGroup from "./EditStudyCirclesGroup";
import EditLocationBasedGroup from "./EditLocationBasedGroup";
import DeleteGroup from "./DeleteGroup";
import { Button } from "@/components/ui/button";

export default function GroupTable() {
    const [activeTab, setActiveTab] = useState<GroupTypeEnum>("STUDY_CIRCLES");

    const { data, isLoading } = useGetAllGroupsQuery([{ name: "limit", value: '1000', }, { name: 'forumType', value: activeTab }]);
    if (isLoading) {
        return <TableSkeleton headers={['Group Name', 'Course', 'Posts', 'Action']} />
    };
    const groupData = data?.data || []

    return (
        <div className="py-6">
            <div className="mb-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-xl font-semibold mb-1">All Groups</h1>
                        <p className="text-sm text-muted-foreground">Manage class discussions, workshop themes, and open topics</p>
                    </div>
                    {
                        activeTab === 'LOCATION_BASED' ? <CreateLocationBasedGroup /> : <CreateStudyCirclesGroup />
                    }
                </div>
            </div>

            <div className="mb-6">
                <div className="border rounded-lg p-1 px-3 bg-background grid grid-cols-2 gap-3">
                    {(["STUDY_CIRCLES", "LOCATION_BASED"] as GroupTypeEnum[]).map((tab) => (
                        <Button
                            variant={tab === activeTab ? 'secondary' : 'outline'}
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className="w-full"
                        >
                            {tab === 'STUDY_CIRCLES' && 'Study Circles'}
                            {tab === 'LOCATION_BASED' && 'Location Based'}
                        </Button>
                    ))}
                </div>
            </div>

            <div className="mb-4">
                <h3 className="text-lg font-medium mb-4">
                    {activeTab === 'STUDY_CIRCLES' && 'Study Circles'}
                    {activeTab === 'LOCATION_BASED' && 'Location Based'} Groups
                </h3>
            </div>

            <div className="border rounded-lg overflow-hidden bg-background shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Group Name</TableHead>
                            {
                                activeTab === 'STUDY_CIRCLES' && <TableHead>Course</TableHead>
                            }
                            <TableHead>Posts</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody colSpan={4}>
                        {groupData.map((group) => (
                            <GroupTableRow key={group.id} group={group} />
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}


function GroupTableRow({ group }: { group: Group }) {
    return <TableRow key={group.id}>
        <TableCell className="font-medium">{group.title}</TableCell>
        {
            group.forumType === 'STUDY_CIRCLES' && <TableCell>{group.course?.title}</TableCell>
        }
        <TableCell>{group._count.posts}</TableCell>
        <TableCell>
            <div className="flex gap-3">
                {group.forumType === 'STUDY_CIRCLES' ? (
                    <Button asChild variant="outline" size="sm">
                        <Link href={`/dashboard/discussion/${group.id}`}>Manage</Link>
                    </Button>
                ) : null}
                {
                    group.forumType === 'LOCATION_BASED'
                        ? <EditLocationBasedGroup forumId={group.id} />
                        : <EditStudyCirclesGroup forumId={group.id} />
                }
                <DeleteGroup forumId={group.id} />
            </div>
        </TableCell>
    </TableRow>
}
