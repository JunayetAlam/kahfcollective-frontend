import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import Subtitle from '../Global/Subtitle';

const sampleMembers = [
    { name: 'Olivia Rhye', avatar: 'https://picsum.photos/seed/user1/64', slogan: 'Awaken' },
    { name: 'Phoenix Baker', avatar: 'https://picsum.photos/seed/user2/64', slogan: 'Ascend' },
    { name: 'Demi Wilkinson', avatar: 'https://picsum.photos/seed/user3/64', slogan: 'Actualize' },
    { name: 'Lana Steiner', avatar: 'https://picsum.photos/seed/user4/64', slogan: 'Awaken' },
    { name: 'Jessica Felicio', avatar: 'https://picsum.photos/seed/user5/64', slogan: 'Ascend' },
    { name: 'Anna Nekrashevich', avatar: 'https://picsum.photos/seed/user6/64', slogan: 'Actualize' },
    { name: 'Aiony Haust', avatar: 'https://picsum.photos/seed/user7/64', slogan: 'Awaken' },
    { name: 'National Placeholder', avatar: 'https://picsum.photos/seed/user8/64', slogan: 'Ascend' },
    { name: 'Kate Morrison', avatar: 'https://picsum.photos/seed/user9/64', slogan: 'Actualize' },
    { name: 'Natali Craig', avatar: 'https://picsum.photos/seed/user10/64', slogan: 'Awaken' },
];

export default function SCF_MembersList() {
    const memberCount = sampleMembers.length;

    return (
        <Card className="bg-transparent shadow-none rounded-lg h-fit">
            <CardHeader className="p-6 pb-0">
                <CardTitle className="text-lg font-bold text-gray-800 border-b border-r-gray-200 pb-5">
                    All members ({memberCount})
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-8">
                {sampleMembers.map((member, i) => (
                    <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                                <AvatarImage src={member.avatar} alt={member.name} />
                                <AvatarFallback>
                                    {member.name.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <Subtitle className="font-medium text-gray-800">{member.name}</Subtitle>
                        </div>
                        <div className="text-sm text-gray-500">{member.slogan}</div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
