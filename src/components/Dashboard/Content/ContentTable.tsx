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
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Pagination } from "@/components/Global/Pagination";
import SearchContent from "./SearchContent";
import CreateContent from "./CreateContent";
import EditContent from "./EditContent";

// Dummy Content Data
const contentItems = [
  {
    id: 1,
    title: "Annual Hassan",
    type: "Student",
    tier: "Awaken",
    state: "Active",
    students: 234,
  },
  {
    id: 2,
    title: "Mathematics Curriculum",
    type: "Course",
    tier: "Ascend",
    state: "Inactive",
    students: 12,
  },
  {
    id: 3,
    title: "Science Worksheets",
    type: "Resource",
    tier: "Actualize",
    state: "Active",
    students: 45,
  },
  {
    id: 4,
    title: "History Lesson Plans",
    type: "Collection",
    tier: "Awaken",
    state: "Inactive",
    students: 78,
  },
  {
    id: 5,
    title: "Language Arts Materials",
    type: "Resource",
    tier: "Awaken",
    state: "Active",
    students: 156,
  },
];

export default function ContentTable() {



  return (
    <div className="rounded-lg">

      <SearchContent />
      <div className="my-4 flex justify-end">

         <CreateContent />
      </div>
     
      <div className="overflow-hidden mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Tier</TableHead>
              <TableHead>State</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contentItems.map((content) => (
              <TableRow key={content.id}>
                {/* Title */}
                <TableCell className="font-medium">{content.title}</TableCell>

                {/* Type */}
                <TableCell>
                  <Badge variant="outline">{content.type}</Badge>
                </TableCell>

                {/* tier */}
                <TableCell>
                  <Badge
                    variant={
                      content.tier === "Published" ? "default" :
                        content.tier === "Draft" ? "secondary" : "outline"
                    }
                  >
                    {content.tier}
                  </Badge>
                </TableCell>

                {/* State Toggle */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={content.state === "Active"}
                    //   onCheckedChange={() => handletierChange(content.id)}
                    />
                    <span className="text-sm">{content.state}</span>
                  </div>
                </TableCell>

                {/* Items Count */}
                <TableCell>
                  <span className="text-sm">{content.students} students</span>
                </TableCell>

                {/* Edit Button */}
                <TableCell>
                  <EditContent/>
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