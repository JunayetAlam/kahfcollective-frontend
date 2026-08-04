import CustomInput from '@/components/Forms/CustomInput';
import { CustomSearchSelect } from '@/components/Forms/CustomSearchSelect';

import CustomTextarea from '@/components/Forms/CustomTextarea';
import { useGetAllCoursesQuery } from '@/redux/api/courseApi';
import { useGetAllClassesQuery } from '@/redux/api/classApi';
import React from 'react';

type Option = {
    label: string
    value: string
}
export default function StudyCirclesGroupForm() {
    const { data: course, isLoading: courseLoading } = useGetAllCoursesQuery([{ name: 'limit', value: '1000' }]);
    const { data: classData, isLoading: classLoading } = useGetAllClassesQuery([{ name: 'limit', value: '1000' }]);



    if (courseLoading || classLoading) {
        return ''
    }

    const courseOption: Option[] = (course?.data || [])?.map((u) => ({ value: u.id, label: u.title })) || [];
    const classOption: Option[] = (classData?.data || [])?.map((u) => ({ value: u.id, label: u.name })) || [];


    return (
        <div className='space-y-6'>
            {/* Group Title */}
            <CustomInput
                required
                name="title"
                type="text"
                label="Group Title"
                placeholder="Enter group title..."
            />

            {/* Description */}
            <CustomTextarea
                required
                name="description"
                label="Description"
                placeholder="Describe the purpose of this group..."
                rows={4}
            />

            {/* Associated Course and Class in a row */}
            <div className="grid grid-cols-2 gap-4">
                {/* Associated Course */}
                <CustomSearchSelect
                    required
                    name="courseId"
                    label="Associated Course"
                    placeholder="Textbook Fundamentals"
                    options={courseOption}
                />

                {/* Class */}
                <CustomSearchSelect
                    required
                    name="groupId"
                    label="Class"
                    placeholder="Select Class"
                    options={classOption}
                />
            </div>
        </div>
    );
}
