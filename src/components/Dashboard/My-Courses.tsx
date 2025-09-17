import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Star } from 'lucide-react';

export default function MyCourses() {
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
      title: "Foundations of Faith",
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

  return (
    <div className="py-6 space-y-6 lg:col-span-2">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Courses</h1>
        <Button variant="outline">View All</Button>
      </div>
      
      <div className="space-y-4">
        {courses.map((course) => (
          <Card key={course.id} className="w-full">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-semibold">
                  {course.title}
                </CardTitle>
                <Button variant="outline" size="sm">
                  Manage
                </Button>
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
    </div>
  );
}