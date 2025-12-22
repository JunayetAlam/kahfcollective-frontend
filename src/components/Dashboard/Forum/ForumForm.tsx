import CustomInput from '@/components/Forms/CustomInput';
import { CustomSearchSelect } from '@/components/Forms/CustomSearchSelect';

import CustomTextarea from '@/components/Forms/CustomTextarea';
import { useGetAllCoursesQuery } from '@/redux/api/courseApi';
import { useGetAllGroupsQuery } from '@/redux/api/groupApi';
import React from 'react';

type Option = {
    label: string
    value: string
}
export default function ForumForm() {
    const { data: course, isLoading: courseLoading } = useGetAllCoursesQuery([{ name: 'limit', value: '1000' }]);
    const { data: group, isLoading: groupLoading } = useGetAllGroupsQuery([{ name: 'limit', value: '1000' }]);



    if (courseLoading || groupLoading) {
        return ''
    }

    const courseOption: Option[] = (course?.data || [])?.map((u) => ({ value: u.id, label: u.title })) || [];
    const groupOption: Option[] = (group?.data || [])?.map((u) => ({ value: u.id, label: u.name })) || [];


    return (
        <div className='space-y-6'>
            {/* Forum Title */}
            <CustomInput
                required
                name="title"
                type="text"
                label="Forum Title"
                placeholder="Enter forum title..."
            />

            {/* Description */}
            <CustomTextarea
                required
                name="description"
                label="Description"
                placeholder="Describe the purpose of this forum..."
                rows={4}
            />

            {/* Associated Course and Membership in a row */}
            <div className="grid grid-cols-2 gap-4">
                {/* Associated Course */}
                <CustomSearchSelect
                    required
                    name="courseId"
                    label="Associated Course"
                    placeholder="Textbook Fundamentals"
                    options={courseOption}
                />

                {/* Membership */}
                <CustomSearchSelect
                    required
                    name="groupId"
                    label="Membership"
                    placeholder="Medium"
                    options={groupOption}
                />
            </div>
        </div>
    );
}