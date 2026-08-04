import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useGetAllConnectedUserToGroupQuery } from '@/redux/api/groupApi';
import { useParams, useSearchParams } from 'next/navigation';
import { TQueryParam } from '@/types';
import { UserClass } from '@/types/class.type';

const MemberClasses = ({ classes }: { classes: UserClass[] }) => {
    const [showAll, setShowAll] = useState(false);
    const visibleClasses = showAll ? classes : classes.slice(0, 3);
    const remainingCount = classes.length - 3;

    return (
        <div className="flex flex-wrap items-center justify-end gap-1.5">
            {visibleClasses.map((item, index) => (
                <Badge key={index} variant="outline" className="border-[#d7ded0] text-[#5c6b55]">
                    {item.group?.name}
                </Badge>
            ))}
            {!showAll && remainingCount > 0 && (
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs text-[#5c6b55]"
                    onClick={() => setShowAll(true)}
                >
                    +{remainingCount} more
                </Button>
            )}
            {showAll && classes.length > 3 && (
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs text-[#5c6b55]"
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

    const { data, isLoading } = useGetAllConnectedUserToGroupQuery({
        forumId: forumId as string,
        args
    });

    const users = data?.data || [];

    if (isLoading) {
        return (
            <div className="border border-[#d7ded0] bg-white p-5">
                <Skeleton className="mb-4 h-5 w-32" />
                <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <Skeleton className="h-4 w-28" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="border border-[#d7ded0] bg-white p-5 md:p-6">
            <div className="mb-5 border-b border-[#e4e9dc] pb-4">
                <p className="mb-1 text-xs font-semibold tracking-[0.18em] text-[#6f7f63] uppercase">
                    Community
                </p>
                <h3 className="text-lg font-semibold text-[#304437]">
                    Members ({users.length})
                </h3>
            </div>

            {users.length === 0 ? (
                <p className="py-8 text-center text-sm text-[#5c6b55]">
                    No members found
                </p>
            ) : (
                <div className="space-y-4">
                    {users.map((member, i) => (
                        <div key={i} className="flex items-center justify-between gap-3">
                            <div className="flex min-w-0 items-center gap-3">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage
                                        src={member.user?.profile || ''}
                                        alt={member.user?.fullName}
                                    />
                                    <AvatarFallback>
                                        {member.user?.fullName?.slice(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="truncate text-sm font-medium text-[#304437]">
                                    {member.user?.fullName}
                                </div>
                            </div>
                            {member.user?.userGroups && member.user.userGroups.length > 0 ? (
                                <MemberClasses classes={member.user.userGroups} />
                            ) : null}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
