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
import { useCreateLocationForumMutation } from "@/redux/api/forumApi"; // <-- import mutation
import { FraternityGroupForm } from "./FruternityForm";
import { Event } from "@/types";


const defaultValues = {
    title: "",
    description: "",
    country: "",
    tierId: "",
};

export default function CreateFraternityGroup() {
    const [open, setOpen] = useState(false);
    const [events, setEvents] = useState<Event[]>([
        { eventName: "", about: "", location: "", date: undefined, time: "" },
    ]);

    // RTK mutation hook
    const [createLocationForum, { isLoading }] = useCreateLocationForumMutation();

    const handleSubmit = async (data: FieldValues) => {
        try {
            const transformedData = {
                ...data,
                events,
            };

           await createLocationForum(transformedData).unwrap();

            toast.success("✅ Fraternity Group created successfully!");

            setOpen(false);
        } catch (error: any) {
            console.error("Fraternity group creation error:", error);
            toast.error(error?.data?.message || "❌ Oops! Something went wrong.");
        }
    };

    const handleCancel = () => {
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Create Fraternity Group</Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create Fraternity Group</DialogTitle>
                    <p className="text-sm text-gray-600">
                        Create a new discussion forum for your community.
                    </p>
                </DialogHeader>

                <CustomForm
                    onSubmit={handleSubmit}
                    defaultValues={defaultValues}
                    className="space-y-6 py-4"
                >
                    <FraternityGroupForm events={events} setEvents={setEvents} />

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
                                <>
                                    <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Creating Forum...
                                </>
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
