/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
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
import {
    useGetSingleForumQuery,
    useUpdateLocationForumMutation
} from "@/redux/api/forumApi";
import { FraternityGroupForm } from "./FruternityForm";
import { Event } from "@/types";
import Loading from "@/components/Global/Loading";



type EditFruternityGroupProps = {
    forumId: string;
};

export default function EditFruternityGroup({ forumId }: EditFruternityGroupProps) {
    const [open, setOpen] = useState(false);
    const [events, setEvents] = useState<Event[]>([
        { eventName: "", about: "", location: "", date: undefined, time: "" },
    ]);

    const { data, isLoading: fetching } = useGetSingleForumQuery(forumId);
    const [updateLocationForum, { isLoading: updating }] = useUpdateLocationForumMutation();

    useEffect(() => {
        if (data?.data?.events) {
            setEvents(data.data.events);
        }
    }, [data]);

    if (fetching) {
        return <Loading/>;
    }

    const handleSubmit = async (data: FieldValues) => {
        try {
            const transformedData = {
                ...data,
                events,
            };
            await updateLocationForum({ id: forumId, body: transformedData }).unwrap();

            toast.success("✅ Fraternity Group updated successfully!");
            setOpen(false);
        } catch (error: any) {
            console.error("Fraternity group update error:", error);
            toast.error(error?.data?.message || "❌ Oops! Something went wrong.");
        }
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const forum = data?.data;
    const defaultValues = {
        title: forum?.title || "",
        description: forum?.description || "",
        country: forum?.country || "",
        tierId: forum?.tierId || "",
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Edit Forum</Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Fraternity Group</DialogTitle>
                    <p className="text-sm text-gray-600">
                        Update the fraternity group details below.
                    </p>
                </DialogHeader>

                {fetching ? (
                    <div className="py-6 text-center text-gray-500">Loading fraternity group data...</div>
                ) : (
                    <CustomForm
                        onSubmit={handleSubmit}
                        defaultValues={defaultValues}
                        className="space-y-6 py-4"
                    >
                        <FraternityGroupForm events={events} setEvents={setEvents} />

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
                                    <>
                                        <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Updating Group...
                                    </>
                                ) : (
                                    "Update Group"
                                )}
                            </Button>
                        </div>
                    </CustomForm>
                )}
            </DialogContent>
        </Dialog>
    );
}