"use client"
import React, { useState } from "react";
import CreateForum from "./CreateForum";
import CreateFraternityGroup from "./CreateFruternityGroup";

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
                        <p className="text-sm text-gray-600">Manage class discussions, workshop themes, and open topics</p>
                    </div>
                    {
                        activeTab === 'Location Based' ? <CreateFraternityGroup /> : <CreateForum />

                    }
                </div>
            </div>

            {/* Tabs */}
            <div className="mb-6">
                <div className="flex border rounded-lg p-1 bg-gray-50">
                    {(["Study Circles", "Location Based"] as TTab[]).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === tab
                                ? "bg-white shadow-sm"
                                : "text-gray-600 hover:text-gray-900"
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
            <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr className="border-b">
                            <th className="text-left py-3 px-4 font-medium text-gray-900">Forum Name</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-900">Course</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-900">Posts</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((forum, index) => (
                            <tr key={forum.id} className={`border-b hover:bg-gray-50 transition-colors ${index === filteredData.length - 1 ? 'border-b-0' : ''}`}>
                                {/* Forum Name */}
                                <td className="py-3 px-4 font-medium text-gray-900">
                                    {forum.forumName}
                                </td>

                                {/* Course */}
                                <td className="py-3 px-4 text-gray-600">
                                    {forum.course}
                                </td>

                                {/* Posts */}
                                <td className="py-3 px-4 text-gray-600">
                                    {forum.posts}
                                </td>

                                {/* Actions */}
                                <td className="py-3 px-4">
                                    <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors">
                                        Moderate
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}