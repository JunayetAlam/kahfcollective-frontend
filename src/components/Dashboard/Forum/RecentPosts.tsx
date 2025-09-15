import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { Edit, Eye, FileText, Search, Trash2 } from "lucide-react";
export default function RecentPosts() {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Recent Post
                </CardTitle>
                <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search users..." className="pl-8 w-48" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="space-y-1">
                            <h4 className="font-medium">Understanding the Concept of Qadar</h4>
                            <Badge variant="secondary" className="text-xs">
                                pending
                            </Badge>
                        </div>
                        <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="space-y-1">
                            <h4 className="font-medium">Understanding the Concept of Qadar</h4>
                            <Badge variant="secondary" className="text-xs">
                                pending
                            </Badge>
                        </div>
                        <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="space-y-1">
                            <h4 className="font-medium">Discussion on Modern Banking</h4>
                            <Badge variant="secondary" className="text-xs">
                                pending
                            </Badge>
                        </div>
                        <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="space-y-1">
                            <h4 className="font-medium">Discussion on Modern Banking</h4>
                            <Badge variant="secondary" className="text-xs">
                                pending
                            </Badge>
                        </div>
                        <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}