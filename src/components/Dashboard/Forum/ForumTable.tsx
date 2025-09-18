"use client"
import React, { useState } from "react";
import CreateForum from "./CreateForum";
import CreateFraternityGroup from "./CreateFruternityGroup";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Forum Data matching the screenshots
const forumData = [
    {
        id: 1,
        forumName: "Adab Discussion Group",
        course: "Principles of Adab",
        posts: 23,
        type: "Study Circles",
        state: "Active",
    },
    {
        id: 2,
        forumName: "Adab Discussion Group",
        course: "Principles of Adab",
        posts: 23,
        type: "Study Circles",
        state: "Active",
    },
    {
        id: 3,
        forumName: "Adab Discussion Group",
        course: "Principles of Adab",
        posts: 23,
        type: "Study Circles",
        state: "Inactive",
    },
    {
        id: 4,
        forumName: "Advanced Islamic Studies",
        course: "Principles of Fiqh",
        posts: 45,
        type: "Location Based",
        state: "Active",
    },
    {
        id: 5,
        forumName: "Quranic Studies Group",
        course: "Tafsir Fundamentals",
        posts: 67,
        type: "Location Based",
        state: "Active",
    },
];
type TTab = "Study Circles" | "Location Based"
export default function ForumTable() {
    const [activeTab, setActiveTab] = useState<TTab>("Study Circles");

    const filteredData = forumData.filter(item => item.type === activeTab);

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
                        activeTab === 'Location Based' ? <CreateFraternityGroup /> : <CreateForum />

                    }
                </div>
            </div>

            {/* Tabs */}
            <div className="mb-6">
                <div className="flex border rounded-lg p-1 bg-background">
                    {(["Study Circles", "Location Based"] as TTab[]).map((tab) => (
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
                        {filteredData.map((forum) => (
                            <TableRow key={forum.id}>
                                <TableCell className="font-medium">{forum.forumName}</TableCell>
                                <TableCell>{forum.course}</TableCell>
                                <TableCell>{forum.posts}</TableCell>
                                <TableCell>
                                    <button className="px-3 py-1 border rounded-md text-sm">
                                        Moderate
                                    </button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}