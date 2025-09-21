/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
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
import {
    useGetSingleForumQuery,
    useUpdateCircleForumMutation,
} from "@/redux/api/forumApi";

type EditForumProps = {
    forumId: string;
};

export default function EditForum({ forumId }: EditForumProps) {
    const [open, setOpen] = useState(false);

    // fetch single forum data
    const { data, isLoading: fetching } = useGetSingleForumQuery(forumId);
    const [updateForum, { isLoading: updating }] = useUpdateCircleForumMutation();

    if (fetching) {
        return ''
    }

    const handleSubmit = async (data: FieldValues) => {
        try {
            await updateForum({ id: forumId, body: data }).unwrap();

            toast.success("Forum updated successfully!");
            setOpen(false);
        } catch (error: any) {
            console.error("Forum update error:", error);
            toast.error(error?.data?.message || "Oops! Something went wrong. Please try again.");
        }
    };

    const handleCancel = () => {
        setOpen(false);
    };
    const forum = data?.data
    const defaultValues = {
        title: forum?.title || '',
        description: forum?.description || '',
        courseId: forum?.courseId || '',
        tierId: forum?.tierId || '',
    };
    console.log(defaultValues)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Edit Forum</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Study Circles Forum</DialogTitle>
                    <p className="text-sm text-gray-600">
                        Update the forum details below.
                    </p>
                </DialogHeader>

                {fetching ? (
                    <div className="py-6 text-center text-gray-500">Loading forum data...</div>
                ) : (
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
                                disabled={updating}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={updating}>
                                {updating ? (
                                    <div className="flex items-center">
                                        <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Updating Forum...
                                    </div>
                                ) : (
                                    "Update Forum"
                                )}
                            </Button>
                        </div>
                    </CustomForm>
                )}
            </DialogContent>
        </Dialog>
    );
}
