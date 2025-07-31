import CourseLesson from '@/components/CourseLesson/CourseLesson';
import React from 'react';

export default async function page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    return (
        <div>
            <CourseLesson slug={slug} />
        </div>
    );
}