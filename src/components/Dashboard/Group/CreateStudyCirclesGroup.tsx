/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FieldValues } from "react-hook-form";
import { toast } from "sonner";
import CustomForm from "@/components/Forms/CustomForm";
import StudyCirclesGroupForm from "./StudyCirclesGroupForm";
import { useCreateCircleGroupMutation } from "@/redux/api/groupApi";

const defaultValues = {
    title: "",
    description: "",
    courseId: "",
    groupId: "",
};

export default function CreateStudyCirclesGroup() {
    const [open, setOpen] = useState(false);
    const [createGroup, { isLoading }] = useCreateCircleGroupMutation();

    const handleSubmit = async (data: FieldValues) => {
        try {
            await createGroup(data).unwrap();

            toast.success("Group created successfully!");

            setOpen(false);
        } catch (error: any) {
            console.error("Group creation error:", error);
            toast.error(error?.data?.message || "Oops! Something went wrong. Please try again.");
        }
    };

    const handleCancel = () => {
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Create Group</Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto !max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Study Circles Group</DialogTitle>
                    <p className="text-sm text-gray-600">
                        Create a new discussion group for your community.
                    </p>
                </DialogHeader>

                <CustomForm
                    onSubmit={handleSubmit}
                    defaultValues={defaultValues}
                    className="space-y-6 py-4"
                >
                    <StudyCirclesGroupForm />

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3 pt-4 border-t">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancel}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <div className="flex items-center">
                                    <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Creating Group...
                                </div>
                            ) : (
                                "Create Group"
                            )}
                        </Button>
                    </div>
                </CustomForm>
            </DialogContent>
        </Dialog>
    );
}
