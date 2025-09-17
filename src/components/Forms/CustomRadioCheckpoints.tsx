"use client";

import { Controller, useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

type TOption = {
  label: string;
  value: string;
};

type TProps = {
  name: string;
  label?: string;
  options: TOption[];
  className?: string;
  otherFieldName?: string; // optional "Other" input field name
  placeholder?: string;
};

export default function CustomRadioCheckpoint({
  name,
  label,
  options,
  className,
  otherFieldName,
  placeholder,
}: TProps) {
  const { control, watch } = useFormContext();
  const selectedValue = watch(name);
  const [focused, setFocused] = useState(false);

  // Handle focus on the "Other" input when selected
  useEffect(() => {
    if (selectedValue === "other" && otherFieldName) {
      const timer = setTimeout(() => {
        const otherInput = document.querySelector(
          `input[name="${otherFieldName}"]`
        ) as HTMLInputElement;
        if (otherInput) {
          otherInput.focus();
        }
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [selectedValue, otherFieldName]);

  return (
    <Controller
      name={name}
      control={control}
      rules={{ 
        required: "This field is required",
        validate: (value) => {
          // Allow false as a valid value
          return value !== undefined && value !== null && value !== "";
        }
      }}
      render={({ field, fieldState: { error } }) => (
        <div className={cn("flex flex-col space-y-3", className)}>
          {label && (
            <label className="font-semibold text-gray-700 text-sm mb-1">
              {label}
            </label>
          )}
          
          <div className="flex flex-col space-y-2">
            {options.map((option, index) => (
              <label
                key={`${option.value}-${index}`} // Better key generation
                className={cn(
                  "flex items-start space-x-3 p-3 rounded-lg border transition-all cursor-pointer",
                  field.value === option.value
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-gray-300",
                  focused && "ring-2 ring-primary/20"
                )}
              >
                <div className="relative flex items-center justify-center mt-0.5">
                  <input
                    type="radio"
                    value={option.value.toString()}
                    checked={field.value === option.value}
                    onChange={() => field.onChange(option.value)}
                    onKeyDown={(e) => {
                      // Allow selection with Space key
                      if (e.key === " ") {
                        e.preventDefault();
                        field.onChange(option.value);
                      }
                    }}
                    className="absolute opacity-0 h-0 w-0"
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                  />
                  <div
                    className={cn(
                      "h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all",
                      field.value === option.value
                        ? "border-primary bg-primary"
                        : "border-gray-400"
                    )}
                  >
                    {field.value === option.value && (
                      <div className="h-2 w-2 rounded-full bg-white" />
                    )}
                  </div>
                </div>
                <span className="text-gray-700">{option.label}</span>
              </label>
            ))}

            {/* Optional Other Field */}
            {otherFieldName && selectedValue === "other" && (
              <div className="pl-8 mt-1 transition-all duration-300">
                <input
                  type="text"
                  placeholder={placeholder || "Please specify"}
                  className="p-2 border rounded-md w-full text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  {...control.register(otherFieldName)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                />
              </div>
            )}
          </div>
          
          {error && (
            <p className="text-red-500 text-xs mt-1">{error.message}</p>
          )}
        </div>
      )}
    />
  );
}