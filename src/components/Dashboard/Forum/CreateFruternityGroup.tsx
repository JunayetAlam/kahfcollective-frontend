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
import CustomInput from "@/components/Forms/CustomInput";
import CustomTextarea from "@/components/Forms/CustomTextarea";
import CustomSelect from "@/components/Forms/CustomSelect";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Event interface
interface Event {
    eventName: string;
    about: string;
    location: string;
    date: Date | undefined;
    time: string;
}

const defaultValues = {
    title: "",
    description: "",
    selectCountries: "",
    membership: "",
    events: [] as Event[],
};

export default function CreateFraternityGroup() {
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (data: FieldValues) => {
        setIsSubmitting(true);

        try {
            console.log("Creating fraternity group:", data);

            toast.success("✅ Fraternity Group created successfully!");

            setOpen(false);
        } catch (error) {
            console.error("Fraternity group creation error:", error);
            toast.error("❌ Oops! Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
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
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create Fraternity Group</DialogTitle>
                    <p className="text-sm text-gray-600">Create a new discussion forum for your community.</p>
                </DialogHeader>

                <CustomForm
                    onSubmit={handleSubmit}
                    defaultValues={defaultValues}
                    className="space-y-6 py-4"
                >
                    <FraternityGroupForm />

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3 pt-4 border-t">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancel}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
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

// FraternityGroupForm Component
function FraternityGroupForm() {
    const [events, setEvents] = useState<Event[]>([
        { eventName: "", about: "", location: "", date: undefined, time: "" }
    ]);

    const addEvent = () => {
        setEvents([...events, { eventName: "", about: "", location: "", date: undefined, time: "" }]);
    };

    const removeEvent = (index: number) => {
        if (events.length > 1) {
            const updatedEvents = [...events];
            updatedEvents.splice(index, 1);
            setEvents(updatedEvents);
        }
    };

    const updateEvent = (index: number, field: keyof Event, value: any) => {
        const updatedEvents = [...events];
        updatedEvents[index] = { ...updatedEvents[index], [field]: value };
        setEvents(updatedEvents);
    };

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

            {/* Select Countries and Membership in a row */}
            <div className="grid grid-cols-2 gap-4">
                {/* Select Countries */}
                <CustomSelect
                    name="selectCountries"
                    label="Select Countries"
                    placeholder="United States"
                    options={[
                        { value: "united-states", label: "United States" },
                        { value: "canada", label: "Canada" },
                        { value: "united-kingdom", label: "United Kingdom" },
                        { value: "germany", label: "Germany" },
                        { value: "france", label: "France" },
                        { value: "japan", label: "Japan" },
                        { value: "australia", label: "Australia" },
                    ]}
                />

                {/* Membership */}
                <CustomSelect
                    name="membership"
                    label="Membership"
                    placeholder="Members Only"
                    options={[
                        { value: "open", label: "Open" },
                        { value: "members-only", label: "Members Only" },
                        { value: "restricted", label: "Restricted" },
                        { value: "private", label: "Private" },
                    ]}
                />
            </div>

            {/* Events Section */}
            <div className="space-y-4 border-t pt-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">Events</h3>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addEvent}
                        className="flex items-center gap-1"
                    >
                        <Plus className="h-4 w-4" />
                        Add Event
                    </Button>
                </div>

                {events.map((event, index) => (
                    <div key={index} className="space-y-4 p-4 border rounded-lg relative">
                        {events.length > 1 && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute top-2 right-2 h-8 w-8"
                                onClick={() => removeEvent(index)}
                            >
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        )}

                        <h4 className="text-sm font-medium">Event {index + 1}</h4>

                        {/* Event Name */}
                        <div>
                            <label
                                htmlFor={"Event Name"}
                                className={cn("text-sm md:text-sm font-semibold pb-2")}
                            >
                                Event Name
                            </label>
                            <Input
                                name={`events[${index}].eventName`}
                                type="text"
                                placeholder="Event name"
                                value={event.eventName}
                                onChange={(e) => updateEvent(index, 'eventName', e.target.value)}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor={"Event Name"}
                                className={cn("text-sm md:text-sm font-semibold pb-2")}
                            >
                                Description
                            </label>
                            <Textarea
                                name={`events[${index}].about`}
                                placeholder="Description"
                                rows={3}
                                value={event.about}
                                onChange={(e) => updateEvent(index, 'about', e.target.value)}
                            />
                        </div>


                        {/* Location, Date, and Time in a row */}
                        <div className="grid grid-cols-3 gap-4">

                            <div>
                                <label
                                    htmlFor={"Event Name"}
                                    className={cn("text-sm md:text-sm font-semibold pb-2")}
                                >
                                    Location
                                </label>
                                <Input
                                    name={`events[${index}].location`}
                                    type="text"
                                    placeholder="Event location"
                                    value={event.location}
                                    onChange={(e) => updateEvent(index, 'location', e.target.value)}
                                />
                            </div>

                            {/* Date */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Date</label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !event.date && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {event.date ? format(event.date, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={event.date}
                                            captionLayout="dropdown"
                                            onSelect={(date) => updateEvent(index, 'date', date)}
                                            
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                           
                            <div>
                                <label
                                    htmlFor={"Event Name"}
                                    className={cn("text-sm md:text-sm font-semibold pb-2")}
                                >
                                    Time
                                </label>
                                <Input
                                    name={`events[${index}].time`}
                                    type="time"
                                    value={event.time}
                                    onChange={(e) => updateEvent(index, 'time', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}