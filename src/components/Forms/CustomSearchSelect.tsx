"use client"

import { Check, ChevronsUpDown } from "lucide-react"
import { Controller, useFormContext } from "react-hook-form"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    FormControl,
   
} from "@/components/ui/form"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

type TSelectOption = {
    label: string;
    value: string;
};

type TCustomSelectProps = {
    name: string;
    label?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    options: TSelectOption[];
    className?: string;
    labelClassName?: string;
    fieldClassName?: string; // renamed from triggerClassName
};

export function CustomSearchSelect(
    {
        name,
        label,
        placeholder = "Select an option",
        required,
        disabled,
        options,
        className,
        labelClassName,
    }: TCustomSelectProps
) {
    const {
        control,
        formState: { errors },
    } = useFormContext();

    
    return (
        <Controller
            name={name}
            control={control}
            rules={{ required: required ? "This field is required" : false }}
            render={({ field }) => (
                <div className={cn("flex flex-col", className)}>
                    {label && (
                        <label
                            htmlFor={name}
                            className={cn("text-sm md:text-sm font-semibold pb-2", labelClassName)}
                        >
                            {label}
                        </label>
                    )}
                    <Popover>
                        <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    className={cn(
                                        "w-full justify-between",
                                        !field.value && "text-muted-foreground"
                                    )}
                                >
                                    {field.value
                                        ? options.find(
                                            (option) => option.value === field.value
                                        )?.label
                                        : placeholder}
                                    <ChevronsUpDown className="opacity-50" />
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                            <Command>
                                <CommandInput
                                    placeholder={placeholder}
                                    className="h-9"
                                />
                                <CommandList>
                                    <CommandEmpty>No option found.</CommandEmpty>
                                    <CommandGroup>
                                        {options.map((option) => (
                                            <CommandItem
                                                disabled={disabled}
                                                value={option.label}
                                                key={option.value}
                                                onSelect={() => {
                                                    field.onChange(option.value)
                                                }}
                                            >
                                                {option.label}
                                                <Check
                                                    className={cn(
                                                        "ml-auto",
                                                        option.value === field.value
                                                            ? "opacity-100"
                                                            : "opacity-0"
                                                    )}
                                                />
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    {errors?.[name] && (
                        <small className="text-red-500 text-sm mt-1">
                            {errors?.[name]?.message as string}
                        </small>
                    )}
                </div>
            )}
        />
    )
}