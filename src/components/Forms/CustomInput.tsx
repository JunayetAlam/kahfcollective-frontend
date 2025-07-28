"use client";

import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";

type TInputProps = {
  type: string;
  name: string;
  label?: string;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  className?: string; // container class
  labelClassName?: string;
  fieldClassName?: string; // input class
};

const CustomInput = ({
  type,
  name,
  label,
  disabled,
  required,
  placeholder,
  className,
  labelClassName,
  fieldClassName,
}: TInputProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  useEffect(() => {
    if (type === "number") {
      const inputElement = document.getElementById(name);
      if (inputElement) {
        inputElement.addEventListener("wheel", (e) => e.preventDefault(), {
          passive: false,
        });
      }
    }
  }, [name, type]);

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

          <Input
            {...field}
            type={type}
            id={name}
            placeholder={placeholder}
            disabled={disabled}
            min={type === "number" ? 0 : undefined}
            step={type === "number" ? 0.01 : undefined}
            className={cn("w-full text-sm", fieldClassName)}
          />

          {errors?.[name] && (
            <small className="text-red-500 text-sm mt-1">
              {errors?.[name]?.message as string}
            </small>
          )}
        </div>
      )}
    />
  );
};

export default CustomInput;
