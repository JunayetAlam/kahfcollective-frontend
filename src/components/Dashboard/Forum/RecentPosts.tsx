'use client'

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FileText, Search } from "lucide-react";
import { TQueryParam } from '@/types';
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAllPostQuery } from '@/redux/api/postApi';
import PostItem from './SingleRecentPost';
import { useRouter, useSearchParams } from 'next/navigation';
import { handleSetSearchParams } from '@/lib/utils';

export default function RecentPosts() {
    const searchParams = useSearchParams();
    const router = useRouter()
    const [searchValue, setSearchValue] = useState('')
    const searchTerm = searchParams.get('searchTerm') || '';

    const args: TQueryParam[] = [
        { name: 'sort', value: '-createdAt' },
        { name: 'limit', value: '4' },
    ];



    if (searchTerm) args.push({ name: 'searchTerm', value: searchTerm })
    const handleSetUrl = React.useCallback(
        (data: Record<string, string>) => {
            handleSetSearchParams(data, searchParams, router);
        },
        [searchParams, router]
    );

    const { data, isLoading } = useGetAllPostQuery(args);
    useEffect(() => {
        setTimeout(() => {
            handleSetUrl({ searchTerm: searchValue });
        }, 500);

        return () => { };
    }, [searchValue, handleSetUrl]);
    const recentPosts = data?.data || [];

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Recent Posts
                </CardTitle>
                <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input value={searchValue} onChange={(e) => setSearchValue(e.target.value)} placeholder="Search posts..." className="pl-8 w-48" />
                </div>
            </CardHeader>

            <CardContent>
                <div className="space-y-4">
                    {isLoading
                        ? Array.from({ length: 4 }).map((_, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 border rounded-lg animate-pulse">
                                <div className="space-y-1 flex-1">
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-3 w-1/4" />
                                </div>
                                <div className="flex items-center gap-1">
                                    <Skeleton className="h-8 w-8 rounded-full" />
                                    <Skeleton className="h-8 w-8 rounded-full" />
                                    <Skeleton className="h-8 w-8 rounded-full" />
                                </div>
                            </div>
                        ))
                        : recentPosts.map((post) => (
                            <PostItem key={post.id} post={post} />
                        ))
                    }
                </div>
            </CardContent>
        </Card>
    );
}
