'use client'

import { useState } from "react";
import Container from "../Global/Container";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "../ui/drawer";
import { Button } from "../ui/button";
import { Filter } from "lucide-react";
import C_Search from "./C_Search";
import { courses } from "@/data";
import CourseCard from "../Global/CourseCard";
import { PaginationWithParams } from "../Global/PaginationWithParams";

export default function Courses() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    return (
        <Container className="py-20 relative">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Desktop Sidebar */}
                <div className="hidden lg:block w-64 flex-shrink-0">
                    <div className="sticky top-24 border-r border-gray-200 border-2 rounded-xl overflow-hidden">
                        <C_Search />
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1">
                    {/* Mobile Filter Button */}
                    <div className="lg:hidden mb-6">
                        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                            <DrawerTrigger asChild>
                                <Button variant="outline" className="w-full">
                                    <Filter className="h-4 w-4 mr-2" />
                                    Filter Courses
                                </Button>
                            </DrawerTrigger>
                            <DrawerContent className="h-[65vh]">
                                <DrawerHeader>
                                    <DrawerTitle>Filter Courses</DrawerTitle>
                                </DrawerHeader>
                                <div className="px-4 pb-6 overflow-y-auto flex-1">
                                    <C_Search />
                                </div>
                            </DrawerContent>
                        </Drawer>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                        {
                            courses.slice(0,3).map((item, idx) => <CourseCard key={idx} course={item} />)
                        }
                    </div>
                </div>
                
            </div>
            <PaginationWithParams totalPages={5} />
        </Container>
    );
}