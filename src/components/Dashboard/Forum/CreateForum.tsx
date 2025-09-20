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
import ForumForm from "./ForumForm";
import { useCreateCircleForumMutation } from "@/redux/api/forumApi";

const defaultValues = {
    title: "",
    description: "",
    courseId: "",
    tierId: "",
};

export default function CreateForum() {
    const [open, setOpen] = useState(false);
    const [createForum, { isLoading }] = useCreateCircleForumMutation();

    const handleSubmit = async (data: FieldValues) => {
        try {
           await createForum(data).unwrap();

            toast.success("Forum created successfully!");

            setOpen(false);
        } catch (error: any) {
            console.error("Forum creation error:", error);
            toast.error(error?.data?.message || "Oops! Something went wrong. Please try again.");
        }
    };

    const handleCancel = () => {
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Create Forum</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Study Circles Forum</DialogTitle>
                    <p className="text-sm text-gray-600">
                        Create a new discussion forum for your community.
                    </p>
                </DialogHeader>

                <CustomForm
                    onSubmit={handleSubmit}
                    defaultValues={defaultValues}
                    className="space-y-6 py-4"
                >
                    <ForumForm />

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
                                    Creating Forum...
                                </div>
                            ) : (
                                "Create Forum"
                            )}
                        </Button>
                    </div>
                </CustomForm>
            </DialogContent>
        </Dialog>
    );
}
