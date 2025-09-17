import React from "react";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {  setData, useCurrentSignUpData } from "@/redux/signUpSlice";
import CustomForm from "../Forms/CustomForm";
import CustomInput from "../Forms/CustomInput";
import { FieldValues } from "react-hook-form";
import { Button } from "../ui/button";
import CustomRadioCheckpoint from "../Forms/CustomRadioCheckpoints";
import PageStep from "./PageStep";

export default function SignUpSecondPage() {
    const dispatch = useAppDispatch();
    const data = useAppSelector(useCurrentSignUpData).data;

    const defaultValues = {
        profession: data.profession || "",
        wasTakeCourseBefore: data.wasTakeCourseBefore || "",
        coursesName: data.coursesName || "",
        isTakeCourseWithSheikh: data.isTakeCourseWithSheikh || "",
        howLongCorrespondence: data.howLongCorrespondence || "",
    };

    const handleSubmit = (formData: FieldValues) => {
        dispatch(setData({ data: formData, currentPage: 3 }));
    };
    return (
        <CustomForm
            onSubmit={handleSubmit}
            defaultValues={defaultValues}
            className="space-y-4"
        >
            {/* Profession */}
            <CustomInput
                required
                label="What is your current profession/major in college?"
                name="profession"
                type="text"
                placeholder="Enter your profession"
            />

            {/* Was Take Course Before */}
            <CustomRadioCheckpoint
                name="wasTakeCourseBefore"
                label="Have you taken any course before?"
                options={[
                    { value: 'yes', label: "Yes" },
                    { value: 'no', label: "No" },
                ]}
                otherFieldName="coursesName"
                placeholder="Enter course name"
            />

            {/* Courses Name (conditional) */}
            <CustomInput
                name="coursesName"
                type="text"
                label="If yes: List them:"
                placeholder="Name of the course(s) you took"
            />

            {/* Is Take Course With Sheikh */}
            <CustomRadioCheckpoint
                name="isTakeCourseWithSheikh"
                label="Are you taking the course with Sheikh?"
                options={[
                    { value: 'yes', label: "Yes" },
                    { value: 'no', label: "No" },
                ]}
            />

            {/* How Long Correspondence */}

            <CustomInput
                label="If Yes, How long will you correspond?"
                name="howLongCorrespondence"
                type="text"
                placeholder="Correspond"
            />

            <PageStep/>

            <Button type="submit" className="w-full mt-6" size="lg" variant="secondary">
                Next
            </Button>
        </CustomForm>
    );
}
