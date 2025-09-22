import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import Subtitle from '../Global/Subtitle';
import { useGetAllConnectedUserToForumQuery } from '@/redux/api/forumApi';
import { useParams, useSearchParams } from 'next/navigation';
import { TQueryParam } from '@/types';


export default function SCF_MembersList() {
    const { slug: forumId } = useParams(); // forumId comes from URL
    const searchparams = useSearchParams();
    const args: TQueryParam[] = [{ name: 'limit', value: '50' }]
    const page = searchparams.get('page');
    if (page) args.push({ name: 'page', value: page })

    const { data, isLoading } = useGetAllConnectedUserToForumQuery({ forumId: forumId as string, args });
    if (isLoading) {
        return ''
    }
    const users = data?.data || [];
    return (
        <Card className="bg-transparent shadow-none rounded-lg h-fit">
            <CardHeader className="p-6 pb-0">
                <CardTitle className="text-lg font-bold text-gray-800 border-b border-r-gray-200 pb-5">
                    All members ({users.length})
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-8">
                {users.map((member, i) => (
                    <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                                <AvatarImage src={member.user?.profile || ''} alt={member.user?.fullName} />
                                <AvatarFallback>
                                    {member.user?.fullName.slice(0, 2)}
                                </AvatarFallback>
                            </Avatar>
                            <Subtitle className="font-medium text-gray-800">{member.user?.fullName}</Subtitle>
                        </div>
                        <div className="text-sm text-gray-500 flex gap-1">{member.user?.userTiers.map(item=> <p key={item.id}>{item.tier?.name}</p>)}</div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
