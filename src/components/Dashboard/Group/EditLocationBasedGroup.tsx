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
    useGetSingleGroupQuery,
    useUpdateLocationGroupMutation
} from "@/redux/api/groupApi";
import { LocationBasedGroupForm } from "./LocationBasedGroupForm";
import { Event } from "@/types";
import Loading from "@/components/Global/Loading";
import { Edit } from "lucide-react";



type EditLocationBasedGroupProps = {
    forumId: string;
};

export default function EditLocationBasedGroup({ forumId }: EditLocationBasedGroupProps) {
    const [open, setOpen] = useState(false);
    const [events, setEvents] = useState<Event[]>([
        { eventName: "", about: "", location: "", date: undefined, time: "" },
    ]);

    const { data, isLoading: fetching } = useGetSingleGroupQuery(forumId);
    const [updateLocationGroup, { isLoading: updating }] = useUpdateLocationGroupMutation();

    useEffect(() => {
        if (data?.data?.events) {
            setEvents(data.data.events);
        }
    }, [data]);

    if (fetching) {
        return <Loading />;
    }

    const handleSubmit = async (data: FieldValues) => {
        try {
            const transformedData = {
                ...data,
                events,
            };
            await updateLocationGroup({ id: forumId, body: transformedData }).unwrap();

            toast.success("Location Based Group updated successfully!");
            setOpen(false);
        } catch (error: any) {
            console.error("Location based group update error:", error);
            toast.error(error?.data?.message || "Oops! Something went wrong.");
        }
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const group = data?.data;
    const defaultValues = {
        title: group?.title || "",
        description: group?.description || "",
        country: group?.country || "",
        groupId: group?.groupId || "",
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size={"icon"}><Edit /></Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Location Based Group</DialogTitle>
                    <p className="text-sm text-gray-600">
                        Update the location based group details below.
                    </p>
                </DialogHeader>

                {fetching ? (
                    <div className="py-6 text-center text-gray-500">Loading location based group data...</div>
                ) : (
                    <CustomForm
                        onSubmit={handleSubmit}
                        defaultValues={defaultValues}
                        className="space-y-6 py-4"
                    >
                        <LocationBasedGroupForm events={events} setEvents={setEvents} />

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
