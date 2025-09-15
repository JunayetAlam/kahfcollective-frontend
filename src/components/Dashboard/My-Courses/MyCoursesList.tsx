'use client'
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Users, Star, Search } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CreateCourse from './CreateCourse';
import ManageCourse from './ManageCourse';

export default function CourseManagementDashboard() {
  const courses = [
    {
      id: 1,
      title: "Foundations of Faith",
      participants: 89,
      rating: 4.9,
      status: "12 to grade",
      nextSession: "Tomorrow 8:00 PM"
    },
    {
      id: 2,
      title: "Advanced Tafsir Studies",
      participants: 89,
      rating: 4.9,
      status: "12 to grade",
      nextSession: "Tomorrow 8:00 PM"
    },
    {
      id: 3,
      title: "Foundations of Faith",
      participants: 89,
      rating: 4.9,
      status: "12 to grade",
      nextSession: "Tomorrow 8:00 PM"
    }
  ];

  const filterButtons = ["Awaken", "Ascend", "Actualize"];
  const [activeFilter, setActiveFilter] = useState("Awaken");

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search users..."
          className="pl-10"
        />
      </div>

      {/* Header with Add Course Button */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Courses</h1>
        <CreateCourse />
      </div>

      {/* Tabs for filtering */}
      <Tabs defaultValue="awaken" className="w-full">
        <TabsList className="grid w-fit grid-cols-3">
          <TabsTrigger value="awaken">Awaken</TabsTrigger>
          <TabsTrigger value="ascend">Ascend</TabsTrigger>
          <TabsTrigger value="actualize">Actualize</TabsTrigger>
        </TabsList>

        <TabsContent value="awaken" className="mt-6">
          {/* Course Cards */}
          <div className="space-y-4">
            {courses.map((course) => (
              <Card key={course.id} className="w-full">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-semibold">
                      {course.title}
                    </CardTitle>
                    <ManageCourse />
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex items-center gap-6 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{course.participants}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-current" />
                      <span>{course.rating}</span>
                    </div>

                    <Badge variant="secondary" className="text-xs">
                      {course.status}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <span>Next:</span>
                    <span>{course.nextSession}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ascend" className="mt-6">
          <div className="space-y-4">
            <p className="text-muted-foreground">Ascend courses will be displayed here.</p>
          </div>
        </TabsContent>

        <TabsContent value="actualize" className="mt-6">
          <div className="space-y-4">
            <p className="text-muted-foreground">Actualize courses will be displayed here.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}