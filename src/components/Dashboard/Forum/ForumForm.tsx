import CustomInput from '@/components/Forms/CustomInput';
import CustomSelect from '@/components/Forms/CustomSelect';
import CustomTextarea from '@/components/Forms/CustomTextarea';
import React from 'react';

export default function ForumForm() {
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
                <CustomSelect
                    required
                    name="associatedCourse"
                    label="Associated Course"
                    placeholder="Textbook Fundamentals"
                    options={[
                        { value: "textbook-fundamentals", label: "Textbook Fundamentals" },
                        { value: "advanced-studies", label: "Advanced Studies" },
                        { value: "research-methods", label: "Research Methods" },
                        { value: "practical-applications", label: "Practical Applications" },
                    ]}
                />

                {/* Membership */}
                <CustomSelect
                    name="membership"
                    label="Membership"
                    placeholder="Medium"
                    options={[
                        { value: "open", label: "Open" },
                        { value: "medium", label: "Medium" },
                        { value: "restricted", label: "Restricted" },
                        { value: "private", label: "Private" },
                    ]}
                />
            </div>
        </div>
    );
}