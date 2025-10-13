import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useGetAllConnectedUserToForumQuery } from '@/redux/api/forumApi';
import { useParams, useSearchParams } from 'next/navigation';
import { TQueryParam } from '@/types';
import {  UserTier } from '@/types/tiers.type';

const MemberTiers = ({ tiers }: {tiers: UserTier[]}) => {
    const [showAll, setShowAll] = useState(false);
    const visibleTiers = showAll ? tiers : tiers.slice(0, 3);
    const remainingCount = tiers.length - 3;

    return (
        <div className="flex gap-1.5 flex-wrap justify-end items-center">
            {visibleTiers.map((item, index) => (
                <Badge key={index} variant="outline">
                    {item.tier?.name}
                </Badge>
            ))}
            {!showAll && remainingCount > 0 && (
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={() => setShowAll(true)}
                >
                    +{remainingCount} more
                </Button>
            )}
            {showAll && tiers.length > 3 && (
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={() => setShowAll(false)}
                >
                    Show less
                </Button>
            )}
        </div>
    );
};

export default function SCF_MembersList() {
    const { slug: forumId } = useParams();
    const searchparams = useSearchParams();
    const args: TQueryParam[] = [{ name: 'limit', value: '50' }];
    const page = searchparams.get('page');
    if (page) args.push({ name: 'page', value: page });

    const { data, isLoading } = useGetAllConnectedUserToForumQuery({ 
        forumId: forumId as string, 
        args 
    });

    const users = data?.data || [];

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-40" />
                </CardHeader>
                <CardContent className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Skeleton className="w-10 h-10 rounded-full" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                            <Skeleton className="h-5 w-20" />
                        </div>
                    ))}
                </CardContent>
            </Card>
        );
    }

    if (users.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>All members (0)</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground text-center py-8">
                        No members found
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>All members ({users.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {users.map((member, i) => (
                    <div key={i} className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                            <Avatar>
                                <AvatarImage 
                                    src={member.user?.profile || ''} 
                                    alt={member.user?.fullName} 
                                />
                                <AvatarFallback>
                                    {member.user?.fullName?.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="font-medium min-w-max">
                                {member.user?.fullName}
                            </div>
                        </div>
                        {member.user?.userTiers && member.user.userTiers.length > 0 && (
                            <MemberTiers tiers={member.user.userTiers} />
                        )}
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}