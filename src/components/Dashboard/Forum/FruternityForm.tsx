/* eslint-disable @typescript-eslint/no-explicit-any */
import CustomInput from "@/components/Forms/CustomInput";
import { CustomSearchSelect } from "@/components/Forms/CustomSearchSelect";
import CustomTextarea from "@/components/Forms/CustomTextarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { COUNTRIES } from "@/data";
import { cn } from "@/lib/utils";
import { useGetAllTiersQuery } from "@/redux/api/tierApi";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { format } from "date-fns";
import { Event } from "@/types";

export function FraternityGroupForm({
    events,
    setEvents,
}: {
    events: Event[];
    setEvents: Dispatch<SetStateAction<Event[]>>;
}) {
    const { data: tier, isLoading: tierLoading } = useGetAllTiersQuery([
        { name: "limit", value: "1000" },
    ]);

    if (tierLoading) {
        return <div>Loading tiers...</div>;
    }

    const tierOption =
        (tier?.data || [])?.map((u) => ({ value: u.id, label: u.name })) || [];

    const addEvent = () => {
        setEvents([
            ...events,
            {time: '', about: '', date: undefined, eventName: '', location: ''}
        ]);
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
        <div className="space-y-6">
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
                <CustomSearchSelect
                    required
                    name="country"
                    label="Select Country"
                    placeholder="Bangladesh"
                    options={COUNTRIES}
                />

                {/* Membership */}
                <CustomSearchSelect
                    required
                    name="tierId"
                    label="Membership"
                    placeholder="Select Tier"
                    options={tierOption}
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
                    <div
                        key={index}
                        className="space-y-4 p-4 border rounded-lg relative"
                    >
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
                                htmlFor={`events[${index}].eventName`}
                                className={cn(
                                    "text-sm md:text-sm font-semibold pb-2 block"
                                )}
                            >
                                Event Name
                            </label>
                            <Input
                                name={`events[${index}].eventName`}
                                type="text"
                                placeholder="Event name"
                                value={event.eventName}
                                onChange={(e) =>
                                    updateEvent(index, "eventName", e.target.value)
                                }
                            />
                        </div>

                        <div>
                            <label
                                htmlFor={`events[${index}].about`}
                                className={cn(
                                    "text-sm md:text-sm font-semibold pb-2 block"
                                )}
                            >
                                Description
                            </label>
                            <Textarea
                                name={`events[${index}].about`}
                                placeholder="Description"
                                rows={3}
                                value={event.about}
                                onChange={(e) =>
                                    updateEvent(index, "about", e.target.value)
                                }
                            />
                        </div>

                        {/* Location, Date, and Time in a row */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label
                                    htmlFor={`events[${index}].location`}
                                    className={cn(
                                        "text-sm md:text-sm font-semibold pb-2 block"
                                    )}
                                >
                                    Location
                                </label>
                                <Input
                                    name={`events[${index}].location`}
                                    type="text"
                                    placeholder="Event location"
                                    value={event.location}
                                    onChange={(e) =>
                                        updateEvent(index, "location", e.target.value)
                                    }
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
                                            {event.date ? (
                                                format(event.date, "PPP")
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={new Date(event.date || '')}
                                            captionLayout="dropdown"
                                            onSelect={(date) =>
                                                updateEvent(index, "date", date)
                                            }
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div>
                                <label
                                    htmlFor={`events[${index}].time`}
                                    className={cn(
                                        "text-sm md:text-sm font-semibold pb-2 block"
                                    )}
                                >
                                    Time
                                </label>
                                <Input
                                    name={`events[${index}].time`}
                                    type="time"
                                    value={event.time}
                                    onChange={(e) =>
                                        updateEvent(index, "time", e.target.value)
                                    }
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}