import React from 'react';
import { Search, Book, Award, Mail, MoreHorizontal } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

// Define types for the student data
interface Student {
    name: string;
    email: string;
    course: string;
    tier?: string;
    progress: number;
    status: 'completed' | 'in-progress' | 'not-started';
}

// Define props for the StudentCard component
interface StudentCardProps {
    student: Student;
}

const StudentCard: React.FC<StudentCardProps> = ({ student }) => {
    const { name, email, course, tier, progress, status } = student;

    // const getStatusColor = (status: Student['status']) => {
    //     switch (status) {
    //         case 'completed':
    //             return 'bg-green-500';
    //         case 'in-progress':
    //             return 'bg-blue-500';
    //         default:
    //             return 'bg-gray-500';
    //     }
    // };

    return (
        <Card className="mb-4">
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Avatar>
                            <AvatarFallback>{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                            <h3 className="font-semibold text-lg">{name}</h3>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <Book className="w-4 h-4" />
                                <span>{course}</span>
                                {tier && (
                                    <>
                                        <Award className="w-4 h-4" />
                                        <span>{tier}</span>
                                    </>
                                )}
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                                <Mail className="w-4 h-4" />
                                <span>{email}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="text-right min-w-[120px]">
                            {status === 'completed' ? (
                                <Badge className="bg-green-500 hover:bg-green-600">
                                    Completed
                                </Badge>
                            ) : (
                                <div className="space-y-2">
                                    <div className="text-sm font-medium">{progress}%</div>
                                    <div className="w-full">
                                        <Progress value={progress} className="h-2" />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex space-x-2">
                            <Button variant="outline" size="icon">
                                <Mail className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="icon">
                                <MoreHorizontal className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default function MyStudentList() {
    const students: Student[] = [
        {
            name: "Ahmed Hassan",
            email: "ahmed@example.com",
            course: "Foundations of Faith",
            tier: "Ascend tier",
            progress: 75,
            status: "in-progress"
        },
        {
            name: "Ahmed Hassan",
            email: "ahmed@example.com",
            course: "Foundations of Faith",
            tier: "Ascend tier",
            progress: 100,
            status: "completed"
        },
        {
            name: "Ahmed Hassan",
            email: "ahmed@example.com",
            course: "Foundations of Faith",
            tier: "Ascend tier",
            progress: 75,
            status: "in-progress"
        },
        {
            name: "Sarah Johnson",
            email: "sarah@example.com",
            course: "Advanced Studies",
            tier: "Premium tier",
            progress: 45,
            status: "in-progress"
        },
        {
            name: "Michael Chen",
            email: "michael@example.com",
            course: "Introduction to Philosophy",
            tier: "Basic tier",
            progress: 100,
            status: "completed"
        },
        {
            name: "Emma Williams",
            email: "emma@example.com",
            course: "Islamic History",
            tier: "Ascend tier",
            progress: 60,
            status: "in-progress"
        }
    ];

    return (
        <div className="min-h-screen py-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-6">Students</h1>

                {/* Search and Filter Bar */}
                <div className="flex items-center space-x-4 mb-6">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search Student..."
                            className="pl-10"
                        />
                    </div>

                    <Select defaultValue="all-courses">
                        <SelectTrigger className="w-48">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all-courses">All Courses</SelectItem>
                            <SelectItem value="foundations">Foundations of Faith</SelectItem>
                            <SelectItem value="advanced">Advanced Studies</SelectItem>
                            <SelectItem value="philosophy">Introduction to Philosophy</SelectItem>
                            <SelectItem value="history">Islamic History</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select defaultValue="all-status">
                        <SelectTrigger className="w-48">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all-status">All Status</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="not-started">Not Started</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button>Add Student</Button>
                </div>
            </div>

            {/* Student Cards */}
            <div className="space-y-4">
                {students.map((student, index) => (
                    <StudentCard
                        key={index}
                        student={student}
                    />
                ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-8">
                <div className="text-sm text-muted-foreground">
                    Showing 1-6 of 24 students
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" disabled>
                        Previous
                    </Button>
                    <Button variant="outline">1</Button>
                    <Button variant="outline">2</Button>
                    <Button variant="outline">3</Button>
                    <Button variant="outline">
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}