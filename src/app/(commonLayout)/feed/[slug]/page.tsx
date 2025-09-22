import Feed from '@/components/StudyCircles/Feed';
import React from 'react';

export default async function page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    return (
        <Feed slug={slug} />
    );
}